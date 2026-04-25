import { createFileRoute } from "@tanstack/react-router";
import { SectionHeader, Panel, Tag, Bullet, Code } from "../components/ui-bits";

export const Route = createFileRoute("/modules")({
  head: () => ({
    meta: [
      { title: "Módulos críticos — AtlasDelta Revamped" },
      { name: "description", content: "Componentes nuevos: Symbolic IR, Coupling Manager, MOR Engine, Plugin Bus, Telemetry." },
    ],
  }),
  component: Modules,
});

const MODULES = [
  {
    id: "MOD-01",
    name: "Symbolic IR & Compiler",
    role: "Representación intermedia",
    desc: "Un AST simbólico que captura ecuaciones (ODE, PDE, DAE, SDE) independientes de la discretización. Habilita diferenciación automática, simplificación, análisis dimensional y generación de kernels especializados (CPU/GPU).",
    tags: ["NEW", "L2"],
    contract: `compile(ir: SymbolicIR, target: Backend) -> KernelArtifact`,
  },
  {
    id: "MOD-02",
    name: "Coupling Manager",
    role: "Acoplamiento multi-dominio",
    desc: "Resuelve interacciones entre dominios (FSI, conjugate heat, electro-térmico, reactivo). Implementa esquemas particionados, monolíticos e híbridos con Picard/Newton acelerado por Anderson.",
    tags: ["NEW", "L3"],
    contract: `couple(graph: DomainGraph, scheme: CouplingScheme) -> CoupledSystem`,
  },
  {
    id: "MOD-03",
    name: "MOR Engine",
    role: "Reducción adaptativa de modelos",
    desc: "Proyección de Galerkin reducida (POD, RB, DEIM) y operadores neuronales (DeepONet, FNO). Decide en runtime cuándo usar el modelo full-order vs. reducido según error estimado.",
    tags: ["NEW", "L2"],
    contract: `reduce(model: FullOrder, budget: ErrorBudget) -> ReducedModel`,
  },
  {
    id: "MOD-04",
    name: "Stochastic Layer",
    role: "Procesos estocásticos integrados",
    desc: "SDEs (Itô/Stratonovich), métodos Monte Carlo multilevel, Polynomial Chaos para cuantificación de incertidumbre. Acoplable con cualquier solver determinista.",
    tags: ["NEW", "L2"],
    contract: `propagate_uncertainty(sys, dist: PriorBundle) -> Posterior`,
  },
  {
    id: "MOD-05",
    name: "Optimization Suite",
    role: "Diseño y control",
    desc: "Multi-objetivo (NSGA-III, MOEA/D), MPC no lineal (IPOPT/CasADi), bayesiano (BoTorch-like) y híbridos gradient/evolutivos. Integración nativa con AD del kernel.",
    tags: ["UPGRADE", "L4"],
    contract: `optimize(objective, constraints, design_space) -> Pareto`,
  },
  {
    id: "MOD-06",
    name: "Engineering Block Library",
    role: "Abstracción reutilizable",
    desc: "Bloques físicos parametrizables con puertos algebraicos (a-causales). Más flexibles que Modelica: soportan PDE locales, eventos discretos y acoplamiento multi-dominio.",
    tags: ["NEW", "L5"],
    contract: `block!(name, ports, equations, params)`,
  },
  {
    id: "MOD-07",
    name: "AI Co-Designer",
    role: "Asistencia inteligente",
    desc: "LLM físicamente informado con grounding sobre el Symbolic IR. Detecta inconsistencias dimensionales, genera modelos desde lenguaje natural, sugiere optimizaciones de diseño.",
    tags: ["NEW", "L6"],
    contract: `assist(intent: NLPrompt, context: ProjectGraph) -> ProposedEdits`,
  },
  {
    id: "MOD-08",
    name: "Plugin Bus",
    role: "Extensibilidad",
    desc: "Carga dinámica de plugins sandboxed (WASM + nativo). Define contratos versionados; permite añadir dominios físicos (cuántico, relativista) sin tocar el kernel.",
    tags: ["NEW", "ALL"],
    contract: `register_plugin(manifest: PluginManifest) -> Handle`,
  },
  {
    id: "MOD-09",
    name: "HIL Bridge",
    role: "Hardware-in-the-loop",
    desc: "Conexión bidireccional con sensores, DAQs y bancos de prueba (EtherCAT, CAN-FD, OPC-UA). Latencia determinista < 100µs.",
    tags: ["NEW", "L0"],
    contract: `bind_io(channel: HwChannel, signal: ModelSignal)`,
  },
  {
    id: "MOD-10",
    name: "Telemetry & Replay",
    role: "Observabilidad",
    desc: "Captura estructurada de estado, métricas y eventos. Replay determinista, time-travel debugging físico y export a OpenTelemetry.",
    tags: ["NEW", "L0"],
    contract: `record(scope: Scope) -> Trace`,
  },
];

function Modules() {
  return (
    <div>
      <SectionHeader
        index="02 / CRITICAL MODULES"
        title="Diez módulos nuevos. Un único kernel."
        subtitle="Cada módulo expone una API estable, vive en su propia capa y puede sustituirse sin afectar al resto."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {MODULES.map((m) => (
          <Panel key={m.id} title={m.name} tag={m.id} accent="primary">
            <div className="flex flex-wrap gap-2 mb-3">
              {m.tags.map((t) => (
                <Tag key={t} tone={t === "NEW" ? "accent" : t === "UPGRADE" ? "warn" : "muted"}>
                  {t}
                </Tag>
              ))}
              <Tag tone="muted">{m.role}</Tag>
            </div>
            <p className="text-muted-foreground mb-4">{m.desc}</p>
            <Code>{m.contract}</Code>
          </Panel>
        ))}
      </div>

      <Panel title="Eliminados / refactorizados desde legacy" tag="§ 2.1">
        <ul>
          <Bullet><b>Monolithic solver loop</b> → reemplazado por scheduler basado en grafo de dependencias.</Bullet>
          <Bullet><b>Hardcoded domain coupling</b> → sustituido por Coupling Manager genérico.</Bullet>
          <Bullet><b>String-based config</b> → reemplazado por Symbolic IR tipado.</Bullet>
          <Bullet><b>Plugins por linkage estático</b> → ahora carga dinámica WASM/nativa.</Bullet>
        </ul>
      </Panel>
    </div>
  );
}
