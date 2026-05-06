import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, Loader2, Plus, Trash2, Eye, EyeOff } from "lucide-react";
import { getPlot, updatePlot, type PlotRow, type PlotSpec, type Series, type FunctionSeries2D, type ParametricSeries2D, type PolarSeries2D, type SurfaceSeries3D, type ParamCurveSeries3D, type PointsSeries2D, type PlotView2D, type PlotView3D } from "@/lib/plots";
import { compute2D, compute3D, derivativeTrace, integrate, buildAnalysisAnnotations } from "@/lib/plot-eval";

export const Route = createFileRoute("/app/p/$id")({
  component: PlotEditor,
});

const PALETTE = ["#22d3ee", "#a78bfa", "#f472b6", "#fbbf24", "#34d399", "#f87171", "#60a5fa", "#fb923c"];

function rid() { return Math.random().toString(36).slice(2, 10); }

function PlotEditor() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [row, setRow] = useState<PlotRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const plotDivRef = useRef<HTMLDivElement>(null);
  const PlotlyRef = useRef<typeof import("plotly.js-dist-min") | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getPlot(id);
        if (cancelled) return;
        if (!data) { setErr("Gráfica no encontrada"); return; }
        setRow(data);
      } catch (e) {
        setErr(e instanceof Error ? e.message : "error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  // Autosave on changes
  useEffect(() => {
    if (!row) return;
    setSaveState("saving");
    const t = setTimeout(async () => {
      try {
        await updatePlot(row.id, { name: row.name, description: row.description ?? null, spec: row.spec });
        setSaveState("saved");
      } catch {
        setSaveState("idle");
      }
    }, 600);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [row?.name, row?.description, JSON.stringify(row?.spec)]);

  const traces = useMemo(() => {
    if (!row) return [] as Array<Record<string, unknown>>;
    return buildPlotlyTraces(row.spec, row.kind);
  }, [row]);

  // Render plotly
  useEffect(() => {
    if (!row) return;
    let cancelled = false;
    (async () => {
      if (!PlotlyRef.current) {
        PlotlyRef.current = await import("plotly.js-dist-min");
      }
      if (cancelled || !plotDivRef.current) return;
      const Plotly = PlotlyRef.current!;
      const layout = buildLayout(row.spec, row.kind);
      Plotly.react(plotDivRef.current, traces as unknown as Plotly.Data[], layout, { displaylogo: false, responsive: true });
    })();
    return () => { cancelled = true; };
  }, [row, traces]);

  if (loading) return <div className="flex-1 flex items-center justify-center"><Loader2 className="h-6 w-6 text-primary animate-spin" /></div>;
  if (err || !row) return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <div className="text-danger mb-3">▸ {err}</div>
        <button onClick={() => navigate({ to: "/app" })} className="text-sm border border-border px-3 py-1.5 hover:border-primary">← Volver</button>
      </div>
    </div>
  );

  const update = (mut: (r: PlotRow) => PlotRow) => setRow((r) => (r ? mut({ ...r, spec: { ...r.spec, series: [...r.spec.series], view: { ...r.spec.view } } }) : r));
  const updateSpec = (mut: (s: PlotSpec) => PlotSpec) => update((r) => ({ ...r, spec: mut(r.spec) }));
  const updateSeries = (sid: string, mut: (s: Series) => Series) => updateSpec((s) => ({ ...s, series: s.series.map((x) => (x.id === sid ? mut(x) : x)) }));

  function addSeries(kind: Series["kind"]) {
    const color = PALETTE[row!.spec.series.length % PALETTE.length];
    const base = { id: rid(), name: kind, color, visible: true };
    let s: Series;
    switch (kind) {
      case "function-2d": s = { ...base, kind, expr: "x^2" } as FunctionSeries2D; break;
      case "parametric-2d": s = { ...base, kind, exprX: "cos(t)", exprY: "sin(t)", tMin: 0, tMax: 2 * Math.PI } as ParametricSeries2D; break;
      case "polar-2d": s = { ...base, kind, expr: "1 + cos(theta)", thetaMin: 0, thetaMax: 2 * Math.PI } as PolarSeries2D; break;
      case "points-2d": s = { ...base, kind, points: [{ x: 0, y: 0 }, { x: 1, y: 1 }] } as PointsSeries2D; break;
      case "surface-3d": s = { ...base, kind, expr: "x*y", xMin: -3, xMax: 3, yMin: -3, yMax: 3, samples: 40 } as SurfaceSeries3D; break;
      case "param-curve-3d": s = { ...base, kind, exprX: "cos(t)", exprY: "sin(t)", exprZ: "t/3", tMin: 0, tMax: 6 * Math.PI } as ParamCurveSeries3D; break;
    }
    updateSpec((spec) => ({ ...spec, series: [...spec.series, s] }));
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="border-b border-border px-4 py-2 flex items-center gap-3 bg-surface/50">
        <Link to="/app" className="text-muted-foreground hover:text-foreground"><ChevronLeft className="h-4 w-4" /></Link>
        <input
          value={row.name}
          onChange={(e) => update((r) => ({ ...r, name: e.target.value }))}
          className="bg-transparent border border-transparent hover:border-border focus:border-primary px-2 py-1 text-sm font-display font-medium focus:outline-none flex-1 max-w-md"
        />
        <span className="text-[11px] text-muted-foreground border border-border px-2 py-1 uppercase tracking-widest">{row.kind}</span>
        <span className="ml-auto text-[11px] text-muted-foreground">
          {saveState === "saving" ? "guardando…" : saveState === "saved" ? "✓ guardado" : ""}
        </span>
      </div>

      <div className="flex-1 min-h-0 grid" style={{ gridTemplateColumns: "320px 1fr" }}>
        {/* Left panel */}
        <div className="border-r border-border overflow-auto bg-surface/30">
          <ViewPanel row={row} updateSpec={updateSpec} />
          <div className="border-t border-border">
            <div className="px-3 py-2 text-[10px] uppercase tracking-widest text-muted-foreground flex items-center justify-between">
              <span>Series</span>
              <div className="flex gap-1">
                {row.kind === "2d" ? (
                  <>
                    <button onClick={() => addSeries("function-2d")} title="y=f(x)" className="border border-border px-1.5 py-0.5 hover:border-primary text-[10px]">f(x)</button>
                    <button onClick={() => addSeries("parametric-2d")} title="paramétrica" className="border border-border px-1.5 py-0.5 hover:border-primary text-[10px]">x(t),y(t)</button>
                    <button onClick={() => addSeries("polar-2d")} title="polar" className="border border-border px-1.5 py-0.5 hover:border-primary text-[10px]">r(θ)</button>
                    <button onClick={() => addSeries("points-2d")} title="puntos" className="border border-border px-1.5 py-0.5 hover:border-primary text-[10px]">·</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => addSeries("surface-3d")} title="z=f(x,y)" className="border border-border px-1.5 py-0.5 hover:border-primary text-[10px]">z=f(x,y)</button>
                    <button onClick={() => addSeries("param-curve-3d")} title="curva 3D" className="border border-border px-1.5 py-0.5 hover:border-primary text-[10px]">curva 3D</button>
                  </>
                )}
              </div>
            </div>
            {row.spec.series.map((s) => (
              <SeriesPanel
                key={s.id}
                series={s}
                onChange={(mut) => updateSeries(s.id, mut)}
                onRemove={() => updateSpec((sp) => ({ ...sp, series: sp.series.filter((x) => x.id !== s.id) }))}
              />
            ))}
          </div>
          {row.kind === "2d" && <AnalysisPanel spec={row.spec} updateSpec={updateSpec} />}
        </div>

        {/* Plot canvas */}
        <div className="min-h-0 bg-background">
          <div ref={plotDivRef} className="w-full h-full" />
        </div>
      </div>
    </div>
  );
}

function ViewPanel({ row, updateSpec }: { row: PlotRow; updateSpec: (m: (s: PlotSpec) => PlotSpec) => void }) {
  if (row.kind === "2d") {
    const v = row.spec.view as PlotView2D;
    return (
      <div className="px-3 py-3 border-b border-border space-y-2">
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Vista 2D</div>
        <div className="grid grid-cols-2 gap-2">
          <NumField label="x min" value={v.xMin} onChange={(n) => updateSpec((s) => ({ ...s, view: { ...(s.view as PlotView2D), xMin: n } }))} />
          <NumField label="x max" value={v.xMax} onChange={(n) => updateSpec((s) => ({ ...s, view: { ...(s.view as PlotView2D), xMax: n } }))} />
          <NumField label="y min" value={v.yMin ?? NaN} onChange={(n) => updateSpec((s) => ({ ...s, view: { ...(s.view as PlotView2D), yMin: Number.isFinite(n) ? n : undefined } }))} />
          <NumField label="y max" value={v.yMax ?? NaN} onChange={(n) => updateSpec((s) => ({ ...s, view: { ...(s.view as PlotView2D), yMax: Number.isFinite(n) ? n : undefined } }))} />
        </div>
        <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={v.grid} onChange={(e) => updateSpec((s) => ({ ...s, view: { ...(s.view as PlotView2D), grid: e.target.checked } }))} />Cuadrícula</label>
      </div>
    );
  }
  const v = row.spec.view as PlotView3D;
  return (
    <div className="px-3 py-3 border-b border-border space-y-2">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Vista 3D</div>
      <div className="grid grid-cols-2 gap-2">
        <NumField label="x min" value={v.xMin} onChange={(n) => updateSpec((s) => ({ ...s, view: { ...(s.view as PlotView3D), xMin: n } }))} />
        <NumField label="x max" value={v.xMax} onChange={(n) => updateSpec((s) => ({ ...s, view: { ...(s.view as PlotView3D), xMax: n } }))} />
        <NumField label="y min" value={v.yMin} onChange={(n) => updateSpec((s) => ({ ...s, view: { ...(s.view as PlotView3D), yMin: n } }))} />
        <NumField label="y max" value={v.yMax} onChange={(n) => updateSpec((s) => ({ ...s, view: { ...(s.view as PlotView3D), yMax: n } }))} />
      </div>
    </div>
  );
}

function SeriesPanel({ series, onChange, onRemove }: { series: Series; onChange: (m: (s: Series) => Series) => void; onRemove: () => void }) {
  return (
    <div className="border-t border-border px-3 py-2 space-y-1.5">
      <div className="flex items-center gap-2">
        <button onClick={() => onChange((s) => ({ ...s, visible: !s.visible }))} className="text-muted-foreground">
          {series.visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
        </button>
        <input type="color" value={series.color} onChange={(e) => onChange((s) => ({ ...s, color: e.target.value }))} className="w-5 h-5 bg-transparent border border-border" />
        <input
          value={series.name}
          onChange={(e) => onChange((s) => ({ ...s, name: e.target.value }))}
          className="bg-transparent text-xs flex-1 px-1 py-0.5 border border-transparent hover:border-border focus:border-primary focus:outline-none"
        />
        <button onClick={onRemove} className="text-muted-foreground hover:text-danger"><Trash2 className="h-3 w-3" /></button>
      </div>
      {series.kind === "function-2d" && (
        <>
          <ExprField label="f(x) =" value={series.expr} onChange={(v) => onChange((s) => ({ ...s, expr: v } as FunctionSeries2D))} />
          <label className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <input type="checkbox" checked={!!series.fill} onChange={(e) => onChange((s) => ({ ...s, fill: e.target.checked } as FunctionSeries2D))} /> Sombrear área
          </label>
        </>
      )}
      {series.kind === "parametric-2d" && (
        <>
          <ExprField label="x(t) =" value={series.exprX} onChange={(v) => onChange((s) => ({ ...s, exprX: v } as ParametricSeries2D))} />
          <ExprField label="y(t) =" value={series.exprY} onChange={(v) => onChange((s) => ({ ...s, exprY: v } as ParametricSeries2D))} />
          <div className="grid grid-cols-2 gap-1">
            <NumField label="t min" value={series.tMin} onChange={(n) => onChange((s) => ({ ...s, tMin: n } as ParametricSeries2D))} />
            <NumField label="t max" value={series.tMax} onChange={(n) => onChange((s) => ({ ...s, tMax: n } as ParametricSeries2D))} />
          </div>
        </>
      )}
      {series.kind === "polar-2d" && (
        <>
          <ExprField label="r(θ) =" value={series.expr} onChange={(v) => onChange((s) => ({ ...s, expr: v } as PolarSeries2D))} />
          <div className="grid grid-cols-2 gap-1">
            <NumField label="θ min" value={series.thetaMin} onChange={(n) => onChange((s) => ({ ...s, thetaMin: n } as PolarSeries2D))} />
            <NumField label="θ max" value={series.thetaMax} onChange={(n) => onChange((s) => ({ ...s, thetaMax: n } as PolarSeries2D))} />
          </div>
        </>
      )}
      {series.kind === "points-2d" && (
        <textarea
          value={series.points.map((p) => `${p.x}, ${p.y}`).join("\n")}
          onChange={(e) => {
            const pts = e.target.value.split("\n").map((l) => l.split(",").map((x) => parseFloat(x.trim()))).filter((a) => a.length >= 2 && Number.isFinite(a[0]) && Number.isFinite(a[1])).map(([x, y]) => ({ x, y }));
            onChange((s) => ({ ...s, points: pts } as PointsSeries2D));
          }}
          rows={4}
          className="w-full bg-background border border-border text-xs font-mono px-2 py-1"
          placeholder="x, y por línea"
        />
      )}
      {series.kind === "surface-3d" && (
        <>
          <ExprField label="z = f(x,y) =" value={series.expr} onChange={(v) => onChange((s) => ({ ...s, expr: v } as SurfaceSeries3D))} />
          <div className="grid grid-cols-2 gap-1">
            <NumField label="x min" value={series.xMin} onChange={(n) => onChange((s) => ({ ...s, xMin: n } as SurfaceSeries3D))} />
            <NumField label="x max" value={series.xMax} onChange={(n) => onChange((s) => ({ ...s, xMax: n } as SurfaceSeries3D))} />
            <NumField label="y min" value={series.yMin} onChange={(n) => onChange((s) => ({ ...s, yMin: n } as SurfaceSeries3D))} />
            <NumField label="y max" value={series.yMax} onChange={(n) => onChange((s) => ({ ...s, yMax: n } as SurfaceSeries3D))} />
          </div>
        </>
      )}
      {series.kind === "param-curve-3d" && (
        <>
          <ExprField label="x(t) =" value={series.exprX} onChange={(v) => onChange((s) => ({ ...s, exprX: v } as ParamCurveSeries3D))} />
          <ExprField label="y(t) =" value={series.exprY} onChange={(v) => onChange((s) => ({ ...s, exprY: v } as ParamCurveSeries3D))} />
          <ExprField label="z(t) =" value={series.exprZ} onChange={(v) => onChange((s) => ({ ...s, exprZ: v } as ParamCurveSeries3D))} />
          <div className="grid grid-cols-2 gap-1">
            <NumField label="t min" value={series.tMin} onChange={(n) => onChange((s) => ({ ...s, tMin: n } as ParamCurveSeries3D))} />
            <NumField label="t max" value={series.tMax} onChange={(n) => onChange((s) => ({ ...s, tMax: n } as ParamCurveSeries3D))} />
          </div>
        </>
      )}
    </div>
  );
}

function AnalysisPanel({ spec, updateSpec }: { spec: PlotSpec; updateSpec: (m: (s: PlotSpec) => PlotSpec) => void }) {
  const fnSeries = spec.series.filter((s) => s.kind === "function-2d") as FunctionSeries2D[];
  const a = spec.analysis ?? {};
  const setA = (mut: (a: NonNullable<PlotSpec["analysis"]>) => NonNullable<PlotSpec["analysis"]>) =>
    updateSpec((s) => ({ ...s, analysis: mut(s.analysis ?? {}) }));

  const view = spec.view as PlotView2D;

  // Quick numeric integral preview
  const integralSeries = fnSeries.find((s) => s.id === a.showIntegralOf);
  const integralValue = integralSeries
    ? integrate(integralSeries.expr, integralSeries.xMin ?? view.xMin, integralSeries.xMax ?? view.xMax)
    : null;

  return (
    <div className="border-t border-border px-3 py-3 space-y-2">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Análisis</div>

      <SelectField label="Mostrar derivada" value={a.showDerivative ?? ""} onChange={(v) => setA((p) => ({ ...p, showDerivative: v || undefined }))} options={fnSeries} />
      <SelectField label="Sombrear integral" value={a.showIntegralOf ?? ""} onChange={(v) => setA((p) => ({ ...p, showIntegralOf: v || undefined }))} options={fnSeries} />
      {integralSeries && integralValue !== null && (
        <div className="text-[11px] text-muted-foreground font-mono pl-1">
          ∫ {integralSeries.name} dx ≈ <span className="text-primary">{integralValue.toFixed(4)}</span>
        </div>
      )}
      <SelectField label="Marcar raíces" value={a.findRoots ?? ""} onChange={(v) => setA((p) => ({ ...p, findRoots: v || undefined }))} options={fnSeries} />
      <SelectField label="Marcar extremos" value={a.findExtrema ?? ""} onChange={(v) => setA((p) => ({ ...p, findExtrema: v || undefined }))} options={fnSeries} />

      {fnSeries.length >= 2 && (
        <div>
          <label className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-1">Intersecciones entre</label>
          <div className="flex gap-1">
            <select className="flex-1 bg-background border border-border text-xs px-1 py-1" value={a.intersectionsBetween?.[0] ?? ""} onChange={(e) => setA((p) => ({ ...p, intersectionsBetween: [e.target.value, p.intersectionsBetween?.[1] ?? ""] as [string, string] }))}>
              <option value="">—</option>
              {fnSeries.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <select className="flex-1 bg-background border border-border text-xs px-1 py-1" value={a.intersectionsBetween?.[1] ?? ""} onChange={(e) => setA((p) => ({ ...p, intersectionsBetween: [p.intersectionsBetween?.[0] ?? "", e.target.value] as [string, string] }))}>
              <option value="">—</option>
              {fnSeries.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
        </div>
      )}

      <div>
        <label className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-1">Evaluar en x=</label>
        <div className="flex gap-1">
          <select
            className="flex-1 bg-background border border-border text-xs px-1 py-1"
            value={a.evaluateAt?.seriesId ?? ""}
            onChange={(e) => setA((p) => ({ ...p, evaluateAt: { seriesId: e.target.value, xs: p.evaluateAt?.xs ?? [0, 1, 2] } }))}
          >
            <option value="">—</option>
            {fnSeries.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <input
            className="flex-1 bg-background border border-border text-xs px-1 py-1 font-mono"
            placeholder="0, 1, 2"
            defaultValue={(a.evaluateAt?.xs ?? []).join(", ")}
            onBlur={(e) => {
              const xs = e.target.value.split(",").map((x) => parseFloat(x.trim())).filter((n) => Number.isFinite(n));
              setA((p) => ({ ...p, evaluateAt: { seriesId: p.evaluateAt?.seriesId ?? "", xs } }));
            }}
          />
        </div>
      </div>
    </div>
  );
}

function NumField({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <label className="text-[10px] uppercase tracking-widest text-muted-foreground block">
      {label}
      <input
        type="number"
        value={Number.isFinite(value) ? value : ""}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full bg-background border border-border text-xs font-mono px-1.5 py-1 mt-0.5 focus:border-primary focus:outline-none"
      />
    </label>
  );
}

function ExprField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="text-[10px] uppercase tracking-widest text-muted-foreground block">
      {label}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-background border border-border text-xs font-mono px-1.5 py-1 mt-0.5 focus:border-primary focus:outline-none"
      />
    </label>
  );
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: Array<{ id: string; name: string }> }) {
  return (
    <label className="text-[10px] uppercase tracking-widest text-muted-foreground block">
      {label}
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-background border border-border text-xs px-1 py-1 mt-0.5 focus:border-primary">
        <option value="">—</option>
        {options.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
      </select>
    </label>
  );
}

// ─── Plotly trace builders ──────────────────────────────────────────
function buildPlotlyTraces(spec: PlotSpec, kind: "2d" | "3d"): Array<Record<string, unknown>> {
  const traces: Array<Record<string, unknown>> = [];
  if (kind === "2d") {
    const view = spec.view as PlotView2D;
    for (const s of spec.series) {
      if (!s.visible) continue;
      const t = compute2D(s, view);
      if (!t) continue;
      traces.push({ type: "scatter", mode: t.mode, name: t.name, x: t.x, y: t.y, line: { color: t.color, width: 2 }, marker: { color: t.color, size: 6 }, fill: t.fill });
    }
    // analysis: derivative
    const a = spec.analysis;
    if (a?.showDerivative) {
      const s = spec.series.find((x) => x.id === a.showDerivative) as FunctionSeries2D | undefined;
      if (s?.kind === "function-2d") {
        const t = derivativeTrace(s, view);
        traces.push({ type: "scatter", mode: "lines", name: t.name, x: t.x, y: t.y, line: { color: t.color, width: 1, dash: "dot" } });
      }
    }
    if (a?.showIntegralOf) {
      const s = spec.series.find((x) => x.id === a.showIntegralOf) as FunctionSeries2D | undefined;
      if (s?.kind === "function-2d") {
        const t = compute2D(s, view);
        if (t) traces.push({ type: "scatter", mode: "lines", name: `∫ ${s.name}`, x: t.x, y: t.y, fill: "tozeroy", line: { color: s.color, width: 0 }, fillcolor: hexToRgba(s.color, 0.2), showlegend: false });
      }
    }
    for (const ann of buildAnalysisAnnotations(spec)) {
      traces.push({ type: "scatter", mode: "markers", name: ann.name, x: ann.x, y: ann.y, marker: { color: ann.color, size: 9, symbol: "circle-open" } });
    }
  } else {
    for (const s of spec.series) {
      if (!s.visible) continue;
      const t = compute3D(s);
      if (!t) continue;
      if (t.type === "surface") {
        traces.push({ type: "surface", name: t.name, x: t.x, y: t.y, z: t.z, colorscale: [[0, t.color], [1, "#fff"]], showscale: false });
      } else {
        traces.push({ type: "scatter3d", mode: "lines", name: t.name, x: t.x, y: t.y, z: t.z, line: { color: t.color, width: 4 } });
      }
    }
  }
  return traces;
}

function buildLayout(spec: PlotSpec, kind: "2d" | "3d"): Record<string, unknown> {
  const common = {
    paper_bgcolor: "#0b0f17",
    plot_bgcolor: "#0b0f17",
    font: { color: "#a1a1aa", family: "ui-monospace, monospace", size: 11 },
    margin: { l: 50, r: 20, t: 30, b: 40 },
    legend: { bgcolor: "rgba(0,0,0,0)" },
  };
  if (kind === "2d") {
    const v = spec.view as PlotView2D;
    return {
      ...common,
      xaxis: { range: [v.xMin, v.xMax], gridcolor: v.grid ? "#1f2937" : "rgba(0,0,0,0)", zerolinecolor: "#3f3f46", title: v.xLabel },
      yaxis: { range: v.yMin != null && v.yMax != null ? [v.yMin, v.yMax] : undefined, gridcolor: v.grid ? "#1f2937" : "rgba(0,0,0,0)", zerolinecolor: "#3f3f46", title: v.yLabel },
      title: v.title,
    };
  }
  const v = spec.view as PlotView3D;
  return {
    ...common,
    scene: {
      xaxis: { range: [v.xMin, v.xMax], gridcolor: "#1f2937", color: "#a1a1aa" },
      yaxis: { range: [v.yMin, v.yMax], gridcolor: "#1f2937", color: "#a1a1aa" },
      zaxis: { range: v.zMin != null && v.zMax != null ? [v.zMin, v.zMax] : undefined, gridcolor: "#1f2937", color: "#a1a1aa" },
      bgcolor: "#0b0f17",
    },
    title: v.title,
  };
}

function hexToRgba(hex: string, a: number): string {
  const m = hex.replace("#", "");
  const r = parseInt(m.slice(0, 2), 16);
  const g = parseInt(m.slice(2, 4), 16);
  const b = parseInt(m.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}
