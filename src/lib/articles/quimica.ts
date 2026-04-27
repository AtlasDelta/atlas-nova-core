import type { Article } from "@/lib/articles";

export const CHEMISTRY_ARTICLES: Article[] = [
  {
    slug: "estructura-atomica",
    title: "Estructura atómica",
    category: "quimica",
    level: "introductorio",
    readingMinutes: 14,
    summary:
      "Modelos atómicos, números cuánticos, configuración electrónica y tabla periódica.",
    sections: [
      {
        id: "modelos",
        title: "De Dalton a Bohr",
        keywords: ["átomo", "Dalton", "Thomson", "Rutherford", "Bohr"],
        body: `
- **Dalton (1808)**: el átomo es indivisible.
- **Thomson (1897)**: descubre el electrón; modelo de "pudín de pasas".
- **Rutherford (1911)**: núcleo denso y positivo, electrones orbitando.
- **Bohr (1913)**: órbitas con energía cuantizada $E_n = -13{,}6/n^2$ eV (hidrógeno).
`,
      },
      {
        id: "numeros-cuanticos",
        title: "Números cuánticos",
        keywords: ["números cuánticos", "n", "l", "m", "s", "orbital"],
        body: `
Cada electrón en un átomo se describe por cuatro números cuánticos:

| Símbolo | Nombre | Valores |
|---------|--------|---------|
| $n$ | principal | 1, 2, 3, … |
| $\\ell$ | azimutal | 0 a $n-1$ |
| $m_\\ell$ | magnético | $-\\ell$ a $+\\ell$ |
| $m_s$ | espín | $\\pm 1/2$ |

Subcapas: $\\ell = 0\\!:\\!s,\\;1\\!:\\!p,\\;2\\!:\\!d,\\;3\\!:\\!f$.
`,
      },
      {
        id: "configuracion",
        title: "Configuración electrónica",
        keywords: ["configuración", "Aufbau", "Hund", "Pauli"],
        body: `
Tres reglas:

1. **Aufbau**: se llenan los orbitales de menor energía primero.
2. **Pauli**: dos electrones en el mismo orbital deben tener espín opuesto.
3. **Hund**: en orbitales degenerados, se ocupan primero todos con espines paralelos.

Ejemplo: el hierro (Z = 26): $1s^2\\,2s^2\\,2p^6\\,3s^2\\,3p^6\\,4s^2\\,3d^6$.
`,
      },
      {
        id: "tabla-periodica",
        title: "Tabla periódica y tendencias",
        keywords: ["tabla periódica", "electronegatividad", "radio atómico", "energía ionización"],
        body: `
- **Radio atómico**: aumenta hacia abajo y a la izquierda.
- **Energía de ionización**: aumenta hacia arriba y a la derecha.
- **Electronegatividad**: máxima en el F (escala Pauling 3,98).

Estas tendencias se explican por la carga nuclear efectiva $Z_{eff}$.
`,
      },
    ],
  },
  {
    slug: "enlace-quimico",
    title: "Enlace químico y geometría molecular",
    category: "quimica",
    level: "intermedio",
    readingMinutes: 13,
    summary: "Iónico, covalente, metálico, hibridación y VSEPR.",
    sections: [
      {
        id: "tipos-enlace",
        title: "Tipos de enlace",
        keywords: ["iónico", "covalente", "metálico", "polar", "apolar"],
        body: `
Según la diferencia de electronegatividad $\\Delta\\chi$:

| $\\Delta\\chi$ | Tipo | Ejemplo |
|--------------|------|---------|
| $> 1{,}7$ | Iónico | NaCl |
| $0{,}4 - 1{,}7$ | Covalente polar | H₂O |
| $< 0{,}4$ | Covalente apolar | H₂ |
| 0 entre metales | Metálico | Cu, Fe |
`,
      },
      {
        id: "hibridacion",
        title: "Hibridación de orbitales",
        keywords: ["hibridación", "sp", "sp2", "sp3"],
        body: `
- $sp$: lineal (180°), ej. CO₂, BeCl₂.
- $sp^2$: trigonal plana (120°), ej. BF₃, eteno.
- $sp^3$: tetraédrica (109,5°), ej. CH₄, H₂O.
`,
      },
      {
        id: "vsepr",
        title: "Modelo VSEPR",
        keywords: ["VSEPR", "geometría molecular", "pares libres"],
        body: `
La geometría minimiza la repulsión entre pares de electrones (enlazantes y libres). Los pares libres ocupan más espacio que los enlazantes, alterando ángulos:

| Pares totales | Geometría | Ej. (sin pares libres) |
|---------------|-----------|------------------------|
| 2 | lineal | $\\mathrm{CO_2}$ |
| 3 | trigonal plana | $\\mathrm{BF_3}$ |
| 4 | tetraédrica | $\\mathrm{CH_4}$ |
| 5 | bipirámide trigonal | $\\mathrm{PCl_5}$ |
| 6 | octaédrica | $\\mathrm{SF_6}$ |
`,
      },
    ],
  },
  {
    slug: "reacciones-y-estequiometria",
    title: "Reacciones químicas y estequiometría",
    category: "quimica",
    level: "introductorio",
    readingMinutes: 12,
    summary: "Tipos de reacción, balance de ecuaciones, reactivo limitante y rendimiento.",
    sections: [
      {
        id: "tipos-reaccion",
        title: "Tipos de reacción",
        keywords: ["combustión", "redox", "ácido-base", "precipitación"],
        body: `
| Tipo | Ejemplo |
|------|---------|
| Síntesis | $2\\,H_2 + O_2 \\to 2\\,H_2O$ |
| Descomposición | $2\\,H_2O_2 \\to 2\\,H_2O + O_2$ |
| Sustitución simple | $Zn + 2\\,HCl \\to ZnCl_2 + H_2$ |
| Doble sustitución | $AgNO_3 + NaCl \\to AgCl + NaNO_3$ |
| Combustión | $CH_4 + 2\\,O_2 \\to CO_2 + 2\\,H_2O$ |
`,
      },
      {
        id: "mol-estequio",
        title: "El mol y los cálculos",
        keywords: ["mol", "Avogadro", "masa molar", "estequiometría"],
        body: `
$N_A = 6{,}022\\times 10^{23}$. Para una reacción $aA + bB \\to cC + dD$, el reactivo limitante es:

$$\\min\\!\\left(\\frac{n_A}{a}, \\frac{n_B}{b}\\right)$$

Rendimiento: $\\eta = m_{real}/m_{teórico}\\times 100\\%$.
`,
      },
    ],
  },
  {
    slug: "cinetica-quimica",
    title: "Cinética química",
    category: "quimica",
    level: "intermedio",
    readingMinutes: 14,
    summary: "Velocidad de reacción, orden, mecanismos y dependencia con la temperatura.",
    sections: [
      {
        id: "velocidad",
        title: "Definición de velocidad",
        keywords: ["velocidad", "ley de velocidad", "orden"],
        body: `
$$v = -\\frac{1}{a}\\frac{d[A]}{dt} = k[A]^\\alpha[B]^\\beta$$

Los exponentes $\\alpha,\\beta$ se determinan **experimentalmente**, no por estequiometría.
`,
      },
      {
        id: "primer-orden",
        title: "Cinética de primer orden",
        keywords: ["primer orden", "exponencial", "vida media"],
        body: `
Si $v = k[A]$, integrando: $[A] = [A]_0 e^{-kt}$. Vida media:

$$t_{1/2} = \\frac{\\ln 2}{k}$$

independiente de $[A]_0$.
`,
        widget: "chem-firstorder",
      },
      {
        id: "arrhenius",
        title: "Ecuación de Arrhenius",
        keywords: ["Arrhenius", "energía activación", "Ea", "T"],
        body: `
$$k = A\\,e^{-E_a/(RT)}$$

Una gráfica $\\ln k$ vs $1/T$ es lineal y la pendiente es $-E_a/R$.
`,
        widget: "chem-arrhenius",
      },
    ],
  },
  {
    slug: "equilibrio-quimico",
    title: "Equilibrio químico",
    category: "quimica",
    level: "intermedio",
    readingMinutes: 12,
    summary: "Constante K, principio de Le Chatelier, relación termodinámica.",
    sections: [
      {
        id: "constante",
        title: "Constante de equilibrio",
        keywords: ["equilibrio", "K", "Q"],
        body: `
Para $aA + bB \\rightleftharpoons cC + dD$:

$$K_c = \\frac{[C]^c[D]^d}{[A]^a[B]^b}$$

Si $Q < K$ avanza a productos; si $Q > K$ retrocede.
`,
      },
      {
        id: "le-chatelier",
        title: "Principio de Le Chatelier",
        keywords: ["Le Chatelier", "perturbación", "desplazamiento"],
        body: `
Una perturbación se contrarresta. Aumentar $[A]$ desplaza a productos; aumentar $T$ favorece la endotérmica; aumentar $p$ favorece el lado con menos moles gaseosos.
`,
      },
      {
        id: "termo-equilibrio",
        title: "Relación con la termodinámica",
        keywords: ["ΔG", "Van't Hoff"],
        body: `
$$\\Delta G^\\circ = -RT\\ln K$$

Van't Hoff describe cómo $K$ depende de $T$:

$$\\ln K = -\\frac{\\Delta H^\\circ}{RT} + \\frac{\\Delta S^\\circ}{R}$$
`,
        widget: "chem-equilibrium",
      },
    ],
  },
  {
    slug: "acido-base",
    title: "Equilibrio ácido-base",
    category: "quimica",
    level: "intermedio",
    readingMinutes: 13,
    summary: "pH, ácidos y bases débiles, buffers y titulaciones.",
    sections: [
      {
        id: "ph",
        title: "Definición de pH",
        keywords: ["pH", "pOH", "Brönsted", "Arrhenius"],
        body: `
$$pH = -\\log_{10}[H^+], \\qquad pH + pOH = 14 \\;(25°C)$$
`,
      },
      {
        id: "debiles",
        title: "Ácidos y bases débiles",
        keywords: ["pKa", "Ka", "ácido débil", "fórmula pH"],
        body: `
Para HA $\\rightleftharpoons$ H⁺ + A⁻:

$$K_a = \\frac{[H^+][A^-]}{[HA]}$$

Aproximación útil cuando la disociación es pequeña: $pH \\approx \\tfrac{1}{2}(pKa - \\log C)$.
`,
        widget: "chem-ph",
      },
      {
        id: "buffer",
        title: "Sistemas buffer",
        keywords: ["buffer", "Henderson-Hasselbalch", "tampón"],
        body: `
$$pH = pKa + \\log\\!\\left(\\frac{[A^-]}{[HA]}\\right)$$

Capacidad máxima cerca de $pH = pKa$.
`,
      },
      {
        id: "titulacion",
        title: "Curvas de titulación",
        keywords: ["titulación", "punto equivalencia", "indicador"],
        body: `
Para ácido fuerte–base fuerte, el punto de equivalencia tiene $pH = 7$. Para ácido débil–base fuerte, $pH > 7$.
`,
        widget: "chem-titration",
      },
    ],
  },
  {
    slug: "termodinamica-quimica",
    title: "Termodinámica química",
    category: "quimica",
    level: "avanzado",
    readingMinutes: 12,
    summary: "Entalpía, entropía, energía libre y espontaneidad.",
    sections: [
      {
        id: "entalpia",
        title: "Entalpía y termoquímica",
        keywords: ["entalpía", "ΔH", "Hess"],
        body: `
$\\Delta H_{rxn} = \\sum \\Delta H_f^\\circ(\\text{prod}) - \\sum \\Delta H_f^\\circ(\\text{reac})$. La **ley de Hess** permite sumar entalpías de pasos individuales.
`,
      },
      {
        id: "entropia",
        title: "Entropía y desorden",
        keywords: ["entropía", "S", "Boltzmann"],
        body: `
$$S = k_B \\ln \\Omega$$

con $\\Omega$ el número de microestados accesibles.
`,
      },
      {
        id: "energia-libre",
        title: "Energía libre de Gibbs",
        keywords: ["Gibbs", "ΔG", "espontaneidad"],
        body: `
$\\Delta G = \\Delta H - T\\Delta S$. La reacción es espontánea si $\\Delta G < 0$.
`,
      },
    ],
  },
  {
    slug: "redox-electroquimica",
    title: "Reacciones redox y electroquímica",
    category: "quimica",
    level: "avanzado",
    readingMinutes: 11,
    summary: "Estados de oxidación, balance de redox, celdas galvánicas y Nernst.",
    sections: [
      {
        id: "oxidacion",
        title: "Estados de oxidación",
        keywords: ["oxidación", "reducción", "número oxidación"],
        body: `
Reglas: en un compuesto neutro la suma de números de oxidación es 0. El O suele ser −2 (excepto peróxidos), el H es +1 con no metales y −1 con metales.
`,
      },
      {
        id: "celdas",
        title: "Celdas galvánicas",
        keywords: ["pila", "celda", "ánodo", "cátodo", "FEM"],
        body: `
Ánodo (−): oxidación. Cátodo (+): reducción. La FEM estándar:

$$E^\\circ_{cell} = E^\\circ_{cat} - E^\\circ_{an}$$
`,
      },
      {
        id: "nernst",
        title: "Ecuación de Nernst",
        keywords: ["Nernst", "potencial", "concentración"],
        body: `
$$E = E^\\circ - \\frac{RT}{nF}\\ln Q$$

A 25°C: $E = E^\\circ - (0{,}0592/n)\\log Q$.
`,
      },
    ],
  },
];
