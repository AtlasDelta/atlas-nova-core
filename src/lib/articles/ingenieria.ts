import type { Article } from "@/lib/articles";

export const ENGINEERING_ARTICLES: Article[] = [
  {
    slug: "control-automatico",
    title: "Control automático",
    category: "ingenieria",
    level: "intermedio",
    readingMinutes: 16,
    summary: "Realimentación, función de transferencia, PID y estabilidad.",
    sections: [
      {
        id: "realimentacion",
        title: "Realimentación",
        keywords: ["lazo cerrado", "feedback", "error"],
        body: `
Un controlador compara la salida medida $y$ con la referencia $r$ y aplica una acción $u$ a la planta. La realimentación reduce sensibilidad a perturbaciones y al modelo.
`,
      },
      {
        id: "transferencia",
        title: "Función de transferencia",
        keywords: ["Laplace", "transferencia", "polo", "cero"],
        body: `
$G(s) = Y(s)/U(s)$ caracteriza un sistema lineal. Los **polos** determinan la estabilidad: si todos tienen parte real negativa, el sistema es estable.
`,
      },
      {
        id: "pid",
        title: "Controlador PID",
        keywords: ["PID", "proporcional", "integral", "derivativo"],
        body: `
$$u(t) = K_p e + K_i \\int e\\,dt + K_d \\frac{de}{dt}$$

- **P**: respuesta rápida pero deja error en régimen permanente.
- **I**: anula el error pero puede saturar.
- **D**: amortigua, pero amplifica ruido.
`,
        widget: "eng-pid",
      },
      {
        id: "ziegler",
        title: "Sintonía de Ziegler–Nichols",
        keywords: ["Ziegler", "Nichols", "sintonía", "ganancia crítica"],
        body: `
A partir de $K_u$ (ganancia crítica) y $T_u$ (periodo de oscilación):

| Tipo | $K_p$ | $K_i$ | $K_d$ |
|------|-------|-------|-------|
| P | $0{,}5K_u$ | — | — |
| PI | $0{,}45K_u$ | $1{,}2K_p/T_u$ | — |
| PID | $0{,}6K_u$ | $2K_p/T_u$ | $K_p T_u/8$ |
`,
      },
      {
        id: "bode",
        title: "Diagramas de Bode",
        keywords: ["Bode", "frecuencia", "filtro", "ancho de banda"],
        body: `
Trazan $|H(j\\omega)|$ en dB y la fase frente a $\\omega$. Útiles para diseñar filtros y evaluar márgenes de estabilidad.
`,
        widget: "eng-bode",
      },
    ],
  },
  {
    slug: "senales-y-sistemas",
    title: "Señales y sistemas",
    category: "ingenieria",
    level: "intermedio",
    readingMinutes: 12,
    summary: "Señales en tiempo continuo y discreto, convolución, muestreo.",
    sections: [
      {
        id: "lti",
        title: "Sistemas LTI y convolución",
        keywords: ["LTI", "lineal", "invariante", "convolución"],
        body: `
Un sistema lineal e invariante en el tiempo se caracteriza por su respuesta al impulso $h(t)$:

$$y(t) = (h * x)(t) = \\int h(\\tau) x(t - \\tau)\\,d\\tau$$
`,
      },
      {
        id: "muestreo",
        title: "Teorema de muestreo de Nyquist",
        keywords: ["muestreo", "Nyquist", "Shannon", "alias"],
        body: `
Para reconstruir una señal de banda limitada a $B$ hertz se requiere $f_s > 2B$. Por debajo aparece **aliasing**.
`,
      },
      {
        id: "ztransform",
        title: "Transformada Z",
        keywords: ["Z", "tiempo discreto", "función de transferencia"],
        body: `
$X(z) = \\sum_n x[n] z^{-n}$. Análoga a Laplace para sistemas discretos.
`,
      },
    ],
  },
  {
    slug: "mecanica-de-materiales",
    title: "Mecánica de materiales",
    category: "ingenieria",
    level: "intermedio",
    readingMinutes: 14,
    summary: "Tensión, deformación, vigas y criterios de fallo.",
    sections: [
      {
        id: "tension",
        title: "Tensión y deformación",
        keywords: ["tensión", "deformación", "Hooke", "Young"],
        body: `
$\\sigma = F/A$, $\\varepsilon = \\Delta L/L$. En régimen elástico: $\\sigma = E\\varepsilon$ con $E$ el módulo de Young.
`,
      },
      {
        id: "vigas",
        title: "Flexión de vigas",
        keywords: ["viga", "deflexión", "momento flector", "EI"],
        body: `
Para una viga simplemente apoyada con carga puntual $P$ en el centro:

$$\\delta_{max} = \\frac{PL^3}{48EI}$$
`,
        widget: "eng-beam",
      },
      {
        id: "fallo",
        title: "Criterios de fallo",
        keywords: ["Von Mises", "Tresca", "fluencia"],
        body: `
**Von Mises**: la fluencia ocurre cuando $\\sigma_{vm} = \\sigma_y$, con

$$\\sigma_{vm} = \\sqrt{\\tfrac{1}{2}[(\\sigma_1-\\sigma_2)^2 + (\\sigma_2-\\sigma_3)^2 + (\\sigma_3-\\sigma_1)^2]}$$
`,
      },
    ],
  },
  {
    slug: "transferencia-de-calor",
    title: "Transferencia de calor",
    category: "ingenieria",
    level: "intermedio",
    readingMinutes: 12,
    summary: "Conducción, convección, radiación e intercambiadores.",
    sections: [
      {
        id: "conduccion",
        title: "Conducción de Fourier",
        keywords: ["Fourier", "conducción", "k"],
        body: `
$\\dot q = -kA\\,dT/dx$. Resistencia térmica de pared: $R = L/(kA)$.
`,
        widget: "eng-heat",
      },
      {
        id: "conveccion",
        title: "Convección y números adimensionales",
        keywords: ["convección", "Nusselt", "Reynolds", "Prandtl"],
        body: `
$\\dot q = hA(T_s - T_\\infty)$. $h$ se obtiene de correlaciones que involucran $\\mathrm{Nu}$, $\\mathrm{Re}$ y $\\mathrm{Pr}$.
`,
      },
      {
        id: "radiacion",
        title: "Radiación térmica",
        keywords: ["radiación", "Stefan", "emisividad"],
        body: `
$\\dot q = \\varepsilon\\sigma A(T_s^4 - T_\\infty^4)$ con $\\sigma = 5{,}67\\times 10^{-8}\\,\\mathrm{W/(m^2 K^4)}$.
`,
      },
    ],
  },
  {
    slug: "termodinamica-aplicada",
    title: "Termodinámica aplicada",
    category: "ingenieria",
    level: "avanzado",
    readingMinutes: 13,
    summary: "Ciclos de potencia y refrigeración: Brayton, Rankine, Otto, Diesel.",
    sections: [
      {
        id: "rankine",
        title: "Ciclo de Rankine",
        keywords: ["Rankine", "vapor", "turbina", "caldera"],
        body: `
Cuatro etapas: bomba (1→2), caldera (2→3), turbina (3→4), condensador (4→1). La eficiencia mejora con mayor presión de caldera y menor presión de condensador, sobrecalentamiento y recalentamientos intermedios.
`,
        widget: "eng-rankine",
      },
      {
        id: "brayton",
        title: "Ciclo Brayton",
        keywords: ["Brayton", "turbina de gas", "compresor"],
        body: `
Compresión isentrópica → combustión isobárica → expansión isentrópica → enfriamiento isobárico. Eficiencia ideal:

$$\\eta = 1 - \\left(\\frac{1}{r_p}\\right)^{(\\gamma-1)/\\gamma}$$

donde $r_p$ es la relación de presiones.
`,
      },
      {
        id: "otto",
        title: "Ciclos Otto y Diesel",
        keywords: ["Otto", "Diesel", "motor combustión interna"],
        body: `
Otto (relación de compresión $r$): $\\eta = 1 - r^{1-\\gamma}$.

Diesel (relación de corte $r_c$): $\\eta = 1 - \\frac{1}{r^{\\gamma-1}}\\frac{r_c^\\gamma - 1}{\\gamma(r_c - 1)}$.
`,
      },
    ],
  },
  {
    slug: "investigacion-operativa",
    title: "Investigación operativa",
    category: "ingenieria",
    level: "intermedio",
    readingMinutes: 12,
    summary: "Programación lineal, colas y simulación.",
    sections: [
      {
        id: "lp",
        title: "Programación lineal",
        keywords: ["LP", "simplex", "optimización lineal"],
        body: `
$$\\min c^T x \\;\\text{s.t.}\\; Ax \\le b,\\; x \\ge 0$$

El método **simplex** recorre vértices del poliedro factible.
`,
      },
      {
        id: "colas",
        title: "Teoría de colas: M/M/1",
        keywords: ["cola", "Markov", "tasa", "ρ"],
        body: `
Llegadas Poisson($\\lambda$), servicio exponencial($\\mu$), un servidor. Utilización $\\rho = \\lambda/\\mu$. Longitud media en sistema:

$$L = \\frac{\\rho}{1 - \\rho}$$
`,
        widget: "eng-queue",
      },
      {
        id: "monte-carlo",
        title: "Simulación de Monte Carlo",
        keywords: ["Monte Carlo", "muestreo", "estimación"],
        body: `
Estima cantidades $\\theta = E[g(X)]$ mediante el promedio $\\hat\\theta_n = \\frac{1}{n}\\sum g(X_i)$ con $X_i$ iid. Error $O(1/\\sqrt n)$.
`,
      },
    ],
  },
  {
    slug: "circuitos-electricos",
    title: "Circuitos eléctricos",
    category: "ingenieria",
    level: "intermedio",
    readingMinutes: 12,
    summary: "Leyes de Kirchhoff, análisis de mallas y nodos, fasores.",
    sections: [
      {
        id: "kirchhoff",
        title: "Leyes de Kirchhoff",
        keywords: ["Kirchhoff", "nodos", "mallas"],
        body: `
- **KCL**: $\\sum I_{entrantes} = 0$ en cada nodo.
- **KVL**: $\\sum V = 0$ alrededor de cada malla.
`,
      },
      {
        id: "thevenin",
        title: "Equivalentes Thévenin y Norton",
        keywords: ["Thevenin", "Norton", "equivalente"],
        body: `
Cualquier red lineal vista desde dos terminales se reduce a una fuente de tensión $V_{th}$ en serie con $R_{th}$, o una fuente de corriente $I_N = V_{th}/R_{th}$ en paralelo con $R_{th}$.
`,
      },
      {
        id: "fasores",
        title: "Análisis fasorial en CA",
        keywords: ["fasor", "impedancia", "CA"],
        body: `
$V = V_m\\cos(\\omega t + \\varphi) \\to \\tilde V = V_m e^{j\\varphi}$. Impedancias: $Z_R = R$, $Z_L = j\\omega L$, $Z_C = 1/(j\\omega C)$.
`,
      },
    ],
  },
  {
    slug: "mecanica-de-fluidos-ing",
    title: "Mecánica de fluidos aplicada",
    category: "ingenieria",
    level: "avanzado",
    readingMinutes: 11,
    summary: "Pérdidas en tuberías, número de Reynolds, bombas.",
    sections: [
      {
        id: "reynolds",
        title: "Número de Reynolds y régimen",
        keywords: ["Reynolds", "laminar", "turbulento"],
        body: `
$\\mathrm{Re} = \\rho v D/\\mu$. Régimen: laminar si $\\mathrm{Re} < 2300$, turbulento si $\\mathrm{Re} > 4000$.
`,
      },
      {
        id: "darcy",
        title: "Pérdidas de carga (Darcy–Weisbach)",
        keywords: ["Darcy", "Weisbach", "factor fricción"],
        body: `
$$h_f = f\\,\\frac{L}{D}\\,\\frac{v^2}{2g}$$

$f$ se obtiene del **diagrama de Moody** o de correlaciones (Colebrook).
`,
      },
      {
        id: "bombas",
        title: "Bombas centrífugas",
        keywords: ["bomba", "altura manométrica", "potencia hidráulica"],
        body: `
Potencia hidráulica: $P_h = \\rho g Q H$. Eficiencia $\\eta = P_h/P_{eje}$. El punto de operación es la intersección entre la curva de la bomba y la del sistema.
`,
      },
    ],
  },
];
