import type { Article } from "@/lib/articles";

export const PHYSICS_ARTICLES: Article[] = [
  // ─────────────────────────── 1
  {
    slug: "mecanica-clasica",
    title: "Mecánica clásica",
    category: "fisica",
    level: "introductorio",
    readingMinutes: 22,
    summary:
      "Cinemática, leyes de Newton, fuerzas, fricción, trabajo, energía y momento. La columna vertebral de la física no relativista.",
    sections: [
      {
        id: "cinematica",
        title: "Cinemática: posición, velocidad y aceleración",
        keywords: ["cinemática", "MRU", "MRUA", "velocidad", "aceleración", "posición"],
        body: `
La **cinemática** describe el movimiento sin preocuparse por sus causas. La posición $x(t)$ define una trayectoria; la **velocidad** es su derivada y la **aceleración** la derivada de la velocidad:

$$v(t) = \\frac{dx}{dt}, \\qquad a(t) = \\frac{dv}{dt} = \\frac{d^2 x}{dt^2}$$

Para aceleración constante $a_0$, integrando dos veces:

$$v(t) = v_0 + a_0\\,t, \\qquad x(t) = x_0 + v_0\\,t + \\tfrac{1}{2}\\,a_0\\,t^2$$

| Movimiento | Condición | Ejemplo |
|------------|-----------|---------|
| Uniforme (MRU) | $a = 0$ | Auto en autopista a velocidad constante |
| Uniformemente acelerado (MRUA) | $a$ constante | Caída libre en vacío |
| Variado | $a(t)$ no constante | Cohete con masa variable |
`,
      },
      {
        id: "tiro-parabolico",
        title: "Tiro parabólico",
        keywords: ["tiro parabólico", "proyectil", "alcance", "altura máxima"],
        body: `
Un proyectil lanzado con velocidad inicial $v_0$ y ángulo $\\theta$ describe una parábola. Las componentes son:

$$x(t) = v_0\\cos\\theta\\,t, \\qquad y(t) = v_0\\sin\\theta\\,t - \\tfrac{1}{2}g\\,t^2$$

El **alcance** (terreno horizontal) y la **altura máxima**:

$$R = \\frac{v_0^2 \\sin(2\\theta)}{g}, \\qquad H = \\frac{v_0^2 \\sin^2\\theta}{2g}$$

El alcance es máximo en $\\theta = 45°$.
`,
        widget: "phys-projectile",
      },
      {
        id: "leyes-newton",
        title: "Las tres leyes de Newton",
        keywords: ["Newton", "inercia", "F=ma", "acción reacción"],
        body: `
**Primera ley (inercia):** un cuerpo libre permanece en reposo o MRU.

$$\\sum \\vec{F} = 0 \\;\\Longleftrightarrow\\; \\vec{v} = \\text{cte}$$

**Segunda ley (dinámica):** la fuerza neta es la tasa de cambio del momento.

$$\\vec{F}_{\\text{neta}} = \\frac{d\\vec{p}}{dt} = m\\,\\vec{a} \\quad \\text{(masa constante)}$$

**Tercera ley (acción-reacción):** $\\vec{F}_{A\\to B} = -\\vec{F}_{B\\to A}$.

> Las dos fuerzas del par acción-reacción nunca actúan sobre el mismo cuerpo: por eso no se cancelan en un diagrama de fuerzas individual.
`,
      },
      {
        id: "fuerza-friccion",
        title: "Fuerza de fricción",
        keywords: ["fricción", "rozamiento", "estática", "cinética", "coeficiente", "μ"],
        body: `
Cuando dos superficies en contacto deslizan o tienden a deslizar, aparece una fuerza tangencial **opuesta al movimiento (o a la tendencia)**:

$$f_s \\le \\mu_s\\,N \\qquad\\text{(estática, antes de deslizar)}$$
$$f_k = \\mu_k\\,N \\qquad\\text{(cinética, durante el deslizamiento)}$$

donde $N$ es la fuerza normal y $\\mu_s > \\mu_k$ típicamente. **No depende del área aparente de contacto** (modelo de Coulomb).

En un plano inclinado de ángulo $\\theta$, el bloque comienza a deslizar cuando:

$$\\tan\\theta > \\mu_s$$

y, una vez en movimiento, su aceleración es:

$$a = g(\\sin\\theta - \\mu_k\\cos\\theta)$$
`,
        widget: "phys-friction",
      },
      {
        id: "trabajo-energia",
        title: "Trabajo y energía cinética",
        keywords: ["trabajo", "energía cinética", "teorema trabajo-energía", "potencia"],
        body: `
El **trabajo** de una fuerza $\\vec{F}$ sobre un desplazamiento $\\vec{d}$:

$$W = \\int_C \\vec{F} \\cdot d\\vec{r}$$

El **teorema del trabajo y la energía** establece:

$$W_{\\text{neto}} = \\Delta E_c = \\tfrac{1}{2} m v_f^2 - \\tfrac{1}{2} m v_i^2$$

La **potencia** instantánea: $P = \\vec{F} \\cdot \\vec{v}$, en watts (1 W = 1 J/s).
`,
      },
      {
        id: "energia-mecanica",
        title: "Energía potencial y conservación",
        keywords: ["energía potencial", "conservación", "energía mecánica"],
        body: `
Para fuerzas **conservativas** existe una función $U(\\vec{r})$ tal que $\\vec{F} = -\\nabla U$.

- **Gravitatoria** (cerca de la Tierra): $U = mgh$.
- **Elástica** (Hooke): $U = \\tfrac{1}{2} k x^2$.

Si solo actúan fuerzas conservativas, la energía mecánica se conserva:

$$E = E_c + U = \\text{cte}$$

Las fuerzas no conservativas (fricción) la disipan en forma de calor.
`,
      },
      {
        id: "momento-lineal",
        title: "Momento lineal y colisiones",
        keywords: ["momento lineal", "impulso", "colisión elástica", "inelástica"],
        body: `
Momento lineal $\\vec{p} = m\\vec{v}$. **Impulso**: $\\vec{J} = \\int \\vec{F}\\,dt = \\Delta \\vec{p}$.

En un sistema **aislado**, $\\sum \\vec{p}$ se conserva. En una colisión:

| Tipo | Conservación de $E_c$ | Ejemplo |
|------|------------------------|---------|
| Elástica | Sí | Bolas de billar idealizadas |
| Inelástica | No | Choque de plastilinas |
| Perfectamente inelástica | No (los cuerpos quedan unidos) | Carro acoplándose a un tren |
`,
      },
    ],
  },

  // ─────────────────────────── 2
  {
    slug: "oscilaciones-y-ondas",
    title: "Oscilaciones y ondas",
    category: "fisica",
    level: "intermedio",
    readingMinutes: 18,
    summary:
      "Oscilador armónico, péndulos, ondas mecánicas, superposición, efecto Doppler.",
    sections: [
      {
        id: "oscilador-armonico",
        title: "Oscilador armónico simple",
        keywords: ["oscilador", "armónico", "MAS", "frecuencia natural"],
        body: `
Un sistema gobernado por $F = -kx$ obedece:

$$m\\ddot{x} + kx = 0 \\;\\Longrightarrow\\; x(t) = A\\cos(\\omega_n t + \\varphi)$$

con frecuencia natural $\\omega_n = \\sqrt{k/m}$ y periodo $T = 2\\pi/\\omega_n$.
`,
      },
      {
        id: "amortiguamiento",
        title: "Oscilador amortiguado",
        keywords: ["amortiguamiento", "subamortiguado", "crítico", "sobreamortiguado", "ζ"],
        body: `
Añadiendo fricción viscosa $-c\\dot x$:

$$m\\ddot x + c\\dot x + k x = 0$$

Definimos $\\zeta = c/(2\\sqrt{km})$. Tres regímenes:

| Régimen | Condición | Comportamiento |
|---------|-----------|----------------|
| Subamortiguado | $\\zeta < 1$ | Oscila con envolvente exponencial |
| Crítico | $\\zeta = 1$ | Vuelve al reposo lo más rápido posible sin oscilar |
| Sobreamortiguado | $\\zeta > 1$ | Vuelve al reposo lentamente, sin oscilar |
`,
        widget: "phys-spring",
      },
      {
        id: "pendulo",
        title: "Péndulo simple",
        keywords: ["péndulo", "pequeñas oscilaciones", "isocronismo"],
        body: `
Para un péndulo de longitud $L$ y ángulos pequeños:

$$\\ddot\\theta + \\frac{g}{L}\\theta = 0, \\qquad T = 2\\pi\\sqrt{L/g}$$

El periodo no depende de la amplitud (ley de **isocronismo**), siempre que $\\theta_0 \\lesssim 15°$. Para amplitudes mayores hay correcciones (serie de potencias en $\\sin^2(\\theta_0/2)$).
`,
        widget: "phys-pendulum",
      },
      {
        id: "ondas-armonicas",
        title: "Ondas armónicas y ecuación de onda",
        keywords: ["onda", "longitud de onda", "frecuencia", "número de onda"],
        body: `
Una onda armónica unidimensional:

$$y(x, t) = A\\sin(kx - \\omega t + \\varphi)$$

con número de onda $k = 2\\pi/\\lambda$, pulsación $\\omega = 2\\pi f$ y velocidad de fase $v = \\omega/k = \\lambda f$. Satisface la ecuación de onda:

$$\\frac{\\partial^2 y}{\\partial t^2} = v^2 \\frac{\\partial^2 y}{\\partial x^2}$$
`,
        widget: "phys-wave",
      },
      {
        id: "superposicion",
        title: "Superposición e interferencia",
        keywords: ["interferencia", "constructiva", "destructiva", "batidos"],
        body: `
Dos ondas coherentes de igual frecuencia interfieren. La diferencia de fase $\\Delta\\varphi$ determina:

- **Constructiva**: $\\Delta\\varphi = 2\\pi n$, amplitudes se suman.
- **Destructiva**: $\\Delta\\varphi = (2n+1)\\pi$, amplitudes se restan.

Frecuencias muy próximas producen **batidos** de frecuencia $|f_1 - f_2|$.
`,
      },
      {
        id: "doppler",
        title: "Efecto Doppler",
        keywords: ["doppler", "frecuencia percibida", "fuente", "observador"],
        body: `
Cuando emisor y receptor se mueven respecto al medio, la frecuencia percibida cambia:

$$f' = f_0 \\,\\frac{c + v_o}{c - v_s}$$

con $c$ la velocidad de propagación, $v_o$ del observador (positiva si se acerca a la fuente) y $v_s$ de la fuente (positiva si se acerca al observador).
`,
        widget: "phys-doppler",
      },
    ],
  },

  // ─────────────────────────── 3
  {
    slug: "termodinamica",
    title: "Termodinámica",
    category: "fisica",
    level: "intermedio",
    readingMinutes: 16,
    summary:
      "Temperatura, calor, leyes de la termodinámica, ciclos y entropía.",
    sections: [
      {
        id: "temperatura-calor",
        title: "Temperatura, calor y trabajo",
        keywords: ["temperatura", "calor", "capacidad calorífica"],
        body: `
La **temperatura** mide la energía cinética media de las partículas. El **calor** $Q$ es energía en tránsito por diferencia de temperatura. El **trabajo** $W$ es energía intercambiada por desplazamiento de fronteras o ejes. Para calentar una masa $m$ una temperatura $\\Delta T$:

$$Q = m c \\Delta T$$

con $c$ el calor específico (J/kg·K).
`,
      },
      {
        id: "primer-principio",
        title: "Primer principio",
        keywords: ["primer principio", "energía interna", "ΔU = Q − W"],
        body: `
La energía se conserva:

$$\\Delta U = Q - W$$

En forma diferencial $dU = \\delta Q - \\delta W$. La entalpía $H = U + pV$ es útil a presión constante: $\\Delta H = Q_p$.
`,
      },
      {
        id: "gas-ideal",
        title: "Gas ideal",
        keywords: ["gas ideal", "pV=nRT", "isoterma", "adiabática"],
        body: `
Ecuación de estado: $pV = nRT$ con $R = 8{,}314\\,\\mathrm{J/(mol\\cdot K)}$.

Procesos típicos:

| Proceso | Constante | Trabajo |
|---------|-----------|---------|
| Isócoro | $V$ | $0$ |
| Isobárico | $p$ | $p\\Delta V$ |
| Isotermo | $T$ | $nRT\\ln(V_2/V_1)$ |
| Adiabático | $Q = 0$ | $(p_1V_1 - p_2V_2)/(\\gamma - 1)$ |
`,
        widget: "chem-gas",
      },
      {
        id: "segundo-principio",
        title: "Segundo principio y entropía",
        keywords: ["segundo principio", "entropía", "Carnot", "irreversibilidad"],
        body: `
Existe una función de estado $S$ tal que en un proceso reversible $dS = \\delta Q_\\text{rev}/T$. Para todo proceso real:

$$\\Delta S_{\\text{universo}} \\ge 0$$

El **rendimiento de Carnot**, máximo posible entre dos focos a $T_h$ y $T_c$:

$$\\eta_C = 1 - \\frac{T_c}{T_h}$$
`,
      },
      {
        id: "transferencia-calor",
        title: "Modos de transferencia de calor",
        keywords: ["conducción", "convección", "radiación", "Fourier", "Stefan-Boltzmann"],
        body: `
- **Conducción** (Fourier): $\\dot q = -k A\\,dT/dx$.
- **Convección** (Newton): $\\dot q = hA(T_s - T_\\infty)$.
- **Radiación** (Stefan–Boltzmann): $\\dot q = \\varepsilon\\sigma A(T_s^4 - T_\\infty^4)$, con $\\sigma = 5{,}67\\times 10^{-8}\\,\\mathrm{W/(m^2 K^4)}$.
`,
        widget: "eng-heat",
      },
    ],
  },

  // ─────────────────────────── 4
  {
    slug: "electromagnetismo",
    title: "Electromagnetismo",
    category: "fisica",
    level: "avanzado",
    readingMinutes: 20,
    summary:
      "Ley de Coulomb, campos eléctrico y magnético, leyes de Maxwell y ondas EM.",
    sections: [
      {
        id: "coulomb",
        title: "Ley de Coulomb y campo eléctrico",
        keywords: ["Coulomb", "campo eléctrico", "carga"],
        body: `
La fuerza entre dos cargas puntuales:

$$\\vec F = \\frac{1}{4\\pi\\varepsilon_0}\\,\\frac{q_1 q_2}{r^2}\\,\\hat r$$

El campo eléctrico es la fuerza por unidad de carga: $\\vec E = \\vec F/q$.
`,
      },
      {
        id: "ley-ohm",
        title: "Corriente, resistencia y ley de Ohm",
        keywords: ["corriente", "resistencia", "Ohm", "potencia eléctrica"],
        body: `
La corriente $I = dq/dt$ se mide en amperios. Para conductores óhmicos:

$$V = I R$$

La potencia disipada: $P = VI = I^2 R = V^2/R$.
`,
        widget: "phys-ohm",
      },
      {
        id: "circuito-rc",
        title: "Circuitos RC",
        keywords: ["RC", "constante de tiempo", "carga", "descarga"],
        body: `
En un circuito RC en serie con tensión $V$, la carga del condensador:

$$V_C(t) = V\\left(1 - e^{-t/\\tau}\\right), \\qquad \\tau = RC$$

Tras $5\\tau$ se alcanza ~99% de la tensión de la fuente.
`,
        widget: "phys-rc",
      },
      {
        id: "maxwell",
        title: "Ecuaciones de Maxwell",
        keywords: ["Maxwell", "Gauss", "Faraday", "Ampère"],
        body: `
En el vacío y forma diferencial:

$$\\nabla\\cdot\\vec E = \\rho/\\varepsilon_0$$
$$\\nabla\\cdot\\vec B = 0$$
$$\\nabla\\times\\vec E = -\\partial \\vec B/\\partial t$$
$$\\nabla\\times\\vec B = \\mu_0 \\vec J + \\mu_0\\varepsilon_0\\,\\partial\\vec E/\\partial t$$

De aquí surgen las **ondas electromagnéticas** que se propagan a $c = 1/\\sqrt{\\mu_0\\varepsilon_0}$.
`,
      },
    ],
  },

  // ─────────────────────────── 5
  {
    slug: "optica",
    title: "Óptica geométrica y ondulatoria",
    category: "fisica",
    level: "intermedio",
    readingMinutes: 14,
    summary:
      "Reflexión, refracción, lentes delgadas, difracción y polarización.",
    sections: [
      {
        id: "reflexion-refraccion",
        title: "Reflexión y refracción",
        keywords: ["reflexión", "refracción", "Snell", "índice"],
        body: `
**Reflexión**: el ángulo de incidencia es igual al de reflexión. **Refracción** (ley de Snell):

$$n_1 \\sin\\theta_1 = n_2 \\sin\\theta_2$$
`,
        widget: "phys-snell",
      },
      {
        id: "lentes",
        title: "Lentes delgadas",
        keywords: ["lente", "distancia focal", "imagen"],
        body: `
La ecuación de la lente delgada:

$$\\frac{1}{f} = \\frac{1}{s_o} + \\frac{1}{s_i}$$

con aumento $M = -s_i/s_o$. Convención: $f > 0$ para lente convergente.
`,
      },
      {
        id: "difraccion",
        title: "Difracción y patrón de doble rendija",
        keywords: ["difracción", "Young", "doble rendija", "interferencia"],
        body: `
La separación entre máximos en un experimento de Young:

$$\\Delta y = \\frac{\\lambda L}{d}$$

donde $d$ es la separación de las rendijas y $L$ la distancia a la pantalla.
`,
      },
    ],
  },

  // ───────── 6
  {
    slug: "relatividad-especial",
    title: "Relatividad especial",
    category: "fisica",
    level: "avanzado",
    readingMinutes: 12,
    summary: "Postulados de Einstein, dilatación temporal, contracción de Lorentz, equivalencia masa-energía.",
    sections: [
      {
        id: "postulados",
        title: "Postulados de Einstein",
        keywords: ["relatividad", "postulado", "velocidad de la luz"],
        body: `
1. Las leyes de la física son las mismas en todo sistema inercial.
2. La velocidad de la luz $c$ es la misma para todos los observadores inerciales, sin importar el movimiento de la fuente.
`,
      },
      {
        id: "dilatacion-tiempo",
        title: "Dilatación del tiempo y contracción de longitudes",
        keywords: ["dilatación", "Lorentz", "γ", "contracción"],
        body: `
Definimos $\\gamma = 1/\\sqrt{1 - v^2/c^2}$. Un observador en reposo ve:

$$\\Delta t = \\gamma\\,\\Delta t_0, \\qquad L = L_0/\\gamma$$

donde los subíndices $0$ refieren al sistema propio.
`,
      },
      {
        id: "energia-masa",
        title: "Energía y masa",
        keywords: ["E=mc²", "energía relativista", "masa-energía"],
        body: `
La energía total de una partícula libre:

$$E^2 = (pc)^2 + (mc^2)^2$$

En reposo: $E = mc^2$. La energía cinética relativista: $E_c = (\\gamma - 1)mc^2$.
`,
      },
    ],
  },

  // ───────── 7
  {
    slug: "fisica-cuantica",
    title: "Mecánica cuántica: postulados básicos",
    category: "fisica",
    level: "avanzado",
    readingMinutes: 15,
    summary:
      "Función de onda, principio de incertidumbre, ecuación de Schrödinger y ejemplos elementales.",
    sections: [
      {
        id: "dualidad",
        title: "Dualidad onda-partícula",
        keywords: ["de Broglie", "fotón", "dualidad"],
        body: `
A toda partícula de momento $p$ se asocia una longitud de onda:

$$\\lambda = \\frac{h}{p}, \\qquad h = 6{,}626\\times 10^{-34}\\,\\mathrm{J\\cdot s}$$
`,
      },
      {
        id: "incertidumbre",
        title: "Principio de incertidumbre de Heisenberg",
        keywords: ["incertidumbre", "Heisenberg", "Δx Δp"],
        body: `
$$\\Delta x \\,\\Delta p \\ge \\frac{\\hbar}{2}$$

Existe un compromiso fundamental entre la precisión simultánea con que se conocen posición y momento.
`,
      },
      {
        id: "schrodinger",
        title: "Ecuación de Schrödinger",
        keywords: ["Schrödinger", "función de onda", "Hamiltoniano"],
        body: `
Para una partícula no relativista en un potencial $V(\\vec r)$:

$$i\\hbar\\frac{\\partial \\Psi}{\\partial t} = -\\frac{\\hbar^2}{2m}\\nabla^2\\Psi + V\\Psi$$

Las soluciones estacionarias se obtienen separando variables: $\\Psi(\\vec r, t) = \\psi(\\vec r) e^{-iEt/\\hbar}$.
`,
      },
      {
        id: "decaimiento",
        title: "Decaimiento radiactivo",
        keywords: ["decaimiento", "vida media", "exponencial", "λ"],
        body: `
El número de núcleos restantes evoluciona como:

$$N(t) = N_0 e^{-\\lambda t}, \\qquad t_{1/2} = \\frac{\\ln 2}{\\lambda}$$
`,
        widget: "phys-decay",
      },
    ],
  },

  // ───────── 8
  {
    slug: "fluidos",
    title: "Mecánica de fluidos",
    category: "fisica",
    level: "intermedio",
    readingMinutes: 12,
    summary: "Presión, principio de Arquímedes, ecuación de Bernoulli, viscosidad.",
    sections: [
      {
        id: "presion",
        title: "Presión y principio de Pascal",
        keywords: ["presión", "Pascal", "estática"],
        body: `
$$p = \\frac{F}{A}, \\qquad p(h) = p_0 + \\rho g h$$

El principio de Pascal: una variación de presión aplicada a un fluido confinado se transmite íntegramente a todos sus puntos (base de la prensa hidráulica).
`,
      },
      {
        id: "arquimedes",
        title: "Empuje de Arquímedes",
        keywords: ["Arquímedes", "empuje", "flotación"],
        body: `
Todo cuerpo sumergido experimenta un empuje vertical igual al peso del fluido desplazado:

$$E = \\rho_f g V_{\\text{desplazado}}$$

Flota si $\\rho_{cuerpo} < \\rho_f$.
`,
      },
      {
        id: "bernoulli",
        title: "Ecuación de Bernoulli",
        keywords: ["Bernoulli", "conservación energía", "velocidad presión"],
        body: `
Para un flujo estacionario, incompresible y sin viscosidad:

$$p + \\tfrac{1}{2}\\rho v^2 + \\rho g h = \\text{cte}$$

Donde $v$ aumenta, $p$ disminuye (efecto Venturi).
`,
      },
    ],
  },
];
