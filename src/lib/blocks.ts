// Catálogo de bloques físicos predefinidos
// Cada bloque define puertos tipados con dominio físico

export type PortDomain =
  | "fluid"        // gases / líquidos compresibles e incompresibles
  | "thermal"      // calor (T, q)
  | "mechanical"   // fuerzas, par, ω
  | "electrical"   // V, I
  | "chemical"     // especies, reacciones
  | "signal";      // señales abstractas (control)

export type PortDirection = "in" | "out" | "bidirectional";

export interface BlockPort {
  id: string;
  label: string;
  domain: PortDomain;
  direction: PortDirection;
}

export interface BlockParam {
  key: string;
  label: string;
  unit: string;
  default: number;
  min?: number;
  max?: number;
}

export interface BlockType {
  id: string;
  name: string;
  category: "fluid" | "thermal" | "mechanical" | "electrical" | "chemical" | "control" | "source" | "sink";
  description: string;
  icon: string;          // single ASCII char or short tag
  color: string;         // semantic token name
  ports: BlockPort[];
  params: BlockParam[];
  equations: string[];   // human-readable, for inspection
}

export const DOMAIN_COLOR: Record<PortDomain, string> = {
  fluid: "#7dd3fc",
  thermal: "#fb923c",
  mechanical: "#a3e635",
  electrical: "#facc15",
  chemical: "#c084fc",
  signal: "#94a3b8",
};

export const BLOCK_LIBRARY: BlockType[] = [
  // ─── FLUID ───
  {
    id: "compressor",
    name: "Compressor",
    category: "fluid",
    description: "Compresor adiabático con eficiencia isentrópica",
    icon: "⌬",
    color: "primary",
    ports: [
      { id: "in", label: "inlet", domain: "fluid", direction: "in" },
      { id: "out", label: "outlet", domain: "fluid", direction: "out" },
      { id: "shaft", label: "shaft", domain: "mechanical", direction: "in" },
    ],
    params: [
      { key: "pr", label: "Pressure ratio", unit: "—", default: 12, min: 1, max: 50 },
      { key: "eta", label: "Efficiency", unit: "—", default: 0.85, min: 0.1, max: 1 },
    ],
    equations: ["T₂/T₁ = 1 + (PR^((γ-1)/γ) - 1)/η", "ẇ = ṁ·cp·(T₂-T₁)"],
  },
  {
    id: "comb_chamber",
    name: "CombChamber",
    category: "fluid",
    description: "Cámara de combustión con liberación de calor",
    icon: "✺",
    color: "accent",
    ports: [
      { id: "in", label: "air", domain: "fluid", direction: "in" },
      { id: "fuel", label: "fuel", domain: "fluid", direction: "in" },
      { id: "out", label: "gas", domain: "fluid", direction: "out" },
    ],
    params: [
      { key: "lhv", label: "LHV fuel", unit: "MJ/kg", default: 42 },
      { key: "eta", label: "Combustion eff.", unit: "—", default: 0.98, min: 0.5, max: 1 },
    ],
    equations: ["q̇ = ṁ_fuel · LHV · η", "T₃ = T₂ + q̇/(ṁ·cp)"],
  },
  {
    id: "turbine",
    name: "Turbine",
    category: "fluid",
    description: "Turbina axial con eficiencia isentrópica",
    icon: "⊛",
    color: "primary",
    ports: [
      { id: "in", label: "gas", domain: "fluid", direction: "in" },
      { id: "out", label: "exhaust", domain: "fluid", direction: "out" },
      { id: "shaft", label: "shaft", domain: "mechanical", direction: "out" },
    ],
    params: [
      { key: "pr", label: "Expansion ratio", unit: "—", default: 0.1, min: 0.01, max: 1 },
      { key: "eta", label: "Efficiency", unit: "—", default: 0.92, min: 0.1, max: 1 },
    ],
    equations: ["T₄/T₃ = 1 - η·(1 - PR^((γ-1)/γ))", "ẇ = ṁ·cp·(T₃-T₄)"],
  },
  {
    id: "pipe",
    name: "Pipe",
    category: "fluid",
    description: "Tubería con pérdida de carga (Darcy-Weisbach)",
    icon: "═",
    color: "primary",
    ports: [
      { id: "in", label: "in", domain: "fluid", direction: "in" },
      { id: "out", label: "out", domain: "fluid", direction: "out" },
    ],
    params: [
      { key: "L", label: "Length", unit: "m", default: 10 },
      { key: "D", label: "Diameter", unit: "m", default: 0.05 },
      { key: "f", label: "Friction factor", unit: "—", default: 0.02 },
    ],
    equations: ["Δp = f·(L/D)·(ρv²/2)"],
  },

  // ─── THERMAL ───
  {
    id: "heat_exchanger",
    name: "HeatExchanger",
    category: "thermal",
    description: "Intercambiador de calor (NTU-effectiveness)",
    icon: "≋",
    color: "accent",
    ports: [
      { id: "h_in", label: "hot in", domain: "fluid", direction: "in" },
      { id: "h_out", label: "hot out", domain: "fluid", direction: "out" },
      { id: "c_in", label: "cold in", domain: "fluid", direction: "in" },
      { id: "c_out", label: "cold out", domain: "fluid", direction: "out" },
    ],
    params: [
      { key: "UA", label: "UA", unit: "W/K", default: 5000 },
      { key: "Cmin", label: "Cmin", unit: "W/K", default: 1000 },
    ],
    equations: ["q̇ = ε·Cmin·(T_h,in - T_c,in)"],
  },
  {
    id: "thermal_mass",
    name: "ThermalMass",
    category: "thermal",
    description: "Masa térmica concentrada (capacitor)",
    icon: "▪",
    color: "accent",
    ports: [
      { id: "q", label: "heat", domain: "thermal", direction: "bidirectional" },
    ],
    params: [
      { key: "m", label: "Mass", unit: "kg", default: 1 },
      { key: "cp", label: "Specific heat", unit: "J/(kg·K)", default: 900 },
      { key: "T0", label: "Initial T", unit: "K", default: 298 },
    ],
    equations: ["m·cp·dT/dt = q̇"],
  },
  {
    id: "convection",
    name: "Convection",
    category: "thermal",
    description: "Resistencia convectiva",
    icon: "↝",
    color: "accent",
    ports: [
      { id: "surf", label: "surface", domain: "thermal", direction: "bidirectional" },
      { id: "amb", label: "ambient", domain: "thermal", direction: "in" },
    ],
    params: [
      { key: "h", label: "h coefficient", unit: "W/(m²·K)", default: 10 },
      { key: "A", label: "Area", unit: "m²", default: 0.1 },
    ],
    equations: ["q̇ = h·A·(T_surf - T_amb)"],
  },

  // ─── MECHANICAL ───
  {
    id: "spring",
    name: "Spring",
    category: "mechanical",
    description: "Resorte lineal Hookeano",
    icon: "ϟ",
    color: "primary",
    ports: [
      { id: "a", label: "node A", domain: "mechanical", direction: "bidirectional" },
      { id: "b", label: "node B", domain: "mechanical", direction: "bidirectional" },
    ],
    params: [
      { key: "k", label: "Stiffness", unit: "N/m", default: 1000 },
      { key: "L0", label: "Free length", unit: "m", default: 0.1 },
    ],
    equations: ["F = k·(x - L₀)"],
  },
  {
    id: "damper",
    name: "Damper",
    category: "mechanical",
    description: "Amortiguador viscoso lineal",
    icon: "▤",
    color: "primary",
    ports: [
      { id: "a", label: "node A", domain: "mechanical", direction: "bidirectional" },
      { id: "b", label: "node B", domain: "mechanical", direction: "bidirectional" },
    ],
    params: [{ key: "c", label: "Damping", unit: "N·s/m", default: 50 }],
    equations: ["F = c·v"],
  },
  {
    id: "mass",
    name: "Mass",
    category: "mechanical",
    description: "Masa puntual con segunda ley de Newton",
    icon: "●",
    color: "primary",
    ports: [{ id: "p", label: "force", domain: "mechanical", direction: "bidirectional" }],
    params: [
      { key: "m", label: "Mass", unit: "kg", default: 1 },
      { key: "x0", label: "Initial pos", unit: "m", default: 0 },
      { key: "v0", label: "Initial vel", unit: "m/s", default: 0 },
    ],
    equations: ["m·ẍ = ΣF"],
  },

  // ─── ELECTRICAL ───
  {
    id: "resistor",
    name: "Resistor",
    category: "electrical",
    description: "Resistencia óhmica",
    icon: "⏚",
    color: "accent",
    ports: [
      { id: "p", label: "+", domain: "electrical", direction: "bidirectional" },
      { id: "n", label: "−", domain: "electrical", direction: "bidirectional" },
    ],
    params: [{ key: "R", label: "Resistance", unit: "Ω", default: 100 }],
    equations: ["V = I·R"],
  },
  {
    id: "capacitor",
    name: "Capacitor",
    category: "electrical",
    description: "Condensador ideal",
    icon: "⚇",
    color: "accent",
    ports: [
      { id: "p", label: "+", domain: "electrical", direction: "bidirectional" },
      { id: "n", label: "−", domain: "electrical", direction: "bidirectional" },
    ],
    params: [{ key: "C", label: "Capacitance", unit: "F", default: 1e-6 }],
    equations: ["I = C·dV/dt"],
  },

  // ─── SOURCES / SINKS ───
  {
    id: "src_flow",
    name: "FlowSource",
    category: "source",
    description: "Fuente de caudal másico fija",
    icon: "→",
    color: "success",
    ports: [{ id: "out", label: "out", domain: "fluid", direction: "out" }],
    params: [
      { key: "mdot", label: "Mass flow", unit: "kg/s", default: 1 },
      { key: "T", label: "Temperature", unit: "K", default: 288 },
      { key: "p", label: "Pressure", unit: "Pa", default: 101325 },
    ],
    equations: ["ṁ = const"],
  },
  {
    id: "src_heat",
    name: "HeatSource",
    category: "source",
    description: "Fuente de calor (potencia constante)",
    icon: "✦",
    color: "success",
    ports: [{ id: "out", label: "heat", domain: "thermal", direction: "out" }],
    params: [{ key: "Q", label: "Power", unit: "W", default: 100 }],
    equations: ["q̇ = Q"],
  },
  {
    id: "src_voltage",
    name: "VoltageSource",
    category: "source",
    description: "Fuente de tensión ideal",
    icon: "⊕",
    color: "success",
    ports: [
      { id: "p", label: "+", domain: "electrical", direction: "out" },
      { id: "n", label: "−", domain: "electrical", direction: "out" },
    ],
    params: [{ key: "V", label: "Voltage", unit: "V", default: 12 }],
    equations: ["V = const"],
  },
  {
    id: "ground",
    name: "Ground",
    category: "sink",
    description: "Referencia eléctrica (0 V)",
    icon: "⏚",
    color: "muted",
    ports: [{ id: "g", label: "gnd", domain: "electrical", direction: "in" }],
    params: [],
    equations: ["V = 0"],
  },
  {
    id: "ambient",
    name: "Ambient",
    category: "sink",
    description: "Sumidero térmico a temperatura fija",
    icon: "○",
    color: "muted",
    ports: [{ id: "amb", label: "ambient", domain: "thermal", direction: "in" }],
    params: [{ key: "T", label: "Temperature", unit: "K", default: 298 }],
    equations: ["T = const"],
  },

  // ─── CONTROL ───
  {
    id: "pid",
    name: "PID",
    category: "control",
    description: "Controlador PID continuo",
    icon: "Σ",
    color: "warn",
    ports: [
      { id: "ref", label: "ref", domain: "signal", direction: "in" },
      { id: "meas", label: "y", domain: "signal", direction: "in" },
      { id: "u", label: "u", domain: "signal", direction: "out" },
    ],
    params: [
      { key: "Kp", label: "Kp", unit: "—", default: 1 },
      { key: "Ki", label: "Ki", unit: "—", default: 0.1 },
      { key: "Kd", label: "Kd", unit: "—", default: 0 },
    ],
    equations: ["u = Kp·e + Ki·∫e dt + Kd·de/dt"],
  },
  {
    id: "step",
    name: "Step",
    category: "control",
    description: "Señal escalón unitario",
    icon: "⎍",
    color: "warn",
    ports: [{ id: "out", label: "y", domain: "signal", direction: "out" }],
    params: [
      { key: "t0", label: "Step time", unit: "s", default: 1 },
      { key: "amp", label: "Amplitude", unit: "—", default: 1 },
    ],
    equations: ["y = amp · u(t - t₀)"],
  },
];

export const CATEGORIES: { id: BlockType["category"]; label: string }[] = [
  { id: "source", label: "SOURCES" },
  { id: "fluid", label: "FLUID" },
  { id: "thermal", label: "THERMAL" },
  { id: "mechanical", label: "MECHANICAL" },
  { id: "electrical", label: "ELECTRICAL" },
  { id: "control", label: "CONTROL" },
  { id: "sink", label: "SINKS" },
];

export function getBlockType(id: string): BlockType | undefined {
  return BLOCK_LIBRARY.find((b) => b.id === id);
}
