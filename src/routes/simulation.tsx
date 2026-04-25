import { createFileRoute } from "@tanstack/react-router";
import { SectionHeader, Panel, Tag, Bullet, Code, KeyVal } from "../components/ui-bits";

export const Route = createFileRoute("/simulation")({
  head: () => ({
    meta: [
      { title: "Simulación end-to-end — AtlasDelta Revamped" },
      { name: "description", content: "Flujo completo de simulación: parsing, IR, compilación, solver acoplado, optimización, post-proceso." },
    ],
  }),
  component: Simulation,
});

const PIPELINE = [
  { step: "01", name: "Authoring", desc: "Usuario define modelo (graph editor, DSL Modelica++, NL via co-designer)." },
  { step: "02", name: "Parse → Symbolic IR", desc: "Generación del AST simbólico con análisis dimensional automático." },
  { step: "03", name: "Static Analysis", desc: "Verificación de consistencia, BCs, well-posedness, índice DAE." },
  { step: "04", name: "Compilation", desc: "Generación de kernels especializados (LLVM/PTX/SPIR-V) con AD inyectado." },
  { step: "05", name: "Mesh & Discretization", desc: "Discretización adaptativa (FEM/FVM/spectral) por dominio." },
  { step: "06", name: "Coupling Setup", desc: "Coupling Manager construye el grafo de interacción multi-dominio." },
  { step: "07", name: "Time Stepping", desc: "Scheduler ejecuta solver acoplado con control adaptativo de paso." },
  { step: "08", name: "MOR Decision", desc: "En runtime, decide reducir subsistemas si error estimado < tolerancia." },
  { step: "09", name: "Telemetry", desc: "Captura estructurada de estado, eventos físicos e invariantes violados." },
  { step: "10", name: "Post-process", desc: "Visualización, export (VTK, HDF5, USD), informes automáticos." },
];

function Simulation() {
  return (
    <div>
      <SectionHeader
        index="03 / SIMULATION FLOW"
        title="De la intención al resultado en 10 pasos."
        subtitle="Pipeline determinista, totalmente trazable, con puntos de extensión por plugin en cada etapa."
      />

      {/* Pipeline */}
      <div className="relative mb-12">
        <div className="absolute left-6 top-2 bottom-2 w-px bg-border md:hidden" />
        <div className="hidden md:grid grid-cols-5 gap-px bg-border border border-border">
          {PIPELINE.map((p) => (
            <div key={p.step} className="bg-surface p-4 hover:bg-surface-2 transition-colors group">
              <div className="text-primary text-xs font-mono">{p.step}</div>
              <div className="font-display font-medium mt-1 text-sm">{p.name}</div>
              <div className="text-xs text-muted-foreground mt-2 leading-relaxed">{p.desc}</div>
            </div>
          ))}
        </div>
        {/* Mobile */}
        <div className="md:hidden space-y-3">
          {PIPELINE.map((p) => (
            <div key={p.step} className="flex gap-4 pl-12 relative">
              <span className="absolute left-4 top-1 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-mono">{p.step}</span>
              <div>
                <div className="font-display font-medium">{p.name}</div>
                <div className="text-xs text-muted-foreground">{p.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Panel title="Dominios físicos soportados" tag="§ 3.1" accent="primary">
          <div className="grid grid-cols-2 gap-2">
            {[
              "CFD compresible",
              "CFD incompresible",
              "Trans. calor no lineal",
              "Mec. estructural NL",
              "Cinética química",
              "Electromagnetismo",
              "Plasma fluido",
              "Multifase",
              "Aeroelasticidad",
              "Propulsión",
              "Órbitas / GNC",
              "Reentrada",
              "Materiales avanzados",
              "Bio-mecánica",
              "Bio-reactores",
              "Acústica",
            ].map((d) => (
              <Tag key={d} tone="muted">{d}</Tag>
            ))}
          </div>
        </Panel>

        <Panel title="Solvers disponibles" tag="§ 3.2" accent="accent">
          <ul className="space-y-2 text-xs">
            <li><b className="text-foreground">ODE:</b> RK4/5, BDF, IMEX, exponential integrators</li>
            <li><b className="text-foreground">DAE:</b> IDA, GMRES con índice ≤ 3</li>
            <li><b className="text-foreground">PDE:</b> FEM, FVM, espectral, DG, IGA</li>
            <li><b className="text-foreground">SDE:</b> Euler-Maruyama, Milstein, MLMC</li>
            <li><b className="text-foreground">Linear:</b> AMG, ILU, GMRES, BiCGStab</li>
            <li><b className="text-foreground">Nonlinear:</b> Newton-Krylov, Anderson, trust-region</li>
          </ul>
        </Panel>

        <Panel title="Parámetros globales" tag="cfg">
          <KeyVal k="Time scheme" v="adaptive" />
          <KeyVal k="Tol. abs." v="1e-8" />
          <KeyVal k="Tol. rel." v="1e-6" />
          <KeyVal k="MOR threshold" v="ε < 1e-3" />
          <KeyVal k="Determinism" v={<Tag tone="success">ON</Tag>} />
          <KeyVal k="Replay" v={<Tag tone="success">ON</Tag>} />
        </Panel>
      </div>

      <Panel title="Ejemplo: simulación FSI de ala flexible" tag="example">
        <Code>{`# Modelica++ DSL
model FlexibleWing
  domain fluid: NavierStokes(compressible=true, mach=0.78)
  domain solid: HyperElastic(model=MooneyRivlin)

  coupling fsi: PartitionedFSI(
    interface = wing.surface,
    scheme    = AitkenRelaxation,
    tol       = 1e-5
  )

  scenario cruise:
    fluid.bc.inlet  = Velocity(250 m/s)
    fluid.bc.outlet = Pressure(20 kPa)
    solid.bc.root   = Fixed
    duration = 5.0 s

  optimize:
    minimize  drag(fluid)
    subject_to  max_stress(solid) < 200 MPa
    over rib_thickness ∈ [1mm, 8mm]
end`}</Code>
      </Panel>

      <Panel title="Garantías del pipeline" tag="§ 3.3">
        <ul>
          <Bullet><b>Conservación verificada:</b> masa, momento, energía monitorizados como invariantes.</Bullet>
          <Bullet><b>Reproducibilidad bit-exact</b> dado el mismo seed y configuración.</Bullet>
          <Bullet><b>Time-travel debugging</b> sobre cualquier paso registrado.</Bullet>
          <Bullet><b>Backpropagation</b> end-to-end vía Enzyme/AD para optimización con gradiente.</Bullet>
        </ul>
      </Panel>
    </div>
  );
}
