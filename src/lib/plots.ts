import { supabase } from "@/integrations/supabase/client";

// ─── Plot specification types ────────────────────────────────────────
export type SeriesKind =
  | "function-2d" // y = f(x)
  | "parametric-2d" // (x(t), y(t))
  | "polar-2d" // r = f(θ)
  | "points-2d" // [{x,y}]
  | "surface-3d" // z = f(x,y)
  | "param-curve-3d"; // (x(t), y(t), z(t))

export interface SeriesBase {
  id: string;
  name: string;
  kind: SeriesKind;
  color: string;
  visible: boolean;
}
export interface FunctionSeries2D extends SeriesBase {
  kind: "function-2d";
  expr: string; // f(x)
  xMin?: number;
  xMax?: number;
  samples?: number;
  fill?: boolean; // shade area under curve
}
export interface ParametricSeries2D extends SeriesBase {
  kind: "parametric-2d";
  exprX: string; // x(t)
  exprY: string; // y(t)
  tMin: number;
  tMax: number;
  samples?: number;
}
export interface PolarSeries2D extends SeriesBase {
  kind: "polar-2d";
  expr: string; // r(θ)
  thetaMin: number;
  thetaMax: number;
  samples?: number;
}
export interface PointsSeries2D extends SeriesBase {
  kind: "points-2d";
  points: Array<{ x: number; y: number; label?: string }>;
}
export interface SurfaceSeries3D extends SeriesBase {
  kind: "surface-3d";
  expr: string; // f(x,y)
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  samples?: number;
}
export interface ParamCurveSeries3D extends SeriesBase {
  kind: "param-curve-3d";
  exprX: string;
  exprY: string;
  exprZ: string;
  tMin: number;
  tMax: number;
  samples?: number;
}

export type Series =
  | FunctionSeries2D
  | ParametricSeries2D
  | PolarSeries2D
  | PointsSeries2D
  | SurfaceSeries3D
  | ParamCurveSeries3D;

export interface PlotView2D {
  xMin: number;
  xMax: number;
  yMin?: number;
  yMax?: number;
  grid: boolean;
  axes: boolean;
  title?: string;
  xLabel?: string;
  yLabel?: string;
}
export interface PlotView3D {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  zMin?: number;
  zMax?: number;
  title?: string;
}

export interface PlotSpec {
  series: Series[];
  view: PlotView2D | PlotView3D;
  /** numerical analysis toggles */
  analysis?: {
    showDerivative?: string; // series id of a function-2d
    showIntegralOf?: string; // series id; shaded area + numeric value
    findRoots?: string; // series id; mark zeros
    findExtrema?: string; // series id; mark min/max
    intersectionsBetween?: [string, string]; // ids of two function-2d
    evaluateAt?: { seriesId: string; xs: number[] };
  };
}

export interface PlotRow {
  id: string;
  name: string;
  description: string | null;
  kind: "2d" | "3d";
  spec: PlotSpec;
  thumbnail: string | null;
  updated_at: string;
}

// ─── CRUD ────────────────────────────────────────────────────────────
export async function listPlots(): Promise<PlotRow[]> {
  const { data, error } = await supabase
    .from("plots")
    .select("id,name,description,kind,spec,thumbnail,updated_at")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as PlotRow[];
}

export async function getPlot(id: string): Promise<PlotRow | null> {
  const { data, error } = await supabase
    .from("plots")
    .select("id,name,description,kind,spec,thumbnail,updated_at")
    .eq("id", id)
    .single();
  if (error) throw error;
  return (data as unknown as PlotRow) ?? null;
}

export async function createPlot(name: string, kind: "2d" | "3d"): Promise<string> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("No autenticado");
  const spec: PlotSpec =
    kind === "2d"
      ? {
          series: [
            {
              id: rid(),
              name: "f(x)",
              kind: "function-2d",
              color: "#22d3ee",
              visible: true,
              expr: "sin(x)",
            } as FunctionSeries2D,
          ],
          view: { xMin: -10, xMax: 10, grid: true, axes: true } as PlotView2D,
        }
      : {
          series: [
            {
              id: rid(),
              name: "f(x,y)",
              kind: "surface-3d",
              color: "#a78bfa",
              visible: true,
              expr: "sin(sqrt(x^2 + y^2))",
              xMin: -5,
              xMax: 5,
              yMin: -5,
              yMax: 5,
              samples: 50,
            } as SurfaceSeries3D,
          ],
          view: { xMin: -5, xMax: 5, yMin: -5, yMax: 5 } as PlotView3D,
        };
  const { data, error } = await supabase
    .from("plots")
    .insert({ user_id: userData.user.id, name, kind, spec: spec as unknown as Record<string, unknown> } as never)
    .select("id")
    .single();
  if (error || !data) throw error ?? new Error("error");
  return (data as { id: string }).id;
}

export async function updatePlot(id: string, patch: Partial<Pick<PlotRow, "name" | "description" | "spec" | "thumbnail">>): Promise<void> {
  const { error } = await supabase.from("plots").update(patch as never).eq("id", id);
  if (error) throw error;
}

export async function deletePlot(id: string): Promise<void> {
  const { error } = await supabase.from("plots").delete().eq("id", id);
  if (error) throw error;
}

// ─── Document ↔ Plot links ──────────────────────────────────────────
export interface LinkedPlot {
  id: string;
  plot_id: string;
  alias: string | null;
  origin_document_id: string; // document that directly owns the link
  origin_document_title: string;
  via?: string[]; // chain of doc titles for transitive links
  plot: { id: string; name: string; kind: "2d" | "3d"; spec: PlotSpec };
}

export async function linkPlotToDoc(documentId: string, plotId: string): Promise<void> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("No autenticado");
  const { error } = await supabase
    .from("document_plots")
    .insert({ document_id: documentId, plot_id: plotId, user_id: userData.user.id });
  if (error && !error.message.includes("duplicate")) throw error;
}

export async function unlinkPlotFromDoc(linkId: string): Promise<void> {
  const { error } = await supabase.from("document_plots").delete().eq("id", linkId);
  if (error) throw error;
}

/**
 * Resolves all plots reachable from `documentId`, transitively following
 * document_links (source → target). Direct links come first; deeper levels
 * include a `via` chain showing the document titles traversed.
 */
export async function resolveAccessiblePlots(documentId: string): Promise<LinkedPlot[]> {
  const seenDocs = new Set<string>([documentId]);
  const out: LinkedPlot[] = [];
  const seenPlots = new Set<string>();

  type Frame = { docId: string; via: string[] };
  const queue: Frame[] = [{ docId: documentId, via: [] }];

  while (queue.length) {
    const { docId, via } = queue.shift()!;
    // current doc title
    const { data: docRow } = await supabase
      .from("documents")
      .select("id,title")
      .eq("id", docId)
      .single();
    const docTitle = docRow?.title ?? "documento";

    // direct plots
    const { data: plotsRows } = await supabase
      .from("document_plots")
      .select("id,plot_id,alias,plots(id,name,kind,spec)")
      .eq("document_id", docId);
    for (const r of plotsRows ?? []) {
      const p = r.plots as unknown as { id: string; name: string; kind: "2d" | "3d"; spec: PlotSpec } | null;
      if (!p) continue;
      if (seenPlots.has(p.id)) continue;
      seenPlots.add(p.id);
      out.push({
        id: r.id,
        plot_id: r.plot_id,
        alias: r.alias,
        origin_document_id: docId,
        origin_document_title: docTitle,
        via: via.length ? via : undefined,
        plot: p,
      });
    }

    // children via document_links (source → target)
    const { data: linkRows } = await supabase
      .from("document_links")
      .select("target_document_id")
      .eq("source_document_id", docId);
    for (const lr of linkRows ?? []) {
      const child = lr.target_document_id as string;
      if (seenDocs.has(child)) continue;
      seenDocs.add(child);
      queue.push({ docId: child, via: [...via, docTitle] });
    }
  }

  return out;
}

function rid(): string {
  return Math.random().toString(36).slice(2, 10);
}
