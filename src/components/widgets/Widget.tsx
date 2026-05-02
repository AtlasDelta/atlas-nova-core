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

/* ───── Nuevos: Física ───── */

function PhysEnergy() {
  return (
    <InteractiveChart
      title="Conservación de energía — péndulo"
      sliders={[
        { key: "L", label: "Longitud L", min: 0.2, max: 3, step: 0.05, initial: 1, unit: "m" },
        { key: "th0", label: "θ₀", min: 5, max: 80, step: 1, initial: 40, unit: "°" },
        { key: "g", label: "g", min: 1.6, max: 25, step: 0.1, initial: 9.81, unit: "m/s²" },
      ]}
      series={[
        { key: "K", label: "E. cinética", color: C.primary },
        { key: "U", label: "E. potencial", color: C.warn },
        { key: "E", label: "E. total", color: C.success, dashed: true },
      ]}
      xKey="t"
      xLabel="t (s)"
      yLabel="E (J/kg)"
      compute={({ L, th0, g }) => {
        const w0 = Math.sqrt(g / L);
        const th = (th0 * Math.PI) / 180;
        const T = (2 * Math.PI) / w0;
        return range(80, 0, 2 * T).map((t) => {
          const a = th * Math.cos(w0 * t);
          const va = -th * w0 * Math.sin(w0 * t);
          const h = L * (1 - Math.cos(a));
          const v = L * va;
          const K = 0.5 * v * v;
          const U = g * h;
          return { t: +t.toFixed(3), K: +K.toFixed(3), U: +U.toFixed(3), E: +(K + U).toFixed(3) };
        });
      }}
      caption="K + U = constante en oscilaciones sin disipación. El intercambio entre ambas es continuo."
    />
  );
}

function PhysCollision() {
  return (
    <PhysicsCanvas
      title="Colisión 1D — elástica vs perfectamente inelástica"
      sliders={[
        { key: "m1", label: "m₁", min: 0.5, max: 5, step: 0.1, initial: 1, unit: "kg" },
        { key: "m2", label: "m₂", min: 0.5, max: 5, step: 0.1, initial: 2, unit: "kg" },
        { key: "v1", label: "v₁ inicial", min: 0.5, max: 6, step: 0.1, initial: 3, unit: "m/s" },
        { key: "e", label: "Coef. restitución e", min: 0, max: 1, step: 0.05, initial: 1 },
      ]}
      draw={(ctx, w, h, t, p) => {
        // Cinemática: choque en t = tc; antes movimiento libre
        const x10 = 100, x20 = w - 200;
        const u1 = p.v1 * 60; // px/s
        const u2 = 0;
        const tc = (x20 - x10 - 60) / (u1 - u2);
        let x1: number, x2: number;
        if (t < tc) {
          x1 = x10 + u1 * t;
          x2 = x20 + u2 * t;
        } else {
          // post-colisión con restitución e
          const v1f = ((p.m1 - p.e * p.m2) * u1 + (1 + p.e) * p.m2 * u2) / (p.m1 + p.m2);
          const v2f = ((p.m2 - p.e * p.m1) * u2 + (1 + p.e) * p.m1 * u1) / (p.m1 + p.m2);
          x1 = x10 + u1 * tc + v1f * (t - tc);
          x2 = x20 + u2 * tc + v2f * (t - tc);
        }
        const cy = h / 2;
        // suelo
        ctx.strokeStyle = "rgba(180,200,220,0.6)";
        ctx.beginPath(); ctx.moveTo(0, cy + 30); ctx.lineTo(w, cy + 30); ctx.stroke();
        // bloques
        const s1 = 18 + p.m1 * 6, s2 = 18 + p.m2 * 6;
        ctx.fillStyle = "rgba(0,200,220,0.85)";
        ctx.fillRect(x1, cy + 30 - s1, s1, s1);
        ctx.fillStyle = "rgba(220,160,60,0.85)";
        ctx.fillRect(x2, cy + 30 - s2, s2, s2);
        ctx.fillStyle = "rgba(200,210,220,0.9)";
        ctx.font = "11px JetBrains Mono, monospace";
        const v1f = ((p.m1 - p.e * p.m2) * u1) / (p.m1 + p.m2) / 60;
        const v2f = ((1 + p.e) * p.m1 * u1) / (p.m1 + p.m2) / 60;
        ctx.fillText(`e = ${p.e.toFixed(2)}  →  v₁' = ${v1f.toFixed(2)} m/s, v₂' = ${v2f.toFixed(2)} m/s`, 12, 18);
        const Ki = 0.5 * p.m1 * p.v1 * p.v1;
        const Kf = 0.5 * p.m1 * v1f * v1f + 0.5 * p.m2 * v2f * v2f;
        ctx.fillText(`Energía: ${(Kf / Ki * 100).toFixed(1)}% conservada`, 12, 34);
      }}
      caption="e = 1: elástica, energía conservada. e = 0: perfectamente inelástica, los cuerpos quedan unidos."
    />
  );
}

function PhysEMWave() {
  return (
    <PhysicsCanvas
      title="Onda electromagnética plana"
      sliders={[
        { key: "f", label: "Frecuencia f", min: 0.2, max: 3, step: 0.1, initial: 1, unit: "Hz" },
        { key: "A", label: "Amplitud", min: 0.2, max: 1.5, step: 0.05, initial: 1 },
      ]}
      draw={(ctx, w, h, t, p) => {
        const cy = h / 2;
        const k = 0.04;
        const w0 = 2 * Math.PI * p.f;
        // E (azul, vertical)
        ctx.strokeStyle = "rgba(0,180,255,0.9)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let x = 0; x < w; x += 2) {
          const y = cy - p.A * 60 * Math.sin(k * x - w0 * t);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        // B (rojo, horizontal proyectado)
        ctx.strokeStyle = "rgba(255,120,80,0.9)";
        ctx.beginPath();
        for (let x = 0; x < w; x += 2) {
          const y = cy + p.A * 30 * Math.sin(k * x - w0 * t);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        // axis
        ctx.strokeStyle = "rgba(180,200,220,0.4)";
        ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(w, cy); ctx.stroke();
        ctx.fillStyle = "rgba(0,180,255,0.95)";
        ctx.font = "11px JetBrains Mono, monospace";
        ctx.fillText("E (campo eléctrico)", 12, 18);
        ctx.fillStyle = "rgba(255,120,80,0.95)";
        ctx.fillText("B (campo magnético)", 12, 34);
        ctx.fillStyle = "rgba(200,210,220,0.7)";
        ctx.fillText("dirección de propagación →", w - 200, h - 12);
      }}
      caption="E ⊥ B ⊥ k, ambos en fase. La luz visible corresponde a f ≈ 4–7·10¹⁴ Hz."
    />
  );
}

function PhysLens() {
  return (
    <PhysicsCanvas
      title="Lente delgada convergente — formación de imagen"
      animate={false}
      sliders={[
        { key: "f", label: "Distancia focal f", min: 30, max: 180, step: 5, initial: 80, unit: "px" },
        { key: "so", label: "s_o (objeto)", min: 50, max: 350, step: 5, initial: 200, unit: "px" },
        { key: "ho", label: "Altura h_o", min: 20, max: 80, step: 1, initial: 50, unit: "px" },
      ]}
      draw={(ctx, w, h, _t, p) => {
        const cy = h / 2;
        const cx = w / 2;
        // axis
        ctx.strokeStyle = "rgba(180,200,220,0.5)";
        ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(w, cy); ctx.stroke();
        // lens
        ctx.strokeStyle = "rgba(0,200,220,0.9)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(cx, cy, 8, 80, 0, 0, Math.PI * 2);
        ctx.stroke();
        // focal points
        ctx.fillStyle = "rgba(220,160,60,0.95)";
        ctx.beginPath(); ctx.arc(cx - p.f, cy, 3, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(cx + p.f, cy, 3, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "rgba(180,200,220,0.7)";
        ctx.font = "10px JetBrains Mono, monospace";
        ctx.fillText("F", cx - p.f - 4, cy + 14);
        ctx.fillText("F'", cx + p.f - 4, cy + 14);
        // object
        const ox = cx - p.so;
        const oyTop = cy - p.ho;
        ctx.strokeStyle = "rgba(0,220,140,0.95)";
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(ox, cy); ctx.lineTo(ox, oyTop); ctx.stroke();
        // image position via 1/f = 1/so + 1/si
        const si = 1 / (1 / p.f - 1 / p.so);
        const M = -si / p.so;
        const ix = cx + si;
        const iyTop = cy - M * p.ho;
        // image (magenta if real, dashed if virtual)
        const real = si > 0;
        ctx.strokeStyle = real ? "rgba(255,80,180,0.95)" : "rgba(255,80,180,0.6)";
        if (!real) ctx.setLineDash([4, 4]);
        ctx.beginPath(); ctx.moveTo(ix, cy); ctx.lineTo(ix, iyTop); ctx.stroke();
        ctx.setLineDash([]);
        // rays: paralelo → pasa por F'
        ctx.strokeStyle = "rgba(255,255,255,0.4)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(ox, oyTop); ctx.lineTo(cx, oyTop); ctx.lineTo(ix, iyTop); ctx.stroke();
        // ray por centro óptico
        ctx.beginPath();
        ctx.moveTo(ox, oyTop); ctx.lineTo(ix, iyTop); ctx.stroke();
        // info
        ctx.fillStyle = "rgba(200,210,220,0.95)";
        ctx.font = "11px JetBrains Mono, monospace";
        ctx.fillText(`s_i = ${si.toFixed(1)} px,  M = ${M.toFixed(2)} (${real ? "real, invertida" : "virtual, derecha"})`, 12, 20);
      }}
      caption="Si s_o > f, imagen real e invertida. Si s_o < f, imagen virtual, derecha y aumentada (lupa)."
    />
  );
}

function PhysFluid() {
  return (
    <InteractiveChart
      title="Bernoulli — presión vs velocidad en tubo Venturi"
      sliders={[
        { key: "v1", label: "v₁ entrada", min: 0.5, max: 10, step: 0.1, initial: 2, unit: "m/s" },
        { key: "rho", label: "ρ", min: 500, max: 13000, step: 50, initial: 1000, unit: "kg/m³" },
        { key: "rA", label: "Radio máx", min: 0.05, max: 0.3, step: 0.005, initial: 0.1, unit: "m" },
        { key: "rB", label: "Radio garganta", min: 0.01, max: 0.1, step: 0.005, initial: 0.04, unit: "m" },
      ]}
      series={[
        { key: "v", label: "v (m/s)", color: C.primary },
        { key: "p", label: "p − p₁ (kPa)", color: C.warn, dashed: true },
      ]}
      xKey="x"
      xLabel="x (posición)"
      compute={({ v1, rho, rA, rB }) => {
        return range(60, 0, 1).map((x) => {
          const r = rA - (rA - rB) * Math.exp(-((x - 0.5) ** 2) / 0.02);
          const A1 = Math.PI * rA * rA;
          const A = Math.PI * r * r;
          const v = (v1 * A1) / A;
          const dp = 0.5 * rho * (v1 * v1 - v * v);
          return { x: +x.toFixed(2), v: +v.toFixed(2), p: +(dp / 1000).toFixed(2) };
        });
      }}
      caption="A·v = cte (continuidad). Donde el área baja, v sube y p baja: principio del efecto Venturi."
    />
  );
}

/* ───── Nuevos: Química ───── */

function ChemLeChatelier() {
  return (
    <InteractiveChart
      title="Le Chatelier — efecto de T y concentración sobre [C]"
      sliders={[
        { key: "K", label: "K base (T₀)", min: 0.1, max: 100, step: 0.1, initial: 5 },
        { key: "dH", label: "ΔH (kJ/mol)", min: -100, max: 100, step: 5, initial: -40 },
        { key: "A0", label: "[A]₀", min: 0.1, max: 2, step: 0.05, initial: 1, unit: "M" },
      ]}
      series={[{ key: "C", label: "[C]_eq (M)", color: C.success }]}
      xKey="T"
      xLabel="T (K)"
      yLabel="[C]_eq"
      compute={({ K, dH, A0 }) => {
        const T0 = 298;
        const R = 8.314;
        return range(60, 250, 600).map((T) => {
          const Kt = K * Math.exp((-dH * 1000 / R) * (1 / T - 1 / T0));
          // A ⇌ C, K = [C]/[A] → [C] = K·[A], conservación A0 = [A] + [C]
          const C = (Kt * A0) / (1 + Kt);
          return { T, C: +C.toFixed(4) };
        });
      }}
      caption="ΔH < 0 (exotérmica): T↑ desplaza a reactivos, [C] baja. ΔH > 0 (endotérmica): T↑ favorece productos."
    />
  );
}

function ChemOrbitals() {
  // Diagrama estático de niveles de energía
  return (
    <figure className="not-prose my-6 border border-border bg-surface">
      <figcaption className="px-4 py-2 text-xs uppercase tracking-widest text-muted-foreground border-b border-border">
        Diagrama de orbitales — orden de llenado (Aufbau)
      </figcaption>
      <div className="p-6">
        <svg viewBox="0 0 480 280" className="w-full" style={{ maxHeight: 320 }}>
          {[
            ["1s", 1, 0],
            ["2s", 2, 0], ["2p", 2, 1],
            ["3s", 3, 0], ["3p", 3, 1], ["3d", 3, 2],
            ["4s", 4, 0], ["4p", 4, 1], ["4d", 4, 2], ["4f", 4, 3],
            ["5s", 5, 0], ["5p", 5, 1],
            ["6s", 6, 0],
          ].map(([label, n, l], i) => {
            const x = 60 + (l as number) * 100;
            const y = 250 - (n as number) * 28 - (l as number) * 6;
            const cap = [2, 6, 10, 14][l as number];
            return (
              <g key={i}>
                <rect x={x} y={y - 10} width={70} height={20} fill="var(--surface-2)" stroke="var(--border-strong)" />
                <text x={x + 35} y={y + 4} textAnchor="middle" fontSize={11} fontFamily="monospace" fill="var(--foreground)">
                  {label} ({cap}e⁻)
                </text>
              </g>
            );
          })}
          {["s (ℓ=0)", "p (ℓ=1)", "d (ℓ=2)", "f (ℓ=3)"].map((t, i) => (
            <text key={i} x={60 + i * 100 + 35} y={270} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">{t}</text>
          ))}
          {/* flecha de orden */}
          <text x={400} y={30} fontSize={11} fill="var(--accent)" fontFamily="monospace">orden: 1s→2s→2p→3s→3p→4s→3d→4p→5s…</text>
        </svg>
      </div>
      <div className="px-4 py-2 text-[11px] text-muted-foreground border-t border-border">
        El 4s se llena antes que el 3d (regla de Madelung: menor n+ℓ; con empate, menor n).
      </div>
    </figure>
  );
}

function ChemBuffer() {
  return (
    <InteractiveChart
      title="Buffer — pH ante adición de ácido/base fuerte"
      sliders={[
        { key: "pKa", label: "pKa", min: 2, max: 12, step: 0.1, initial: 4.75 },
        { key: "HA", label: "[HA]₀", min: 0.01, max: 1, step: 0.01, initial: 0.1, unit: "M" },
        { key: "A", label: "[A⁻]₀", min: 0.01, max: 1, step: 0.01, initial: 0.1, unit: "M" },
      ]}
      series={[
        { key: "pH", label: "pH del buffer", color: C.primary },
        { key: "pHw", label: "pH agua pura (ref.)", color: C.muted, dashed: true },
      ]}
      xKey="n"
      xLabel="mmol HCl añadidos"
      compute={({ pKa, HA, A }) => {
        // 1 L de buffer
        return range(40, 0, Math.min(HA, A) * 0.9 * 1000).map((nH) => {
          const HAn = HA + nH / 1000;
          const An = A - nH / 1000;
          const pH = pKa + Math.log10(An / HAn);
          // agua pura: pH = -log10(nH/V)
          const pHw = nH > 0 ? -Math.log10(nH / 1000) : 7;
          return { n: +nH.toFixed(1), pH: +pH.toFixed(2), pHw: +pHw.toFixed(2) };
        });
      }}
      caption="El buffer absorbe protones convirtiendo A⁻ en HA. Capacidad máxima cerca de pH = pKa."
    />
  );
}

/* ───── Nuevos: Matemática ───── */

function MathRiemann() {
  return (
    <PhysicsCanvas
      title="Suma de Riemann — área bajo f(x) = sin(x) + 1.2"
      animate={false}
      sliders={[
        { key: "n", label: "Particiones n", min: 2, max: 80, step: 1, initial: 12 },
      ]}
      draw={(ctx, w, h, _t, p) => {
        const a = 0, b = Math.PI * 2;
        const padL = 40, padR = 16, padT = 20, padB = 30;
        const W = w - padL - padR;
        const H = h - padT - padB;
        const f = (x: number) => Math.sin(x) + 1.2;
        const yMax = 2.5;
        const sx = (x: number) => padL + ((x - a) / (b - a)) * W;
        const sy = (y: number) => padT + H - (y / yMax) * H;
        // axes
        ctx.strokeStyle = "rgba(180,200,220,0.5)";
        ctx.beginPath(); ctx.moveTo(padL, sy(0)); ctx.lineTo(w - padR, sy(0)); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(padL, padT); ctx.lineTo(padL, sy(0)); ctx.stroke();
        // bars (midpoint rule)
        const dx = (b - a) / p.n;
        let sum = 0;
        ctx.fillStyle = "rgba(0,200,220,0.35)";
        ctx.strokeStyle = "rgba(0,200,220,0.85)";
        for (let i = 0; i < p.n; i++) {
          const xm = a + (i + 0.5) * dx;
          const fv = f(xm);
          sum += fv * dx;
          const x0 = sx(a + i * dx);
          const x1 = sx(a + (i + 1) * dx);
          const y0 = sy(fv);
          const y1 = sy(0);
          ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
          ctx.strokeRect(x0, y0, x1 - x0, y1 - y0);
        }
        // curve
        ctx.strokeStyle = "rgba(255,200,80,0.95)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let i = 0; i <= 200; i++) {
          const x = a + ((b - a) * i) / 200;
          const y = f(x);
          if (i === 0) ctx.moveTo(sx(x), sy(y));
          else ctx.lineTo(sx(x), sy(y));
        }
        ctx.stroke();
        // info
        ctx.fillStyle = "rgba(200,210,220,0.95)";
        ctx.font = "11px JetBrains Mono, monospace";
        ctx.fillText(`Σ ≈ ${sum.toFixed(4)}    exacto: ${(2.4 * Math.PI).toFixed(4)}`, padL, 14);
      }}
      caption="Al aumentar n, la suma de áreas converge a la integral definida (definición de Riemann)."
    />
  );
}

function MathVectorField() {
  return (
    <PhysicsCanvas
      title="Campo vectorial F(x,y) = (−y, x) (rotacional)"
      animate={false}
      sliders={[
        { key: "g", label: "Densidad", min: 8, max: 30, step: 1, initial: 16 },
      ]}
      draw={(ctx, w, h, _t, p) => {
        const cx = w / 2, cy = h / 2;
        const span = Math.min(w, h) * 0.45;
        ctx.strokeStyle = "rgba(180,200,220,0.4)";
        ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(w, cy); ctx.moveTo(cx, 0); ctx.lineTo(cx, h); ctx.stroke();
        const N = Math.round(p.g);
        const step = (2 * span) / N;
        for (let i = 0; i <= N; i++) {
          for (let j = 0; j <= N; j++) {
            const x = -span + i * step;
            const y = -span + j * step;
            const fx = -y, fy = x;
            const mag = Math.hypot(fx, fy);
            if (mag < 1e-3) continue;
            const len = Math.min(step * 0.45, mag * 0.06);
            const ux = (fx / mag) * len;
            const uy = (fy / mag) * len;
            const px = cx + x;
            const py = cy - y;
            const ex = px + ux;
            const ey = py - uy;
            const t = Math.min(1, mag / span);
            ctx.strokeStyle = `rgba(${Math.round(40 + t * 200)}, ${Math.round(220 - t * 80)}, 220, 0.85)`;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(ex, ey); ctx.stroke();
            // arrowhead
            const ang = Math.atan2(-uy, ux);
            ctx.beginPath();
            ctx.moveTo(ex, ey);
            ctx.lineTo(ex - 4 * Math.cos(ang - 0.4), ey + 4 * Math.sin(ang - 0.4));
            ctx.moveTo(ex, ey);
            ctx.lineTo(ex - 4 * Math.cos(ang + 0.4), ey + 4 * Math.sin(ang + 0.4));
            ctx.stroke();
          }
        }
      }}
      caption="Las líneas de campo rodean el origen: ∇·F = 0 (no hay fuente), ∇×F = 2k̂ (rotacional puro)."
    />
  );
}

function MathDistribution() {
  return (
    <InteractiveChart
      title="Distribución normal — efecto de μ y σ"
      sliders={[
        { key: "mu", label: "μ", min: -3, max: 3, step: 0.1, initial: 0 },
        { key: "sig", label: "σ", min: 0.3, max: 3, step: 0.05, initial: 1 },
      ]}
      series={[
        { key: "p", label: "N(μ, σ²)", color: C.primary },
        { key: "n01", label: "N(0, 1) ref", color: C.muted, dashed: true },
      ]}
      xKey="x"
      xLabel="x"
      yLabel="densidad"
      compute={({ mu, sig }) => {
        const pdf = (x: number, m: number, s: number) =>
          Math.exp(-((x - m) ** 2) / (2 * s * s)) / (s * Math.sqrt(2 * Math.PI));
        return range(120, -6, 6).map((x) => ({
          x: +x.toFixed(2),
          p: +pdf(x, mu, sig).toFixed(4),
          n01: +pdf(x, 0, 1).toFixed(4),
        }));
      }}
      caption="μ traslada el pico; σ controla la dispersión (~68% en [μ−σ, μ+σ])."
    />
  );
}

function MathConic() {
  return (
    <PhysicsCanvas
      title="Cónicas — clasificación por excentricidad"
      animate={false}
      sliders={[
        { key: "e", label: "Excentricidad e", min: 0, max: 1.6, step: 0.02, initial: 0.5 },
        { key: "p", label: "Semilatus p", min: 30, max: 120, step: 5, initial: 70 },
      ]}
      draw={(ctx, w, h, _t, par) => {
        const cx = w / 2, cy = h / 2;
        ctx.strokeStyle = "rgba(180,200,220,0.4)";
        ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(w, cy); ctx.moveTo(cx, 0); ctx.lineTo(cx, h); ctx.stroke();
        ctx.fillStyle = "rgba(220,160,60,0.95)";
        ctx.beginPath(); ctx.arc(cx, cy, 4, 0, Math.PI * 2); ctx.fill();
        // r = p / (1 + e cosθ)
        ctx.strokeStyle = "rgba(0,200,220,0.95)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        let started = false;
        for (let deg = 0; deg <= 360; deg += 1) {
          const th = (deg * Math.PI) / 180;
          const denom = 1 + par.e * Math.cos(th);
          if (denom <= 0.05) { started = false; continue; }
          const r = par.p / denom;
          if (r > 600) { started = false; continue; }
          const x = cx + r * Math.cos(th);
          const y = cy - r * Math.sin(th);
          if (!started) { ctx.moveTo(x, y); started = true; }
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        const tipo = par.e < 0.01 ? "circunferencia" : par.e < 1 ? "elipse" : par.e === 1 ? "parábola" : "hipérbola";
        ctx.fillStyle = "rgba(200,210,220,0.95)";
        ctx.font = "11px JetBrains Mono, monospace";
        ctx.fillText(`e = ${par.e.toFixed(2)} → ${tipo}`, 12, 18);
      }}
      caption="e = 0: circunferencia · 0 < e < 1: elipse · e = 1: parábola · e > 1: hipérbola."
    />
  );
}

/* ───── Nuevos: Ingeniería ───── */

function EngRLC() {
  return (
    <InteractiveChart
      title="Respuesta de un circuito RLC en serie a un escalón"
      sliders={[
        { key: "R", label: "R", min: 0.1, max: 200, step: 0.5, initial: 20, unit: "Ω" },
        { key: "L", label: "L", min: 0.001, max: 1, step: 0.001, initial: 0.05, unit: "H" },
        { key: "C", label: "C", min: 1e-6, max: 1e-3, step: 1e-6, initial: 1e-4, unit: "F" },
      ]}
      series={[
        { key: "Vc", label: "V_C(t)", color: C.primary },
        { key: "ref", label: "ref. 1 V", color: C.muted, dashed: true },
      ]}
      xKey="t"
      xLabel="t (ms)"
      compute={({ R, L, C: Cap }) => {
        const w0 = 1 / Math.sqrt(L * Cap);
        const z = R / 2 * Math.sqrt(Cap / L);
        const T = 6 / (z * w0 + 1e-3);
        return range(80, 0, T).map((t) => {
          let v = 0;
          if (z < 1) {
            const wd = w0 * Math.sqrt(1 - z * z);
            v = 1 - Math.exp(-z * w0 * t) * (Math.cos(wd * t) + (z * w0 / wd) * Math.sin(wd * t));
          } else if (z === 1) {
            v = 1 - (1 + w0 * t) * Math.exp(-w0 * t);
          } else {
            const r = w0 * Math.sqrt(z * z - 1);
            const A = 0.5 * (1 + (z * w0) / r);
            const B = 0.5 * (1 - (z * w0) / r);
            v = 1 - A * Math.exp((-z * w0 + r) * t) - B * Math.exp((-z * w0 - r) * t);
          }
          return { t: +(t * 1000).toFixed(2), Vc: +v.toFixed(4), ref: 1 };
        });
      }}
      caption="ζ = (R/2)√(C/L). Subamortiguado (ζ<1): oscila. Crítico (ζ=1): respuesta más rápida sin overshoot."
    />
  );
}

function EngMoody() {
  return (
    <InteractiveChart
      title="Factor de fricción f vs Reynolds (rugosidad relativa fija)"
      sliders={[
        { key: "eps", label: "ε/D", min: 0, max: 0.05, step: 0.0005, initial: 0.001 },
      ]}
      series={[{ key: "f", label: "f (Darcy)", color: C.warn }]}
      xKey="logRe"
      xLabel="log₁₀ Re"
      yLabel="f"
      compute={({ eps }) => {
        return range(60, 2.5, 8).map((lr) => {
          const Re = Math.pow(10, lr);
          let f: number;
          if (Re < 2300) f = 64 / Re; // laminar
          else {
            // Swamee-Jain (aprox. de Colebrook)
            f = 0.25 / Math.pow(Math.log10(eps / 3.7 + 5.74 / Math.pow(Re, 0.9)), 2);
          }
          return { logRe: +lr.toFixed(2), f: +f.toFixed(4) };
        });
      }}
      caption="Régimen laminar f = 64/Re; turbulento depende fuertemente de la rugosidad relativa."
    />
  );
}

function EngThevenin() {
  return (
    <figure className="not-prose my-6 border border-border bg-surface">
      <figcaption className="px-4 py-2 text-xs uppercase tracking-widest text-muted-foreground border-b border-border">
        Equivalente Thévenin ↔ Norton
      </figcaption>
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <svg viewBox="0 0 240 160" className="w-full">
          <text x={120} y={16} textAnchor="middle" fontSize={11} fill="var(--muted-foreground)" fontFamily="monospace">Thévenin</text>
          <line x1={40} y1={120} x2={40} y2={50} stroke="var(--foreground)" strokeWidth={1.5} />
          <line x1={30} y1={50} x2={50} y2={50} stroke="var(--foreground)" strokeWidth={2} />
          <line x1={34} y1={42} x2={46} y2={42} stroke="var(--foreground)" strokeWidth={2} />
          <text x={20} y={70} fontSize={10} fontFamily="monospace" fill="var(--primary)">V_th</text>
          <line x1={40} y1={42} x2={40} y2={30} stroke="var(--foreground)" />
          <line x1={40} y1={30} x2={120} y2={30} stroke="var(--foreground)" />
          <rect x={120} y={20} width={50} height={20} fill="none" stroke="var(--foreground)" strokeWidth={1.5} />
          <text x={145} y={15} textAnchor="middle" fontSize={10} fontFamily="monospace" fill="var(--accent)">R_th</text>
          <line x1={170} y1={30} x2={210} y2={30} stroke="var(--foreground)" />
          <circle cx={210} cy={30} r={3} fill="var(--foreground)" />
          <line x1={40} y1={120} x2={210} y2={120} stroke="var(--foreground)" />
          <circle cx={210} cy={120} r={3} fill="var(--foreground)" />
          <text x={220} y={75} fontSize={10} fontFamily="monospace" fill="var(--muted-foreground)">carga</text>
        </svg>
        <svg viewBox="0 0 240 160" className="w-full">
          <text x={120} y={16} textAnchor="middle" fontSize={11} fill="var(--muted-foreground)" fontFamily="monospace">Norton</text>
          <circle cx={60} cy={75} r={18} fill="none" stroke="var(--foreground)" strokeWidth={1.5} />
          <line x1={50} y1={75} x2={70} y2={75} stroke="var(--foreground)" />
          <line x1={70} y1={75} x2={64} y2={70} stroke="var(--foreground)" />
          <line x1={70} y1={75} x2={64} y2={80} stroke="var(--foreground)" />
          <text x={60} y={110} textAnchor="middle" fontSize={10} fontFamily="monospace" fill="var(--success)">I_N</text>
          <line x1={60} y1={57} x2={60} y2={30} stroke="var(--foreground)" />
          <line x1={60} y1={30} x2={140} y2={30} stroke="var(--foreground)" />
          <line x1={60} y1={93} x2={60} y2={120} stroke="var(--foreground)" />
          <line x1={60} y1={120} x2={210} y2={120} stroke="var(--foreground)" />
          <line x1={140} y1={30} x2={140} y2={50} stroke="var(--foreground)" />
          <rect x={130} y={50} width={20} height={50} fill="none" stroke="var(--foreground)" strokeWidth={1.5} />
          <text x={160} y={80} fontSize={10} fontFamily="monospace" fill="var(--accent)">R_N</text>
          <line x1={140} y1={100} x2={140} y2={120} stroke="var(--foreground)" />
          <line x1={140} y1={30} x2={210} y2={30} stroke="var(--foreground)" />
          <circle cx={210} cy={30} r={3} fill="var(--foreground)" />
          <circle cx={210} cy={120} r={3} fill="var(--foreground)" />
        </svg>
      </div>
      <div className="px-4 py-2 text-[11px] text-muted-foreground border-t border-border">
        Conversión: I_N = V_th / R_th, R_N = R_th. Ambas redes producen la misma corriente y tensión en cualquier carga conectada a sus terminales.
      </div>
    </figure>
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
  "phys-energy": PhysEnergy,
  "phys-collision": PhysCollision,
  "phys-em-wave": PhysEMWave,
  "phys-lens": PhysLens,
  "phys-fluid": PhysFluid,
  "chem-lechatelier": ChemLeChatelier,
  "chem-orbitals": ChemOrbitals,
  "chem-buffer": ChemBuffer,
  "math-riemann": MathRiemann,
  "math-vectorfield": MathVectorField,
  "math-distribution": MathDistribution,
  "math-conic": MathConic,
  "eng-rlc": EngRLC,
  "eng-moody": EngMoody,
  "eng-thevenin": EngThevenin,
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
