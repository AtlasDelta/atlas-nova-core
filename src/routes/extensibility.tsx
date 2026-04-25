import { createFileRoute } from "@tanstack/react-router";
import { SectionHeader, Panel, Tag, Bullet, Code } from "../components/ui-bits";

export const Route = createFileRoute("/extensibility")({
  head: () => ({
    meta: [
      { title: "Extensibilidad — AtlasDelta Revamped" },
      { name: "description", content: "Plugins de física custom, dominios futuros (cuántico, relativista), HIL, export a otros frameworks." },
    ],
  }),
  component: Extensibility,
});

function Extensibility() {
  return (
    <div>
      <SectionHeader
        index="07 / EXTENSIBILITY"
        title="Todo es plugin. Incluso la física."
        subtitle="El kernel solo conoce el Symbolic IR y el solver loop. Cualquier dominio físico, hardware o exportador se añade sin recompilar el núcleo."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Panel title="Tipos de plugin soportados" tag="§ 7.1" accent="primary">
          <ul>
            <Bullet><b>Physics Plugin:</b> añade dominios (cuántico, relativista, granular, biológico).</Bullet>
            <Bullet><b>Solver Plugin:</b> registra esquemas numéricos custom.</Bullet>
            <Bullet><b>Block Plugin:</b> librerías de componentes verticales (industria aeroespacial, biotech).</Bullet>
            <Bullet><b>I/O Plugin:</b> exporta a Simulink, Modelica, OpenFOAM, Ansys, USD, glTF.</Bullet>
            <Bullet><b>HW Plugin:</b> drivers para DAQs, EtherCAT, CAN-FD, OPC-UA, ROS2.</Bullet>
            <Bullet><b>UI Plugin:</b> paneles personalizados en la IDE (e.g. visualizador de tensores).</Bullet>
          </ul>
        </Panel>

        <Panel title="Aislamiento y seguridad" tag="§ 7.2" accent="warn">
          <ul>
            <Bullet>Plugins WASM corren sandboxed con capabilities explícitas.</Bullet>
            <Bullet>Plugins nativos requieren firma + manifest auditado.</Bullet>
            <Bullet>Quotas de CPU/RAM/IO por plugin.</Bullet>
            <Bullet>Versionado semántico estricto del contrato.</Bullet>
            <Bullet>Marketplace con revisión comunitaria + ranking de uso.</Bullet>
          </ul>
        </Panel>
      </div>

      <Panel title="Manifest de un plugin de física" tag="example">
        <Code>{`# atlasdelta-plugin.toml
[plugin]
id        = "ad.physics.granular"
name      = "Granular Mechanics"
version   = "0.3.1"
abi       = "ad-2.0"
runtime   = "wasm"        # o "native"

[capabilities]
register_domain = ["granular"]
register_solver = ["dem", "mpm"]
declare_units   = ["packing_fraction"]

[contracts]
ir_version  = "^2.0"
coupling    = "supported"
ad          = "forward+reverse"

[resources]
max_memory  = "8 GiB"
max_threads = 32`}</Code>
      </Panel>

      <Panel title="Dominios futuros pre-pensados" tag="§ 7.3" accent="accent">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm font-display font-medium mb-2">Cuántico</div>
            <p className="text-muted-foreground text-xs">
              Schrödinger / Lindblad sobre el mismo IR; acoplable a térmica clásica para
              simulación de qubits superconductores en su entorno.
            </p>
          </div>
          <div>
            <div className="text-sm font-display font-medium mb-2">Relativista</div>
            <p className="text-muted-foreground text-xs">
              MHD relativista y geodésicas en métricas no triviales para astrofísica computacional.
            </p>
          </div>
          <div>
            <div className="text-sm font-display font-medium mb-2">Bio-celular</div>
            <p className="text-muted-foreground text-xs">
              Sistemas de reacción-difusión en geometrías celulares; acoplamiento con biomecánica de tejidos.
            </p>
          </div>
          <div>
            <div className="text-sm font-display font-medium mb-2">Sistemas socio-técnicos</div>
            <p className="text-muted-foreground text-xs">
              Modelos basados en agentes integrados con simulación física (smart grids, mobility).
            </p>
          </div>
        </div>
      </Panel>

      <Panel title="Interoperabilidad bidireccional" tag="§ 7.4">
        <div className="flex flex-wrap gap-2">
          {["FMI 3.0", "Modelica", "Simulink (.slx)", "OpenFOAM dict", "Ansys CDB", "USD", "VTK/HDF5", "ROS2", "ONNX"].map(f => (
            <Tag key={f} tone="muted">{f}</Tag>
          ))}
        </div>
        <p className="text-muted-foreground text-xs mt-3">
          Importar y exportar sin pérdida semántica significativa cuando el formato lo permita;
          aviso explícito de degradación cuando no.
        </p>
      </Panel>
    </div>
  );
}
