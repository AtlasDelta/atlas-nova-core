import { useMemo, useState, type ReactNode } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  ReferenceLine,
} from "recharts";

export interface SliderSpec {
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
  initial: number;
  unit?: string;
}

export interface SeriesSpec {
  key: string;
  label: string;
  color: string; // CSS color o var(--...)
  dashed?: boolean;
}

interface Props {
  title?: string;
  caption?: ReactNode;
  sliders: SliderSpec[];
  series: SeriesSpec[];
  /** Devuelve filas {x, [seriesKey]: number} */
  compute: (params: Record<string, number>) => Array<Record<string, number>>;
  xLabel?: string;
  yLabel?: string;
  xKey?: string;
  height?: number;
}

/**
 * Gráfica científica parametrizable. Sliders en vivo, tooltip, leyenda.
 * Pensado para curvas como Arrhenius, oscilador, decaimiento, etc.
 */
export function InteractiveChart({
  title,
  caption,
  sliders,
  series,
  compute,
  xLabel,
  yLabel,
  xKey = "x",
  height = 280,
}: Props) {
  const [params, setParams] = useState<Record<string, number>>(() =>
    Object.fromEntries(sliders.map((s) => [s.key, s.initial])),
  );

  const data = useMemo(() => compute(params), [params, compute]);

  return (
    <figure className="not-prose my-6 border border-border bg-surface">
      {title && (
        <figcaption className="px-4 py-2 text-xs uppercase tracking-widest text-muted-foreground border-b border-border">
          {title}
        </figcaption>
      )}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_220px]">
        <div className="p-3" style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 16, bottom: 24, left: 0 }}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="2 4" />
              <XAxis
                dataKey={xKey}
                stroke="var(--muted-foreground)"
                fontSize={10}
                tickLine={false}
                label={
                  xLabel
                    ? { value: xLabel, position: "insideBottom", offset: -8, fill: "var(--muted-foreground)", fontSize: 10 }
                    : undefined
                }
              />
              <YAxis
                stroke="var(--muted-foreground)"
                fontSize={10}
                tickLine={false}
                label={
                  yLabel
                    ? { value: yLabel, angle: -90, position: "insideLeft", fill: "var(--muted-foreground)", fontSize: 10 }
                    : undefined
                }
              />
              <Tooltip
                contentStyle={{
                  background: "var(--surface-2)",
                  border: "1px solid var(--border-strong)",
                  fontSize: 11,
                  borderRadius: 2,
                }}
                labelStyle={{ color: "var(--muted-foreground)" }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <ReferenceLine y={0} stroke="var(--border-strong)" />
              {series.map((s) => (
                <Line
                  key={s.key}
                  type="monotone"
                  dataKey={s.key}
                  name={s.label}
                  stroke={s.color}
                  strokeWidth={1.75}
                  strokeDasharray={s.dashed ? "4 4" : undefined}
                  dot={false}
                  isAnimationActive={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
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
