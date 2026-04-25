import { createFileRoute } from "@tanstack/react-router";
import { SectionHeader, Panel, Tag, KeyVal, Bullet } from "../components/ui-bits";

export const Route = createFileRoute("/performance")({
  head: () => ({
    meta: [
      { title: "Performance & escalabilidad — AtlasDelta Revamped" },
      { name: "description", content: "Paralelización CPU/GPU/cluster, MOR adaptativa, real-time, benchmarks objetivos." },
    ],
  }),
  component: Performance,
});

function Performance() {
  return (
    <div>
      <SectionHeader
        index="05 / PERFORMANCE & SCALE"
        title="Diseñado para correr desde un laptop hasta un cluster de 10k nodos."
        subtitle="Paralelización nativa en cada capa, MOR adaptativa, ejecución real-time cuando el problema lo permite."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border border border-border mb-8">
        {[
          { tier: "DESKTOP", peak: "10⁶ DOF", lat: "interactivo", hw: "1×CPU + 1×GPU" },
          { tier: "WORKSTATION", peak: "10⁸ DOF", lat: "minutos", hw: "2×CPU + 4×GPU" },
          { tier: "HPC CLUSTER", peak: "10¹¹ DOF", lat: "horas", hw: "10k nodos MPI" },
        ].map((t) => (
          <div key={t.tier} className="bg-surface p-5">
            <div className="text-primary text-xs">{t.tier}</div>
            <div className="font-display text-2xl mt-1">{t.peak}</div>
            <div className="text-muted-foreground text-xs mt-2">latencia · {t.lat}</div>
            <div className="text-muted-foreground text-xs">hw · {t.hw}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Panel title="Paralelización por capa" tag="§ 5.1" accent="primary">
          <ul>
            <Bullet><b>Intra-kernel:</b> SIMD (AVX-512, NEON), GPU SIMT.</Bullet>
            <Bullet><b>Intra-dominio:</b> domain decomposition (METIS / ParMETIS).</Bullet>
            <Bullet><b>Inter-dominio:</b> pipeline + dataflow scheduling sobre Coupling Manager.</Bullet>
            <Bullet><b>Inter-nodo:</b> MPI no bloqueante + RDMA cuando esté disponible.</Bullet>
            <Bullet><b>Async I/O:</b> HDF5 paralelo + ADIOS2 para checkpoints sin bloqueo.</Bullet>
          </ul>
        </Panel>

        <Panel title="Reducción adaptativa (MOR)" tag="§ 5.2" accent="accent">
          <p className="text-muted-foreground mb-3">
            El sistema decide en runtime qué subsistemas reducir. Mantiene un estimador de error a posteriori;
            si la reducción es segura, sustituye el modelo full-order por su proyección.
          </p>
          <KeyVal k="Métodos" v="POD · RB · DEIM · DeepONet · FNO" />
          <KeyVal k="Speedup típico" v="10× – 1000×" />
          <KeyVal k="Error garantizado" v="ε &lt; 10⁻³" />
          <KeyVal k="Activación" v="auto / manual" />
        </Panel>
      </div>

      <Panel title="Targets de performance vs AtlasDelta legacy" tag="bench" accent="success">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted-foreground uppercase tracking-wider border-b border-border">
                <th className="py-2 pr-4">Caso</th>
                <th className="py-2 pr-4">Legacy</th>
                <th className="py-2 pr-4">Revamped</th>
                <th className="py-2">Ganancia</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {[
                ["CFD aleta cúbica 10⁷ celdas", "180 min", "12 min", "15×"],
                ["FSI ala AGARD 445.6", "no soportado", "45 min", "—"],
                ["Multi-físico reactor 10⁶ DOF", "8 h", "22 min", "22×"],
                ["MPC NL · 200 estados · 1 kHz", "no real-time", "real-time", "RT"],
                ["Optimización 50 vars · 200 evals", "12 h (Nelder-Mead)", "18 min (BO+grad)", "40×"],
              ].map((r) => (
                <tr key={r[0]}>
                  <td className="py-2.5 pr-4 text-foreground">{r[0]}</td>
                  <td className="py-2.5 pr-4 text-muted-foreground">{r[1]}</td>
                  <td className="py-2.5 pr-4 text-foreground">{r[2]}</td>
                  <td className="py-2.5"><Tag tone="success">{r[3]}</Tag></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title="Ejecución en tiempo real" tag="§ 5.3" accent="primary">
        <ul>
          <Bullet>Modo RT activable cuando el problema cabe en presupuesto temporal fijo.</Bullet>
          <Bullet>Scheduler con prioridades estilo EDF; jitter &lt; 50 µs en HIL.</Bullet>
          <Bullet>Garbage collector ausente en hot path (Rust + arenas).</Bullet>
          <Bullet>Soporte para sistemas operativos RT (Xenomai, RTLinux, FreeRTOS).</Bullet>
        </ul>
      </Panel>
    </div>
  );
}
