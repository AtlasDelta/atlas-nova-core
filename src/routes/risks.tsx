import { createFileRoute } from "@tanstack/react-router";
import { SectionHeader, Panel, Tag } from "../components/ui-bits";
import { AlertTriangle, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/risks")({
  head: () => ({
    meta: [
      { title: "Riesgos técnicos — AtlasDelta Revamped" },
      { name: "description", content: "Riesgos técnicos clasificados con mitigaciones explícitas." },
    ],
  }),
  component: Risks,
});

const RISKS = [
  {
    id: "R-01",
    sev: "crítico",
    title: "Complejidad del Symbolic IR",
    desc: "Un IR demasiado genérico puede no compilar a código competitivo en performance.",
    mit: "IR co-diseñado con compilador desde día 1; benchmarks continuos vs solvers especializados; fallback a kernels handwritten en hot paths.",
  },
  {
    id: "R-02",
    sev: "crítico",
    title: "Acoplamiento multi-físico inestable",
    desc: "Esquemas particionados pueden divergir en regímenes fuertemente acoplados (FSI denso, plasma).",
    mit: "Coupling Manager con detección automática y fallback a esquema monolítico; library de relajadores (Aitken, IQN-ILS); cobertura por benchmarks comunitarios.",
  },
  {
    id: "R-03",
    sev: "alto",
    title: "Co-Designer alucinando física",
    desc: "LLM puede proponer modelos plausibles sintácticamente pero erróneos físicamente.",
    mit: "Pipeline de validación obligatoria (análisis dimensional, well-posedness, conservación) antes de aplicar; UI muestra siempre el diff; modo offline con modelo restringido.",
  },
  {
    id: "R-04",
    sev: "alto",
    title: "Fragmentación del ecosistema de plugins",
    desc: "Múltiples plugins resolviendo el mismo problema con APIs incompatibles.",
    mit: "Marketplace curado con tagging semántico; specs de referencia para dominios comunes; programa de partners para plugins clave.",
  },
  {
    id: "R-05",
    sev: "alto",
    title: "Performance MOR insuficiente",
    desc: "Reducción adaptativa puede no alcanzar la tolerancia en problemas con discontinuidades.",
    mit: "Múltiples métodos disponibles (POD, RB, DEIM, FNO); estimadores de error robustos; degradación elegante a full-order cuando MOR falla.",
  },
  {
    id: "R-06",
    sev: "medio",
    title: "Migración 1.x rompiendo modelos legacy",
    desc: "Importer puede perder semántica en modelos con extensiones custom.",
    mit: "Suite de regression tests con 1000+ modelos legacy; bridge bidireccional 12 meses; programa de soporte de migración asistido por Co-Designer.",
  },
  {
    id: "R-07",
    sev: "medio",
    title: "Adopción HPC lenta",
    desc: "Centros HPC son conservadores con stacks nuevos; resistencia a desplegar Rust/WASM.",
    mit: "Distribución como Spack/EasyBuild package; certificación con principales OEMs; case studies con 2-3 centros faro.",
  },
  {
    id: "R-08",
    sev: "medio",
    title: "Determinismo bit-exact difícil en GPU",
    desc: "Reducciones en GPU son intrínsecamente no asociativas.",
    mit: "Modo determinista usa reducciones ordenadas (más lentas); CPU-only path siempre disponible; documentación clara del trade-off.",
  },
  {
    id: "R-09",
    sev: "bajo",
    title: "Costo de mantenimiento del kernel",
    desc: "Mantener compatibilidad ABI del IR a largo plazo es costoso.",
    mit: "Versionado semántico con LTS; tooling de migración automática entre versiones del IR.",
  },
  {
    id: "R-10",
    sev: "bajo",
    title: "Curva de aprendizaje del DSL",
    desc: "Modelica++ con extensiones nuevas requiere formación.",
    mit: "Co-Designer cubre el caso de usuario novato; templates por industria; documentación interactiva con ejemplos vivos.",
  },
];

const sevTone: Record<string, "danger" | "warn" | "muted"> = {
  "crítico": "danger",
  "alto": "warn",
  "medio": "warn",
  "bajo": "muted",
};

function Risks() {
  return (
    <div>
      <SectionHeader
        index="09 / RISK REGISTER"
        title="Diez riesgos. Diez mitigaciones."
        subtitle="Identificados antes de la implementación. Cada riesgo tiene un owner técnico y métricas de seguimiento."
      />

      <div className="space-y-3">
        {RISKS.map((r) => (
          <div key={r.id} className="border border-border bg-surface">
            <div className="flex items-center gap-3 px-4 py-2 border-b border-border bg-surface-2/50">
              <Tag tone={sevTone[r.sev]}>{r.sev}</Tag>
              <span className="text-xs text-muted-foreground font-mono">{r.id}</span>
              <span className="font-display font-medium ml-2">{r.title}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
              <div className="bg-surface p-4">
                <div className="flex items-center gap-2 text-xs text-danger mb-2">
                  <AlertTriangle className="h-3.5 w-3.5" /> RIESGO
                </div>
                <p className="text-sm text-muted-foreground">{r.desc}</p>
              </div>
              <div className="bg-surface p-4">
                <div className="flex items-center gap-2 text-xs text-success mb-2">
                  <ShieldCheck className="h-3.5 w-3.5" /> MITIGACIÓN
                </div>
                <p className="text-sm text-foreground">{r.mit}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Panel title="Métricas de salud del proyecto" tag="§ 9.1">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          {[
            ["Cobertura tests", "≥ 85%"],
            ["Regression suite", "1000+ casos"],
            ["Benchmark CI", "diario"],
            ["Security audit", "trimestral"],
          ].map(([k, v]) => (
            <div key={k}>
              <div className="text-xs text-muted-foreground">{k}</div>
              <div className="font-display text-lg text-primary">{v}</div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
