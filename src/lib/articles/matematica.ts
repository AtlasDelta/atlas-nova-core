import type { Article } from "@/lib/articles";

export const MATH_ARTICLES: Article[] = [
  {
    slug: "calculo-diferencial",
    title: "Cálculo diferencial",
    category: "matematica",
    level: "introductorio",
    readingMinutes: 16,
    summary: "Límites, derivadas, reglas, optimización y aplicaciones geométricas.",
    sections: [
      {
        id: "limites",
        title: "Límites y continuidad",
        keywords: ["límite", "continuidad", "ε-δ"],
        body: `
$\\lim_{x\\to a} f(x) = L$ significa que $f(x)$ se acerca arbitrariamente a $L$ cuando $x\\to a$. Una función es **continua en $a$** si $\\lim_{x\\to a} f(x) = f(a)$.
`,
      },
      {
        id: "derivada",
        title: "La derivada",
        keywords: ["derivada", "tangente", "pendiente"],
        body: `
$$f'(x) = \\lim_{h\\to 0} \\frac{f(x+h) - f(x)}{h}$$

Geométricamente, es la pendiente de la recta tangente.
`,
        widget: "math-derivative",
      },
      {
        id: "reglas",
        title: "Reglas de derivación",
        keywords: ["producto", "cociente", "cadena"],
        body: `
| Regla | Fórmula |
|-------|---------|
| Suma | $(f+g)' = f' + g'$ |
| Producto | $(fg)' = f'g + fg'$ |
| Cociente | $(f/g)' = (f'g - fg')/g^2$ |
| Cadena | $(f\\circ g)'(x) = f'(g(x))g'(x)$ |

Derivadas usuales: $(x^n)' = nx^{n-1}$, $(e^x)' = e^x$, $(\\ln x)' = 1/x$, $(\\sin x)' = \\cos x$.
`,
      },
      {
        id: "optimizacion",
        title: "Optimización",
        keywords: ["máximo", "mínimo", "extremo", "criterio derivada"],
        body: `
Los extremos de una función derivable se buscan entre los **puntos críticos** ($f'(x) = 0$). El criterio de la segunda derivada:

- $f''(x_0) > 0$: mínimo local.
- $f''(x_0) < 0$: máximo local.
`,
      },
      {
        id: "taylor",
        title: "Polinomios de Taylor",
        keywords: ["Taylor", "Maclaurin", "serie", "aproximación"],
        body: `
Aproximación de orden $n$ alrededor de $a$:

$$f(x) \\approx \\sum_{k=0}^n \\frac{f^{(k)}(a)}{k!}(x-a)^k$$

Ejemplo (Maclaurin): $\\sin x = x - x^3/6 + x^5/120 - \\dots$
`,
        widget: "math-taylor",
      },
    ],
  },
  {
    slug: "calculo-integral",
    title: "Cálculo integral",
    category: "matematica",
    level: "intermedio",
    readingMinutes: 14,
    summary: "Antiderivadas, técnicas de integración, integral definida y teorema fundamental.",
    sections: [
      {
        id: "primitiva",
        title: "Primitivas",
        keywords: ["antiderivada", "primitiva", "integral indefinida"],
        body: `
$\\int f(x)\\,dx = F(x) + C$ donde $F'(x) = f(x)$.

Integrales básicas: $\\int x^n dx = x^{n+1}/(n+1)$ ($n\\neq -1$), $\\int dx/x = \\ln|x|$, $\\int e^x dx = e^x$.
`,
      },
      {
        id: "tecnicas",
        title: "Técnicas de integración",
        keywords: ["sustitución", "partes", "fracciones simples"],
        body: `
- **Sustitución**: $u = g(x)$, $du = g'(x)\\,dx$.
- **Por partes**: $\\int u\\,dv = uv - \\int v\\,du$.
- **Fracciones simples** para racionales.
`,
      },
      {
        id: "tfc",
        title: "Teorema fundamental del cálculo",
        keywords: ["TFC", "Newton-Leibniz", "integral definida"],
        body: `
$$\\int_a^b f(x)\\,dx = F(b) - F(a)$$

donde $F$ es cualquier primitiva de $f$. Conecta la derivada con el área bajo la curva.
`,
      },
    ],
  },
  {
    slug: "algebra-lineal",
    title: "Álgebra lineal",
    category: "matematica",
    level: "intermedio",
    readingMinutes: 18,
    summary: "Espacios vectoriales, matrices, sistemas, determinantes, autovalores.",
    sections: [
      {
        id: "vectores",
        title: "Vectores y combinaciones lineales",
        keywords: ["vector", "combinación lineal", "independencia"],
        body: `
Un **espacio vectorial** sobre $\\mathbb K$ admite suma y multiplicación por escalar. Vectores $\\vec v_1,\\dots,\\vec v_k$ son **linealmente independientes** si $\\sum c_i \\vec v_i = \\vec 0 \\Rightarrow c_i = 0$.
`,
      },
      {
        id: "matrices",
        title: "Matrices y producto",
        keywords: ["matriz", "producto", "transpuesta", "inversa"],
        body: `
$(AB)_{ij} = \\sum_k A_{ik}B_{kj}$. Propiedades: $(AB)^T = B^T A^T$, $(AB)^{-1} = B^{-1}A^{-1}$.
`,
      },
      {
        id: "sistemas",
        title: "Sistemas lineales",
        keywords: ["Gauss", "Gauss-Jordan", "rango"],
        body: `
$Ax = b$ tiene:

- **Solución única** si $A$ es invertible (rango pleno).
- **Infinitas soluciones** si $\\text{rank}(A) = \\text{rank}([A|b]) < n$.
- **Ninguna** si $\\text{rank}(A) < \\text{rank}([A|b])$.

Eliminación gaussiana lleva el sistema a forma escalonada.
`,
      },
      {
        id: "determinante",
        title: "Determinante",
        keywords: ["determinante", "volumen", "Cramer"],
        body: `
$\\det A$ mide el factor de escala de volumen de la transformación $A$. $\\det A = 0 \\iff A$ singular.
`,
      },
      {
        id: "autovalores",
        title: "Autovalores y autovectores",
        keywords: ["autovalor", "eigenvalue", "diagonalización"],
        body: `
$A\\vec v = \\lambda \\vec v$ con $\\vec v \\neq 0$. Se obtienen como raíces de $\\det(A - \\lambda I) = 0$. Útiles en PCA, dinámica y mecánica cuántica.
`,
        widget: "math-eigen",
      },
    ],
  },
  {
    slug: "ecuaciones-diferenciales",
    title: "Ecuaciones diferenciales ordinarias",
    category: "matematica",
    level: "avanzado",
    readingMinutes: 15,
    summary: "Tipos, métodos elementales y modelos canónicos.",
    sections: [
      {
        id: "separables",
        title: "EDO separables y lineales",
        keywords: ["separable", "factor integrante", "lineal primer orden"],
        body: `
Separable: $dy/dx = g(x)h(y) \\Rightarrow \\int dy/h(y) = \\int g(x)dx$.

Lineal: $y' + p(x)y = q(x)$, factor $\\mu = e^{\\int p\\,dx}$.
`,
      },
      {
        id: "logistica",
        title: "Modelo logístico",
        keywords: ["logística", "Verhulst", "crecimiento poblacional"],
        body: `
$$\\frac{dN}{dt} = rN\\!\\left(1 - \\frac{N}{K}\\right) \\;\\Rightarrow\\; N(t) = \\frac{K}{1 + \\frac{K - N_0}{N_0}e^{-rt}}$$
`,
        widget: "math-logistic",
      },
      {
        id: "segundo-orden",
        title: "EDO lineales de segundo orden",
        keywords: ["coeficientes constantes", "característica", "oscilador"],
        body: `
$ay'' + by' + cy = 0$ tiene solución dependiente del discriminante de $a\\lambda^2 + b\\lambda + c = 0$.
`,
      },
    ],
  },
  {
    slug: "analisis-fourier",
    title: "Análisis de Fourier",
    category: "matematica",
    level: "avanzado",
    readingMinutes: 12,
    summary: "Series, transformada y aplicaciones a señales.",
    sections: [
      {
        id: "serie",
        title: "Series de Fourier",
        keywords: ["serie de Fourier", "armónico", "ortogonalidad"],
        body: `
Toda función periódica adecuada se escribe:

$$f(x) = \\frac{a_0}{2} + \\sum_{n=1}^\\infty \\left(a_n\\cos\\frac{2\\pi nx}{T} + b_n\\sin\\frac{2\\pi nx}{T}\\right)$$
`,
        widget: "math-fourier",
      },
      {
        id: "transformada",
        title: "Transformada de Fourier",
        keywords: ["FT", "espectro", "frecuencia"],
        body: `
$$\\hat f(\\omega) = \\int_{-\\infty}^\\infty f(t)\\,e^{-i\\omega t}\\,dt$$

Pasa una señal del tiempo al dominio de frecuencia.
`,
      },
    ],
  },
  {
    slug: "probabilidad-estadistica",
    title: "Probabilidad y estadística",
    category: "matematica",
    level: "intermedio",
    readingMinutes: 16,
    summary: "Distribuciones, esperanza, varianza, teorema central del límite.",
    sections: [
      {
        id: "espacios",
        title: "Espacios de probabilidad",
        keywords: ["σ-álgebra", "probabilidad", "evento"],
        body: `
Triple $(\\Omega, \\mathcal F, P)$. $P(\\emptyset)=0$, $P(\\Omega)=1$, $P(\\bigcup A_i) = \\sum P(A_i)$ para disjuntos.
`,
      },
      {
        id: "distribuciones",
        title: "Distribuciones comunes",
        keywords: ["binomial", "Poisson", "normal", "exponencial"],
        body: `
| Distribución | PMF/PDF | Media | Varianza |
|--------------|---------|-------|----------|
| Bernoulli($p$) | $p^k(1-p)^{1-k}$ | $p$ | $p(1-p)$ |
| Binomial($n,p$) | $\\binom{n}{k}p^k(1-p)^{n-k}$ | $np$ | $np(1-p)$ |
| Poisson($\\lambda$) | $\\lambda^k e^{-\\lambda}/k!$ | $\\lambda$ | $\\lambda$ |
| Normal($\\mu,\\sigma^2$) | $\\frac{1}{\\sigma\\sqrt{2\\pi}}e^{-(x-\\mu)^2/(2\\sigma^2)}$ | $\\mu$ | $\\sigma^2$ |
`,
      },
      {
        id: "tcl",
        title: "Teorema central del límite",
        keywords: ["TCL", "central del límite", "promedio muestral"],
        body: `
La suma estandarizada de $n$ v.a. iid con media $\\mu$ y varianza $\\sigma^2 < \\infty$ tiende a $\\mathcal N(0,1)$:

$$\\frac{\\bar X_n - \\mu}{\\sigma/\\sqrt n} \\xrightarrow{d} \\mathcal N(0,1)$$
`,
      },
    ],
  },
  {
    slug: "metodos-numericos",
    title: "Métodos numéricos",
    category: "matematica",
    level: "avanzado",
    readingMinutes: 13,
    summary: "Raíces, sistemas, integración y EDO numéricas.",
    sections: [
      {
        id: "newton",
        title: "Newton–Raphson",
        keywords: ["Newton", "raíz", "convergencia cuadrática"],
        body: `
Iteración: $x_{n+1} = x_n - f(x_n)/f'(x_n)$. Converge cuadráticamente si la aproximación inicial es buena.
`,
        widget: "math-newton-raphson",
      },
      {
        id: "cuadratura",
        title: "Cuadratura numérica",
        keywords: ["trapecio", "Simpson", "integración numérica"],
        body: `
Trapecio: $\\int_a^b f \\approx \\frac{h}{2}\\sum (f_i + f_{i+1})$. Simpson: error $O(h^4)$.
`,
      },
      {
        id: "rk",
        title: "Runge–Kutta de orden 4",
        keywords: ["RK4", "EDO numérica"],
        body: `
Para $y' = f(t,y)$, RK4 calcula 4 pendientes y promedia:

$$y_{n+1} = y_n + \\tfrac{h}{6}(k_1 + 2k_2 + 2k_3 + k_4)$$

con $k_1 = f(t_n, y_n)$, $k_2 = f(t_n+h/2, y_n+hk_1/2)$, etc.
`,
      },
    ],
  },
  {
    slug: "geometria-analitica",
    title: "Geometría analítica",
    category: "matematica",
    level: "introductorio",
    readingMinutes: 9,
    summary: "Recta, circunferencia, cónicas y vectores en el plano.",
    sections: [
      {
        id: "recta",
        title: "La recta",
        keywords: ["recta", "pendiente", "ecuación general"],
        body: `
Forma punto-pendiente: $y - y_0 = m(x - x_0)$. General: $Ax + By + C = 0$.
`,
      },
      {
        id: "conicas",
        title: "Cónicas",
        keywords: ["circunferencia", "elipse", "parábola", "hipérbola"],
        body: `
| Cónica | Ecuación canónica |
|--------|--------------------|
| Circunferencia | $x^2 + y^2 = r^2$ |
| Elipse | $x^2/a^2 + y^2/b^2 = 1$ |
| Parábola | $y^2 = 4px$ |
| Hipérbola | $x^2/a^2 - y^2/b^2 = 1$ |
`,
      },
    ],
  },
];
