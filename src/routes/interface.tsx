import { createFileRoute } from "@tanstack/react-router";
import { SectionHeader, Panel, Tag, Bullet } from "../components/ui-bits";

export const Route = createFileRoute("/interface")({
  head: () => ({
    meta: [
      { title: "Interfaz conceptual — AtlasDelta Revamped" },
      { name: "description", content: "Visualización de sistemas como grafos físicos, edición nodos+ecuaciones, debugging físico." },
    ],
  }),
  component: Interface,
});

function Interface() {
  return (
    <div>
      <SectionHeader
        index="06 / USER INTERFACE"
        title="Una IDE para ingeniería, no para programación."
        subtitle="El usuario manipula sistemas físicos. La sintaxis está al servicio de la intuición física, no al revés."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Panel title="Vistas principales" tag="§ 6.1" accent="primary">
          <ul>
            <Bullet><b>Graph Editor:</b> nodos = bloques físicos · aristas = puertos algebraicos.</Bullet>
            <Bullet><b>Equation View:</b> ecuaciones LaTeX vivas, editables, con análisis dimensional inline.</Bullet>
            <Bullet><b>Field View:</b> campos PDE en 2D/3D con color-mapping, isosurfaces, streamlines.</Bullet>
            <Bullet><b>Time Plot:</b> series temporales con anotaciones de eventos físicos.</Bullet>
            <Bullet><b>Pareto Explorer:</b> exploración interactiva de frente de Pareto en optimización multi-objetivo.</Bullet>
            <Bullet><b>HIL Console:</b> dashboard real-time para ejecuciones con hardware.</Bullet>
          </ul>
        </Panel>

        <Panel title="Debugging físico (no computacional)" tag="§ 6.2" accent="accent">
          <p className="text-muted-foreground mb-3">
            La diferencia clave con un debugger tradicional: AtlasDelta no muestra trazas de código,
            sino <b className="text-foreground">trazas físicas</b>.
          </p>
          <ul>
            <Bullet>Inspect any time-step y ver el estado completo del sistema físico.</Bullet>
            <Bullet>Watch invariants: masa, energía, momento, entropía con alertas si se violan.</Bullet>
            <Bullet>Causal chains: "¿qué llevó a esta presión?" → cadena de dependencias físicas.</Bullet>
            <Bullet>What-if: modificar un parámetro y re-simular desde un punto.</Bullet>
            <Bullet>Time-travel: rebobinar y avanzar en simulaciones registradas.</Bullet>
          </ul>
        </Panel>
      </div>

      <Panel title="Mockup conceptual del Graph Editor" tag="§ 6.3">
        <div className="bg-background border border-border p-4 font-mono text-xs leading-relaxed overflow-x-auto">
<pre className="text-muted-foreground">{`  ┌──────────────┐         ┌──────────────┐         ┌──────────────┐
  │  Compressor  │ ──air─▶ │  CombChamber │ ──gas─▶ │   Turbine    │
  │  η=0.85      │         │  ΔH=42 MJ/kg │         │  η=0.92      │
  └──────┬───────┘         └──────┬───────┘         └──────┬───────┘
         │                        │                        │
         │ shaft (ω, τ)           │ thermal (T, q)         │ shaft
         ▼                        ▼                        ▼
  ┌──────────────────────────────────────────────────────────────┐
  │                  Coupling Manager · monolithic               │
  └──────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │   Hybrid ODE/PDE Solver│  ◀── MOR active (POD, ε=4e-4)
                    └────────────────────────┘`}</pre>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Tag tone="success">conserva energía</Tag>
          <Tag tone="success">conserva masa</Tag>
          <Tag tone="warn">δ entropía local</Tag>
          <Tag tone="primary">RT capable</Tag>
        </div>
      </Panel>

      <Panel title="Principios de UX" tag="§ 6.4">
        <ul>
          <Bullet><b>Cero modal blocking.</b> Toda operación es asíncrona; el usuario nunca espera.</Bullet>
          <Bullet><b>Direct manipulation.</b> Arrastrar un parámetro → ver el efecto en preview MOR inmediato.</Bullet>
          <Bullet><b>Multi-representación.</b> Cada modelo se ve como grafo, ecuaciones y código simultáneamente.</Bullet>
          <Bullet><b>Keyboard-first.</b> Toda acción accesible vía command palette estilo VSCode.</Bullet>
          <Bullet><b>Colaboración nativa.</b> Multi-usuario en tiempo real con CRDT sobre el IR.</Bullet>
        </ul>
      </Panel>
    </div>
  );
}
