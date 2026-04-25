import { createFileRoute } from "@tanstack/react-router";
import { SectionHeader, Panel, Tag, Code, Bullet, KeyVal } from "../components/ui-bits";

export const Route = createFileRoute("/architecture")({
  head: () => ({
    meta: [
      { title: "Arquitectura — AtlasDelta Revamped" },
      { name: "description", content: "Arquitectura completa por capas: kernel físico-matemático, engine de sistemas acoplados, capa de optimización y abstracción de ingeniería." },
    ],
  }),
  component: Architecture,
});

const LAYERS = [
  { id: "L7", name: "Interface Layer", color: "primary", items: ["Graph Editor", "Equation IDE", "Real-time Dashboards", "Physical Debugger"] },
  { id: "L6", name: "AI Co-Designer", color: "accent", items: ["NL → Model", "Inconsistency Detector", "Design Optimizer", "Modeling Assistant"] },
  { id: "L5", name: "Engineering Abstraction", color: "primary", items: ["Physical Blocks", "Modelica++ DSL", "Component Library", "Port Algebra"] },
  { id: "L4", name: "Optimization Layer", color: "accent", items: ["Multi-objective", "MPC", "Evolutionary", "Gradient-hybrid", "Bayesian"] },
  { id: "L3", name: "Coupled Engine", color: "primary", items: ["Domain Coupler", "CFD", "FEM", "Chemistry", "EM", "Multi-physics"] },
  { id: "L2", name: "Physics Core (Kernel)", color: "primary", items: ["Hybrid ODE/PDE Solver", "Multi-scale", "Stochastic SDE", "Symbolic IR"] },
  { id: "L1", name: "Numerics & Linear Algebra", color: "muted", items: ["Sparse LA", "AD (Enzyme)", "Mesh", "Quadrature"] },
  { id: "L0", name: "Runtime & HPC", color: "muted", items: ["Scheduler", "MPI", "CUDA/ROCm", "Distributed Mem", "Telemetry"] },
] as const;

function Architecture() {
  return (
    <div>
      <SectionHeader
        index="01 / SYSTEM ARCHITECTURE"
        title="Una pila de 8 capas, sin acoplamientos rígidos."
        subtitle="Cada capa expone un contrato estable y se comunica por buses tipados. Toda funcionalidad mutable vive como plugin."
      />

      {/* Stack visual */}
      <div className="space-y-px bg-border border border-border mb-12">
        {LAYERS.map((l) => (
          <div
            key={l.id}
            className="bg-surface grid grid-cols-12 items-center hover:bg-surface-2 transition-colors"
          >
            <div className="col-span-2 md:col-span-1 px-4 py-4 border-r border-border text-center">
              <div className="text-primary font-mono font-bold">{l.id}</div>
            </div>
            <div className="col-span-10 md:col-span-3 px-4 py-4 border-r border-border">
              <div className="font-display font-medium">{l.name}</div>
            </div>
            <div className="col-span-12 md:col-span-8 px-4 py-4 flex flex-wrap gap-2">
              {l.items.map((i) => (
                <Tag key={i} tone={l.color as "primary" | "accent" | "muted"}>
                  {i}
                </Tag>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Panel title="Principios arquitectónicos" tag="§ 1.1" accent="primary">
          <ul>
            <Bullet><b>Núcleo cerrado, periferia abierta.</b> El kernel L1–L2 es estable y minimal; todo lo demás es plugin.</Bullet>
            <Bullet><b>Symbolic-first.</b> Toda física se compila a un IR simbólico antes de generar código numérico.</Bullet>
            <Bullet><b>Buses tipados.</b> Comunicación entre capas vía mensajes con contrato estático verificado en compile-time.</Bullet>
            <Bullet><b>Determinismo opcional.</b> Cualquier simulación puede reproducirse bit-exact dado el mismo seed.</Bullet>
            <Bullet><b>Observabilidad nativa.</b> Telemetría estructurada en cada nivel; nada de printf-debug.</Bullet>
          </ul>
        </Panel>

        <Panel title="Contratos de interfaz" tag="API" accent="accent">
          <Code>{`// L2 → L3: Solver request contract
trait CoupledSolver {
  fn step(&mut self,
    state: &mut StateBundle,
    dt: TimeStep,
    coupling: &CouplingGraph,
  ) -> Result<StepReport, PhysicsError>;
  fn invariants(&self) -> &[Invariant];
}

// L5 → L2: Symbolic IR
enum Equation {
  Ode { lhs: Symbol, rhs: Expr },
  Pde { lhs: Symbol, rhs: Expr,
        domain: Mesh, bcs: Vec<BC> },
  Algebraic(Expr),
  Stochastic { drift: Expr, diff: Expr },
}`}</Code>
        </Panel>
      </div>

      <Panel title="Topología de despliegue" tag="§ 1.2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-xs text-primary mb-2">EDGE / DESKTOP</div>
            <KeyVal k="Modo" v="Single-node" />
            <KeyVal k="Backend" v="CPU + opt. GPU" />
            <KeyVal k="Uso" v="Diseño interactivo" />
          </div>
          <div>
            <div className="text-xs text-primary mb-2">CLUSTER / HPC</div>
            <KeyVal k="Modo" v="MPI + GPU" />
            <KeyVal k="Backend" v="CUDA · ROCm · SYCL" />
            <KeyVal k="Uso" v="Producción" />
          </div>
          <div>
            <div className="text-xs text-primary mb-2">REAL-TIME / HIL</div>
            <KeyVal k="Modo" v="Bare-metal RT" />
            <KeyVal k="Backend" v="Xenomai / RTOS" />
            <KeyVal k="Uso" v="Hardware-in-loop" />
          </div>
        </div>
      </Panel>
    </div>
  );
}
