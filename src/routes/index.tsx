import { createFileRoute, Link } from "@tanstack/react-router";
import { Panel, KeyVal, Tag, Bullet } from "../components/ui-bits";
import { ArrowRight, Cpu, Atom, Brain, Network, Layers, Zap } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AtlasDelta Revamped — Overview" },
      { name: "description", content: "Visión general de AtlasDelta Revamped: el sucesor universal de Simulink, OpenFOAM y Modelica con IA integrada." },
    ],
  }),
  component: Overview,
});

function Overview() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="relative border border-border bg-surface overflow-hidden corner-marks">
        <div className="absolute inset-0 bg-grid-fade pointer-events-none" style={{ background: "var(--gradient-conic)" }} />
        <div className="absolute inset-0 scanline pointer-events-none" />
        <div className="scan-line" />
        <div className="relative p-10 md:p-14">
          <div className="flex items-center gap-3 mb-6">
            <Tag tone="primary">RFC AD-2.0-001</Tag>
            <Tag tone="accent">SPEC COMPLETA</Tag>
            <Tag tone="muted">2026 → 2036</Tag>
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-semibold text-balance leading-[0.95]">
            AtlasDelta<br />
            <span className="text-primary">Revamped.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl text-balance">
            Un <span className="text-foreground">digital twin universal</span> para
            modelado físico-matemático avanzado, simulación multi-dominio y
            diseño asistido por IA. El sucesor conceptual de
            <span className="text-foreground"> Simulink + OpenFOAM + Modelica</span>,
            unificado en un único kernel extensible.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/architecture" className="group inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium hover:glow-primary transition-all">
              ▸ Explorar arquitectura
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/roadmap" className="inline-flex items-center gap-2 border border-border-strong px-5 py-2.5 text-sm hover:border-primary hover:text-primary transition-colors">
              Visión a 10 años
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-px bg-border border border-border">
            {[
              ["KERNEL", "Hybrid ODE/PDE"],
              ["DOMINIOS", "7 acoplados"],
              ["BACKENDS", "CPU·GPU·HPC"],
              ["IA", "Co-designer"],
            ].map(([k, v]) => (
              <div key={k} className="bg-surface p-4">
                <div className="text-[10px] text-muted-foreground tracking-widest">{k}</div>
                <div className="text-foreground font-display text-lg mt-1">{v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section>
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="text-2xl font-display font-semibold">Seis pilares fundamentales</h2>
          <span className="text-xs text-muted-foreground">§ 0.1</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { Icon: Atom, title: "Physics Core", desc: "Solver diferencial híbrido ODE/PDE, multi-escala (macro↔micro↔nano), estocástico integrado." },
            { Icon: Network, title: "Coupled Engine", desc: "Fluidos, térmica, estructural, química, EM y control en interacción tiempo-real." },
            { Icon: Brain, title: "AI Co-Designer", desc: "Asistente de modelado, detección de inconsistencias físicas, NL → modelo." },
            { Icon: Layers, title: "Engineering Abstraction", desc: "Bloques reutilizables tipo Modelica++ con ecuaciones declarativas." },
            { Icon: Zap, title: "HPC Native", desc: "Paralelización CPU/GPU/cluster, MOR adaptativa, ejecución real-time." },
            { Icon: Cpu, title: "Plugin Universe", desc: "Física custom, dominios futuros (cuántico, relativista), hardware-in-loop." },
          ].map(({ Icon, title, desc }) => (
            <Panel key={title}>
              <div className="flex gap-3">
                <Icon className="h-5 w-5 text-primary flex-none mt-0.5" />
                <div>
                  <div className="font-display font-medium text-base mb-1">{title}</div>
                  <p className="text-muted-foreground text-sm">{desc}</p>
                </div>
              </div>
            </Panel>
          ))}
        </div>
      </section>

      {/* What this spec covers */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Panel title="Qué cubre esta especificación" tag="§ 0.2">
            <ul>
              <Bullet>Arquitectura completa por capas con contratos de interfaz.</Bullet>
              <Bullet>Diferencias clave vs AtlasDelta legacy y plan de migración.</Bullet>
              <Bullet>Flujo end-to-end: parsing → compilación simbólica → solver → post-proceso.</Bullet>
              <Bullet>Componentes críticos nuevos: Symbolic IR, Coupling Manager, MOR Engine.</Bullet>
              <Bullet>Riesgos técnicos clasificados con mitigaciones explícitas.</Bullet>
              <Bullet>Roadmap de evolución 2026 → 2036 en 5 fases.</Bullet>
            </ul>
          </Panel>
        </div>
        <Panel title="Metadata" tag="REV 2.0">
          <div className="space-y-1">
            <KeyVal k="Versión" v="2.0.0-draft" />
            <KeyVal k="Status" v={<Tag tone="warn">DRAFT</Tag>} />
            <KeyVal k="Compat" v="AtlasDelta 1.x ✓" />
            <KeyVal k="Lenguajes" v="Rust · C++ · Py" />
            <KeyVal k="Licencia" v="Dual" />
            <KeyVal k="Target HW" v="x86 · ARM · CUDA · ROCm" />
          </div>
        </Panel>
      </section>
    </div>
  );
}
