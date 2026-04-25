import { createFileRoute } from "@tanstack/react-router";
import { SectionHeader, Panel, Tag } from "../components/ui-bits";

export const Route = createFileRoute("/roadmap")({
  head: () => ({
    meta: [
      { title: "Roadmap 10 años — AtlasDelta Revamped" },
      { name: "description", content: "Visión de evolución 2026 → 2036 en cinco fases." },
    ],
  }),
  component: Roadmap,
});

const PHASES = [
  {
    p: "Φ1",
    range: "2026 — 2027",
    name: "FOUNDATION",
    color: "primary",
    items: [
      "Symbolic IR estable (v2.0)",
      "Kernel ODE/PDE híbrido en producción",
      "Coupling Manager con FSI y conjugate heat",
      "Co-Designer alpha (modelos lineales)",
      "Migración 1.x → 2.0 al 100%",
    ],
  },
  {
    p: "Φ2",
    range: "2027 — 2029",
    name: "MULTI-PHYSICS",
    color: "primary",
    items: [
      "Cobertura completa: químico, EM, plasma fluido",
      "MOR adaptativa con operadores neuronales",
      "HIL Bridge certificado (EtherCAT, OPC-UA)",
      "Plugin marketplace con 100+ extensiones",
      "Co-Designer beta (modelos no lineales)",
    ],
  },
  {
    p: "Φ3",
    range: "2029 — 2031",
    name: "SCALE",
    color: "accent",
    items: [
      "Despliegue a 10k nodos demostrado",
      "Real-time en sistemas de 10⁶ DOF",
      "Cloud-native multi-tenant offering",
      "Certificación industrial (DO-178, ISO 26262 cuando aplique)",
      "Co-Designer GA con auto-optimización",
    ],
  },
  {
    p: "Φ4",
    range: "2031 — 2033",
    name: "FRONTIER DOMAINS",
    color: "accent",
    items: [
      "Plugin cuántico (qubits superconductores) GA",
      "Plugin relativista (MHD, geodésicas) beta",
      "Bio-celular completo (reacción-difusión + biomec)",
      "Acoplamiento físico ↔ basado en agentes",
      "Auto-discovery de leyes constitutivas vía ML",
    ],
  },
  {
    p: "Φ5",
    range: "2033 — 2036",
    name: "UNIVERSAL TWIN",
    color: "accent",
    items: [
      "Federación de gemelos digitales entre organizaciones",
      "Co-simulación trans-escala atomística → continua → sistemas",
      "Co-Designer autónomo (operación supervisada)",
      "Estándar de facto para ingeniería computacional",
      "Ecosistema sostenible: 1000+ contribuidores activos",
    ],
  },
] as const;

function Roadmap() {
  return (
    <div>
      <SectionHeader
        index="10 / TEN-YEAR ROADMAP"
        title="Cinco fases. Una década. Un único kernel."
        subtitle="Cada fase entrega valor independiente. Sin big-bang releases: evolución continua con ventanas LTS bianuales."
      />

      <div className="space-y-6">
        {PHASES.map((ph, i) => (
          <div key={ph.p} className="relative">
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 md:col-span-3">
                <div className="sticky top-20">
                  <div className={`text-5xl font-display font-bold ${ph.color === "primary" ? "text-primary" : "text-accent"}`}>{ph.p}</div>
                  <div className="text-xs text-muted-foreground mt-1 tracking-widest">{ph.range}</div>
                  <div className="font-display font-semibold mt-1">{ph.name}</div>
                </div>
              </div>
              <div className="col-span-12 md:col-span-9">
                <div className="border-l-2 border-border pl-6 space-y-3">
                  {ph.items.map((it) => (
                    <div key={it} className="relative flex gap-3 items-start">
                      <span className={`absolute -left-[27px] top-2 w-2 h-2 rounded-full bg-${ph.color}`} />
                      <span className="text-sm text-foreground">{it}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {i < PHASES.length - 1 && <div className="my-8 border-t border-border/50" />}
          </div>
        ))}
      </div>

      <Panel title="Visión 2036" tag="vision" accent="accent">
        <p className="text-base text-foreground leading-relaxed">
          AtlasDelta Revamped se convierte en el <span className="text-primary">substrato común</span> sobre
          el que se diseña, valida y opera cualquier sistema de ingeniería complejo:
          desde un microsatélite hasta un reactor de fusión, pasando por una red eléctrica
          inteligente o un órgano artificial.
        </p>
        <p className="text-base text-foreground leading-relaxed mt-3">
          Un único formalismo. Un único kernel. Infinitos dominios.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Tag tone="primary">DIGITAL TWIN UNIVERSAL</Tag>
          <Tag tone="accent">AI-NATIVE</Tag>
          <Tag tone="success">OPEN ECOSYSTEM</Tag>
          <Tag tone="muted">EXASCALE READY</Tag>
        </div>
      </Panel>
    </div>
  );
}
