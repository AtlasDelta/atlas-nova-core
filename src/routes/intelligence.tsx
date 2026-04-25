import { createFileRoute } from "@tanstack/react-router";
import { SectionHeader, Panel, Tag, Bullet, Code } from "../components/ui-bits";

export const Route = createFileRoute("/intelligence")({
  head: () => ({
    meta: [
      { title: "Inteligencia integrada — AtlasDelta Revamped" },
      { name: "description", content: "AI Co-Designer: NL→modelo, detección de inconsistencias físicas, sugerencias de optimización." },
    ],
  }),
  component: Intelligence,
});

function Intelligence() {
  return (
    <div>
      <SectionHeader
        index="04 / INTELLIGENCE LAYER"
        title="Un copiloto que entiende física, no solo código."
        subtitle="LLM físicamente informado con grounding sobre el Symbolic IR. No genera texto: genera ediciones verificables."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Panel title="Capacidades del Co-Designer" tag="§ 4.1" accent="accent">
          <ul>
            <Bullet><b>NL → Modelo:</b> "Diseña un intercambiador contracorriente con 12 kW y ΔT de 40 K" → bloques + ecuaciones + BCs.</Bullet>
            <Bullet><b>Detección dimensional:</b> alerta si una ecuación viola homogeneidad de unidades.</Bullet>
            <Bullet><b>Inconsistencia física:</b> identifica BCs incompatibles, sistemas mal-puestos, índice DAE inválido.</Bullet>
            <Bullet><b>Sugerencia de diseño:</b> propone variaciones paramétricas con Pareto previsto.</Bullet>
            <Bullet><b>Explicación:</b> traduce errores numéricos a causas físicas plausibles.</Bullet>
            <Bullet><b>Refactor de modelos:</b> reescribe en forma canónica o adimensionaliza.</Bullet>
          </ul>
        </Panel>

        <Panel title="Grounding técnico" tag="§ 4.2" accent="primary">
          <p className="text-muted-foreground mb-3">
            El asistente nunca opera sobre texto libre del modelo. Su entrada es el Symbolic IR;
            su salida es un diff verificable que pasa por el mismo análisis estático que el código humano.
          </p>
          <Code>{`pipeline:
  user_intent (NL)
    → semantic_parser
    → ir_proposal (SymbolicIR)
    → static_check (units, well-posed)
    → user_review (diff UI)
    → apply | reject`}</Code>
        </Panel>
      </div>

      <Panel title="Ejemplo de interacción" tag="demo">
        <div className="space-y-3 text-sm">
          <div className="border-l-2 border-primary pl-4">
            <div className="text-xs text-primary mb-1">USER</div>
            <p>Quiero modelar la transferencia de calor en una aleta rectangular de aluminio, base 80°C, aire a 25°C, convección natural.</p>
          </div>
          <div className="border-l-2 border-accent pl-4">
            <div className="text-xs text-accent mb-1">CO-DESIGNER · proposed diff</div>
            <Code>{`+ block FinHTX
+   param L = 50 mm, t = 2 mm, k = 237 W/(m·K)
+   param T_base = 80°C, T_amb = 25°C
+   param h = NaturalConvection(T_base, T_amb, L)  // ≈ 8 W/(m²·K)
+   eqn  d²θ/dx² - (h·P)/(k·A_c)·θ = 0
+   bc   θ(0) = T_base - T_amb
+   bc   dθ/dx(L) = 0   // tip insulated
+ end`}</Code>
            <div className="mt-2 text-xs text-muted-foreground">
              ✓ Análisis dimensional OK · ✓ Bien puesto · ✓ Solución analítica disponible para validación
            </div>
          </div>
        </div>
      </Panel>

      <Panel title="Guard-rails" tag="§ 4.3" accent="warn">
        <ul>
          <Bullet>Toda edición generada por IA pasa por <b>análisis estático</b> antes de ser aplicable.</Bullet>
          <Bullet>El usuario <b>siempre revisa el diff</b>; nunca hay aplicación silenciosa.</Bullet>
          <Bullet>El asistente puede <b>declarar incertidumbre</b> ("modelo de h_conv aproximado ±20%").</Bullet>
          <Bullet>Audit trail completo: cada edición IA queda registrada con prompt y modelo usado.</Bullet>
          <Bullet>Modo <Tag tone="muted">offline</Tag> usa modelo local (Llama-class) cuando no hay red.</Bullet>
        </ul>
      </Panel>
    </div>
  );
}
