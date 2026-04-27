import type { ReactElement } from "react";
import type { WidgetKey } from "@/lib/articles";
import { InteractiveChart } from "@/components/InteractiveChart";
import { PhysicsCanvas } from "@/components/PhysicsCanvas";

type P = Record<string, number>;
type CanvasFn = (
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  p: P,
) => void;

const C = {
  primary: "var(--primary)",
  accent: "var(--accent)",
  success: "var(--success)",
  warn: "var(--warn)",
  danger: "var(--danger)",
  muted: "var(--muted-foreground)",
};

/* ────────── helpers numéricos ────────── */
function range(n: number, from = 0, to = 1) {
  const out: number[] = [];
  const step = (to - from) / (n - 1);
  for (let i = 0; i < n; i++) out.push(from + i * step);
  return out;
}

/* ════════════════════════════════════════════════════════════
 *  WIDGETS — uno por WidgetKey
 * ════════════════════════════════════════════════════════════ */

function PhysProjectile() {
  return (
    <InteractiveChart
      title="Tiro parabólico — y(x)"
      sliders={[
        { key: "v0", label: "Velocidad inicial v₀", min: 5, max: 60, step: 1, initial: 25, unit: "m/s" },
        { key: "ang", label: "Ángulo θ", min: 5, max: 85, step: 1, initial: 45, unit: "°" },
        { key: "g", label: "Gravedad g", min: 1.6, max: 25, step: 0.1, initial: 9.81, unit: "m/s²" },
      ]}
      series={[{ key: "y", label: "altura y(x)", color: C.primary }]}
      xKey="x"
      xLabel="x (m)"
      yLabel="y (m)"
      compute={({ v0, ang, g }) => {
        const th = (ang * Math.PI) / 180;
        const vx = v0 * Math.cos(th);
        const vy = v0 * Math.sin(th);
        const tEnd = (2 * vy) / g;
        const xEnd = vx * tEnd;
        return range(80, 0, xEnd).map((x) => {
          const t = x / vx;
          return { x: +x.toFixed(2), y: +(vy * t - 0.5 * g * t * t).toFixed(3) };
        });
      }}
      caption="Sin resistencia del aire. Alcance R = v₀² sin(2θ)/g, máximo en θ = 45°."
    />
  );
}

function PhysFriction() {
  return (
    <PhysicsCanvas
      title="Bloque con fricción sobre plano inclinado"
      sliders={[
        { key: "ang", label: "Inclinación θ", min: 0, max: 60, step: 1, initial: 25, unit: "°" },
        { key: "mu", label: "Coef. fricción μ", min: 0, max: 0.8, step: 0.01, initial: 0.25 },
        { key: "g", label: "Gravedad g", min: 1, max: 20, step: 0.1, initial: 9.81, unit: "m/s²" },
      ]}
      draw={(ctx, w, h, t, p) => {
        const th = (p.ang * Math.PI) / 180;
        const aSlide = p.g * (Math.sin(th) - p.mu * Math.cos(th));
        // Movimiento solo si fuerza neta positiva
        const a = aSlide > 0 ? aSlide : 0;
        const Lmax = Math.min(w, h) * 0.7;
        // distancia recorrida (con reseteo cíclico)
        const period = a > 0 ? Math.sqrt((2 * Lmax) / a) : 4;
        const tt = (t % (period + 0.6));
        const s = a > 0 ? Math.min(0.5 * a * tt * tt, Lmax) : 0;

        // Origen del plano
        const ox = w * 0.12;
        const oy = h * 0.85;
        const ex = ox + Lmax * Math.cos(th);
        const ey = oy - Lmax * Math.sin(th);

        // Plano
        ctx.strokeStyle = "rgba(180,200,220,0.9)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(ox, oy);
        ctx.lineTo(ex, oy);
        ctx.lineTo(ox, oy);
        ctx.lineTo(ex, ey);
        ctx.stroke();

        // hatching del suelo
        ctx.strokeStyle = "rgba(120,140,160,0.5)";
        ctx.lineWidth = 1;
        for (let x = ox; x <= ex; x += 8) {
          ctx.beginPath();
          ctx.moveTo(x, oy);
          ctx.lineTo(x - 6, oy + 8);
          ctx.stroke();
        }

        // bloque
        const bx = ox + s * Math.cos(th);
        const by = oy - s * Math.sin(th);
        const bw = 36, bh = 22;
        ctx.save();
        ctx.translate(bx, by);
        ctx.rotate(-th);
        ctx.fillStyle = a > 0 ? "rgba(0,200,220,0.85)" : "rgba(220,160,60,0.85)";
        ctx.fillRect(-bw / 2, -bh, bw, bh);
        ctx.strokeStyle = "rgba(255,255,255,0.6)";
        ctx.strokeRect(-bw / 2, -bh, bw, bh);
        ctx.restore();

        // Texto
        ctx.fillStyle = "rgba(200,210,220,0.9)";
        ctx.font = "11px JetBrains Mono, monospace";
        ctx.fillText(`a = g(sinθ − μ·cosθ) = ${aSlide.toFixed(2)} m/s²`, 12, 18);
        ctx.fillStyle = a > 0 ? "rgba(0,200,220,0.9)" : "rgba(220,160,60,0.9)";
        ctx.fillText(a > 0 ? "Bloque desliza" : "Bloque en reposo (fricción estática suficiente)", 12, 34);
      }}
      caption="Si tan(θ) ≤ μ, el bloque permanece en reposo: la fricción equilibra el peso paralelo al plano."
    />
  );
}

function PhysSpring() {
  return (
    <PhysicsCanvas
      title="Oscilador masa-resorte amortiguado"
      sliders={[
        { key: "k", label: "Rigidez k", min: 1, max: 80, step: 1, initial: 30, unit: "N/m" },
        { key: "m", label: "Masa m", min: 0.1, max: 5, step: 0.1, initial: 1, unit: "kg" },
        { key: "c", label: "Amortiguam. c", min: 0, max: 6, step: 0.05, initial: 0.4, unit: "Ns/m" },
        { key: "x0", label: "Amplitud inicial x₀", min: 0.2, max: 2, step: 0.05, initial: 1, unit: "m" },
      ]}
      draw={(ctx, w, h, t, p) => {
        const wn = Math.sqrt(p.k / p.m);
        const z = p.c / (2 * Math.sqrt(p.k * p.m));
        let x = 0;
        if (z < 1) {
          const wd = wn * Math.sqrt(1 - z * z);
          x = p.x0 * Math.exp(-z * wn * t) * Math.cos(wd * t);
        } else if (z === 1) {
          x = p.x0 * (1 + wn * t) * Math.exp(-wn * t);
        } else {
          const r = Math.sqrt(z * z - 1);
          x = (p.x0 / 2) * (Math.exp((-z + r) * wn * t) + Math.exp((-z - r) * wn * t));
        }

        const cy = h / 2;
        const wallX = w * 0.1;
        const eqX = w * 0.55;
        const scale = (w * 0.3);
        const massX = eqX + x * scale;

        // pared
        ctx.strokeStyle = "rgba(180,200,220,0.9)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(wallX, cy - 50);
        ctx.lineTo(wallX, cy + 50);
        ctx.stroke();
        for (let y = cy - 50; y < cy + 50; y += 8) {
          ctx.beginPath();
          ctx.moveTo(wallX, y);
          ctx.lineTo(wallX - 8, y + 6);
          ctx.stroke();
        }

        // resorte (zigzag)
        ctx.strokeStyle = "rgba(0,200,220,0.85)";
        ctx.beginPath();
        ctx.moveTo(wallX, cy);
        const N = 14;
        const dx = (massX - wallX) / N;
        for (let i = 1; i < N; i++) {
          ctx.lineTo(wallX + i * dx, cy + (i % 2 === 0 ? -10 : 10));
        }
        ctx.lineTo(massX, cy);
        ctx.stroke();

        // masa
        ctx.fillStyle = "rgba(220,160,60,0.9)";
        ctx.fillRect(massX, cy - 22, 36, 44);
        ctx.strokeStyle = "rgba(255,255,255,0.6)";
        ctx.strokeRect(massX, cy - 22, 36, 44);

        // info
        ctx.fillStyle = "rgba(200,210,220,0.9)";
        ctx.font = "11px JetBrains Mono, monospace";
        ctx.fillText(`ωₙ = ${wn.toFixed(2)} rad/s   ζ = ${z.toFixed(2)}`, 12, 18);
        const reg = z < 1 ? "subamortiguado" : z === 1 ? "crítico" : "sobreamortiguado";
        ctx.fillText(`régimen: ${reg}`, 12, 34);
      }}
    />
  );
}

function PhysPendulum() {
  return (
    <PhysicsCanvas
      title="Péndulo simple"
      sliders={[
        { key: "L", label: "Longitud L", min: 0.2, max: 3, step: 0.05, initial: 1, unit: "m" },
        { key: "g", label: "Gravedad g", min: 1.6, max: 25, step: 0.1, initial: 9.81, unit: "m/s²" },
        { key: "th0", label: "Ángulo inicial θ₀", min: 5, max: 80, step: 1, initial: 30, unit: "°" },
      ]}
      draw={(ctx, w, h, t, p) => {
        const w0 = Math.sqrt(p.g / p.L);
        const th0 = (p.th0 * Math.PI) / 180;
        const th = th0 * Math.cos(w0 * t);
        const px = w / 2;
        const py = h * 0.15;
        const len = Math.min(h * 0.7, 240);
        const bx = px + len * Math.sin(th);
        const by = py + len * Math.cos(th);

        ctx.strokeStyle = "rgba(180,200,220,0.5)";
        ctx.beginPath();
        ctx.arc(px, py, len, Math.PI / 2 - th0, Math.PI / 2 + th0);
        ctx.stroke();

        ctx.strokeStyle = "rgba(0,200,220,0.85)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(bx, by);
        ctx.stroke();

        ctx.fillStyle = "rgba(220,160,60,0.95)";
        ctx.beginPath();
        ctx.arc(bx, by, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.6)";
        ctx.stroke();

        ctx.fillStyle = "rgba(200,210,220,0.9)";
        ctx.font = "11px JetBrains Mono, monospace";
        ctx.fillText(`T = 2π√(L/g) = ${(2 * Math.PI / w0).toFixed(2)} s`, 12, 18);
      }}
      caption="Aproximación de pequeñas oscilaciones (válida hasta ~15°). Para ángulos grandes, T crece."
    />
  );
}

function PhysOhm() {
  return (
    <InteractiveChart
      title="Ley de Ohm — V = IR"
      sliders={[
        { key: "R", label: "Resistencia R", min: 1, max: 100, step: 1, initial: 10, unit: "Ω" },
      ]}
      series={[{ key: "V", label: "V (V)", color: C.primary }]}
      xKey="I"
      xLabel="Corriente I (A)"
      yLabel="Tensión V (V)"
      compute={({ R }) =>
        range(40, 0, 5).map((I) => ({ I: +I.toFixed(2), V: +(R * I).toFixed(2) }))
      }
    />
  );
}

function PhysWave() {
  return (
    <InteractiveChart
      title="Onda armónica y(x, t₀)"
      sliders={[
        { key: "A", label: "Amplitud A", min: 0.1, max: 2, step: 0.05, initial: 1 },
        { key: "lam", label: "Long. onda λ", min: 0.5, max: 10, step: 0.1, initial: 2, unit: "m" },
        { key: "phi", label: "Fase φ", min: 0, max: 6.28, step: 0.05, initial: 0, unit: "rad" },
      ]}
      series={[{ key: "y", label: "y(x)", color: C.primary }]}
      xKey="x"
      xLabel="x (m)"
      compute={({ A, lam, phi }) => {
        const k = (2 * Math.PI) / lam;
        return range(120, 0, 10).map((x) => ({ x: +x.toFixed(2), y: +(A * Math.sin(k * x + phi)).toFixed(3) }));
      }}
    />
  );
}

function PhysDoppler() {
  return (
    <InteractiveChart
      title="Efecto Doppler — frecuencia percibida"
      sliders={[
        { key: "f0", label: "Freq. emitida f₀", min: 100, max: 2000, step: 10, initial: 440, unit: "Hz" },
        { key: "vs", label: "Vel. fuente vs", min: -100, max: 100, step: 1, initial: 30, unit: "m/s" },
        { key: "vo", label: "Vel. observ. vo", min: -100, max: 100, step: 1, initial: 0, unit: "m/s" },
        { key: "c", label: "Vel. medio c", min: 100, max: 400, step: 1, initial: 343, unit: "m/s" },
      ]}
      series={[{ key: "f", label: "f percibida (Hz)", color: C.accent }]}
      xKey="d"
      xLabel="distancia recorrida (m)"
      yLabel="f (Hz)"
      compute={({ f0, vs, vo, c }) =>
        range(40, 0, 100).map((d) => ({
          d: +d.toFixed(1),
          f: +((f0 * (c + vo)) / (c - vs)).toFixed(2),
        }))
      }
      caption="f' = f₀(c + v_observador)/(c − v_fuente). Convención: positivo si acerca al observador."
    />
  );
}

function PhysDecay() {
  return (
    <InteractiveChart
      title="Decaimiento radiactivo N(t)"
      sliders={[
        { key: "N0", label: "N₀ (núcleos)", min: 100, max: 10000, step: 100, initial: 1000 },
        { key: "T", label: "Vida media T₁/₂", min: 0.5, max: 20, step: 0.1, initial: 5, unit: "s" },
      ]}
      series={[{ key: "N", label: "N(t)", color: C.warn }]}
      xKey="t"
      xLabel="tiempo (s)"
      compute={({ N0, T }) => {
        const lam = Math.log(2) / T;
        return range(60, 0, 30).map((t) => ({ t: +t.toFixed(2), N: +(N0 * Math.exp(-lam * t)).toFixed(1) }));
      }}
    />
  );
}

function PhysRC() {
  return (
    <InteractiveChart
      title="Carga de un circuito RC"
      sliders={[
        { key: "V", label: "Tensión V", min: 1, max: 20, step: 0.5, initial: 5, unit: "V" },
        { key: "R", label: "Resistencia R", min: 100, max: 10000, step: 100, initial: 1000, unit: "Ω" },
        { key: "C", label: "Capacidad C", min: 1e-6, max: 1e-3, step: 1e-6, initial: 1e-4, unit: "F" },
      ]}
      series={[
        { key: "Vc", label: "V_C(t)", color: C.primary },
        { key: "I", label: "I(t)·R", color: C.accent, dashed: true },
      ]}
      xKey="t"
      xLabel="tiempo (s)"
      compute={({ V, R, C: Cap }) => {
        const tau = R * Cap;
        return range(60, 0, 5 * tau).map((t) => ({
          t: +t.toFixed(3),
          Vc: +(V * (1 - Math.exp(-t / tau))).toFixed(3),
          I: +(V * Math.exp(-t / tau)).toFixed(3),
        }));
      }}
      caption="Constante τ = RC. Tras 5τ, V_C alcanza ~99% de V."
    />
  );
}

function PhysSnell() {
  return (
    <InteractiveChart
      title="Ley de Snell — ángulo refractado"
      sliders={[
        { key: "n1", label: "Índice n₁", min: 1, max: 2, step: 0.01, initial: 1 },
        { key: "n2", label: "Índice n₂", min: 1, max: 2.5, step: 0.01, initial: 1.5 },
      ]}
      series={[{ key: "th2", label: "θ₂ (°)", color: C.success }]}
      xKey="th1"
      xLabel="θ₁ (°)"
      compute={({ n1, n2 }) =>
        range(60, 0, 89).map((th1) => {
          const s = (n1 / n2) * Math.sin((th1 * Math.PI) / 180);
          const th2 = Math.abs(s) <= 1 ? (Math.asin(s) * 180) / Math.PI : NaN;
          return { th1: +th1.toFixed(1), th2: Number.isFinite(th2) ? +th2.toFixed(2) : 90 };
        })
      }
      caption="Si n₁ > n₂, existe un ángulo crítico θ_c = arcsin(n₂/n₁) por encima del cual hay reflexión total interna."
    />
  );
}

/* ───── Química ───── */

function ChemArrhenius() {
  return (
    <InteractiveChart
      title="Ecuación de Arrhenius — k(T)"
      sliders={[
        { key: "A", label: "Factor A", min: 1e8, max: 1e13, step: 1e8, initial: 1e10, unit: "1/s" },
        { key: "Ea", label: "Energía activación Eₐ", min: 20, max: 200, step: 1, initial: 80, unit: "kJ/mol" },
      ]}
      series={[{ key: "k", label: "k (1/s)", color: C.accent }]}
      xKey="T"
      xLabel="T (K)"
      yLabel="k"
      compute={({ A, Ea }) => {
        const R = 8.314;
        return range(60, 250, 800).map((T) => ({
          T: +T.toFixed(0),
          k: +(A * Math.exp((-Ea * 1000) / (R * T))).toExponential(3),
        }));
      }}
    />
  );
}

function ChemFirstOrder() {
  return (
    <InteractiveChart
      title="Cinética de primer orden"
      sliders={[
        { key: "C0", label: "[A]₀", min: 0.01, max: 1, step: 0.01, initial: 0.5, unit: "M" },
        { key: "k", label: "k", min: 0.01, max: 2, step: 0.01, initial: 0.3, unit: "1/s" },
      ]}
      series={[{ key: "C", label: "[A](t)", color: C.primary }]}
      xKey="t"
      xLabel="t (s)"
      compute={({ C0, k }) =>
        range(60, 0, 20).map((t) => ({ t: +t.toFixed(2), C: +(C0 * Math.exp(-k * t)).toFixed(4) }))
      }
      caption="Vida media t₁/₂ = ln(2)/k, independiente de la concentración inicial."
    />
  );
}

function ChemEquilibrium() {
  return (
    <InteractiveChart
      title="Equilibrio A ⇌ B (K vs T)"
      sliders={[
        { key: "dH", label: "ΔH°", min: -100, max: 100, step: 1, initial: 50, unit: "kJ/mol" },
        { key: "dS", label: "ΔS°", min: -200, max: 200, step: 1, initial: 80, unit: "J/(mol·K)" },
      ]}
      series={[{ key: "K", label: "K(T)", color: C.success }]}
      xKey="T"
      xLabel="T (K)"
      compute={({ dH, dS }) => {
        const R = 8.314;
        return range(60, 200, 800).map((T) => ({
          T: +T.toFixed(0),
          K: +Math.exp(-(dH * 1000 - T * dS) / (R * T)).toExponential(3),
        }));
      }}
      caption="Van't Hoff: ln K = −ΔH°/(RT) + ΔS°/R."
    />
  );
}

function ChemPh() {
  return (
    <InteractiveChart
      title="pH de un ácido débil HA"
      sliders={[
        { key: "Ca", label: "Concentración C", min: 1e-4, max: 1, step: 1e-4, initial: 0.1, unit: "M" },
        { key: "pKa", label: "pKa", min: 1, max: 13, step: 0.1, initial: 4.75 },
      ]}
      series={[{ key: "pH", label: "pH", color: C.primary }]}
      xKey="logC"
      xLabel="−log₁₀ C"
      compute={({ Ca, pKa }) => {
        // aproximación pH ≈ ½(pKa − log C) para ácido débil moderado
        const Ka = Math.pow(10, -pKa);
        return range(40, 0.5 * Ca, 1.5 * Ca).map((c) => {
          const x = (-Ka + Math.sqrt(Ka * Ka + 4 * Ka * c)) / 2;
          const pH = -Math.log10(x);
          return { logC: +(-Math.log10(c)).toFixed(2), pH: +pH.toFixed(2) };
        });
      }}
    />
  );
}

function ChemGas() {
  return (
    <InteractiveChart
      title="Gas ideal — isotermas pV = nRT"
      sliders={[
        { key: "n", label: "n (mol)", min: 0.1, max: 5, step: 0.1, initial: 1 },
        { key: "T", label: "T (K)", min: 100, max: 800, step: 5, initial: 300 },
      ]}
      series={[{ key: "p", label: "p (Pa)", color: C.accent }]}
      xKey="V"
      xLabel="V (L)"
      compute={({ n, T }) => {
        const R = 8.314;
        return range(60, 0.5, 30).map((V) => ({
          V: +V.toFixed(2),
          p: +((n * R * T) / (V * 1e-3)).toFixed(0),
        }));
      }}
    />
  );
}

function ChemTitration() {
  return (
    <InteractiveChart
      title="Curva de titulación ácido fuerte / base fuerte"
      sliders={[
        { key: "Ca", label: "[ácido]", min: 0.01, max: 1, step: 0.01, initial: 0.1, unit: "M" },
        { key: "Va", label: "Vol. ácido", min: 5, max: 100, step: 1, initial: 25, unit: "mL" },
        { key: "Cb", label: "[base]", min: 0.01, max: 1, step: 0.01, initial: 0.1, unit: "M" },
      ]}
      series={[{ key: "pH", label: "pH", color: C.primary }]}
      xKey="Vb"
      xLabel="V_base (mL)"
      compute={({ Ca, Va, Cb }) => {
        const Veq = (Ca * Va) / Cb;
        return range(80, 0, Veq * 2).map((Vb) => {
          const nH = Ca * Va * 1e-3 - Cb * Vb * 1e-3;
          const Vt = (Va + Vb) * 1e-3;
          let pH: number;
          if (nH > 1e-12) pH = -Math.log10(nH / Vt);
          else if (nH < -1e-12) pH = 14 + Math.log10(-nH / Vt);
          else pH = 7;
          return { Vb: +Vb.toFixed(2), pH: +pH.toFixed(2) };
        });
      }}
      caption="Punto de equivalencia: pH = 7 (ácido y base fuertes)."
    />
  );
}

/* ───── Matemática ───── */

function MathDerivative() {
  return (
    <InteractiveChart
      title="f(x) y su derivada f'(x)"
      sliders={[
        { key: "a", label: "a (coef. x²)", min: -2, max: 2, step: 0.1, initial: 1 },
        { key: "b", label: "b (coef. x)", min: -5, max: 5, step: 0.1, initial: 0 },
        { key: "c", label: "c (constante)", min: -5, max: 5, step: 0.1, initial: 0 },
      ]}
      series={[
        { key: "f", label: "f(x) = ax² + bx + c", color: C.primary },
        { key: "df", label: "f'(x) = 2ax + b", color: C.accent, dashed: true },
      ]}
      xKey="x"
      xLabel="x"
      compute={({ a, b, c }) =>
        range(80, -5, 5).map((x) => ({
          x: +x.toFixed(2),
          f: +(a * x * x + b * x + c).toFixed(3),
          df: +(2 * a * x + b).toFixed(3),
        }))
      }
    />
  );
}

function MathTaylor() {
  return (
    <InteractiveChart
      title="Aproximación de Taylor de sin(x) en 0"
      sliders={[
        { key: "N", label: "Orden N (impares)", min: 1, max: 13, step: 2, initial: 5 },
      ]}
      series={[
        { key: "sin", label: "sin(x)", color: C.primary },
        { key: "tay", label: "Taylor N", color: C.accent, dashed: true },
      ]}
      xKey="x"
      xLabel="x"
      compute={({ N }) => {
        const fact = (k: number) => { let r = 1; for (let i = 2; i <= k; i++) r *= i; return r; };
        return range(120, -2 * Math.PI, 2 * Math.PI).map((x) => {
          let t = 0;
          for (let k = 1; k <= N; k += 2) t += ((k - 1) / 2 % 2 === 0 ? 1 : -1) * Math.pow(x, k) / fact(k);
          return { x: +x.toFixed(2), sin: +Math.sin(x).toFixed(3), tay: +t.toFixed(3) };
        });
      }}
    />
  );
}

function MathFourier() {
  return (
    <InteractiveChart
      title="Serie de Fourier — onda cuadrada"
      sliders={[
        { key: "N", label: "N términos", min: 1, max: 30, step: 1, initial: 5 },
      ]}
      series={[{ key: "s", label: "Σ", color: C.primary }]}
      xKey="x"
      xLabel="x"
      compute={({ N }) =>
        range(160, -Math.PI, Math.PI).map((x) => {
          let s = 0;
          for (let k = 1; k <= N; k++) {
            const n = 2 * k - 1;
            s += Math.sin(n * x) / n;
          }
          return { x: +x.toFixed(2), s: +((4 / Math.PI) * s).toFixed(3) };
        })
      }
      caption="Suma parcial de la serie 4/π · Σ sin((2k−1)x)/(2k−1). Ondas de Gibbs en los saltos."
    />
  );
}

function MathNewtonRaphson() {
  return (
    <InteractiveChart
      title="Newton–Raphson sobre f(x) = x² − a"
      sliders={[
        { key: "a", label: "a", min: 0.1, max: 50, step: 0.1, initial: 2 },
        { key: "x0", label: "x₀", min: 0.1, max: 10, step: 0.1, initial: 5 },
        { key: "n", label: "Iter. n", min: 1, max: 12, step: 1, initial: 6 },
      ]}
      series={[{ key: "x", label: "xₙ", color: C.success }]}
      xKey="i"
      xLabel="iteración"
      compute={({ a, x0, n }) => {
        const out = [{ i: 0, x: +x0.toFixed(6) }];
        let x = x0;
        for (let i = 1; i <= n; i++) {
          x = x - (x * x - a) / (2 * x);
          out.push({ i, x: +x.toFixed(6) });
        }
        return out;
      }}
      caption="Converge cuadráticamente a √a desde casi cualquier x₀ > 0."
    />
  );
}

function MathLogistic() {
  return (
    <InteractiveChart
      title="Crecimiento logístico"
      sliders={[
        { key: "r", label: "Tasa r", min: 0.1, max: 2, step: 0.05, initial: 0.6 },
        { key: "K", label: "Capacidad K", min: 100, max: 5000, step: 50, initial: 1000 },
        { key: "N0", label: "N₀", min: 1, max: 500, step: 1, initial: 10 },
      ]}
      series={[{ key: "N", label: "N(t)", color: C.primary }]}
      xKey="t"
      xLabel="t"
      compute={({ r, K, N0 }) =>
        range(60, 0, 20).map((t) => ({
          t: +t.toFixed(2),
          N: +(K / (1 + ((K - N0) / N0) * Math.exp(-r * t))).toFixed(2),
        }))
      }
    />
  );
}

function MathEigen() {
  return (
    <InteractiveChart
      title="Iteración de potencia — convergencia al autovalor dominante"
      sliders={[
        { key: "l1", label: "λ₁", min: 0.5, max: 5, step: 0.05, initial: 3 },
        { key: "l2", label: "λ₂", min: 0.1, max: 5, step: 0.05, initial: 1 },
        { key: "n", label: "Iter. n", min: 1, max: 30, step: 1, initial: 12 },
      ]}
      series={[{ key: "r", label: "Rayleigh ρₙ", color: C.success }]}
      xKey="i"
      xLabel="iteración"
      compute={({ l1, l2, n }) => {
        let v = [1, 1];
        const out: Array<Record<string, number>> = [];
        for (let i = 1; i <= n; i++) {
          v = [l1 * v[0], l2 * v[1]];
          const norm = Math.hypot(v[0], v[1]);
          v = [v[0] / norm, v[1] / norm];
          const Av = [l1 * v[0], l2 * v[1]];
          const r = v[0] * Av[0] + v[1] * Av[1];
          out.push({ i, r: +r.toFixed(4) });
        }
        return out;
      }}
      caption="Para una matriz diag(λ₁, λ₂) con |λ₁| > |λ₂|, el cociente de Rayleigh tiende a λ₁."
    />
  );
}

/* ───── Ingeniería ───── */

function EngPID() {
  return (
    <InteractiveChart
      title="Respuesta de un sistema 1er orden con control PID"
      sliders={[
        { key: "Kp", label: "Kp", min: 0, max: 10, step: 0.1, initial: 2 },
        { key: "Ki", label: "Ki", min: 0, max: 5, step: 0.05, initial: 0.5 },
        { key: "Kd", label: "Kd", min: 0, max: 5, step: 0.05, initial: 0.1 },
        { key: "tau", label: "τ planta", min: 0.1, max: 5, step: 0.1, initial: 1 },
      ]}
      series={[
        { key: "y", label: "y(t)", color: C.primary },
        { key: "r", label: "ref", color: C.muted, dashed: true },
      ]}
      xKey="t"
      xLabel="t (s)"
      compute={({ Kp, Ki, Kd, tau }) => {
        const dt = 0.05, T = 15;
        let y = 0, e_prev = 0, integ = 0;
        const out: Array<Record<string, number>> = [];
        const r = 1;
        for (let t = 0; t <= T; t += dt) {
          const e = r - y;
          integ += e * dt;
          const der = (e - e_prev) / dt;
          const u = Kp * e + Ki * integ + Kd * der;
          // planta 1er orden: tau dy/dt + y = u
          y += (dt / tau) * (u - y);
          e_prev = e;
          out.push({ t: +t.toFixed(2), y: +y.toFixed(4), r });
        }
        return out;
      }}
    />
  );
}

function EngBode() {
  return (
    <InteractiveChart
      title="Bode de magnitud — filtro pasa-bajos 1er orden"
      sliders={[
        { key: "fc", label: "f_c", min: 1, max: 10000, step: 1, initial: 100, unit: "Hz" },
      ]}
      series={[{ key: "dB", label: "|H| (dB)", color: C.primary }]}
      xKey="f"
      xLabel="f (Hz, log)"
      yLabel="dB"
      compute={({ fc }) =>
        range(60, 0, 5).map((e) => {
          const f = Math.pow(10, e);
          const r = f / fc;
          const mag = 1 / Math.sqrt(1 + r * r);
          return { f: +f.toFixed(1), dB: +(20 * Math.log10(mag)).toFixed(2) };
        })
      }
      caption="Caída asintótica de −20 dB/década por encima de la frecuencia de corte f_c."
    />
  );
}

function EngBeam() {
  return (
    <InteractiveChart
      title="Deflexión de viga simplemente apoyada con carga puntual"
      sliders={[
        { key: "L", label: "Longitud L", min: 1, max: 10, step: 0.1, initial: 4, unit: "m" },
        { key: "P", label: "Carga P", min: 100, max: 50000, step: 100, initial: 5000, unit: "N" },
        { key: "EI", label: "EI", min: 1e4, max: 1e7, step: 1e4, initial: 1e6, unit: "N·m²" },
      ]}
      series={[{ key: "y", label: "deflexión (mm)", color: C.warn }]}
      xKey="x"
      xLabel="x (m)"
      compute={({ L, P, EI }) => {
        const a = L / 2; // carga centrada
        const b = L - a;
        return range(60, 0, L).map((x) => {
          let y = 0;
          if (x <= a) {
            y = (P * b * x) / (6 * L * EI) * (L * L - b * b - x * x);
          } else {
            y = (P * a * (L - x)) / (6 * L * EI) * (2 * L * x - a * a - x * x);
          }
          return { x: +x.toFixed(2), y: +(y * 1000).toFixed(3) };
        });
      }}
      caption="Deflexión máxima en el centro: PL³/(48 EI)."
    />
  );
}

function EngHeat() {
  return (
    <InteractiveChart
      title="Conducción 1D estacionaria en pared compuesta"
      sliders={[
        { key: "T1", label: "T interior", min: -20, max: 80, step: 1, initial: 22, unit: "°C" },
        { key: "T2", label: "T exterior", min: -40, max: 50, step: 1, initial: -5, unit: "°C" },
        { key: "k1", label: "k pared", min: 0.05, max: 5, step: 0.01, initial: 0.6, unit: "W/m·K" },
        { key: "k2", label: "k aislante", min: 0.02, max: 1, step: 0.01, initial: 0.04, unit: "W/m·K" },
      ]}
      series={[{ key: "T", label: "T (°C)", color: C.primary }]}
      xKey="x"
      xLabel="x (cm)"
      compute={({ T1, T2, k1, k2 }) => {
        // 10 cm pared + 5 cm aislante
        const L1 = 0.10, L2 = 0.05;
        const R1 = L1 / k1, R2 = L2 / k2;
        const q = (T1 - T2) / (R1 + R2);
        const Tmid = T1 - q * R1;
        return range(60, 0, L1 + L2).map((x) => {
          let T: number;
          if (x <= L1) T = T1 - q * (x / k1);
          else T = Tmid - q * ((x - L1) / k2);
          return { x: +(x * 100).toFixed(2), T: +T.toFixed(2) };
        });
      }}
    />
  );
}

function EngRankine() {
  return (
    <InteractiveChart
      title="Eficiencia ideal de un ciclo Rankine vs presión de caldera"
      sliders={[
        { key: "Pc", label: "P condensador", min: 5, max: 50, step: 1, initial: 10, unit: "kPa" },
      ]}
      series={[{ key: "eta", label: "η", color: C.success }]}
      xKey="Pb"
      xLabel="P caldera (kPa)"
      compute={({ Pc }) =>
        range(40, 500, 15000).map((Pb) => ({
          Pb: +Pb.toFixed(0),
          // aprox simple: η ≈ 1 − (Tc/Tb), con T saturación ~ 100·(P/100)^0.25
          eta: +(1 - Math.pow(Pc / Pb, 0.25)).toFixed(4),
        }))
      }
      caption="Aproximación simplificada (no usa tablas de vapor reales)."
    />
  );
}

function EngQueue() {
  return (
    <InteractiveChart
      title="Cola M/M/1 — longitud media en el sistema"
      sliders={[
        { key: "rho", label: "Utilización ρ", min: 0.05, max: 0.99, step: 0.01, initial: 0.7 },
      ]}
      series={[{ key: "L", label: "L = ρ/(1−ρ)", color: C.warn }]}
      xKey="rho"
      xLabel="ρ"
      compute={() =>
        range(60, 0.05, 0.97).map((rho) => ({ rho: +rho.toFixed(3), L: +(rho / (1 - rho)).toFixed(3) }))
      }
      caption="L explota cuando ρ → 1: pequeñas variaciones de carga implican enormes esperas."
    />
  );
}

const REGISTRY: Record<WidgetKey, () => ReactElement> = {
  "phys-projectile": PhysProjectile,
  "phys-friction": PhysFriction,
  "phys-spring": PhysSpring,
  "phys-pendulum": PhysPendulum,
  "phys-ohm": PhysOhm,
  "phys-wave": PhysWave,
  "phys-doppler": PhysDoppler,
  "phys-decay": PhysDecay,
  "phys-rc": PhysRC,
  "phys-snell": PhysSnell,
  "chem-arrhenius": ChemArrhenius,
  "chem-firstorder": ChemFirstOrder,
  "chem-equilibrium": ChemEquilibrium,
  "chem-ph": ChemPh,
  "chem-gas": ChemGas,
  "chem-titration": ChemTitration,
  "math-derivative": MathDerivative,
  "math-taylor": MathTaylor,
  "math-fourier": MathFourier,
  "math-newton-raphson": MathNewtonRaphson,
  "math-logistic": MathLogistic,
  "math-eigen": MathEigen,
  "eng-pid": EngPID,
  "eng-bode": EngBode,
  "eng-beam": EngBeam,
  "eng-heat": EngHeat,
  "eng-rankine": EngRankine,
  "eng-queue": EngQueue,
};

export function Widget({ name }: { name: WidgetKey }) {
  const C = REGISTRY[name];
  if (!C) {
    return (
      <div className="my-4 p-3 border border-warn/40 text-xs text-muted-foreground">
        Widget no disponible: {name}
      </div>
    );
  }
  return <C />;
}
