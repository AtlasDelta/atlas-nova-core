// Repositorio estático de artículos científicos.
// Cuerpo en markdown con ecuaciones LaTeX inline ($...$) y display ($$...$$).

export type Category = "fisica" | "quimica" | "matematica" | "ingenieria";

export interface Article {
  slug: string;
  title: string;
  category: Category;
  level: "introductorio" | "intermedio" | "avanzado";
  readingMinutes: number;
  summary: string;
  body: string;
}

export const CATEGORY_META: Record<Category, { label: string; description: string; color: string }> = {
  fisica: {
    label: "Física",
    description: "Mecánica, electromagnetismo, termodinámica y más.",
    color: "primary",
  },
  quimica: {
    label: "Química",
    description: "Estructura, reacciones, equilibrio y cinética.",
    color: "accent",
  },
  matematica: {
    label: "Matemática",
    description: "Cálculo, álgebra lineal, ecuaciones diferenciales.",
    color: "success",
  },
  ingenieria: {
    label: "Ingeniería",
    description: "Sistemas, control, materiales y procesos.",
    color: "warn",
  },
};

export const ARTICLES: Article[] = [
  // ─────────── FÍSICA ───────────
  {
    slug: "leyes-de-newton",
    title: "Las leyes de Newton del movimiento",
    category: "fisica",
    level: "introductorio",
    readingMinutes: 6,
    summary:
      "Las tres leyes que fundamentan la mecánica clásica, formuladas con notación moderna y ejemplos cotidianos.",
    body: `
## Contexto histórico

Isaac Newton publicó en 1687 los *Philosophiæ Naturalis Principia Mathematica*, donde estableció tres leyes que aún hoy describen con precisión el movimiento de los cuerpos a velocidades muy inferiores a la de la luz y a escalas mucho mayores que las atómicas.

## Primera ley: inercia

Todo cuerpo permanece en reposo o en movimiento rectilíneo uniforme a menos que una fuerza neta externa actúe sobre él.

$$\\sum \\vec{F} = 0 \\;\\Longleftrightarrow\\; \\vec{v} = \\text{constante}$$

Esta ley introduce el concepto de **sistema de referencia inercial**: aquel en el que la primera ley se cumple.

## Segunda ley: dinámica

La aceleración de un cuerpo es proporcional a la fuerza neta aplicada e inversamente proporcional a su masa.

$$\\vec{F}_{\\text{neta}} = m \\, \\vec{a}$$

En su forma más general, válida también cuando la masa varía con el tiempo:

$$\\vec{F} = \\frac{d\\vec{p}}{dt}, \\qquad \\vec{p} = m\\vec{v}$$

## Tercera ley: acción y reacción

Cuando un cuerpo $A$ ejerce una fuerza sobre $B$, $B$ ejerce simultáneamente sobre $A$ una fuerza de igual magnitud y dirección opuesta.

$$\\vec{F}_{A \\to B} = -\\vec{F}_{B \\to A}$$

## Limitaciones

Estas leyes dejan de ser precisas cuando:

- Las velocidades se aproximan a $c$ (relatividad especial).
- Las masas o energías son extremas (relatividad general).
- Las escalas son atómicas o subatómicas (mecánica cuántica).
`,
  },
  {
    slug: "primer-principio-termodinamica",
    title: "Primer principio de la termodinámica",
    category: "fisica",
    level: "intermedio",
    readingMinutes: 7,
    summary:
      "Conservación de la energía aplicada a sistemas termodinámicos: calor, trabajo y energía interna.",
    body: `
## Enunciado

La variación de energía interna $\\Delta U$ de un sistema cerrado es igual al calor $Q$ absorbido menos el trabajo $W$ realizado por el sistema sobre el entorno.

$$\\Delta U = Q - W$$

En forma diferencial, para procesos infinitesimales:

$$dU = \\delta Q - \\delta W$$

> **Nota sobre notación**: $\\delta$ se usa en lugar de $d$ porque $Q$ y $W$ no son funciones de estado — su valor depende del camino seguido entre los estados inicial y final.

## Trabajo en procesos $p$–$V$

Para un gas que se expande contra una presión externa:

$$W = \\int_{V_1}^{V_2} p \\, dV$$

En un proceso isotermo de un gas ideal ($pV = nRT$):

$$W = nRT \\ln\\!\\left(\\frac{V_2}{V_1}\\right)$$

## Casos particulares

- **Proceso adiabático** ($Q = 0$): $\\Delta U = -W$. Toda la variación de energía interna proviene del trabajo.
- **Proceso isócoro** ($V$ constante, $W = 0$): $\\Delta U = Q$.
- **Proceso isobárico** ($p$ constante): $W = p\\,\\Delta V$, y se introduce la **entalpía** $H = U + pV$ con $\\Delta H = Q_p$.

## Implicación filosófica

El primer principio prohíbe los **móviles perpetuos de primera especie**: máquinas que producirían trabajo sin consumir energía equivalente.
`,
  },
  {
    slug: "ondas-electromagneticas",
    title: "Ondas electromagnéticas y ecuaciones de Maxwell",
    category: "fisica",
    level: "avanzado",
    readingMinutes: 9,
    summary:
      "Cómo las cuatro ecuaciones de Maxwell predicen la existencia de ondas que se propagan a la velocidad de la luz.",
    body: `
## Las ecuaciones de Maxwell en el vacío

En forma diferencial y unidades del SI:

$$\\nabla \\cdot \\vec{E} = 0$$

$$\\nabla \\cdot \\vec{B} = 0$$

$$\\nabla \\times \\vec{E} = -\\frac{\\partial \\vec{B}}{\\partial t}$$

$$\\nabla \\times \\vec{B} = \\mu_0 \\varepsilon_0 \\frac{\\partial \\vec{E}}{\\partial t}$$

## Derivación de la ecuación de onda

Aplicando el rotacional a la tercera ecuación y usando la identidad vectorial $\\nabla \\times (\\nabla \\times \\vec{A}) = \\nabla(\\nabla\\cdot\\vec{A}) - \\nabla^2 \\vec{A}$:

$$\\nabla^2 \\vec{E} = \\mu_0 \\varepsilon_0 \\frac{\\partial^2 \\vec{E}}{\\partial t^2}$$

Esta es una ecuación de onda con velocidad de propagación:

$$c = \\frac{1}{\\sqrt{\\mu_0 \\varepsilon_0}} \\approx 2{,}998 \\times 10^{8} \\,\\mathrm{m/s}$$

## Solución plana monocromática

$$\\vec{E}(\\vec{r}, t) = \\vec{E}_0 \\, e^{i(\\vec{k}\\cdot\\vec{r} - \\omega t)}$$

con la relación de dispersión $\\omega = c|\\vec{k}|$ y $\\vec{E}_0 \\perp \\vec{k}$, $\\vec{B}_0 \\perp \\vec{k}$, $\\vec{E}_0 \\perp \\vec{B}_0$ — la luz es transversal.

## Espectro electromagnético

Una sola familia de ondas, ordenada por frecuencia:

| Banda | Frecuencia | Longitud de onda |
|-------|-----------|-------------------|
| Radio | < 3 GHz | > 10 cm |
| Microondas | 3 – 300 GHz | 1 mm – 10 cm |
| Visible | ~430 – 770 THz | 390 – 700 nm |
| Rayos X | 30 PHz – 30 EHz | 10 pm – 10 nm |
`,
  },

  // ─────────── QUÍMICA ───────────
  {
    slug: "estequiometria-basica",
    title: "Estequiometría: cálculos en reacciones químicas",
    category: "quimica",
    level: "introductorio",
    readingMinutes: 5,
    summary:
      "Cómo balancear ecuaciones químicas y calcular cantidades de reactivos y productos a partir de moles.",
    body: `
## El mol como unidad

Un mol contiene exactamente $N_A = 6{,}022 \\times 10^{23}$ entidades (número de Avogadro). La masa molar $M$ de una sustancia se mide en g/mol y coincide numéricamente con su masa atómica/molecular en uma.

$$n = \\frac{m}{M}$$

## Balance de ecuaciones

La ley de conservación de la masa exige que el número de átomos de cada elemento sea el mismo en reactivos y productos. Por ejemplo, la combustión del metano:

$$\\mathrm{CH_4 + 2\\,O_2 \\longrightarrow CO_2 + 2\\,H_2O}$$

Los coeficientes estequiométricos (1, 2, 1, 2) indican las proporciones molares.

## Reactivo limitante

Cuando varios reactivos se mezclan en proporciones distintas a las estequiométricas, uno se agota antes. Si reaccionan $n_A$ moles de $A$ y $n_B$ moles de $B$ con coeficientes $a, b$:

$$\\text{limitante} = \\min\\!\\left(\\frac{n_A}{a}, \\frac{n_B}{b}\\right)$$

## Rendimiento

Distinguimos:

- **Rendimiento teórico** $m_t$: masa de producto si todo el limitante reacciona.
- **Rendimiento real** $m_r$: lo realmente obtenido en el laboratorio.

$$\\eta = \\frac{m_r}{m_t} \\times 100\\%$$

## Ejemplo

Quema completa de 16 g de $\\mathrm{CH_4}$ ($M = 16$ g/mol) con $\\mathrm{O_2}$ en exceso. Por estequiometría se producen $1 \\cdot 44 = 44$ g de $\\mathrm{CO_2}$.
`,
  },
  {
    slug: "equilibrio-quimico",
    title: "Equilibrio químico y principio de Le Chatelier",
    category: "quimica",
    level: "intermedio",
    readingMinutes: 7,
    summary:
      "La constante de equilibrio, el cociente de reacción y cómo predecir el efecto de perturbaciones externas.",
    body: `
## Reacciones reversibles

Para una reacción genérica:

$$a\\,A + b\\,B \\rightleftharpoons c\\,C + d\\,D$$

en el equilibrio dinámico las velocidades directa e inversa se igualan. La **constante de equilibrio** se define como:

$$K_c = \\frac{[C]^c [D]^d}{[A]^a [B]^b}$$

donde $[X]$ es la concentración molar de la especie $X$ en el equilibrio.

## Cociente de reacción

Fuera del equilibrio, el mismo cociente se denota $Q_c$:

- Si $Q_c < K_c$: la reacción avanza hacia la derecha.
- Si $Q_c > K_c$: avanza hacia la izquierda.
- Si $Q_c = K_c$: el sistema ya está en equilibrio.

## Principio de Le Chatelier

> Si un sistema en equilibrio se perturba, evoluciona en el sentido que tienda a contrarrestar la perturbación.

Aplicaciones típicas:

- **Aumentar $[A]$**: el equilibrio se desplaza hacia los productos.
- **Aumentar la presión** (con $\\Delta n_{\\text{gas}} \\neq 0$): se favorece el lado con menos moles gaseosos.
- **Aumentar la temperatura** en una reacción endotérmica ($\\Delta H > 0$): se favorecen los productos.

## Relación con la termodinámica

$$\\Delta G^\\circ = -RT \\ln K$$

donde $\\Delta G^\\circ$ es la variación de energía libre estándar, $R = 8{,}314\\,\\mathrm{J/(mol\\cdot K)}$ y $T$ la temperatura en kelvin.
`,
  },
  {
    slug: "cinetica-quimica",
    title: "Cinética química: velocidad y orden de reacción",
    category: "quimica",
    level: "avanzado",
    readingMinutes: 8,
    summary:
      "Leyes de velocidad, mecanismos de reacción y dependencia con la temperatura mediante la ecuación de Arrhenius.",
    body: `
## Definición de velocidad

Para $a\\,A + b\\,B \\to c\\,C + d\\,D$:

$$v = -\\frac{1}{a}\\frac{d[A]}{dt} = -\\frac{1}{b}\\frac{d[B]}{dt} = \\frac{1}{c}\\frac{d[C]}{dt} = \\frac{1}{d}\\frac{d[D]}{dt}$$

## Ley de velocidad

Generalmente de la forma:

$$v = k\\,[A]^{\\alpha}[B]^{\\beta}$$

donde $\\alpha$ y $\\beta$ son los **órdenes parciales** (determinados experimentalmente, no por la estequiometría) y $\\alpha + \\beta$ es el orden global.

## Cinéticas integradas

| Orden | Ley diferencial | Forma integrada | Vida media |
|-------|-----------------|-----------------|-------------|
| 0 | $-d[A]/dt = k$ | $[A] = [A]_0 - kt$ | $[A]_0/(2k)$ |
| 1 | $-d[A]/dt = k[A]$ | $\\ln[A] = \\ln[A]_0 - kt$ | $\\ln 2 / k$ |
| 2 | $-d[A]/dt = k[A]^2$ | $1/[A] = 1/[A]_0 + kt$ | $1/(k[A]_0)$ |

## Ecuación de Arrhenius

La constante de velocidad $k$ depende fuertemente de la temperatura:

$$k = A \\, e^{-E_a / (RT)}$$

donde $A$ es el **factor preexponencial** y $E_a$ la **energía de activación**. En forma logarítmica:

$$\\ln k = \\ln A - \\frac{E_a}{R}\\,\\frac{1}{T}$$

Una gráfica de $\\ln k$ frente a $1/T$ es lineal y permite extraer $E_a$ de la pendiente.
`,
  },

  // ─────────── MATEMÁTICA ───────────
  {
    slug: "derivadas-fundamentales",
    title: "Derivadas: definición, reglas y geometría",
    category: "matematica",
    level: "introductorio",
    readingMinutes: 6,
    summary:
      "El concepto de derivada como límite, las reglas de cálculo y la interpretación como pendiente de la recta tangente.",
    body: `
## Definición formal

La derivada de $f$ en el punto $x_0$ es:

$$f'(x_0) = \\lim_{h \\to 0} \\frac{f(x_0 + h) - f(x_0)}{h}$$

cuando ese límite existe y es finito.

## Interpretación geométrica

$f'(x_0)$ es la **pendiente de la recta tangente** a la gráfica de $f$ en el punto $(x_0, f(x_0))$. La ecuación de la tangente es:

$$y = f(x_0) + f'(x_0)\\,(x - x_0)$$

## Reglas básicas

| Regla | Fórmula |
|-------|---------|
| Suma | $(f + g)' = f' + g'$ |
| Producto | $(fg)' = f'g + fg'$ |
| Cociente | $(f/g)' = (f'g - fg')/g^2$ |
| Cadena | $(f \\circ g)'(x) = f'(g(x))\\,g'(x)$ |

## Derivadas de funciones usuales

$$\\frac{d}{dx}(x^n) = n\\,x^{n-1}$$

$$\\frac{d}{dx}(\\sin x) = \\cos x, \\qquad \\frac{d}{dx}(\\cos x) = -\\sin x$$

$$\\frac{d}{dx}(e^x) = e^x, \\qquad \\frac{d}{dx}(\\ln x) = \\frac{1}{x}$$

## Aplicación: optimización

Los extremos relativos de una función derivable se encuentran entre los **puntos críticos**, donde $f'(x) = 0$. El signo de $f''(x)$ permite clasificarlos:

- $f''(x_0) > 0$: mínimo local.
- $f''(x_0) < 0$: máximo local.
- $f''(x_0) = 0$: criterio inconcluso, examinar derivadas superiores.
`,
  },
  {
    slug: "algebra-lineal-vectores",
    title: "Espacios vectoriales y transformaciones lineales",
    category: "matematica",
    level: "intermedio",
    readingMinutes: 8,
    summary:
      "Estructura algebraica de los vectores, base y dimensión, y cómo las matrices representan transformaciones.",
    body: `
## Espacio vectorial

Un espacio vectorial sobre un cuerpo $\\mathbb{K}$ (típicamente $\\mathbb{R}$ o $\\mathbb{C}$) es un conjunto $V$ con dos operaciones:

- **Suma**: $\\vec{u} + \\vec{v} \\in V$
- **Producto por escalar**: $\\lambda \\vec{v} \\in V$ con $\\lambda \\in \\mathbb{K}$

que satisfacen los ocho axiomas de espacio vectorial (asociatividad, conmutatividad, neutro, opuesto, distributividad, etc.).

## Base y dimensión

Un conjunto $\\{\\vec{e}_1, \\dots, \\vec{e}_n\\}$ es **base** de $V$ si:

1. Es linealmente independiente: $\\sum \\lambda_i \\vec{e}_i = \\vec{0} \\Rightarrow \\lambda_i = 0$.
2. Genera $V$: todo $\\vec{v} \\in V$ se escribe como $\\vec{v} = \\sum c_i \\vec{e}_i$.

El número $n$ es la **dimensión** de $V$.

## Transformaciones lineales

Una aplicación $T : V \\to W$ es lineal si:

$$T(\\vec{u} + \\vec{v}) = T(\\vec{u}) + T(\\vec{v}), \\qquad T(\\lambda \\vec{v}) = \\lambda \\, T(\\vec{v})$$

Fijadas bases en $V$ y $W$, $T$ se representa por una **matriz** $A$ tal que $T(\\vec{x}) = A\\vec{x}$ en coordenadas.

## Núcleo e imagen

$$\\ker(T) = \\{\\vec{v} \\in V : T(\\vec{v}) = \\vec{0}\\}$$

$$\\operatorname{Im}(T) = \\{T(\\vec{v}) : \\vec{v} \\in V\\} \\subseteq W$$

El **teorema de la dimensión** los relaciona:

$$\\dim V = \\dim \\ker(T) + \\dim \\operatorname{Im}(T)$$

## Autovalores y autovectores

Un escalar $\\lambda$ es **autovalor** de $A$ si existe $\\vec{v} \\neq \\vec{0}$ con:

$$A\\vec{v} = \\lambda \\vec{v}$$

Se obtienen como raíces del **polinomio característico**:

$$\\det(A - \\lambda I) = 0$$
`,
  },
  {
    slug: "ecuaciones-diferenciales-ordinarias",
    title: "Introducción a las ecuaciones diferenciales ordinarias",
    category: "matematica",
    level: "avanzado",
    readingMinutes: 9,
    summary:
      "Tipos, métodos elementales de resolución y modelos clásicos: crecimiento exponencial, oscilador armónico.",
    body: `
## Definición

Una **ecuación diferencial ordinaria** (EDO) es una relación entre una función $y(x)$ y sus derivadas:

$$F(x, y, y', y'', \\dots, y^{(n)}) = 0$$

El **orden** es el de la derivada más alta. Una EDO es **lineal** si $y$ y sus derivadas aparecen elevadas a la primera potencia y sin productos entre ellas.

## EDO de primer orden separable

$$\\frac{dy}{dx} = g(x)\\,h(y)$$

Se integra separando variables:

$$\\int \\frac{dy}{h(y)} = \\int g(x)\\,dx + C$$

**Ejemplo** (crecimiento exponencial): $dy/dx = ky$ tiene como solución $y(x) = y_0\\,e^{kx}$.

## EDO lineal de primer orden

$$y' + p(x)\\,y = q(x)$$

Se resuelve multiplicando por el **factor integrante** $\\mu(x) = e^{\\int p(x)\\,dx}$:

$$y(x) = \\frac{1}{\\mu(x)} \\left( \\int \\mu(x)\\,q(x)\\,dx + C \\right)$$

## Oscilador armónico

La EDO lineal de segundo orden con coeficientes constantes:

$$m\\,\\ddot{x} + c\\,\\dot{x} + k\\,x = 0$$

modela un sistema masa-resorte-amortiguador. Su ecuación característica $m\\lambda^2 + c\\lambda + k = 0$ tiene tres regímenes según el discriminante $\\Delta = c^2 - 4mk$:

| Régimen | Condición | Solución |
|---------|-----------|----------|
| Sobreamortiguado | $\\Delta > 0$ | $x = A e^{\\lambda_1 t} + B e^{\\lambda_2 t}$ |
| Crítico | $\\Delta = 0$ | $x = (A + Bt)\\,e^{\\lambda t}$ |
| Subamortiguado | $\\Delta < 0$ | $x = e^{-\\zeta\\omega_n t}(A\\cos\\omega_d t + B\\sin\\omega_d t)$ |

donde $\\omega_n = \\sqrt{k/m}$, $\\zeta = c/(2\\sqrt{mk})$ y $\\omega_d = \\omega_n\\sqrt{1-\\zeta^2}$.

## Existencia y unicidad

El **teorema de Picard–Lindelöf** garantiza que el problema de valores iniciales:

$$y' = f(x, y), \\qquad y(x_0) = y_0$$

tiene una solución única en un entorno de $x_0$ si $f$ es continua y Lipschitz en $y$ en una región que contenga $(x_0, y_0)$.
`,
  },

  // ─────────── INGENIERÍA ───────────
  {
    slug: "sistemas-control-pid",
    title: "Control PID: tres acciones, un controlador",
    category: "ingenieria",
    level: "introductorio",
    readingMinutes: 6,
    summary:
      "El controlador más usado en la industria, explicado en sus tres componentes y con criterios de sintonía.",
    body: `
## Estructura

Un controlador **PID** (Proporcional–Integral–Derivativo) calcula la acción de control $u(t)$ a partir del error $e(t) = r(t) - y(t)$ entre la referencia $r$ y la salida medida $y$:

$$u(t) = K_p\\, e(t) + K_i \\int_0^t e(\\tau)\\,d\\tau + K_d\\,\\frac{de(t)}{dt}$$

En el dominio de Laplace:

$$C(s) = K_p + \\frac{K_i}{s} + K_d\\,s$$

## Las tres acciones

- **Proporcional**: responde al error actual. Aumentar $K_p$ acelera la respuesta pero introduce oscilación y deja un **error en régimen permanente**.
- **Integral**: acumula el error pasado. Elimina el error en régimen permanente, pero puede saturar (*windup*) y desestabilizar el sistema.
- **Derivativa**: anticipa el error futuro a partir de su pendiente. Aporta amortiguamiento, pero amplifica el ruido.

## Sintonía: método de Ziegler–Nichols

A partir de la ganancia crítica $K_u$ (a la que el sistema oscila sostenidamente con un controlador puramente proporcional) y el periodo de oscilación $T_u$:

| Tipo | $K_p$ | $K_i$ | $K_d$ |
|------|-------|-------|-------|
| P | $0{,}5\\,K_u$ | — | — |
| PI | $0{,}45\\,K_u$ | $1{,}2\\,K_p / T_u$ | — |
| PID | $0{,}6\\,K_u$ | $2\\,K_p / T_u$ | $K_p\\,T_u / 8$ |

## Limitaciones

- Sistemas con retardos importantes o no lineales fuertes a menudo requieren controladores avanzados (predictivo, adaptativo).
- La acción derivativa pura sobre la medida amplifica ruido; se suele aplicar a la salida y filtrarla.
`,
  },
  {
    slug: "transferencia-de-calor",
    title: "Modos de transferencia de calor",
    category: "ingenieria",
    level: "intermedio",
    readingMinutes: 7,
    summary:
      "Conducción, convección y radiación: leyes fundamentales y cuándo dominan en problemas reales.",
    body: `
## Conducción

Transferencia por contacto molecular dentro de un sólido o un fluido en reposo. La ley de Fourier en una dimensión:

$$\\dot{q}_x = -k\\,A\\,\\frac{dT}{dx}$$

donde $k$ es la **conductividad térmica** del material (W/(m·K)). Resistencia térmica de una pared plana:

$$R_{\\text{cond}} = \\frac{L}{k\\,A}$$

## Convección

Entre un sólido y un fluido en movimiento, la ley de enfriamiento de Newton:

$$\\dot{q} = h\\,A\\,(T_s - T_\\infty)$$

donde $h$ es el **coeficiente de convección** (W/(m²·K)), que depende del régimen (laminar o turbulento), la geometría y las propiedades del fluido. Se calcula a partir de correlaciones empíricas con números adimensionales:

$$\\mathrm{Nu} = \\frac{h\\,L}{k_f}, \\qquad \\mathrm{Re} = \\frac{\\rho v L}{\\mu}, \\qquad \\mathrm{Pr} = \\frac{\\mu c_p}{k_f}$$

## Radiación

Todo cuerpo a temperatura $T > 0\\,\\mathrm{K}$ emite energía electromagnética. Para un emisor de superficie $A$, emisividad $\\varepsilon$ y temperatura $T_s$ rodeado de un entorno a $T_\\infty$:

$$\\dot{q} = \\varepsilon\\,\\sigma\\,A\\,(T_s^4 - T_\\infty^4)$$

con $\\sigma = 5{,}67 \\times 10^{-8}\\,\\mathrm{W/(m^2 \\cdot K^4)}$, la constante de Stefan–Boltzmann.

## ¿Cuál domina?

| Situación | Modo dominante |
|-----------|----------------|
| Aislamiento de tuberías | Conducción + convección externa |
| Disipador de electrónica con ventilador | Convección forzada |
| Radiador de calefacción doméstico | Convección natural + radiación |
| Pérdidas de un satélite en órbita | Radiación |

En la mayoría de los problemas reales, los tres modos coexisten y se suman como **resistencias térmicas en paralelo o en serie**.
`,
  },
  {
    slug: "balance-de-energia-procesos",
    title: "Balances de energía en procesos estacionarios",
    category: "ingenieria",
    level: "avanzado",
    readingMinutes: 8,
    summary:
      "Aplicación del primer principio a sistemas abiertos: ecuación de la energía con flujo, calor y trabajo.",
    body: `
## Sistema abierto y volumen de control

A diferencia de un sistema cerrado, un **volumen de control** intercambia masa con su entorno a través de fronteras (entradas y salidas). El balance de energía para un volumen de control en régimen estacionario es:

$$\\dot{Q} - \\dot{W}_s = \\sum_{\\text{salidas}} \\dot{m}_s \\left(h_s + \\frac{v_s^2}{2} + g z_s\\right) - \\sum_{\\text{entradas}} \\dot{m}_e \\left(h_e + \\frac{v_e^2}{2} + g z_e\\right)$$

donde:

- $\\dot{Q}$: calor neto que entra al volumen (W).
- $\\dot{W}_s$: trabajo de eje neto realizado por el sistema (W) (sin contar el trabajo de flujo, ya incluido en $h$).
- $h$: entalpía específica (J/kg).
- $v$: velocidad del flujo (m/s).
- $z$: altura sobre una referencia (m).

## Balance de masa

En régimen estacionario:

$$\\sum_{\\text{entradas}} \\dot{m}_e = \\sum_{\\text{salidas}} \\dot{m}_s$$

## Casos típicos

### Turbina adiabática

$\\dot{Q} = 0$, energía cinética/potencial despreciables, una entrada y una salida:

$$\\dot{W}_s = \\dot{m}\\,(h_e - h_s)$$

### Intercambiador de calor

$\\dot{W}_s = 0$, dos corrientes que no se mezclan:

$$\\dot{m}_h\\,(h_{h,e} - h_{h,s}) = \\dot{m}_c\\,(h_{c,s} - h_{c,e})$$

### Tobera

$\\dot{Q} \\approx 0$, $\\dot{W}_s = 0$, conversión de entalpía en energía cinética:

$$\\frac{v_s^2 - v_e^2}{2} = h_e - h_s$$

## Eficiencia isentrópica

Las máquinas reales no son reversibles. Para una turbina:

$$\\eta_t = \\frac{h_e - h_s}{h_e - h_{s,\\text{ideal}}}$$

y para un compresor:

$$\\eta_c = \\frac{h_{s,\\text{ideal}} - h_e}{h_s - h_e}$$

Estos valores típicos (0,85 – 0,95) se aplican en simulaciones de ciclos termodinámicos como Brayton o Rankine.
`,
  },
];

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

export function articlesByCategory(cat: Category): Article[] {
  return ARTICLES.filter((a) => a.category === cat);
}
