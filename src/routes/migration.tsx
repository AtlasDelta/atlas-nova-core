import { createFileRoute } from "@tanstack/react-router";
import { SectionHeader, Panel, Tag, Bullet } from "../components/ui-bits";

export const Route = createFileRoute("/migration")({
  head: () => ({
    meta: [
      { title: "Migración legacy → Revamped" },
      { name: "description", content: "Plan de migración de AtlasDelta 1.x a 2.0 con compatibilidad conceptual y deprecación gradual." },
    ],
  }),
  component: Migration,
});

const DIFFS = [
  { area: "Núcleo", legacy: "Solver monolítico hardcoded", revamped: "Symbolic IR + solver pluggable", impact: "alto" },
  { area: "Acoplamiento", legacy: "Hardcoded por par de dominios", revamped: "Coupling Manager genérico", impact: "alto" },
  { area: "Plugins", legacy: "Static linking · sin sandbox", revamped: "WASM/nativo · sandboxed", impact: "medio" },
  { area: "Config", legacy: "INI/YAML con strings sueltas", revamped: "Symbolic IR tipado + DSL", impact: "alto" },
  { area: "Paralelismo", legacy: "OpenMP intra-nodo", revamped: "MPI + GPU + dataflow", impact: "alto" },
  { area: "MOR", legacy: "no soportado", revamped: "POD/RB/operadores neuronales", impact: "nuevo" },
  { area: "IA", legacy: "no soportado", revamped: "Co-Designer integrado", impact: "nuevo" },
  { area: "UI", legacy: "Scripts + viewer separado", revamped: "IDE unificada con debugger físico", impact: "alto" },
  { area: "Determinismo", legacy: "no garantizado", revamped: "Bit-exact opcional", impact: "medio" },
  { area: "HIL", legacy: "vía script ad-hoc", revamped: "HIL Bridge nativo", impact: "nuevo" },
];

function Migration() {
  return (
    <div>
      <SectionHeader
        index="08 / LEGACY MIGRATION"
        title="Compatibilidad conceptual. Refactor total bajo el capó."
        subtitle="Los modelos 1.x se importan y se traducen automáticamente al Symbolic IR. Coexistencia de runtimes durante 12 meses."
      />

      <Panel title="Diferencias clave vs AtlasDelta 1.x" tag="diff-table">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted-foreground uppercase tracking-wider border-b border-border">
                <th className="py-2 pr-4">Área</th>
                <th className="py-2 pr-4">Legacy 1.x</th>
                <th className="py-2 pr-4">Revamped 2.0</th>
                <th className="py-2">Impacto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {DIFFS.map((d) => (
                <tr key={d.area}>
                  <td className="py-2.5 pr-4 font-medium text-foreground">{d.area}</td>
                  <td className="py-2.5 pr-4 text-muted-foreground">{d.legacy}</td>
                  <td className="py-2.5 pr-4 text-foreground">{d.revamped}</td>
                  <td className="py-2.5">
                    <Tag tone={d.impact === "alto" ? "danger" : d.impact === "nuevo" ? "accent" : "warn"}>{d.impact}</Tag>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Panel title="Plan de migración (T+0 → T+18m)" tag="§ 8.1" accent="primary">
          <ol className="space-y-3">
            {[
              ["T+0", "Release 2.0-alpha. Importer 1.x → IR. Coexistencia binarios 1.x/2.0."],
              ["T+3m", "Beta pública. Block library 1.x portada al 100%."],
              ["T+6m", "GA 2.0. Compat layer 1.x marcada deprecated."],
              ["T+12m", "Eliminación de runtime 1.x. Solo bridge de import."],
              ["T+18m", "End-of-life total para 1.x. Solo modelos importados sobreviven."],
            ].map(([t, d]) => (
              <li key={t} className="flex gap-4">
                <Tag tone="primary">{t}</Tag>
                <span className="text-sm text-muted-foreground">{d}</span>
              </li>
            ))}
          </ol>
        </Panel>

        <Panel title="Garantías de compatibilidad" tag="§ 8.2" accent="success">
          <ul>
            <Bullet>Todos los modelos 1.x se importan automáticamente al IR.</Bullet>
            <Bullet>Resultados numéricos equivalentes ± tolerancia documentada.</Bullet>
            <Bullet>Pipelines existentes ejecutables vía CLI compatible.</Bullet>
            <Bullet>Scripts de validación legacy se ejecutan sin modificación durante 12 meses.</Bullet>
            <Bullet>Bridge bidireccional 1.x ↔ 2.0 mantenido durante todo el período.</Bullet>
          </ul>
        </Panel>
      </div>
    </div>
  );
}
