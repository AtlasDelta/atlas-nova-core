import { useEffect, useRef, useState, type ReactNode } from "react";

export interface PhysicsSliderSpec {
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
  initial: number;
  unit?: string;
}

export type DrawFn = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  t: number,
  params: Record<string, number>,
) => void;

interface Props {
  title?: string;
  caption?: ReactNode;
  sliders: PhysicsSliderSpec[];
  draw: DrawFn;
  height?: number;
  /** Si false, dibuja una sola vez por cambio de parámetros (no anima). */
  animate?: boolean;
}

/**
 * Lienzo canvas para simulaciones físicas en tiempo real (péndulo, masa-resorte,
 * fricción, etc.). El callback `draw` recibe el contexto, el tiempo en segundos
 * desde el inicio y los valores actuales de los sliders.
 */
export function PhysicsCanvas({
  title,
  caption,
  sliders,
  draw,
  height = 260,
  animate = true,
}: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [params, setParams] = useState<Record<string, number>>(() =>
    Object.fromEntries(sliders.map((s) => [s.key, s.initial])),
  );
  const [running, setRunning] = useState(true);
  const startRef = useRef<number>(performance.now());
  const pausedAtRef = useRef<number>(0);
  const elapsedRef = useRef<number>(0);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let raf = 0;
    const tick = (now: number) => {
      if (running) {
        elapsedRef.current = (now - startRef.current) / 1000;
      }
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      try {
        draw(ctx, rect.width, rect.height, elapsedRef.current, params);
      } catch {
        /* noop */
      }
      if (animate) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [draw, params, animate, running]);

  const reset = () => {
    startRef.current = performance.now();
    pausedAtRef.current = 0;
    elapsedRef.current = 0;
    setRunning(true);
  };

  const toggle = () => {
    if (running) {
      pausedAtRef.current = performance.now();
      setRunning(false);
    } else {
      // Reanudar: ajustar startRef para mantener elapsed
      startRef.current = performance.now() - elapsedRef.current * 1000;
      setRunning(true);
    }
  };

  return (
    <figure className="not-prose my-6 border border-border bg-surface">
      {title && (
        <figcaption className="px-4 py-2 text-xs uppercase tracking-widest text-muted-foreground border-b border-border flex items-center justify-between">
          <span>{title}</span>
          {animate && (
            <span className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggle}
                className="px-2 py-0.5 text-[10px] border border-border-strong hover:border-primary hover:text-primary transition-colors"
              >
                {running ? "Pausar" : "Reanudar"}
              </button>
              <button
                type="button"
                onClick={reset}
                className="px-2 py-0.5 text-[10px] border border-border-strong hover:border-primary hover:text-primary transition-colors"
              >
                Reiniciar
              </button>
            </span>
          )}
        </figcaption>
      )}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_220px]">
        <div className="p-2">
          <canvas
            ref={ref}
            style={{ width: "100%", height: `${height}px`, display: "block" }}
          />
        </div>
        <div className="border-t md:border-t-0 md:border-l border-border p-3 space-y-3 bg-surface-2/40">
          {sliders.map((s) => (
            <label key={s.key} className="block text-[11px]">
              <div className="flex justify-between text-muted-foreground mb-1">
                <span>{s.label}</span>
                <span className="text-foreground tabular-nums">
                  {fmt(params[s.key])}
                  {s.unit ? ` ${s.unit}` : ""}
                </span>
              </div>
              <input
                type="range"
                min={s.min}
                max={s.max}
                step={s.step}
                value={params[s.key]}
                onChange={(e) =>
                  setParams((p) => ({ ...p, [s.key]: Number(e.target.value) }))
                }
                className="w-full accent-primary"
              />
            </label>
          ))}
        </div>
      </div>
      {caption && (
        <div className="px-4 py-2 text-[11px] text-muted-foreground border-t border-border">
          {caption}
        </div>
      )}
    </figure>
  );
}

function fmt(n: number): string {
  if (!Number.isFinite(n)) return "—";
  const abs = Math.abs(n);
  if (abs !== 0 && (abs < 0.01 || abs >= 10000)) return n.toExponential(2);
  if (Number.isInteger(n)) return n.toString();
  return n.toFixed(abs < 1 ? 3 : 2);
}
