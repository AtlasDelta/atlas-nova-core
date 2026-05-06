import { compile, type EvalFunction } from "mathjs";
import type { Series, PlotSpec, FunctionSeries2D } from "./plots";

export interface Computed2DTrace {
  id: string;
  name: string;
  color: string;
  x: number[];
  y: number[];
  mode?: "lines" | "markers" | "lines+markers";
  fill?: "tozeroy";
}
export interface Computed3DSurface {
  id: string;
  name: string;
  color: string;
  x: number[];
  y: number[];
  z: number[][];
  type: "surface";
}
export interface Computed3DCurve {
  id: string;
  name: string;
  color: string;
  x: number[];
  y: number[];
  z: number[];
  type: "scatter3d";
}

export type ComputedTrace = Computed2DTrace | Computed3DSurface | Computed3DCurve;

function safeCompile(expr: string): EvalFunction | null {
  try {
    return compile(expr);
  } catch {
    return null;
  }
}

function evalSafe(fn: EvalFunction | null, scope: Record<string, number>): number {
  if (!fn) return NaN;
  try {
    const v = fn.evaluate(scope);
    return typeof v === "number" && Number.isFinite(v) ? v : NaN;
  } catch {
    return NaN;
  }
}

export function compute2D(series: Series, view: { xMin: number; xMax: number }): Computed2DTrace | null {
  if (series.kind === "function-2d") {
    const xMin = series.xMin ?? view.xMin;
    const xMax = series.xMax ?? view.xMax;
    const n = series.samples ?? 400;
    const fn = safeCompile(series.expr);
    const x: number[] = [];
    const y: number[] = [];
    const dx = (xMax - xMin) / (n - 1);
    for (let i = 0; i < n; i++) {
      const xi = xMin + i * dx;
      x.push(xi);
      y.push(evalSafe(fn, { x: xi }));
    }
    return { id: series.id, name: series.name, color: series.color, x, y, mode: "lines", fill: series.fill ? "tozeroy" : undefined };
  }
  if (series.kind === "parametric-2d") {
    const n = series.samples ?? 600;
    const fnX = safeCompile(series.exprX);
    const fnY = safeCompile(series.exprY);
    const x: number[] = [];
    const y: number[] = [];
    const dt = (series.tMax - series.tMin) / (n - 1);
    for (let i = 0; i < n; i++) {
      const t = series.tMin + i * dt;
      x.push(evalSafe(fnX, { t }));
      y.push(evalSafe(fnY, { t }));
    }
    return { id: series.id, name: series.name, color: series.color, x, y, mode: "lines" };
  }
  if (series.kind === "polar-2d") {
    const n = series.samples ?? 600;
    const fn = safeCompile(series.expr);
    const x: number[] = [];
    const y: number[] = [];
    const dt = (series.thetaMax - series.thetaMin) / (n - 1);
    for (let i = 0; i < n; i++) {
      const th = series.thetaMin + i * dt;
      const r = evalSafe(fn, { theta: th, t: th });
      x.push(r * Math.cos(th));
      y.push(r * Math.sin(th));
    }
    return { id: series.id, name: series.name, color: series.color, x, y, mode: "lines" };
  }
  if (series.kind === "points-2d") {
    return {
      id: series.id,
      name: series.name,
      color: series.color,
      x: series.points.map((p) => p.x),
      y: series.points.map((p) => p.y),
      mode: "markers",
    };
  }
  return null;
}

export function compute3D(series: Series): Computed3DSurface | Computed3DCurve | null {
  if (series.kind === "surface-3d") {
    const n = series.samples ?? 50;
    const fn = safeCompile(series.expr);
    const x: number[] = [];
    const y: number[] = [];
    const z: number[][] = [];
    const dx = (series.xMax - series.xMin) / (n - 1);
    const dy = (series.yMax - series.yMin) / (n - 1);
    for (let i = 0; i < n; i++) x.push(series.xMin + i * dx);
    for (let j = 0; j < n; j++) y.push(series.yMin + j * dy);
    for (let j = 0; j < n; j++) {
      const row: number[] = [];
      for (let i = 0; i < n; i++) row.push(evalSafe(fn, { x: x[i], y: y[j] }));
      z.push(row);
    }
    return { id: series.id, name: series.name, color: series.color, x, y, z, type: "surface" };
  }
  if (series.kind === "param-curve-3d") {
    const n = series.samples ?? 600;
    const fnX = safeCompile(series.exprX);
    const fnY = safeCompile(series.exprY);
    const fnZ = safeCompile(series.exprZ);
    const x: number[] = [];
    const y: number[] = [];
    const z: number[] = [];
    const dt = (series.tMax - series.tMin) / (n - 1);
    for (let i = 0; i < n; i++) {
      const t = series.tMin + i * dt;
      x.push(evalSafe(fnX, { t }));
      y.push(evalSafe(fnY, { t }));
      z.push(evalSafe(fnZ, { t }));
    }
    return { id: series.id, name: series.name, color: series.color, x, y, z, type: "scatter3d" };
  }
  return null;
}

// ─── Numerical analysis on 2D function series ───────────────────────
export function findRoots(fnExpr: string, xMin: number, xMax: number, samples = 1000): number[] {
  const fn = safeCompile(fnExpr);
  if (!fn) return [];
  const xs: number[] = [];
  const dx = (xMax - xMin) / (samples - 1);
  let prevX = xMin;
  let prevY = evalSafe(fn, { x: prevX });
  for (let i = 1; i < samples; i++) {
    const x = xMin + i * dx;
    const y = evalSafe(fn, { x });
    if (Number.isFinite(prevY) && Number.isFinite(y) && prevY * y < 0) {
      // bisection refinement
      let a = prevX, b = x, fa = prevY;
      for (let k = 0; k < 40; k++) {
        const m = (a + b) / 2;
        const fm = evalSafe(fn, { x: m });
        if (!Number.isFinite(fm)) break;
        if (fa * fm < 0) { b = m; } else { a = m; fa = fm; }
        if (Math.abs(b - a) < 1e-9) break;
      }
      xs.push((a + b) / 2);
    }
    prevX = x;
    prevY = y;
  }
  return xs;
}

export function findExtrema(fnExpr: string, xMin: number, xMax: number, samples = 1000): Array<{ x: number; y: number; kind: "min" | "max" }> {
  const fn = safeCompile(fnExpr);
  if (!fn) return [];
  const out: Array<{ x: number; y: number; kind: "min" | "max" }> = [];
  const dx = (xMax - xMin) / (samples - 1);
  let yPrev = evalSafe(fn, { x: xMin });
  let yCur = evalSafe(fn, { x: xMin + dx });
  for (let i = 2; i < samples; i++) {
    const xn = xMin + i * dx;
    const yn = evalSafe(fn, { x: xn });
    if (Number.isFinite(yPrev) && Number.isFinite(yCur) && Number.isFinite(yn)) {
      if (yCur > yPrev && yCur > yn) out.push({ x: xn - dx, y: yCur, kind: "max" });
      else if (yCur < yPrev && yCur < yn) out.push({ x: xn - dx, y: yCur, kind: "min" });
    }
    yPrev = yCur;
    yCur = yn;
  }
  return out;
}

/** Numeric derivative trace (central differences). */
export function derivativeTrace(series: FunctionSeries2D, view: { xMin: number; xMax: number }): Computed2DTrace {
  const fn = safeCompile(series.expr);
  const xMin = series.xMin ?? view.xMin;
  const xMax = series.xMax ?? view.xMax;
  const n = series.samples ?? 400;
  const x: number[] = [];
  const y: number[] = [];
  const dx = (xMax - xMin) / (n - 1);
  const h = dx / 4;
  for (let i = 0; i < n; i++) {
    const xi = xMin + i * dx;
    const yp = (evalSafe(fn, { x: xi + h }) - evalSafe(fn, { x: xi - h })) / (2 * h);
    x.push(xi);
    y.push(yp);
  }
  return { id: `${series.id}-d`, name: `d/dx ${series.name}`, color: "#fbbf24", x, y, mode: "lines" };
}

/** Simpson's rule numeric integral over [a,b]. */
export function integrate(fnExpr: string, a: number, b: number, n = 200): number {
  const fn = safeCompile(fnExpr);
  if (!fn) return NaN;
  if (n % 2 === 1) n += 1;
  const h = (b - a) / n;
  let s = evalSafe(fn, { x: a }) + evalSafe(fn, { x: b });
  for (let i = 1; i < n; i++) {
    const x = a + i * h;
    s += (i % 2 === 0 ? 2 : 4) * evalSafe(fn, { x });
  }
  return (h / 3) * s;
}

export function findIntersections(fA: string, fB: string, xMin: number, xMax: number, samples = 1000): Array<{ x: number; y: number }> {
  const a = safeCompile(fA);
  const b = safeCompile(fB);
  if (!a || !b) return [];
  const xs = findRoots(`(${fA}) - (${fB})`, xMin, xMax, samples);
  return xs.map((x) => ({ x, y: evalSafe(a, { x }) }));
}

export function evaluateAt(fnExpr: string, xs: number[]): Array<{ x: number; y: number }> {
  const fn = safeCompile(fnExpr);
  return xs.map((x) => ({ x, y: evalSafe(fn, { x }) }));
}

export function buildAnalysisAnnotations(spec: PlotSpec): Array<{ id: string; x: number[]; y: number[]; mode: "markers"; name: string; color: string; symbol?: string }> {
  const out: Array<{ id: string; x: number[]; y: number[]; mode: "markers"; name: string; color: string; symbol?: string }> = [];
  const a = spec.analysis;
  if (!a) return out;
  const view = spec.view as { xMin: number; xMax: number };
  const findSeries = (id?: string) => spec.series.find((s) => s.id === id) as FunctionSeries2D | undefined;

  if (a.findRoots) {
    const s = findSeries(a.findRoots);
    if (s?.kind === "function-2d") {
      const xs = findRoots(s.expr, s.xMin ?? view.xMin, s.xMax ?? view.xMax);
      out.push({ id: `${s.id}-roots`, x: xs, y: xs.map(() => 0), mode: "markers", name: `raíces de ${s.name}`, color: "#f87171" });
    }
  }
  if (a.findExtrema) {
    const s = findSeries(a.findExtrema);
    if (s?.kind === "function-2d") {
      const ex = findExtrema(s.expr, s.xMin ?? view.xMin, s.xMax ?? view.xMax);
      out.push({ id: `${s.id}-ext`, x: ex.map((p) => p.x), y: ex.map((p) => p.y), mode: "markers", name: `extremos de ${s.name}`, color: "#34d399" });
    }
  }
  if (a.intersectionsBetween) {
    const [aId, bId] = a.intersectionsBetween;
    const A = findSeries(aId);
    const B = findSeries(bId);
    if (A?.kind === "function-2d" && B?.kind === "function-2d") {
      const pts = findIntersections(A.expr, B.expr, view.xMin, view.xMax);
      out.push({ id: `int-${aId}-${bId}`, x: pts.map((p) => p.x), y: pts.map((p) => p.y), mode: "markers", name: `intersecciones`, color: "#f472b6" });
    }
  }
  if (a.evaluateAt) {
    const s = findSeries(a.evaluateAt.seriesId);
    if (s?.kind === "function-2d") {
      const pts = evaluateAt(s.expr, a.evaluateAt.xs);
      out.push({ id: `${s.id}-eval`, x: pts.map((p) => p.x), y: pts.map((p) => p.y), mode: "markers", name: `f(x_i)`, color: "#60a5fa" });
    }
  }
  return out;
}
