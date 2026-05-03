import type { Article } from "@/lib/articles";

export const MATH_ARTICLES: Article[] = [
  {
    slug: "calculo-diferencial",
    title: "Cálculo diferencial",
    category: "matematica",
    level: "introductorio",
    readingMinutes: 24,
    summary:
      "Límites, derivadas, reglas de derivación, optimización y aproximación local. La herramienta para entender el cambio.",
    sections: [
      {
        id: "limites",
        title: "Límites y continuidad",
        keywords: ["límite", "continuidad", "ε-δ"],
        body: `
El cálculo diferencial nace de un problema geométrico (la pendiente de una tangente) y otro físico (la velocidad instantánea). Ambos requieren el mismo concepto matemático: el **límite**.

Decir que $\\lim_{x \\to a} f(x) = L$ significa que el valor de $f(x)$ se puede hacer **tan cercano a $L$ como queramos** con tal de tomar $x$ suficientemente cerca de $a$ (pero distinto de $a$). La definición rigurosa $\\varepsilon$–$\\delta$ formaliza la idea:

> Para todo $\\varepsilon > 0$ existe $\\delta > 0$ tal que si $0 < |x - a| < \\delta$, entonces $|f(x) - L| < \\varepsilon$.

Este lenguaje, debido a Cauchy y Weierstrass en el siglo XIX, finalmente puso al cálculo sobre fundamentos sólidos después de 150 años de "infinitésimos" usados con éxito pero sin rigor.

**Reglas operativas** (válidas si los límites individuales existen):

- $\\lim(f \\pm g) = \\lim f \\pm \\lim g$
- $\\lim(f \\cdot g) = \\lim f \\cdot \\lim g$
- $\\lim(f/g) = \\lim f / \\lim g$, si $\\lim g \\neq 0$
- $\\lim f(g(x)) = f(\\lim g(x))$, si $f$ es continua

**Indeterminaciones.** $0/0$, $\\infty/\\infty$, $\\infty - \\infty$, $0\\cdot\\infty$, $1^\\infty$, $0^0$, $\\infty^0$. No tienen valor único: hay que manipular algebraicamente o usar **L'Hôpital**.

**Continuidad.** Una función $f$ es continua en $a$ si:

1. $f(a)$ está definido,
2. $\\lim_{x\\to a} f(x)$ existe,
3. $\\lim_{x\\to a} f(x) = f(a)$.

Las funciones elementales (polinomios, exp, log, sin, cos, raíces) son continuas en su dominio. Las discontinuidades pueden ser **evitables** (límite existe pero $\\neq f(a)$), de **salto** (límites laterales distintos) o **esenciales** (alguno no existe).

> **Por qué importa la continuidad.** El **teorema del valor intermedio** garantiza que una función continua en $[a,b]$ toma todos los valores entre $f(a)$ y $f(b)$. Es la base de muchos métodos numéricos para encontrar raíces (bisección).
`,
      },
      {
        id: "derivada",
        title: "La derivada y su interpretación",
        keywords: ["derivada", "tangente", "pendiente"],
        body: `
La **derivada** de $f$ en $x$ es el límite del cociente incremental:

$$f'(x) = \\lim_{h\\to 0} \\frac{f(x+h) - f(x)}{h}$$

Cuando este límite existe se dice que $f$ es **derivable** en $x$. La derivada admite varias lecturas equivalentes:

- **Geométrica**: pendiente de la recta tangente al gráfico en el punto $(x, f(x))$.
- **Física**: tasa instantánea de cambio. Si $x(t)$ es posición, $x'(t)$ es velocidad. Si $x(t)$ es población, $x'(t)$ es tasa de natalidad neta.
- **Aproximación lineal**: $f(x+h) \\approx f(x) + f'(x)\\,h$ para $h$ pequeño. Es la mejor aproximación lineal posible cerca de $x$.

**Notaciones equivalentes:**

$$f'(x) = \\frac{df}{dx} = \\frac{d}{dx}f(x) = D_x f$$

La forma de Leibniz $df/dx$ es muy útil porque sugiere "cancelar diferenciales", lo que de hecho es la idea detrás de la **regla de la cadena**.

**Derivable implica continua.** El recíproco es falso: $f(x) = |x|$ es continua en 0 pero no derivable allí (la pendiente brinca de $-1$ a $+1$). Existen incluso funciones continuas en todo $\\mathbb R$ que **no son derivables en ningún punto** (ejemplo de Weierstrass), totalmente contraintuitivas.

> **Diferencial.** Se define $df = f'(x)\\,dx$. Sirve para propagación de errores: si una magnitud $f$ depende de $x$ y conoces el error $\\Delta x$, el error en $f$ es aproximadamente $|f'(x)|\\,\\Delta x$. Esta es la base del análisis dimensional de incertidumbres en física experimental.

**Derivadas de orden superior.** $f''(x) = (f')'(x)$, $f'''(x)$, etc. La segunda derivada mide la **curvatura** y la **aceleración** en problemas físicos. Su signo determina concavidad: $f''>0$ cóncava arriba, $f''<0$ cóncava abajo.
`,
        widget: "math-derivative",
      },
      {
        id: "reglas",
        title: "Reglas de derivación",
        keywords: ["producto", "cociente", "cadena"],
        body: `
Casi nunca se calculan derivadas directamente desde el límite. En su lugar se usan **reglas algebraicas** que se demuestran una vez y se aplican mecánicamente.

| Regla | Fórmula |
|-------|---------|
| Suma | $(f+g)' = f' + g'$ |
| Producto | $(fg)' = f'g + fg'$ |
| Cociente | $(f/g)' = (f'g - fg')/g^2$ |
| Cadena | $(f\\circ g)'(x) = f'(g(x))\\cdot g'(x)$ |
| Inversa | $(f^{-1})'(y) = 1/f'(x)$, con $y=f(x)$ |

**Derivadas de funciones elementales:**

| Función | Derivada |
|---------|----------|
| $x^n$ | $n x^{n-1}$ |
| $e^x$ | $e^x$ |
| $a^x$ | $a^x \\ln a$ |
| $\\ln x$ | $1/x$ |
| $\\log_a x$ | $1/(x\\ln a)$ |
| $\\sin x$ | $\\cos x$ |
| $\\cos x$ | $-\\sin x$ |
| $\\tan x$ | $\\sec^2 x$ |
| $\\arcsin x$ | $1/\\sqrt{1-x^2}$ |
| $\\arctan x$ | $1/(1+x^2)$ |

**Regla de la cadena en acción.** Es la regla más usada y la más equivocada por estudiantes. La idea es: deriva la función externa **dejando la interna intacta**, y multiplica por la derivada de la interna. Por ejemplo:

$$\\frac{d}{dx}\\sin(x^2) = \\cos(x^2)\\cdot 2x$$

$$\\frac{d}{dx}e^{3x+1} = 3\\,e^{3x+1}$$

$$\\frac{d}{dx}\\ln(\\cos x) = -\\tan x$$

**Derivación implícita.** Cuando $y$ no está despejada explícitamente, derivamos ambos lados respecto a $x$ recordando que $y = y(x)$:

$$x^2 + y^2 = 1 \\;\\Rightarrow\\; 2x + 2y\\,y' = 0 \\;\\Rightarrow\\; y' = -x/y$$

Útil para curvas implícitas (circunferencias, elipses, curvas algebraicas) y en problemas de tasas relacionadas.

> **Derivación logarítmica.** Para expresiones del tipo $f^g$ (base y exponente variables), tomar logaritmo antes de derivar simplifica enormemente. Por ejemplo, $y = x^x \\Rightarrow \\ln y = x\\ln x \\Rightarrow y'/y = \\ln x + 1 \\Rightarrow y' = x^x(\\ln x + 1)$.
`,
      },
      {
        id: "optimizacion",
        title: "Optimización: encontrar máximos y mínimos",
        keywords: ["máximo", "mínimo", "extremo", "criterio derivada"],
        body: `
Una de las aplicaciones más útiles del cálculo es encontrar **valores extremos** de funciones: el máximo beneficio, el mínimo costo, la trayectoria más rápida, la forma más eficiente.

**Teorema de Fermat.** Si $f$ tiene un extremo local en un punto interior $x_0$ y es derivable allí, entonces $f'(x_0) = 0$. Los puntos donde la derivada se anula se llaman **puntos críticos**.

> **Atención.** Que $f'(x_0)=0$ no garantiza un extremo. Puede ser un **punto de inflexión horizontal**, como $f(x) = x^3$ en el origen. Hay que comprobar.

**Criterios para clasificar puntos críticos:**

- **Primera derivada**: si $f'$ cambia de $+$ a $-$ en $x_0$, es máximo local; de $-$ a $+$, mínimo local; sin cambio, ni máximo ni mínimo.
- **Segunda derivada**: si $f''(x_0) > 0$ es mínimo local, si $f''(x_0) < 0$ es máximo local, si $f''(x_0) = 0$ el criterio no decide.

**Extremos absolutos en intervalos cerrados.** En $[a, b]$ (cerrado y acotado) y $f$ continua, el máximo y mínimo absolutos existen (teorema de Weierstrass) y se buscan entre:

1. los puntos críticos en $(a,b)$,
2. los extremos del intervalo, $a$ y $b$.

**Estrategia general de problemas:**

1. Identificar la magnitud a optimizar (función objetivo) y las variables.
2. Reducir a una función de **una sola variable** usando relaciones del problema.
3. Determinar el dominio.
4. Encontrar puntos críticos y comparar con los extremos del dominio.
5. Verificar la solución (¿tiene sentido físico?).

> **Ejemplo clásico.** Caja con base cuadrada y volumen $V$ fijo, sin tapa. ¿Qué dimensiones minimizan el material? Sea $x$ el lado de la base y $h$ la altura. $V = x^2 h$, área a minimizar $A(x) = x^2 + 4xh = x^2 + 4V/x$. Igualando $A'(x) = 2x - 4V/x^2 = 0$: $x = (2V)^{1/3}$ y $h = V/x^2 = x/2$. La caja óptima es media veces más alta que ancha.

**Optimización con restricciones.** Cuando hay condiciones que las variables deben cumplir, la herramienta es el **método de los multiplicadores de Lagrange** (cálculo multivariable). En el caso unidimensional, las restricciones suelen permitir despejar y reducir a un problema sin restricciones.
`,
      },
      {
        id: "taylor",
        title: "Aproximaciones polinómicas: serie de Taylor",
        keywords: ["Taylor", "Maclaurin", "serie", "aproximación"],
        body: `
Las funciones elementales suelen ser difíciles de calcular salvo en casos triviales. La **serie de Taylor** las aproxima localmente por **polinomios**, que son fáciles de evaluar y manipular.

Si $f$ es suficientemente derivable, su polinomio de Taylor de orden $n$ alrededor de $a$ es:

$$P_n(x) = \\sum_{k=0}^n \\frac{f^{(k)}(a)}{k!}(x-a)^k$$

Cuando $a = 0$ se llama **serie de Maclaurin**. Para muchas funciones la serie infinita converge a la función original en un cierto **radio de convergencia** $R$:

$$f(x) = \\sum_{k=0}^\\infty \\frac{f^{(k)}(a)}{k!}(x-a)^k$$

**Series de Maclaurin notables** (todas con $|x|$ pequeño):

| Función | Serie | Radio |
|---------|-------|-------|
| $e^x$ | $1 + x + x^2/2! + x^3/3! + \\ldots$ | $\\infty$ |
| $\\sin x$ | $x - x^3/3! + x^5/5! - \\ldots$ | $\\infty$ |
| $\\cos x$ | $1 - x^2/2! + x^4/4! - \\ldots$ | $\\infty$ |
| $\\ln(1+x)$ | $x - x^2/2 + x^3/3 - \\ldots$ | $1$ |
| $1/(1-x)$ | $1 + x + x^2 + x^3 + \\ldots$ | $1$ |
| $(1+x)^\\alpha$ | $\\sum \\binom{\\alpha}{k} x^k$ | $1$ |

**Resto de Taylor** (Lagrange): el error al usar $P_n$ está acotado por

$$|f(x) - P_n(x)| \\leq \\frac{M}{(n+1)!}|x-a|^{n+1}$$

donde $M$ es una cota de $|f^{(n+1)}|$ en el intervalo. Este error decrece factorialmente, lo que explica por qué Taylor es tan eficiente.

**Aplicaciones físicas.**

- **Pendulo de pequeñas oscilaciones**: $\\sin\\theta \\approx \\theta$ es la primera aproximación de Taylor; permite linealizar la EDO en $\\ddot\\theta + (g/L)\\sin\\theta = 0$.
- **Mecánica relativista**: $\\sqrt{1-v^2/c^2} \\approx 1 - \\tfrac{1}{2}v^2/c^2$, que recupera la energía cinética clásica $\\tfrac{1}{2}mv^2$ como límite no relativista de $E = mc^2/\\sqrt{1-v^2/c^2}$.
- **Electrónica**: linealización de transistores y diodos en torno a su punto de operación.

> **Funciones analíticas.** Las funciones que coinciden con su serie de Taylor en un entorno se llaman **analíticas**. Casi todas las funciones elementales lo son. Sorprendentemente, **no toda función infinitamente derivable es analítica**: el contraejemplo $f(x) = e^{-1/x^2}$ (con $f(0)=0$) tiene todas sus derivadas nulas en 0, así que su serie de Taylor es 0 pero la función no.
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
    readingMinutes: 22,
    summary:
      "Antiderivadas, técnicas de integración, integral definida y teorema fundamental del cálculo. La operación inversa de la derivada y la herramienta para acumular cantidades.",
    sections: [
      {
        id: "primitiva",
        title: "Antiderivadas o primitivas",
        keywords: ["antiderivada", "primitiva", "integral indefinida"],
        body: `
La **integración indefinida** es la operación inversa de la derivación: dada $f$, buscar una función $F$ tal que $F'(x) = f(x)$. Tal $F$ se llama **antiderivada** o **primitiva** de $f$.

$$\\int f(x)\\,dx = F(x) + C$$

La constante $C$ aparece porque la derivada elimina términos constantes: si $F$ es una primitiva, $F + 5$ también lo es. Toda primitiva de $f$ se diferencia de otra en una constante (en intervalos conexos).

**Tabla básica de primitivas** (a verificar derivando):

| $f(x)$ | $\\int f(x)\\,dx$ |
|--------|------------------|
| $x^n$, $n \\neq -1$ | $\\dfrac{x^{n+1}}{n+1} + C$ |
| $1/x$ | $\\ln|x| + C$ |
| $e^x$ | $e^x + C$ |
| $a^x$ | $a^x/\\ln a + C$ |
| $\\sin x$ | $-\\cos x + C$ |
| $\\cos x$ | $\\sin x + C$ |
| $\\sec^2 x$ | $\\tan x + C$ |
| $1/(1+x^2)$ | $\\arctan x + C$ |
| $1/\\sqrt{1-x^2}$ | $\\arcsin x + C$ |

**Linealidad.** $\\int (af + bg)\\,dx = a\\int f\\,dx + b\\int g\\,dx$. La integración respeta sumas y constantes multiplicativas, pero **no** respeta productos ni cocientes (no hay "regla del producto" para integrar).

> **Atención.** No toda función elemental tiene primitiva elemental. Ejemplos famosos: $e^{-x^2}$ (la integral de Gauss), $\\sin(x)/x$ (seno integral), $1/\\ln x$ (logaritmo integral). Sus primitivas existen como funciones especiales pero no se expresan con funciones elementales.

Encontrar primitivas a mano es a menudo un arte: requiere reconocer patrones, manipular algebraicamente y aplicar técnicas específicas (siguiente sección).
`,
      },
      {
        id: "tecnicas",
        title: "Técnicas de integración",
        keywords: ["sustitución", "partes", "fracciones simples"],
        body: `
A diferencia de derivar (mecánico con las reglas), integrar requiere **estrategia**. Las tres técnicas principales son:

**1. Sustitución (cambio de variable).** Es la regla de la cadena al revés. Si $u = g(x)$, entonces $du = g'(x)\\,dx$ y:

$$\\int f(g(x))\\,g'(x)\\,dx = \\int f(u)\\,du$$

Buscamos en el integrando una "función dentro de otra" cuya derivada también esté presente.

Ejemplo: $\\int 2x\\,e^{x^2}\\,dx$. Tomar $u = x^2 \\Rightarrow du = 2x\\,dx$, queda $\\int e^u\\,du = e^u + C = e^{x^2} + C$.

**2. Integración por partes.** Es la regla del producto al revés:

$$\\int u\\,dv = uv - \\int v\\,du$$

Útil cuando el integrando es producto de dos funciones de naturaleza distinta (algebraica × trascendente). Regla mnemotécnica para elegir $u$: **LIATE** (Logaritmo, Inversa trigonométrica, Algebraica, Trigonométrica, Exponencial); el primero en la lista que aparezca, ese se elige como $u$.

Ejemplo: $\\int x e^x\\,dx$. Tomar $u = x$, $dv = e^x\\,dx \\Rightarrow du = dx$, $v = e^x$. Resultado: $xe^x - \\int e^x\\,dx = xe^x - e^x + C$.

**3. Fracciones parciales.** Para integrar funciones racionales $P(x)/Q(x)$, se descompone en fracciones más simples. El denominador se factoriza y a cada factor se le asocia una fracción de forma estándar:

- Factor lineal $(x-a)$: $\\dfrac{A}{x-a}$.
- Factor cuadrático irreducible $(x^2+bx+c)$: $\\dfrac{Bx+C}{x^2+bx+c}$.
- Factores repetidos: $\\dfrac{A_1}{x-a} + \\dfrac{A_2}{(x-a)^2} + \\ldots$

Ejemplo: $\\int \\dfrac{1}{x^2-1}\\,dx = \\int\\dfrac{1/2}{x-1}\\,dx - \\int\\dfrac{1/2}{x+1}\\,dx = \\tfrac{1}{2}\\ln\\left|\\dfrac{x-1}{x+1}\\right| + C$.

**Otras técnicas útiles:**

- **Sustituciones trigonométricas**: $x = a\\sin\\theta$ para $\\sqrt{a^2-x^2}$, $x = a\\tan\\theta$ para $\\sqrt{a^2+x^2}$, $x = a\\sec\\theta$ para $\\sqrt{x^2-a^2}$.
- **Identidades trigonométricas** para potencias de seno y coseno.
- **Sustitución de Weierstrass** $t = \\tan(x/2)$ para integrales racionales en seno y coseno.

> **Consejo.** Si una integral te resiste, prueba primero sustitución (la más común), luego partes (la segunda más común). Si nada funciona, considera que la primitiva podría no ser elemental. Software como WolframAlpha o sistemas CAS pueden detectarlo automáticamente.
`,
      },
      {
        id: "tfc",
        title: "Teorema fundamental del cálculo",
        keywords: ["TFC", "Newton-Leibniz", "integral definida"],
        body: `
La **integral definida** $\\int_a^b f(x)\\,dx$ se define originalmente como el **límite de sumas de Riemann**, una idea geométrica:

$$\\int_a^b f(x)\\,dx = \\lim_{n\\to\\infty} \\sum_{i=1}^n f(x_i^*)\\,\\Delta x$$

donde el intervalo $[a,b]$ se parte en $n$ subintervalos de ancho $\\Delta x = (b-a)/n$ y $x_i^*$ es un punto cualquiera del $i$-ésimo subintervalo. Geométricamente, es el **área con signo** entre el gráfico de $f$ y el eje $x$.

**Teorema fundamental del cálculo (Newton–Leibniz).** Si $f$ es continua en $[a,b]$ y $F$ es **cualquier** primitiva de $f$, entonces:

$$\\int_a^b f(x)\\,dx = F(b) - F(a)$$

Este resultado, demostrado independientemente por Newton y Leibniz a finales del siglo XVII, es uno de los hitos más importantes de la matemática: conecta dos problemas aparentemente distintos (áreas y tangentes) y reduce el cálculo de áreas a la búsqueda de primitivas.

**Versión "función integral".** Definiendo $G(x) = \\int_a^x f(t)\\,dt$ (área desde $a$ hasta $x$), se cumple:

$$G'(x) = f(x)$$

Es decir, **la derivada de la integral con respecto a su límite superior es el integrando**. La acumulación y la derivación son operaciones inversas.

**Propiedades de la integral definida:**

- $\\int_a^a f = 0$
- $\\int_b^a f = -\\int_a^b f$
- $\\int_a^b (\\alpha f + \\beta g) = \\alpha\\int_a^b f + \\beta\\int_a^b g$
- Aditividad: $\\int_a^b f + \\int_b^c f = \\int_a^c f$
- Si $f \\geq 0$, entonces $\\int_a^b f \\geq 0$.
- **Teorema del valor medio**: $\\int_a^b f = f(c)(b-a)$ para algún $c \\in (a,b)$.

**Aplicaciones (más allá del área):**

| Magnitud | Integral |
|----------|----------|
| Área entre curvas | $\\int_a^b [f(x)-g(x)]\\,dx$ |
| Volumen por discos | $\\pi\\int_a^b [f(x)]^2\\,dx$ |
| Longitud de arco | $\\int_a^b \\sqrt{1 + [f'(x)]^2}\\,dx$ |
| Trabajo | $\\int_a^b F(x)\\,dx$ |
| Centro de masa | $\\bar x = \\dfrac{\\int_a^b x\\rho(x)\\,dx}{\\int_a^b \\rho(x)\\,dx}$ |
| Promedio de $f$ | $\\dfrac{1}{b-a}\\int_a^b f(x)\\,dx$ |
| Probabilidad (PDF) | $P(a \\leq X \\leq b) = \\int_a^b f(x)\\,dx$ |

> **Integrales impropias.** Cuando los límites son infinitos o el integrando explota se requiere una definición por límites: $\\int_1^\\infty 1/x^2\\,dx = \\lim_{R\\to\\infty}[-1/x]_1^R = 1$. Pueden converger o diverger.
`,
      },
    ],
  },
  {
    slug: "algebra-lineal",
    title: "Álgebra lineal",
    category: "matematica",
    level: "intermedio",
    readingMinutes: 26,
    summary:
      "Espacios vectoriales, matrices, sistemas lineales, determinantes y autovalores. La gramática de las transformaciones lineales.",
    sections: [
      {
        id: "vectores",
        title: "Vectores y espacios vectoriales",
        keywords: ["vector", "combinación lineal", "independencia"],
        body: `
Un **espacio vectorial** sobre un cuerpo $\\mathbb K$ (típicamente $\\mathbb R$ o $\\mathbb C$) es un conjunto $V$ con dos operaciones —suma de vectores y multiplicación por escalar— que satisfacen ocho axiomas (asociatividad, conmutatividad, existencia del 0, opuesto, distributividades, etc.).

Ejemplos canónicos:

- $\\mathbb R^n$: $n$-tuplas ordenadas de números reales.
- $\\mathcal P_n$: polinomios de grado $\\leq n$.
- $\\mathcal C[a,b]$: funciones continuas en un intervalo.
- $M_{m\\times n}$: matrices reales $m\\times n$.

La fuerza del álgebra lineal está en que **los mismos teoremas valen en todos esos contextos**: son consecuencias de los axiomas, no de la naturaleza concreta de los "vectores".

**Combinaciones lineales.** Una combinación lineal de $\\vec v_1, \\ldots, \\vec v_k$ con escalares $c_1, \\ldots, c_k$ es:

$$\\vec w = c_1\\vec v_1 + c_2\\vec v_2 + \\ldots + c_k\\vec v_k$$

El conjunto de **todas** las combinaciones lineales se llama **espacio generado** $\\langle \\vec v_1, \\ldots, \\vec v_k \\rangle$ y es siempre un **subespacio** de $V$.

**Independencia lineal.** Los vectores son **linealmente independientes** si la única manera de escribir el vector cero como combinación lineal de ellos es con todos los coeficientes nulos:

$$\\sum c_i \\vec v_i = \\vec 0 \\;\\Longrightarrow\\; c_1 = c_2 = \\ldots = c_k = 0$$

Si no, son **linealmente dependientes** (alguno se expresa en función de los otros).

**Base y dimensión.** Una **base** de $V$ es un conjunto linealmente independiente que genera todo $V$. Toda base tiene el mismo número de elementos, llamado **dimensión** de $V$.

| Espacio | Dimensión | Base canónica |
|---------|-----------|---------------|
| $\\mathbb R^n$ | $n$ | $\\{e_1, \\ldots, e_n\\}$ |
| $\\mathcal P_n$ | $n+1$ | $\\{1, x, x^2, \\ldots, x^n\\}$ |
| $M_{m\\times n}$ | $mn$ | matrices con un 1 y resto ceros |

> **Coordenadas.** Una vez fijada una base, cada vector queda representado por sus coordenadas (una $n$-tupla de escalares). Esto reduce todos los cálculos a operaciones entre números, eficientes para computación.

**Producto interno.** En espacios reales, $\\langle \\vec u, \\vec v \\rangle = \\sum u_i v_i$. Define la **norma** $\\|\\vec v\\| = \\sqrt{\\langle \\vec v, \\vec v\\rangle}$ y el **ángulo** $\\cos\\theta = \\langle\\vec u,\\vec v\\rangle / (\\|\\vec u\\|\\|\\vec v\\|)$. Vectores con producto interno cero son **ortogonales**.
`,
      },
      {
        id: "matrices",
        title: "Matrices y transformaciones lineales",
        keywords: ["matriz", "producto", "transpuesta", "inversa"],
        body: `
Una **matriz** es un arreglo rectangular de escalares. Más profundamente, es la representación en coordenadas de una **transformación lineal** $T: V \\to W$ entre espacios vectoriales.

**Producto matricial.** Si $A$ es $m\\times n$ y $B$ es $n\\times p$, $AB$ es $m\\times p$ con:

$$(AB)_{ij} = \\sum_{k=1}^n A_{ik}\\,B_{kj}$$

El producto **no es conmutativo** en general: $AB \\neq BA$. Es asociativo y distribuye sobre la suma.

**Propiedades algebraicas:**

- $(AB)^T = B^T A^T$
- $(AB)^{-1} = B^{-1}A^{-1}$ (si ambas son invertibles)
- $(A^T)^{-1} = (A^{-1})^T$
- Trace: $\\text{tr}(AB) = \\text{tr}(BA)$, aunque $A$ y $B$ no conmuten.

**Inversa de una matriz.** $A$ es **invertible** si existe $A^{-1}$ con $AA^{-1} = A^{-1}A = I$. Solo las matrices cuadradas pueden tener inversa, y solo si son **no singulares** ($\\det A \\neq 0$).

Para matrices $2\\times 2$:

$$A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}, \\quad A^{-1} = \\frac{1}{ad-bc}\\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}$$

Para matrices más grandes se usa el método de Gauss-Jordan o la fórmula con la matriz adjunta.

**Tipos especiales:**

- **Identidad** $I$: 1 en la diagonal, 0 fuera. $AI = IA = A$.
- **Diagonal**: solo entradas no nulas en la diagonal.
- **Triangular** (superior o inferior): ceros bajo o sobre la diagonal.
- **Simétrica**: $A^T = A$.
- **Ortogonal**: $A^T A = I$, equivale a $A^{-1} = A^T$. Conserva normas y ángulos.
- **Hermítica** (compleja): $A^H = A$, donde $A^H$ es la traspuesta conjugada.

> **Interpretación geométrica.** Multiplicar por una matriz es aplicar una transformación lineal: rotaciones, escalas, reflexiones, proyecciones, cizallas. Las columnas de $A$ son las imágenes de los vectores de la base canónica. Esto permite "ver" qué hace una matriz mirando solo sus columnas.

**Rango.** El **rango** de $A$ es el número de columnas (o filas) linealmente independientes. Equivale a la dimensión de la imagen de la transformación. Una matriz $n\\times n$ es invertible $\\iff$ rango $= n$.
`,
      },
      {
        id: "sistemas",
        title: "Sistemas lineales",
        keywords: ["Gauss", "Gauss-Jordan", "rango"],
        body: `
Un **sistema lineal** $A\\vec x = \\vec b$ con $A$ matriz $m\\times n$, $\\vec x$ vector incógnita en $\\mathbb R^n$ y $\\vec b \\in \\mathbb R^m$ resume $m$ ecuaciones lineales en $n$ incógnitas. Su análisis es la aplicación más concreta y útil del álgebra lineal.

**Teorema de Rouché-Frobenius.** Sea $\\bar A = [A | \\vec b]$ la matriz aumentada. Hay tres casos:

| Condición | Solución |
|-----------|----------|
| $\\text{rank}(A) = \\text{rank}(\\bar A) = n$ | Única |
| $\\text{rank}(A) = \\text{rank}(\\bar A) < n$ | Infinitas (con $n - \\text{rank}$ parámetros libres) |
| $\\text{rank}(A) < \\text{rank}(\\bar A)$ | Ninguna (sistema **incompatible**) |

**Eliminación gaussiana.** Algoritmo estándar para resolver sistemas (y para calcular rango, inversa y determinante). Aplica **operaciones elementales por filas**:

1. Intercambiar dos filas.
2. Multiplicar una fila por un escalar no nulo.
3. Sumar a una fila un múltiplo de otra.

Estas operaciones no cambian la solución del sistema. El objetivo es llevar $A$ a la **forma escalonada por filas**: cada fila empieza con más ceros que la anterior, y en cada fila no nula el primer elemento no nulo es 1 (pivote).

Luego se hace **sustitución hacia atrás** desde la última ecuación.

**Forma escalonada reducida (Gauss-Jordan).** Adicionalmente se anulan los elementos por encima de cada pivote. La solución se lee directamente.

**Ejemplo:** $x + 2y = 5$, $3x + 4y = 11$.

$$\\begin{pmatrix} 1 & 2 & | & 5 \\\\ 3 & 4 & | & 11 \\end{pmatrix} \\xrightarrow{R_2 - 3R_1} \\begin{pmatrix} 1 & 2 & | & 5 \\\\ 0 & -2 & | & -4 \\end{pmatrix} \\Rightarrow y = 2,\\; x = 1$$

> **Estabilidad numérica.** En la práctica computacional la eliminación pura puede acumular errores de redondeo. Se usa **pivoteo parcial** (intercambiar filas para que el pivote sea el de mayor valor absoluto) o **descomposiciones** (LU, QR, SVD) más estables.

**Sistemas homogéneos** ($\\vec b = \\vec 0$). Siempre tienen al menos la solución trivial $\\vec x = \\vec 0$. El conjunto de soluciones forma un subespacio (el **núcleo** o **kernel** de $A$). Su dimensión es $n - \\text{rank}(A)$ (teorema de la dimensión).
`,
      },
      {
        id: "determinante",
        title: "Determinante: el factor de escala del volumen",
        keywords: ["determinante", "volumen", "Cramer"],
        body: `
El **determinante** de una matriz cuadrada $A$ es un escalar $\\det A$ con dos interpretaciones complementarias:

1. **Algebraica**: $A$ es invertible $\\iff \\det A \\neq 0$.
2. **Geométrica**: $|\\det A|$ es el factor por el que la transformación lineal $A$ multiplica volúmenes (áreas en 2D, hipervolúmenes en general). El **signo** indica si conserva o invierte la orientación.

**Cálculo en dimensión baja:**

$$\\det\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} = ad - bc$$

Para $3\\times 3$ (regla de Sarrus):

$$\\det\\begin{pmatrix} a & b & c \\\\ d & e & f \\\\ g & h & i \\end{pmatrix} = aei + bfg + cdh - ceg - bdi - afh$$

Para matrices más grandes se usa **expansión de Laplace** por filas o columnas, o se reduce primero a forma triangular (donde $\\det$ es el producto de la diagonal).

**Propiedades clave:**

- $\\det(AB) = \\det A \\cdot \\det B$
- $\\det(A^T) = \\det A$
- $\\det(A^{-1}) = 1/\\det A$
- $\\det(\\alpha A) = \\alpha^n \\det A$ para $A$ de tamaño $n\\times n$
- Intercambiar dos filas cambia el signo de $\\det$.
- Multiplicar una fila por $\\alpha$ multiplica $\\det$ por $\\alpha$.
- Sumar a una fila múltiplo de otra **no cambia** $\\det$.
- Una matriz con dos filas iguales o proporcionales tiene $\\det = 0$.

**Regla de Cramer.** Para sistemas $A\\vec x = \\vec b$ con $A$ invertible:

$$x_i = \\frac{\\det A_i}{\\det A}$$

donde $A_i$ es $A$ con la columna $i$ reemplazada por $\\vec b$. Útil teóricamente; ineficiente computacionalmente para $n$ grande.

> **Aplicaciones del determinante.**
> - **Volumen**: el paralelepípedo generado por tres vectores en $\\mathbb R^3$ tiene volumen $|\\det[\\vec v_1\\;\\vec v_2\\;\\vec v_3]|$.
> - **Cambio de variable** en integrales múltiples: el factor jacobiano es $|\\det J|$.
> - **Wronskiano**: el determinante de una matriz de soluciones de una EDO indica si son linealmente independientes.
> - **Producto vectorial**: $\\vec u \\times \\vec v = \\det\\begin{pmatrix} \\vec i & \\vec j & \\vec k \\\\ u_1 & u_2 & u_3 \\\\ v_1 & v_2 & v_3 \\end{pmatrix}$.
`,
      },
      {
        id: "autovalores",
        title: "Autovalores y diagonalización",
        keywords: ["autovalor", "eigenvalue", "diagonalización"],
        body: `
Para una matriz cuadrada $A$, un escalar $\\lambda$ es un **autovalor** (eigenvalue) si existe un vector $\\vec v \\neq \\vec 0$ tal que:

$$A\\vec v = \\lambda \\vec v$$

El vector $\\vec v$ se llama **autovector** asociado a $\\lambda$. Geométricamente, $A$ no rota a $\\vec v$: solo lo escala (por $\\lambda$). Los autovectores marcan las **direcciones invariantes** de la transformación.

**Cálculo.** Reordenando: $(A - \\lambda I)\\vec v = \\vec 0$. Para que haya solución no trivial, debe ser $\\det(A - \\lambda I) = 0$. Esto es el **polinomio característico** $p(\\lambda)$, de grado $n$. Sus raíces son los autovalores.

Para cada autovalor, los autovectores asociados se obtienen resolviendo el sistema homogéneo $(A - \\lambda I)\\vec v = \\vec 0$.

**Ejemplo.** $A = \\begin{pmatrix} 4 & 1 \\\\ 2 & 3 \\end{pmatrix}$.

$$\\det(A - \\lambda I) = (4-\\lambda)(3-\\lambda) - 2 = \\lambda^2 - 7\\lambda + 10 = (\\lambda-5)(\\lambda-2)$$

Autovalores: $\\lambda_1 = 5$ con autovector $(1,1)^T$, $\\lambda_2 = 2$ con $(1,-2)^T$.

**Diagonalización.** Si $A$ tiene $n$ autovectores linealmente independientes, se puede escribir:

$$A = PDP^{-1}$$

donde $D$ es diagonal con los autovalores y $P$ tiene los autovectores en columnas. Esto **simplifica enormemente** los cálculos: $A^k = PD^kP^{-1}$, y elevar una diagonal es trivial.

**Cuándo es diagonalizable:**

- Si $A$ tiene $n$ autovalores distintos, sí.
- Si $A$ es simétrica real (o hermítica compleja), sí siempre, y $P$ se puede elegir ortogonal: $A = QDQ^T$.
- Si hay autovalores repetidos puede o no serlo; depende de si la **multiplicidad geométrica** (dimensión del espacio propio) iguala a la **algebraica** (multiplicidad como raíz del polinomio).

> **Aplicaciones espectaculares.**
> - **PCA (análisis de componentes principales)**: los autovectores de la matriz de covarianza dan las direcciones de máxima varianza de los datos. Base de la reducción de dimensión.
> - **Mecánica cuántica**: los observables son operadores hermíticos; sus autovalores son los valores medibles y los autovectores los estados propios.
> - **Modos normales** en vibraciones mecánicas: los autovalores de la matriz de rigidez dan las frecuencias propias.
> - **PageRank** de Google: el ranking de páginas web es esencialmente el autovector dominante de una matriz estocástica enorme.
> - **Cadenas de Markov**: la distribución estacionaria es el autovector de la matriz de transición con autovalor 1.

**Teorema espectral.** Toda matriz simétrica real es diagonalizable por una matriz ortogonal y todos sus autovalores son reales. Esta es una de las propiedades más importantes y bonitas del álgebra lineal.
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
    readingMinutes: 22,
    summary:
      "Tipos de EDO, métodos elementales y modelos canónicos. El lenguaje natural de la dinámica.",
    sections: [
      {
        id: "separables",
        title: "EDO de primer orden: separables y lineales",
        keywords: ["separable", "factor integrante", "lineal primer orden"],
        body: `
Una **ecuación diferencial ordinaria** (EDO) involucra una función desconocida y sus derivadas. El **orden** es el de la derivada más alta. Las EDO son la herramienta natural para describir sistemas que evolucionan en el tiempo (o en el espacio): poblaciones, circuitos, vibraciones, química, finanzas.

**Existencia y unicidad** (Picard-Lindelöf). Para $y' = f(t, y)$, $y(t_0) = y_0$, si $f$ y $\\partial f/\\partial y$ son continuas en una vecindad del dato inicial, existe una solución única en algún intervalo. Sin estas condiciones pueden fallar la existencia o la unicidad.

**Variables separables.** Si la EDO se puede escribir como:

$$\\frac{dy}{dx} = g(x)\\,h(y)$$

separamos e integramos:

$$\\int \\frac{dy}{h(y)} = \\int g(x)\\,dx$$

Ejemplo: $dy/dx = xy$. Separando, $dy/y = x\\,dx \\Rightarrow \\ln|y| = x^2/2 + C \\Rightarrow y = Ae^{x^2/2}$.

**Lineales de primer orden.** Tienen la forma:

$$y' + p(x)\\,y = q(x)$$

Se resuelven multiplicando por el **factor integrante** $\\mu(x) = e^{\\int p(x)\\,dx}$:

$$\\frac{d}{dx}(\\mu y) = \\mu q \\;\\Longrightarrow\\; y = \\frac{1}{\\mu}\\int \\mu\\,q\\,dx$$

Este truco transforma la EDO en una integración directa. Cubre muchísimos casos prácticos: circuitos RC y RL, modelos de mezclado, decaimientos con fuente externa.

> **Ejemplo (mezclado).** Un tanque tiene 100 L de salmuera. Entra agua pura a 5 L/min y sale la mezcla bien agitada a 5 L/min. ¿Cómo evoluciona la masa de sal $S(t)$? Por balance: $S' = -5\\,(S/100) = -S/20$, separable: $S(t) = S_0 e^{-t/20}$. La sal cae exponencialmente con constante 20 min.

**Otras formas de primer orden:**

- **Exactas**: $M(x,y)\\,dx + N(x,y)\\,dy = 0$ con $\\partial M/\\partial y = \\partial N/\\partial x$. La solución es $F(x,y) = C$.
- **Bernoulli**: $y' + p(x)y = q(x)y^n$. Sustitución $u = y^{1-n}$ la convierte en lineal.
- **Homogéneas**: $y' = f(y/x)$. Sustitución $v = y/x$ la convierte en separable.
`,
      },
      {
        id: "logistica",
        title: "Modelo logístico de crecimiento",
        keywords: ["logística", "Verhulst", "crecimiento poblacional"],
        body: `
El **modelo de crecimiento exponencial** $dN/dt = rN$ (sin restricciones) es irrealista a largo plazo: ninguna población crece indefinidamente. Verhulst (1838) propuso añadir un término que frene el crecimiento al acercarse a una **capacidad de carga** $K$:

$$\\frac{dN}{dt} = r N\\!\\left(1 - \\frac{N}{K}\\right)$$

Esta es la **ecuación logística**, una de las EDO más importantes de la biología matemática y de la dinámica no lineal.

**Análisis cualitativo:**

- $N = 0$ y $N = K$ son **puntos de equilibrio** ($dN/dt = 0$).
- $N = 0$ es inestable: cualquier pequeña población crece.
- $N = K$ es estable: si $N < K$ crece hacia $K$, si $N > K$ decrece hacia $K$.
- Crecimiento más rápido en $N = K/2$ (donde $d^2N/dt^2 = 0$, punto de inflexión).

**Solución analítica** (es separable):

$$N(t) = \\frac{K}{1 + \\left(\\dfrac{K - N_0}{N_0}\\right) e^{-rt}}$$

La curva resultante tiene forma de **S** (sigmoide): empieza con crecimiento casi exponencial, atraviesa un punto de inflexión y satura en $K$.

**Aplicaciones que van mucho más allá de la biología:**

| Campo | Aplicación |
|-------|------------|
| Ecología | Poblaciones de animales en hábitat limitado |
| Epidemiología | SIR simplificado (infectados acumulados) |
| Marketing | Adopción de un nuevo producto |
| Tecnología | Curvas de adopción (móviles, internet) |
| Aprendizaje automático | Función de activación logística (sigmoide) |
| Química | Cinética autocatalítica |

> **Cuidado con la versión discreta.** La ecuación logística discretizada $x_{n+1} = r\\,x_n(1-x_n)$ exhibe **caos determinista** para $r > 3{,}57$. Es uno de los ejemplos canónicos de cómo dinámicas muy simples pueden producir comportamientos extremadamente complejos. Lo descubrió Robert May en 1976 y abrió toda un área de la matemática.

La logística también admite extensiones: con **retardo** (Hutchinson), con **aprovechamiento** ($-h$), con dos especies (**Lotka-Volterra**), etc. Todas conservan su valor pedagógico como introducciones a la dinámica no lineal.
`,
        widget: "math-logistic",
      },
      {
        id: "segundo-orden",
        title: "EDO lineales de segundo orden con coeficientes constantes",
        keywords: ["coeficientes constantes", "característica", "oscilador"],
        body: `
Las EDO de segundo orden aparecen siempre que hay una **segunda derivada física** en juego: aceleración (Newton), curvatura, intensidad en circuitos. La forma genérica con coeficientes constantes es:

$$a y'' + b y' + c y = f(t)$$

**Ecuación homogénea** ($f = 0$). Buscamos soluciones de la forma $y = e^{\\lambda t}$. Sustituyendo: $a\\lambda^2 + b\\lambda + c = 0$, la **ecuación característica**. Tres casos según el discriminante $\\Delta = b^2 - 4ac$:

| $\\Delta$ | Raíces | Solución general |
|----------|--------|-------------------|
| $> 0$ | $\\lambda_1, \\lambda_2$ reales distintas | $C_1 e^{\\lambda_1 t} + C_2 e^{\\lambda_2 t}$ |
| $= 0$ | $\\lambda$ doble | $(C_1 + C_2 t) e^{\\lambda t}$ |
| $< 0$ | $\\alpha \\pm i\\beta$ | $e^{\\alpha t}(C_1\\cos\\beta t + C_2\\sin\\beta t)$ |

**Oscilador armónico.** Ejemplo prototípico: $m\\ddot x + kx = 0$. Característica $m\\lambda^2 + k = 0$, raíces $\\pm i\\omega_0$ con $\\omega_0 = \\sqrt{k/m}$. Solución: $x(t) = A\\cos\\omega_0 t + B\\sin\\omega_0 t = R\\cos(\\omega_0 t - \\varphi)$. Movimiento periódico de frecuencia $\\omega_0$.

**Oscilador amortiguado.** $m\\ddot x + c\\dot x + kx = 0$. Definiendo $\\zeta = c/(2\\sqrt{mk})$ (factor de amortiguamiento):

- $\\zeta < 1$ subamortiguado: oscilaciones decrecientes.
- $\\zeta = 1$ críticamente amortiguado: vuelve al equilibrio sin oscilar, lo más rápido posible.
- $\\zeta > 1$ sobreamortiguado: vuelve al equilibrio sin oscilar, más lento.

> **Diseño práctico.** Suspensiones de coche, puertas automáticas o brazos robóticos se diseñan típicamente cerca del amortiguamiento crítico ($\\zeta \\approx 0{,}7$) para combinar respuesta rápida con sobreoscilación tolerable.

**Ecuación no homogénea** ($f \\neq 0$). Solución general = solución homogénea + **solución particular** $y_p$. Métodos:

- **Coeficientes indeterminados**: probar la forma de $y_p$ según la forma de $f$ (polinomio, exponencial, seno-coseno).
- **Variación de parámetros**: técnica más general, requiere la solución homogénea.

**Resonancia.** Si $f(t) = F\\cos(\\omega t)$ y $\\omega$ coincide con la frecuencia natural $\\omega_0$ del sistema sin amortiguamiento, la amplitud de $y_p$ **diverge linealmente con el tiempo**. La resonancia explica el colapso del puente de Tacoma Narrows (1940), por qué un columpio se eleva con pequeños empujes sincronizados, y la base de la afinación de instrumentos musicales.
`,
      },
    ],
  },
  {
    slug: "analisis-fourier",
    title: "Análisis de Fourier",
    category: "matematica",
    level: "avanzado",
    readingMinutes: 18,
    summary:
      "Series, transformada y aplicaciones a señales. Cualquier señal se descompone en oscilaciones puras.",
    sections: [
      {
        id: "serie",
        title: "Series de Fourier",
        keywords: ["serie de Fourier", "armónico", "ortogonalidad"],
        body: `
La idea revolucionaria de Joseph Fourier (1807, en su trabajo sobre conducción de calor) fue que **toda función periódica razonable** se puede escribir como suma —posiblemente infinita— de senos y cosenos:

$$f(x) = \\frac{a_0}{2} + \\sum_{n=1}^\\infty \\left[a_n\\cos\\!\\left(\\frac{2\\pi nx}{T}\\right) + b_n\\sin\\!\\left(\\frac{2\\pi nx}{T}\\right)\\right]$$

con $T$ el periodo. Los coeficientes se calculan por proyección sobre cada armónico:

$$a_n = \\frac{2}{T}\\int_0^T f(x)\\cos\\!\\left(\\frac{2\\pi nx}{T}\\right)\\,dx, \\qquad b_n = \\frac{2}{T}\\int_0^T f(x)\\sin\\!\\left(\\frac{2\\pi nx}{T}\\right)\\,dx$$

**Por qué funciona.** Las funciones $\\{\\cos(n\\omega x), \\sin(n\\omega x)\\}$ forman un **conjunto ortogonal** en el sentido del producto interno $\\langle f, g\\rangle = \\int_0^T fg\\,dx$. Ortogonal significa que la integral del producto de dos funciones distintas es cero. Es como una **base ortogonal** infinitodimensional para el espacio de funciones, y los coeficientes son las "coordenadas" de $f$ en esa base.

**Forma compleja** (más compacta y elegante):

$$f(x) = \\sum_{n=-\\infty}^\\infty c_n\\,e^{2\\pi i n x/T}, \\qquad c_n = \\frac{1}{T}\\int_0^T f(x)\\,e^{-2\\pi i n x/T}\\,dx$$

**Convergencia.** El teorema de Dirichlet dice que si $f$ es seccionalmente continua y tiene un número finito de extremos por periodo, la serie converge a $f(x)$ donde $f$ es continua y al promedio $\\tfrac{1}{2}[f(x^-)+f(x^+)]$ en las discontinuidades.

> **Fenómeno de Gibbs.** En las discontinuidades, las sumas parciales sobrepasan el valor real en un ~9 % invariablemente, sin importar cuántos términos tomes. Es una característica intrínseca de la convergencia puntual y aparece en compresión de imágenes, conversión digital-analógica, y como artefactos visuales típicos en JPG.

**Aplicaciones musicales.** Una nota de violín y la misma nota de un piano tienen la misma frecuencia fundamental pero distinta serie de armónicos (los $a_n, b_n$): es lo que el oído percibe como **timbre**. La síntesis aditiva de sonidos es construir directamente las series de Fourier deseadas.

**Igualdad de Parseval** (conservación de energía):

$$\\frac{1}{T}\\int_0^T |f(x)|^2\\,dx = \\sum_{n=-\\infty}^\\infty |c_n|^2$$

La energía total de la señal se reparte entre todos los armónicos.
`,
        widget: "math-fourier",
      },
      {
        id: "transformada",
        title: "Transformada de Fourier",
        keywords: ["FT", "espectro", "frecuencia"],
        body: `
La serie de Fourier requiere periodicidad. Para señales **no periódicas** (un pulso, una respuesta transitoria) generalizamos haciendo $T \\to \\infty$. El resultado es la **transformada de Fourier**:

$$\\hat f(\\omega) = \\int_{-\\infty}^\\infty f(t)\\,e^{-i\\omega t}\\,dt$$

con su inversa:

$$f(t) = \\frac{1}{2\\pi}\\int_{-\\infty}^\\infty \\hat f(\\omega)\\,e^{i\\omega t}\\,d\\omega$$

Convierte una función del **dominio del tiempo** $f(t)$ en una función del **dominio de la frecuencia** $\\hat f(\\omega)$. Las dos representaciones contienen la misma información: son maneras complementarias de mirar la misma señal.

**Propiedades fundamentales** (suponiendo $f \\leftrightarrow \\hat f$):

| Propiedad | Tiempo | Frecuencia |
|-----------|--------|------------|
| Linealidad | $\\alpha f + \\beta g$ | $\\alpha \\hat f + \\beta \\hat g$ |
| Desplazamiento | $f(t-t_0)$ | $\\hat f(\\omega)\\,e^{-i\\omega t_0}$ |
| Modulación | $f(t)\\,e^{i\\omega_0 t}$ | $\\hat f(\\omega - \\omega_0)$ |
| Escalado | $f(at)$ | $\\frac{1}{|a|}\\hat f(\\omega/a)$ |
| Derivada | $f'(t)$ | $i\\omega\\hat f(\\omega)$ |
| **Convolución** | $(f * g)(t)$ | $\\hat f(\\omega)\\hat g(\\omega)$ |

La última, el **teorema de la convolución**, es la razón profunda de por qué Fourier es tan útil en procesamiento de señales: la convolución (que es complicada) se vuelve **producto** (trivial) en el dominio de frecuencia. Filtrar una señal es multiplicar su espectro por la "función de transferencia" del filtro.

**Pares notables:**

| $f(t)$ | $\\hat f(\\omega)$ |
|--------|---------------------|
| $\\delta(t)$ | $1$ |
| $1$ | $2\\pi\\delta(\\omega)$ |
| $e^{-at}u(t)$, $a>0$ | $1/(a + i\\omega)$ |
| $e^{-t^2/2}$ | $\\sqrt{2\\pi}\\,e^{-\\omega^2/2}$ |
| Rectángulo ancho $T$ | $T\\,\\text{sinc}(\\omega T/2)$ |

> **Principio de incertidumbre.** Una señal muy concentrada en el tiempo tiene un espectro muy ancho, y viceversa: $\\Delta t \\cdot \\Delta\\omega \\geq 1/2$. Es matemáticamente equivalente al principio de Heisenberg en mecánica cuántica.

**Versión discreta y FFT.** Para señales muestreadas se usa la **transformada discreta de Fourier (DFT)**, que la **FFT** (Cooley-Tukey, 1965) calcula en $O(N\\log N)$ en vez de $O(N^2)$. Sin la FFT no existirían el JPEG, el MP3, las imágenes médicas (RM, TAC), las telecomunicaciones modernas ni los radiotelescopios.

**Aplicaciones cotidianas:** ecualizador de audio (multiplica el espectro por una curva), eliminación de ruido (poner a cero ciertas frecuencias), reconocimiento de voz (extracción de características espectrales), compresión de imágenes JPEG (DCT, prima cercana de la FT), análisis espectral en química (resonancia magnética nuclear, espectroscopía).
`,
      },
    ],
  },
  {
    slug: "probabilidad-estadistica",
    title: "Probabilidad y estadística",
    category: "matematica",
    level: "intermedio",
    readingMinutes: 22,
    summary:
      "Distribuciones, esperanza, varianza, teorema central del límite. La matemática de lo incierto.",
    sections: [
      {
        id: "espacios",
        title: "Espacios de probabilidad",
        keywords: ["σ-álgebra", "probabilidad", "evento"],
        body: `
La fundación moderna de la probabilidad (Kolmogorov, 1933) se basa en tres ingredientes:

- $\\Omega$: **espacio muestral**, el conjunto de todos los resultados posibles.
- $\\mathcal F$: $\\sigma$-**álgebra** de subconjuntos de $\\Omega$ (los **eventos**), cerrada bajo unión numerable y complemento.
- $P: \\mathcal F \\to [0,1]$: **medida de probabilidad** que cumple:
  - $P(\\Omega) = 1$,
  - $P(\\emptyset) = 0$,
  - **$\\sigma$-aditividad**: $P\\!\\left(\\bigcup_i A_i\\right) = \\sum_i P(A_i)$ para una unión numerable de eventos disjuntos.

A partir de estos tres axiomas se deducen todas las propiedades:

- $P(A^c) = 1 - P(A)$
- $P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$
- Si $A \\subseteq B$, $P(A) \\leq P(B)$
- $P(A) \\leq 1$ para todo evento.

**Probabilidad condicional.** Dado que $B$ ha ocurrido, la probabilidad de $A$ es:

$$P(A | B) = \\frac{P(A \\cap B)}{P(B)}, \\qquad P(B) > 0$$

**Independencia.** Eventos $A$ y $B$ son independientes si $P(A \\cap B) = P(A)\\,P(B)$, equivalentemente $P(A|B) = P(A)$: saber que $B$ ocurrió no cambia la probabilidad de $A$.

**Teorema de Bayes.** Punto de encuentro entre la probabilidad y la inferencia:

$$P(A|B) = \\frac{P(B|A)\\,P(A)}{P(B)}$$

Permite **invertir** una condicional. Es la base de la estadística bayesiana, el filtro spam, los sistemas de diagnóstico médico y la inferencia en machine learning probabilístico.

> **Paradoja de Monty Hall.** Tres puertas, premio detrás de una. Eliges una; el presentador (que sabe dónde está el premio) abre **otra** puerta vacía. ¿Cambias tu elección? Bayes responde: sí, hay 2/3 de probabilidad detrás de la otra puerta. La intuición falla porque ignora la información que da la elección del presentador.

**Variables aleatorias.** Funciones $X: \\Omega \\to \\mathbb R$ que asignan un número a cada resultado. **Discretas** si toman valores en un conjunto numerable; **continuas** si distribuyen su probabilidad mediante una densidad $f_X(x)$ tal que $P(a \\leq X \\leq b) = \\int_a^b f_X$.
`,
      },
      {
        id: "distribuciones",
        title: "Distribuciones de probabilidad comunes",
        keywords: ["binomial", "Poisson", "normal", "exponencial"],
        body: `
Aunque infinitas distribuciones son posibles, un puñado aparece una y otra vez en aplicaciones. Conviene memorizar sus propiedades básicas.

| Distribución | PMF / PDF | Media | Varianza | Aparece en |
|--------------|-----------|-------|----------|------------|
| Bernoulli($p$) | $p^k(1-p)^{1-k}$, $k\\in\\{0,1\\}$ | $p$ | $p(1-p)$ | Un único experimento sí/no |
| Binomial($n,p$) | $\\binom{n}{k}p^k(1-p)^{n-k}$ | $np$ | $np(1-p)$ | $n$ ensayos Bernoulli iid |
| Geométrica($p$) | $(1-p)^{k-1}p$ | $1/p$ | $(1-p)/p^2$ | Nº ensayos hasta el primer éxito |
| Poisson($\\lambda$) | $\\lambda^k e^{-\\lambda}/k!$ | $\\lambda$ | $\\lambda$ | Eventos raros en un intervalo |
| Uniforme($a,b$) | $1/(b-a)$ | $(a+b)/2$ | $(b-a)^2/12$ | Sin información previa |
| Exponencial($\\lambda$) | $\\lambda e^{-\\lambda x}$ | $1/\\lambda$ | $1/\\lambda^2$ | Tiempos entre eventos Poisson |
| Normal($\\mu,\\sigma^2$) | $\\dfrac{1}{\\sigma\\sqrt{2\\pi}}e^{-(x-\\mu)^2/(2\\sigma^2)}$ | $\\mu$ | $\\sigma^2$ | Promedios, errores |
| $\\chi^2_n$ | (compleja) | $n$ | $2n$ | Sumas de normales² |
| Student-$t_n$ | (compleja) | $0$ | $n/(n-2)$ | Inferencia con muestras pequeñas |

**Propiedades clave de la normal.**

- Es **simétrica** alrededor de la media, en forma de campana.
- El 68 % de la probabilidad está en $\\mu \\pm \\sigma$, el 95 % en $\\mu \\pm 2\\sigma$, el 99,7 % en $\\mu \\pm 3\\sigma$.
- Estandarización: si $X \\sim \\mathcal N(\\mu, \\sigma^2)$, entonces $Z = (X-\\mu)/\\sigma \\sim \\mathcal N(0,1)$.
- Suma de normales independientes es normal.

**Conexiones entre distribuciones:**

- Binomial$(n, \\lambda/n) \\to$ Poisson$(\\lambda)$ cuando $n \\to \\infty$.
- Poisson$(\\lambda) \\to \\mathcal N(\\lambda, \\lambda)$ para $\\lambda$ grande.
- $\\sum_{i=1}^n Z_i^2 \\sim \\chi^2_n$ con $Z_i \\sim \\mathcal N(0,1)$ iid.
- $\\bar X / (S/\\sqrt n) \\sim t_{n-1}$ con muestra de normal.

> **Esperanza y varianza.** Para variable continua $E[X] = \\int x f(x)\\,dx$; varianza $\\text{Var}(X) = E[(X-\\mu)^2] = E[X^2] - \\mu^2$. Linealidad: $E[aX+b] = aE[X]+b$, $\\text{Var}(aX+b) = a^2\\text{Var}(X)$. Para suma de **independientes**: la varianza es aditiva ($\\text{Var}(X+Y) = \\text{Var}(X) + \\text{Var}(Y)$).

**Función generadora de momentos.** $M_X(t) = E[e^{tX}]$. Cuando existe, sus derivadas en 0 dan los momentos: $E[X^n] = M_X^{(n)}(0)$. Útil para identificar distribuciones por su MGF.
`,
      },
      {
        id: "tcl",
        title: "Teorema central del límite",
        keywords: ["TCL", "central del límite", "promedio muestral"],
        body: `
El **teorema central del límite** (TCL) es uno de los resultados más profundos y útiles de la matemática. Explica por qué la **distribución normal** aparece tan a menudo en la naturaleza, incluso cuando los datos individuales no son normales.

**Enunciado básico.** Sean $X_1, X_2, \\ldots$ variables aleatorias independientes e idénticamente distribuidas (iid) con media $\\mu$ y varianza $\\sigma^2$ finita. Sea $\\bar X_n = (X_1 + \\ldots + X_n)/n$. Entonces:

$$\\frac{\\bar X_n - \\mu}{\\sigma/\\sqrt n} \\xrightarrow{d} \\mathcal N(0, 1) \\;\\;\\text{cuando}\\;\\; n \\to \\infty$$

En palabras: el promedio muestral, **convenientemente estandarizado**, converge en distribución a la normal estándar, **sea cual sea la distribución original** de los $X_i$ (con tal de que tenga varianza finita). Es genuinamente sorprendente.

**Implicaciones prácticas.**

1. La media de $n$ mediciones tiene distribución aproximadamente normal con media $\\mu$ y desviación $\\sigma/\\sqrt n$. Es la base del **error estándar**: medir $n$ veces y promediar reduce el error en $\\sqrt n$.
2. Cualquier magnitud que sea **suma de muchos efectos pequeños independientes** será aproximadamente normal: errores de medición, alturas, tiempos de reacción, calificaciones de exámenes...
3. Justifica usar la normal en muchos tests estadísticos aunque la distribución original no sea normal.

**Variantes y extensiones.**

- **Lindeberg-Lévy** (versión clásica iid).
- **Lindeberg-Feller**: para variables independientes pero no idénticamente distribuidas, bajo una condición sobre las colas.
- **TCL multivariado**: para vectores aleatorios, converge a normal multivariada.
- **TCL para martingalas, procesos estacionarios, sumas dependientes**: hay generalizaciones específicas.

> **Cuándo falla.** Si la varianza no es finita (distribuciones de cola pesada como Cauchy o algunas Pareto), el TCL no aplica. Estas distribuciones son cruciales en finanzas, donde subestimar la probabilidad de eventos extremos puede llevar a desastres (LTCM 1998, crisis de 2008).

**Inferencia estadística basada en TCL.**

- **Intervalo de confianza para la media** (varianza conocida): $\\bar X \\pm z_{\\alpha/2} \\cdot \\sigma/\\sqrt n$.
- **Test de hipótesis** sobre la media: estadístico $Z = (\\bar X - \\mu_0)/(\\sigma/\\sqrt n) \\sim \\mathcal N(0,1)$ bajo H₀.
- Cuando $\\sigma$ se estima de la muestra: usar Student-$t$ con $n-1$ grados de libertad.

El TCL es el "puente" entre la teoría de la probabilidad y la práctica de la estadística aplicada.
`,
      },
    ],
  },
  {
    slug: "metodos-numericos",
    title: "Métodos numéricos",
    category: "matematica",
    level: "avanzado",
    readingMinutes: 18,
    summary:
      "Algoritmos para resolver problemas matemáticos con un computador: raíces, integrales, sistemas y EDO.",
    sections: [
      {
        id: "newton",
        title: "Newton–Raphson para encontrar raíces",
        keywords: ["Newton", "raíz", "convergencia cuadrática"],
        body: `
Encontrar raíces (soluciones de $f(x) = 0$) es un problema omnipresente: equilibrios químicos, intersecciones geométricas, reglajes de modelos, optimización. Cuando no hay fórmula cerrada se recurre a iteración numérica.

**Newton-Raphson** es el método más utilizado por su rapidez. La idea: linealizar $f$ alrededor de $x_n$ usando la tangente, y tomar como nueva aproximación la raíz de esa recta:

$$x_{n+1} = x_n - \\frac{f(x_n)}{f'(x_n)}$$

**Convergencia cuadrática.** Si la aproximación inicial es buena y $f'(x^*) \\neq 0$, el error se **eleva al cuadrado** en cada iteración: si tienes 2 cifras correctas en una iteración, tendrás 4 en la siguiente, 8 en la próxima, etc. Es asombrosamente rápido.

Formalmente, si $e_n = x_n - x^*$, entonces $e_{n+1} \\approx \\dfrac{f''(x^*)}{2f'(x^*)}\\,e_n^2$.

**Cuándo falla:**

- Si $f'(x^*) = 0$ (raíz múltiple), la convergencia es solo lineal.
- Si la aproximación inicial está lejos, puede divergir o oscilar.
- Si la derivada se anula en alguna iteración, el método explota.
- Funciones con tangentes muy planas o muy verticales generan iteraciones erráticas.

> **Ejemplo.** Calcular $\\sqrt 2$ resolviendo $x^2 - 2 = 0$. Newton da $x_{n+1} = (x_n + 2/x_n)/2$. Partiendo de $x_0 = 1$: 1, 1.5, 1.4166..., 1.41421..., 1.4142135623... Cuatro iteraciones bastan para 10 cifras. Este es un caso particular del método babilónico de extracción de raíces, que tiene **3000 años de antigüedad**.

**Variantes:**

- **Bisección**: lenta pero infalible (siempre converge si $f$ es continua y cambia de signo). Reduce el intervalo a la mitad cada paso.
- **Secante**: como Newton pero aproximando $f'$ con cociente de diferencias. Útil cuando $f'$ es difícil de calcular.
- **Brent**: combina lo robusto de bisección con lo rápido de secante. Es el método por defecto en muchas librerías (SciPy, MATLAB).
- **Newton multivariable**: $\\vec x_{n+1} = \\vec x_n - J(\\vec x_n)^{-1} F(\\vec x_n)$, con $J$ el jacobiano. Permite resolver sistemas no lineales de varias ecuaciones.

**Aplicación: optimización.** Para encontrar mínimos, aplicar Newton a $f'(x) = 0$ da $x_{n+1} = x_n - f'(x_n)/f''(x_n)$. La generalización en varias dimensiones (con la matriz hessiana) es el método de Newton para optimización. Variantes cuasi-Newton (BFGS, L-BFGS) aproximan la hessiana cuando es muy costosa: son los caballos de batalla del aprendizaje automático.
`,
        widget: "math-newton-raphson",
      },
      {
        id: "cuadratura",
        title: "Cuadratura numérica: integración aproximada",
        keywords: ["trapecio", "Simpson", "integración numérica"],
        body: `
Cuando una integral no tiene primitiva elemental (o sí pero es engorrosa), se aproxima numéricamente subdividiendo el intervalo $[a,b]$ en $n$ subintervalos de ancho $h = (b-a)/n$.

**Regla del rectángulo (punto medio).** Sustituye $f$ por el valor en el punto medio de cada subintervalo:

$$\\int_a^b f(x)\\,dx \\approx h\\sum_{i=0}^{n-1} f\\!\\left(a + (i + \\tfrac{1}{2})h\\right)$$

Error: $O(h^2)$.

**Regla del trapecio.** Aproxima $f$ por una recta en cada subintervalo:

$$\\int_a^b f(x)\\,dx \\approx \\frac{h}{2}\\left[f(a) + 2\\sum_{i=1}^{n-1} f(a+ih) + f(b)\\right]$$

Error: $O(h^2)$. Sencilla y muy usada.

**Regla de Simpson.** Aproxima $f$ por **parábolas** en pares de subintervalos. Requiere $n$ par:

$$\\int_a^b f \\approx \\frac{h}{3}\\left[f(a) + 4\\!\\sum_{i\\,\\text{impar}} f_i + 2\\!\\sum_{i\\,\\text{par}} f_i + f(b)\\right]$$

Error: $O(h^4)$. Mucho más precisa con el mismo número de evaluaciones; es **exacta** para polinomios de hasta grado 3.

**Cuadratura de Gauss-Legendre.** En vez de espaciar uniformemente los nodos, los elige óptimamente: con $n$ nodos integra exactamente polinomios de grado $2n-1$. Es el estándar en cálculos científicos serios.

**Métodos adaptativos.** Refinan automáticamente la malla en regiones donde $f$ varía rápidamente. La función `quad` de SciPy o `integral` de MATLAB usan adaptativo de Gauss-Kronrod.

> **Cuándo qué.** Para funciones suaves, Simpson o Gauss-Legendre. Para funciones con discontinuidades o picos, métodos adaptativos. Para integrales en muchas dimensiones, **Monte Carlo** (siguiente sección): el error escala como $1/\\sqrt n$ independientemente de la dimensión, mientras que la cuadratura clásica sufre la "maldición de la dimensionalidad" ($n^d$ evaluaciones para $d$ dimensiones).

**Integración impropia.** Para $\\int_0^\\infty$ o integrandos con singularidades, se hacen cambios de variable o se usa integración exponencial doble (tanh-sinh), notablemente robusta cerca de los extremos.
`,
      },
      {
        id: "rk",
        title: "Métodos numéricos para EDO: Runge–Kutta de orden 4",
        keywords: ["RK4", "EDO numérica"],
        body: `
Para resolver $y' = f(t, y)$ con $y(t_0) = y_0$ se discretiza el tiempo en pasos $h$ y se construye una sucesión $y_0, y_1, y_2, \\ldots$.

**Método de Euler explícito** (el más simple):

$$y_{n+1} = y_n + h\\,f(t_n, y_n)$$

Es solo de orden 1: el error global es $O(h)$. Inestable y poco preciso. Útil pedagógicamente; rara vez en producción.

**Métodos de Runge–Kutta.** Combinan varias evaluaciones de $f$ en el intervalo $[t_n, t_n + h]$ para mejorar drásticamente la precisión. El **RK4** clásico es:

$$\\begin{aligned}
k_1 &= f(t_n, y_n) \\\\
k_2 &= f(t_n + h/2,\\, y_n + h\\,k_1/2) \\\\
k_3 &= f(t_n + h/2,\\, y_n + h\\,k_2/2) \\\\
k_4 &= f(t_n + h,\\, y_n + h\\,k_3) \\\\
y_{n+1} &= y_n + \\tfrac{h}{6}(k_1 + 2k_2 + 2k_3 + k_4)
\\end{aligned}$$

Error global $O(h^4)$ con cuatro evaluaciones por paso. Es el método "estándar" para problemas no rígidos: se enseña primero, se usa en simulaciones físicas, animación, juegos, etc.

**Métodos adaptativos (RKF45, Dormand-Prince).** Calculan dos estimaciones de orden distinto y usan su diferencia como **estimador del error local**. Si el error es muy grande, reducen $h$; si es muy pequeño, lo agrandan. Mantienen el error por debajo de una tolerancia con el menor coste posible. Son los que llaman las funciones `solve_ivp` de SciPy o `ode45` de MATLAB.

**Métodos implícitos.** Para problemas **rígidos** (donde la solución tiene escalas temporales muy distintas, típico en cinética química o circuitos con elementos muy dispares), los métodos explícitos exigen pasos minúsculos por estabilidad. Métodos implícitos (Euler implícito, BDF, Radau) son más robustos pero requieren resolver una ecuación no lineal en cada paso (con Newton).

**Sistemas y orden superior.** Una EDO de orden $n$ se reduce a un sistema de $n$ EDO de orden 1 introduciendo variables auxiliares. Por ejemplo, $\\ddot x = -\\omega^2 x$ se reescribe como $\\dot x = v$, $\\dot v = -\\omega^2 x$, y se aplica RK4 al sistema vectorial.

> **Conservación de energía.** En sistemas hamiltonianos (mecánica clásica sin fricción), métodos generales como RK4 acumulan deriva energética. Existen **integradores simplécticos** (Verlet, Leapfrog) que conservan exactamente o casi exactamente la energía a largo plazo. Son los preferidos en simulación molecular y dinámica orbital, donde se simulan miles de millones de pasos.

**Errores y estabilidad.** El error global crece como $K\\,h^p$ con $p$ el orden del método y $K$ dependiente de $f$ y del intervalo. Pero también hay un **error de redondeo** que crece con el número de pasos. Por eso reducir $h$ ad infinitum no mejora la precisión; hay un $h$ óptimo.
`,
      },
    ],
  },
  {
    slug: "geometria-analitica",
    title: "Geometría analítica",
    category: "matematica",
    level: "introductorio",
    readingMinutes: 14,
    summary:
      "Recta, circunferencia, cónicas y vectores en el plano. La geometría traducida al lenguaje del álgebra.",
    sections: [
      {
        id: "recta",
        title: "La recta y sus formas",
        keywords: ["recta", "pendiente", "ecuación general"],
        body: `
Descartes (1637) tuvo la idea revolucionaria de asignar coordenadas a los puntos del plano. Eso convirtió cada figura geométrica en una ecuación algebraica, y permitió usar las herramientas del álgebra para estudiar geometría. Aunque parezca elemental hoy, fue un cambio de paradigma.

**Distintas formas de la ecuación de una recta** (todas equivalentes):

| Forma | Ecuación | Cuándo usarla |
|-------|----------|---------------|
| Punto-pendiente | $y - y_0 = m(x - x_0)$ | Conoces un punto y la pendiente |
| Pendiente-ordenada | $y = mx + b$ | Quieres expresar $y$ en función de $x$ |
| Cartesiana / general | $Ax + By + C = 0$ | Forma estándar; útil para distancias |
| Segmentaria | $x/a + y/b = 1$ | Conoces los cortes con los ejes |
| Paramétrica | $\\vec r(t) = \\vec r_0 + t\\vec v$ | Movimiento, geometría 3D |

**Pendiente.** Si $(x_1,y_1)$ y $(x_2,y_2)$ son dos puntos de la recta:

$$m = \\frac{y_2 - y_1}{x_2 - x_1}$$

Si $m = 0$ la recta es horizontal; si $m$ no existe ($x_1 = x_2$), es vertical.

**Paralelismo y perpendicularidad.** Dos rectas con pendientes $m_1$ y $m_2$:

- Paralelas: $m_1 = m_2$.
- Perpendiculares: $m_1\\,m_2 = -1$ (excepto los casos vertical/horizontal, paralelos a los ejes).

**Distancias y ángulos.**

- **Distancia entre puntos**: $d = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}$.
- **Distancia de un punto a una recta** $Ax + By + C = 0$: $d = |Ax_0 + By_0 + C|/\\sqrt{A^2+B^2}$.
- **Ángulo entre dos rectas**: $\\tan\\theta = |(m_1 - m_2)/(1 + m_1 m_2)|$.

> **Generalización a 3D.** En el espacio una recta se describe paramétricamente $\\vec r(t) = \\vec r_0 + t\\vec v$ o como intersección de dos planos. Un único $Ax + By + Cz + D = 0$ ya describe un **plano**, no una recta.
`,
      },
      {
        id: "conicas",
        title: "Las cónicas: circunferencia, elipse, parábola, hipérbola",
        keywords: ["circunferencia", "elipse", "parábola", "hipérbola"],
        body: `
Las **cónicas** son las curvas que se obtienen al cortar un cono circular recto con un plano (de ahí su nombre, debido a Apolonio, s. III a.C.). Según el ángulo del corte aparecen circunferencia, elipse, parábola o hipérbola. Algebraicamente son las soluciones de una ecuación cuadrática general en $x$, $y$:

$$Ax^2 + Bxy + Cy^2 + Dx + Ey + F = 0$$

El **discriminante** $B^2 - 4AC$ las clasifica: $<0$ elipse (incluyendo circunferencia si $A=C$, $B=0$), $=0$ parábola, $>0$ hipérbola.

**Formas canónicas (centradas en el origen, ejes paralelos a los coordenados):**

| Cónica | Ecuación | Parámetros |
|--------|----------|------------|
| Circunferencia | $x^2 + y^2 = r^2$ | radio $r$ |
| Elipse | $\\dfrac{x^2}{a^2} + \\dfrac{y^2}{b^2} = 1$ | semiejes $a, b$ |
| Parábola | $y^2 = 4px$ | distancia focal $p$ |
| Hipérbola | $\\dfrac{x^2}{a^2} - \\dfrac{y^2}{b^2} = 1$ | semiejes $a, b$ |

**Definición por focos** (alternativa, muy elegante):

- **Elipse**: lugar de puntos cuya **suma** de distancias a dos focos es constante.
- **Hipérbola**: lugar de puntos cuya **diferencia** de distancias a dos focos (en valor absoluto) es constante.
- **Parábola**: lugar equidistante de un foco y una directriz.

**Excentricidad** $e$: $0$ para circunferencia, $0 < e < 1$ elipse, $e = 1$ parábola, $e > 1$ hipérbola. Mide cuánto se aleja de ser una circunferencia.

**Aplicaciones físicas notables:**

- **Órbitas planetarias**: Kepler descubrió que son **elipses** con el Sol en uno de los focos (1ª ley). Los cometas pueden tener trayectorias parabólicas o hiperbólicas si su energía no los liga al Sol.
- **Antenas parabólicas y telescopios**: la propiedad reflectora de la parábola concentra los rayos paralelos en el foco. Por eso las antenas funcionan.
- **Faros de coche**: la fuente está en el foco; la parábola convierte la luz en un haz paralelo.
- **Susurraderos elípticos**: si te paras en un foco y susurras, alguien en el otro foco te oye nítidamente. Las cúpulas y galerías elípticas (St. Paul, Capitolio de EE.UU.) lo demuestran.
- **Hipérbolas en navegación LORAN**: midiendo diferencias de tiempo entre señales, la posición del barco está sobre una hipérbola con focos en las dos torres.

> **Rotación y traslación.** Si la cónica no está alineada con los ejes ni centrada, los términos $Bxy$, $Dx$, $Ey$ no son cero. Una **rotación** (matriz ortogonal) elimina el $Bxy$; una **traslación** (cambio de origen) elimina $Dx$ y $Ey$. Tras estas dos transformaciones la cónica vuelve a su forma canónica.
`,
        widget: "math-conic",
      },
    ],
  },
];
