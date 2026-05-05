import type { Article } from "@/lib/articles";

export const ENGINEERING_ARTICLES: Article[] = [
  {
    slug: "control-automatico",
    title: "Control automático",
    category: "ingenieria",
    level: "intermedio",
    readingMinutes: 26,
    summary:
      "Realimentación, función de transferencia, PID, sintonía y estabilidad: del regulador de Watt al control moderno.",
    sections: [
      {
        id: "historia",
        title: "Origen histórico",
        keywords: ["Watt", "Maxwell", "historia control", "cibernética"],
        body: `
La historia del control automático se remonta al **siglo III a.C.**, cuando Ctesibio de Alejandría diseñó relojes de agua con flotadores que mantenían el nivel constante. Sin embargo, la **revolución industrial** marcó el verdadero nacimiento del campo: en **1788, James Watt** acopló a su máquina de vapor un *governor* (regulador centrífugo) que ajustaba la apertura de la válvula según la velocidad de rotación, evitando embalamientos y caídas bruscas.

El análisis matemático llegó en **1868**, cuando **James Clerk Maxwell** publicó *On Governors*, demostrando que la estabilidad podía estudiarse mediante las raíces de un polinomio característico. **Routh (1877)** y **Hurwitz (1895)** dieron criterios algebraicos para decidir estabilidad sin calcular raíces. En la **Segunda Guerra Mundial**, **Norbert Wiener** (servomecanismos antiaéreos) y **Bode**, **Nyquist** y **Nichols** (en Bell Labs, controlando amplificadores telefónicos) consolidaron la teoría clásica de la frecuencia. La era moderna arrancó con **Kalman (1960)** y la representación en espacio de estados, base del control óptimo y de filtros de ruido en la era espacial.

Hoy todo —desde un termostato a un cohete reutilizable— depende de estas mismas ideas.
`,
      },
      {
        id: "realimentacion",
        title: "Realimentación: la idea fundamental",
        keywords: ["lazo cerrado", "feedback", "error", "perturbación"],
        body: `
Un **controlador** compara la salida medida $y(t)$ con una referencia $r(t)$ y produce una señal de control $u(t)$ que actúa sobre la **planta** (el sistema físico a regular). El error es:

$$e(t) = r(t) - y(t)$$

**Glosario de símbolos:**

| Símbolo | Significado | Unidad típica |
|---------|-------------|---------------|
| $r(t)$ | Referencia o consigna (*setpoint*) | depende de la planta |
| $y(t)$ | Salida medida | misma que $r$ |
| $e(t)$ | Error | misma que $r$ |
| $u(t)$ | Acción de control | volts, %, etc. |
| $d(t)$ | Perturbación externa | — |

**Ventajas del lazo cerrado** frente al control en lazo abierto:

1. **Rechazo de perturbaciones**: si $d(t)$ empuja la salida, el error crece y el controlador reacciona.
2. **Robustez al modelo**: errores en los parámetros se compensan parcialmente.
3. **Linealización efectiva**: incluso plantas no lineales se comportan más “limpiamente”.

El precio es la posibilidad de **inestabilidad**: una ganancia excesiva puede generar oscilaciones crecientes.

**Ejemplo cotidiano.** Un termostato lee la temperatura ambiente ($y$), la compara con la deseada ($r=20\\,°\\mathrm{C}$) y enciende o apaga la caldera ($u\\in\\{0,1\\}$). Cuando alguien abre una ventana ($d$), la temperatura cae, el error sube y la caldera se enciende automáticamente.
`,
      },
      {
        id: "transferencia",
        title: "Función de transferencia",
        keywords: ["Laplace", "transferencia", "polo", "cero", "estabilidad"],
        body: `
Para un sistema lineal e invariante en el tiempo (LTI) con condiciones iniciales nulas, la **transformada de Laplace** convierte ecuaciones diferenciales en algebraicas. La función de transferencia es:

$$G(s) = \\frac{Y(s)}{U(s)}$$

donde $s = \\sigma + j\\omega$ es la variable compleja de Laplace.

**Polos y ceros.** $G(s)$ se escribe como cociente de polinomios:

$$G(s) = K\\,\\frac{(s - z_1)(s - z_2)\\cdots}{(s - p_1)(s - p_2)\\cdots}$$

- Los **polos** $p_i$ son las raíces del denominador. Determinan la dinámica natural: si todos cumplen $\\mathrm{Re}(p_i) < 0$, el sistema es **estable** (toda perturbación decae).
- Los **ceros** $z_j$ moldean cómo el sistema responde a entradas, no su estabilidad.

**Ejemplo: motor DC.** El modelo simplificado es $J\\dot\\omega + b\\omega = K_t i$, con tensión $V = Ri + K_e\\omega$. Eliminando $i$ y aplicando Laplace:

$$G(s) = \\frac{\\Omega(s)}{V(s)} = \\frac{K_t}{(Js + b)(R) + K_t K_e}$$

Es un sistema de **primer orden** con un único polo real negativo: el motor no oscila, sólo tiene un retardo.

**Sistema de segundo orden estándar:**

$$G(s) = \\frac{\\omega_n^2}{s^2 + 2\\zeta\\omega_n s + \\omega_n^2}$$

| Símbolo | Significado |
|---------|-------------|
| $\\omega_n$ | Frecuencia natural (rad/s) |
| $\\zeta$ | Coeficiente de amortiguamiento |

Con $\\zeta < 1$ aparece sobreoscilación; con $\\zeta = 1$ amortiguamiento crítico (respuesta más rápida sin oscilar); con $\\zeta > 1$ sobreamortiguado (lento).
`,
      },
      {
        id: "pid",
        title: "Controlador PID",
        keywords: ["PID", "proporcional", "integral", "derivativo"],
        body: `
El **PID** es el controlador más usado en la industria (>90% de los lazos). Combina tres acciones:

$$u(t) = K_p\\,e(t) + K_i\\int_0^t e(\\tau)\\,d\\tau + K_d\\,\\frac{de(t)}{dt}$$

**Significado físico de cada término:**

- **Proporcional ($K_p$)**: reacciona al error actual. Aumenta la velocidad de respuesta pero deja un *error en régimen permanente* (offset) si la planta no tiene integrador propio.
- **Integral ($K_i$)**: acumula el error pasado. Garantiza error nulo en régimen, pero introduce retraso de fase y puede provocar *windup* (saturación del integrador).
- **Derivativo ($K_d$)**: anticipa la tendencia futura del error. Amortigua oscilaciones, pero amplifica el ruido de medida; en la práctica se filtra: $K_d s/(1 + \\tau_f s)$.

**Ejemplo práctico — control de nivel en un tanque.** Una válvula de entrada $u\\in[0,100]\\%$ alimenta un tanque que se vacía a caudal $Q_{out}$. Se quiere $h = 1{,}5\\,\\mathrm{m}$. Con sólo P, el nivel se estabiliza en $1{,}3\\,\\mathrm{m}$ (offset). Añadiendo I, el integrador “sube” lentamente la apertura hasta eliminar el offset; con D, las oscilaciones por golpes de carga se amortiguan.

**Forma discreta** (la que se programa en un PLC):

$$u_k = u_{k-1} + K_p(e_k - e_{k-1}) + K_i T_s\\,e_k + \\frac{K_d}{T_s}(e_k - 2e_{k-1} + e_{k-2})$$
`,
        widget: "eng-pid",
      },
      {
        id: "ziegler",
        title: "Sintonía de Ziegler–Nichols",
        keywords: ["Ziegler", "Nichols", "sintonía", "ganancia crítica"],
        body: `
**John G. Ziegler** y **Nathaniel B. Nichols**, ingenieros de Taylor Instrument, publicaron en **1942** un método empírico que sigue siendo la primera referencia.

**Procedimiento (método de oscilación):**

1. Pon $K_i = K_d = 0$ y aumenta $K_p$ hasta encontrar la **ganancia crítica** $K_u$ que produce oscilaciones sostenidas.
2. Mide su **periodo** $T_u$.
3. Aplica las recetas:

| Tipo | $K_p$ | $T_i$ | $T_d$ |
|------|-------|-------|-------|
| P    | $0{,}5\\,K_u$  | — | — |
| PI   | $0{,}45\\,K_u$ | $T_u/1{,}2$ | — |
| PID  | $0{,}6\\,K_u$  | $T_u/2$ | $T_u/8$ |

donde $K_i = K_p/T_i$ y $K_d = K_p T_d$.

Es un punto de partida; suele dar respuestas rápidas pero con sobreoscilación apreciable. Para procesos lentos (intercambiadores de calor, bioreactores) se prefieren métodos como **Cohen–Coon**, **IMC** o **lambda tuning**.
`,
      },
      {
        id: "bode",
        title: "Diagramas de Bode",
        keywords: ["Bode", "frecuencia", "filtro", "ancho de banda", "margen"],
        body: `
Hendrik **Bode** (Bell Labs, años 30) introdujo una representación logarítmica de $H(j\\omega)$ que permite componer respuestas de varios bloques sumando gráficas.

Se trazan dos curvas en función de $\\omega$ (escala log):

- **Magnitud**: $20\\log_{10}|H(j\\omega)|$ en dB.
- **Fase**: $\\arg H(j\\omega)$ en grados.

**Para qué sirve:**

- Diseño de **filtros** (paso-bajo, paso-alto, paso-banda) leyendo directamente la frecuencia de corte.
- Cálculo del **margen de ganancia** $G_m$ y **margen de fase** $\\varphi_m$, dos indicadores cuantitativos de cuán cerca de la inestabilidad opera el lazo cerrado. Como regla, $\\varphi_m \\in [45°, 60°]$ ofrece un buen compromiso entre rapidez y robustez.
- Identificación experimental: excitando con senoidales de distintas frecuencias se reconstruye $H(j\\omega)$ punto a punto.

**Ejemplo.** Un filtro RC paso-bajo con $f_c = 1/(2\\pi RC)$ presenta $-20\\,\\mathrm{dB/década}$ por encima de $f_c$ y desfase asintótico de $-90°$.
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
    readingMinutes: 20,
    summary:
      "Convolución, muestreo, transformadas y procesado digital: las matemáticas detrás del audio, la imagen y las telecomunicaciones.",
    sections: [
      {
        id: "historia",
        title: "Contexto histórico",
        keywords: ["Fourier", "Shannon", "Nyquist", "telecomunicaciones"],
        body: `
La teoría de señales nació en el siglo XIX con **Joseph Fourier (1822)**, quien al estudiar la conducción del calor descubrió que cualquier función periódica puede descomponerse en suma de senoidales. Esta idea, criticada en su momento, se volvió la herramienta universal del análisis.

A principios del **siglo XX**, los ingenieros de telefonía de **Bell Labs** —Harry Nyquist (1928) y Claude Shannon (1948)— formalizaron cuántas muestras hacen falta para reconstruir una señal y cuánta información puede transmitirse por un canal con ruido. Estos trabajos son la base de toda la era digital: del CD al WiFi.
`,
      },
      {
        id: "lti",
        title: "Sistemas LTI y convolución",
        keywords: ["LTI", "lineal", "invariante", "convolución", "impulso"],
        body: `
Un sistema es **lineal** si cumple superposición ($T[ax_1 + bx_2] = aT[x_1] + bT[x_2]$) e **invariante en el tiempo** si un retardo en la entrada produce el mismo retardo en la salida.

Todo sistema LTI queda completamente caracterizado por su **respuesta al impulso** $h(t)$ (salida cuando se aplica un Delta de Dirac):

$$y(t) = (h * x)(t) = \\int_{-\\infty}^{\\infty} h(\\tau)\\,x(t - \\tau)\\,d\\tau$$

| Símbolo | Significado |
|---------|-------------|
| $x(t)$ | Entrada |
| $h(t)$ | Respuesta al impulso |
| $y(t)$ | Salida |
| $*$ | Convolución |

**Ejemplo: filtro de media móvil.** Si $h[n] = 1/N$ para $0 \\le n < N$, la salida es el promedio de las últimas $N$ muestras de la entrada — útil para suavizar ruido en sensores.
`,
      },
      {
        id: "muestreo",
        title: "Teorema de muestreo de Nyquist–Shannon",
        keywords: ["muestreo", "Nyquist", "Shannon", "alias", "ADC"],
        body: `
**Enunciado.** Una señal continua de banda limitada a $B$ Hz puede reconstruirse exactamente a partir de muestras tomadas con frecuencia $f_s > 2B$. La cota $2B$ es la **frecuencia de Nyquist**.

Si $f_s$ es menor, las componentes de alta frecuencia se “pliegan” sobre las bajas y aparece **aliasing** (irreversible). Por eso los conversores A/D incluyen un **filtro antialias** analógico antes del muestreo.

**Ejemplo audio.** El oído humano llega a unos 20 kHz, así que el CD usa $f_s = 44{,}1\\,\\mathrm{kHz} > 2 \\cdot 20\\,\\mathrm{kHz}$. Para video con muestreo de 48 fps en cine moderno, los “ruidos” como ruedas que parecen girar al revés son aliasing temporal.

**Reconstrucción ideal:**

$$x(t) = \\sum_{n=-\\infty}^{\\infty} x[n]\\,\\mathrm{sinc}\\!\\left(\\frac{t - nT_s}{T_s}\\right),\\quad T_s = 1/f_s$$
`,
      },
      {
        id: "ztransform",
        title: "Transformada Z",
        keywords: ["Z", "tiempo discreto", "función de transferencia", "ROC"],
        body: `
Para sistemas en tiempo discreto, la análoga a Laplace es:

$$X(z) = \\sum_{n=-\\infty}^{\\infty} x[n]\\,z^{-n}$$

donde $z$ es una variable compleja. La **región de convergencia (ROC)** indica para qué $|z|$ converge la suma y depende de si la señal es causal/anticausal.

**Estabilidad.** Un sistema discreto es estable si todos los polos de $H(z)$ están dentro del **círculo unitario** ($|p_i| < 1$). Esto reemplaza a la condición $\\mathrm{Re}(p_i) < 0$ del caso continuo.

**Ejemplo: filtro IIR de primer orden.**

$$y[n] = a\\,y[n-1] + (1-a)\\,x[n] \\;\\Rightarrow\\; H(z) = \\frac{(1-a)}{1 - a z^{-1}}$$

con $a \\in (0, 1)$. Es un suavizado exponencial; cuanto mayor $a$, más memoria.
`,
      },
    ],
  },
  {
    slug: "mecanica-de-materiales",
    title: "Mecánica de materiales",
    category: "ingenieria",
    level: "intermedio",
    readingMinutes: 22,
    summary:
      "Tensión, deformación, vigas, torsión y criterios de fallo: cómo predecir si una estructura aguantará.",
    sections: [
      {
        id: "historia",
        title: "Origen histórico",
        keywords: ["Galileo", "Hooke", "Navier", "resistencia de materiales"],
        body: `
**Galileo Galilei**, en sus *Discorsi* (1638), planteó el primer estudio sistemático sobre la rotura de vigas en voladizo, fundando la **resistencia de materiales**. Aunque su modelo era incorrecto (suponía rotación rígida), abrió el camino.

**Robert Hooke (1678)** publicó *Ut tensio, sic vis*: la deformación es proporcional a la fuerza — la primera ley constitutiva. **Leonhard Euler y Daniel Bernoulli** desarrollaron la teoría de vigas (s. XVIII). **Claude-Louis Navier**, en 1826, publicó el primer manual moderno de la disciplina, base de la ingeniería civil del siglo XIX que hizo posibles puentes y ferrocarriles.
`,
      },
      {
        id: "tension",
        title: "Tensión y deformación",
        keywords: ["tensión", "deformación", "Hooke", "Young", "Poisson"],
        body: `
**Tensión normal** (estrés): fuerza por unidad de área.

$$\\sigma = \\frac{F}{A}\\quad [\\mathrm{Pa}]$$

**Deformación unitaria**:

$$\\varepsilon = \\frac{\\Delta L}{L_0}\\quad [\\text{adimensional}]$$

En el **régimen elástico lineal** se cumple la ley de Hooke:

$$\\sigma = E\\,\\varepsilon$$

| Símbolo | Significado | Valor típico (acero) |
|---------|-------------|----------------------|
| $E$ | Módulo de Young | 200 GPa |
| $\\nu$ | Coef. Poisson | 0,30 |
| $G$ | Módulo de cizalla | $E/[2(1+\\nu)] \\approx 77$ GPa |
| $\\sigma_y$ | Límite de fluencia | 250 MPa |

**Ejemplo.** Una barra de acero de $A = 100\\,\\mathrm{mm^2}$ y $L = 1\\,\\mathrm{m}$ soporta $F = 20\\,\\mathrm{kN}$. Tensión $\\sigma = 200\\,\\mathrm{MPa}$ (próxima al límite); deformación $\\varepsilon = 200/200000 = 10^{-3}$, alargamiento de **1 mm**.
`,
      },
      {
        id: "vigas",
        title: "Flexión de vigas",
        keywords: ["viga", "deflexión", "momento flector", "EI", "Euler-Bernoulli"],
        body: `
La teoría de **Euler–Bernoulli** modela vigas esbeltas suponiendo que las secciones planas se mantienen planas y perpendiculares al eje deformado. La ecuación gobernante es:

$$EI\\,\\frac{d^4 v}{dx^4} = w(x)$$

| Símbolo | Significado | Unidad |
|---------|-------------|--------|
| $v(x)$ | Deflexión transversal | m |
| $E$ | Módulo de Young | Pa |
| $I$ | Momento de inercia de la sección | m⁴ |
| $w(x)$ | Carga distribuida | N/m |

**Casos clásicos** (deflexión máxima):

- Viga simplemente apoyada, carga puntual $P$ en el centro: $\\delta_{max} = PL^3/(48EI)$.
- Viga simplemente apoyada, carga uniforme $w$: $\\delta_{max} = 5wL^4/(384EI)$.
- Voladizo, carga puntual en el extremo: $\\delta_{max} = PL^3/(3EI)$.

**Ejemplo.** Vigueta IPE-200 de acero ($I = 1{,}94\\times 10^{-5}\\,\\mathrm{m^4}$) de 4 m simplemente apoyada con carga centrada de 10 kN: $\\delta = (10^4)(4^3)/(48 \\cdot 2\\times 10^{11} \\cdot 1{,}94\\times 10^{-5}) \\approx 3{,}4\\,\\mathrm{mm}$.
`,
        widget: "eng-beam",
      },
      {
        id: "torsion",
        title: "Torsión de ejes",
        keywords: ["torsión", "ángulo", "par", "G"],
        body: `
Para un eje circular sometido a un par $T$:

$$\\tau_{max} = \\frac{T r}{J},\\qquad \\theta = \\frac{T L}{G J}$$

con $J = \\pi d^4/32$ el momento polar de la sección y $G$ el módulo de cizalla. Se usa para dimensionar ejes de transmisión, brocas y árboles de levas.
`,
      },
      {
        id: "fallo",
        title: "Criterios de fallo",
        keywords: ["Von Mises", "Tresca", "fluencia", "fatiga"],
        body: `
**Von Mises** (energía de distorsión): la fluencia ocurre cuando

$$\\sigma_{vm} = \\sqrt{\\tfrac{1}{2}\\left[(\\sigma_1-\\sigma_2)^2 + (\\sigma_2-\\sigma_3)^2 + (\\sigma_3-\\sigma_1)^2\\right]} = \\sigma_y$$

**Tresca** (cortante máxima): $\\tau_{max} = (\\sigma_1 - \\sigma_3)/2 = \\sigma_y/2$. Más conservador que Von Mises.

**Fatiga.** Bajo cargas cíclicas, las piezas fallan a tensiones muy inferiores al límite estático. La curva de **Wöhler** ($S$–$N$) relaciona amplitud y número de ciclos hasta fallo. Pequeños concentradores (rayas, agujeros) reducen drásticamente la vida — por eso los ejes de avión se pulen y se inspeccionan periódicamente.
`,
      },
    ],
  },
  {
    slug: "transferencia-de-calor",
    title: "Transferencia de calor",
    category: "ingenieria",
    level: "intermedio",
    readingMinutes: 20,
    summary:
      "Conducción, convección y radiación: cómo se mueve la energía térmica y cómo se diseñan intercambiadores y aislamientos.",
    sections: [
      {
        id: "historia",
        title: "Contexto histórico",
        keywords: ["Fourier", "Newton", "Stefan", "Boltzmann"],
        body: `
**Joseph Fourier** publicó en 1822 *Théorie analytique de la chaleur*, donde formuló la ley de la conducción y, para resolverla, inventó las series que llevan su nombre. **Isaac Newton** (siglo XVII) había observado ya que el enfriamiento es proporcional a la diferencia de temperaturas. **Josef Stefan (1879)** —experimentalmente— y **Ludwig Boltzmann (1884)** —teóricamente, desde la termodinámica— establecieron la ley $T^4$ de la radiación.
`,
      },
      {
        id: "conduccion",
        title: "Conducción de Fourier",
        keywords: ["Fourier", "conducción", "k", "resistencia térmica"],
        body: `
$$\\dot q = -k A\\,\\frac{dT}{dx}$$

| Símbolo | Significado | Unidad |
|---------|-------------|--------|
| $\\dot q$ | Flujo de calor | W |
| $k$ | Conductividad térmica | W/(m·K) |
| $A$ | Área transversal | m² |
| $dT/dx$ | Gradiente de temperatura | K/m |

**Resistencia térmica de pared plana**: $R = L/(kA)$. Las paredes en serie suman resistencias (como resistencias eléctricas).

**Ejemplo.** Pared de ladrillo ($k=0{,}7$, $L=15\\,\\mathrm{cm}$, $A=10\\,\\mathrm{m^2}$) con $\\Delta T = 20\\,°\\mathrm{C}$: $\\dot q = kA\\Delta T/L = 0{,}7\\cdot 10 \\cdot 20/0{,}15 \\approx 933\\,\\mathrm{W}$.
`,
        widget: "eng-heat",
      },
      {
        id: "conveccion",
        title: "Convección y números adimensionales",
        keywords: ["convección", "Nusselt", "Reynolds", "Prandtl", "Newton"],
        body: `
La **ley de enfriamiento de Newton** describe la convección:

$$\\dot q = h A (T_s - T_\\infty)$$

donde $h$ depende del régimen de flujo, geometría y propiedades del fluido. Se obtiene de **correlaciones** que combinan números adimensionales:

- **Reynolds** $\\mathrm{Re} = \\rho v D/\\mu$ — relación inercia/viscosidad.
- **Prandtl** $\\mathrm{Pr} = \\mu c_p/k$ — relación entre cantidad de movimiento y difusión térmica.
- **Nusselt** $\\mathrm{Nu} = hD/k$ — gradiente adimensional en la pared.

Para tubos lisos en régimen turbulento, **Dittus–Boelter** da $\\mathrm{Nu} = 0{,}023\\,\\mathrm{Re}^{0{,}8}\\mathrm{Pr}^{n}$ con $n=0{,}4$ al calentar y $0{,}3$ al enfriar.
`,
      },
      {
        id: "radiacion",
        title: "Radiación térmica",
        keywords: ["radiación", "Stefan", "Boltzmann", "emisividad"],
        body: `
$$\\dot q = \\varepsilon \\sigma A (T_s^4 - T_\\infty^4)$$

con $\\sigma = 5{,}67\\times 10^{-8}\\,\\mathrm{W/(m^2 K^4)}$ y $\\varepsilon\\in[0,1]$ la emisividad (1 = cuerpo negro ideal).

**Ejemplo.** Una placa pintada de negro mate ($\\varepsilon=0{,}95$) a $T_s=600\\,\\mathrm{K}$ rodeada de paredes a $300\\,\\mathrm{K}$ irradia $\\dot q/A = 0{,}95\\cdot 5{,}67\\times 10^{-8}(600^4-300^4) \\approx 6{,}5\\,\\mathrm{kW/m^2}$. Por eso los hornos brillan visiblemente.
`,
      },
    ],
  },
  {
    slug: "termodinamica-aplicada",
    title: "Termodinámica aplicada",
    category: "ingenieria",
    level: "avanzado",
    readingMinutes: 18,
    summary:
      "Ciclos de potencia y refrigeración: del vapor de Watt a las turbinas de gas modernas.",
    sections: [
      {
        id: "historia",
        title: "Origen de los ciclos térmicos",
        keywords: ["Carnot", "Rankine", "Brayton", "máquinas térmicas"],
        body: `
**Sadi Carnot**, en 1824, publicó *Réflexions sur la puissance motrice du feu*, demostrando que el rendimiento máximo de una máquina térmica entre dos focos depende sólo de sus temperaturas:

$$\\eta_{Carnot} = 1 - T_f/T_c$$

Este resultado —probado antes incluso del primer principio formal— marcó el inicio de la **termodinámica**. Más tarde, **William Rankine** (1850) sistematizó el ciclo de vapor que sustentó la revolución industrial; **George Brayton** patentó el ciclo de turbina de gas (1872), corazón de los reactores aeronáuticos modernos.
`,
      },
      {
        id: "rankine",
        title: "Ciclo de Rankine",
        keywords: ["Rankine", "vapor", "turbina", "caldera"],
        body: `
Cuatro etapas:

1. **Bomba** (1→2): comprime agua líquida; trabajo $w_b = h_2 - h_1$.
2. **Caldera** (2→3): calienta a presión constante; calor $q_{in} = h_3 - h_2$.
3. **Turbina** (3→4): expansión generando trabajo $w_t = h_3 - h_4$.
4. **Condensador** (4→1): cesión de calor al ambiente.

Eficiencia térmica: $\\eta = (w_t - w_b)/q_{in}$.

**Mejoras reales:** sobrecalentamiento, recalentamiento intermedio y regeneración con extracciones; centrales modernas alcanzan $\\eta \\approx 45\\%$.

**Ejemplo.** Vapor a 540 °C, 16 MPa, condensador a 50 mbar (32 °C): $\\eta_{ideal}\\approx 42\\%$.
`,
        widget: "eng-rankine",
      },
      {
        id: "brayton",
        title: "Ciclo Brayton",
        keywords: ["Brayton", "turbina de gas", "compresor", "relación de presiones"],
        body: `
Compresión isentrópica → combustión isobárica → expansión isentrópica → enfriamiento. Eficiencia ideal:

$$\\eta = 1 - \\left(\\frac{1}{r_p}\\right)^{(\\gamma-1)/\\gamma}$$

| Símbolo | Significado |
|---------|-------------|
| $r_p$ | Relación de presiones $p_2/p_1$ |
| $\\gamma$ | $c_p/c_v$ del gas (≈1,4 aire) |

Es la base de los **turborreactores**: aumentar $r_p$ sube el rendimiento, pero también la temperatura a la entrada de la turbina, limitada por los materiales (~1700 K en aleaciones modernas refrigeradas).
`,
      },
      {
        id: "otto",
        title: "Ciclos Otto y Diesel",
        keywords: ["Otto", "Diesel", "motor combustión interna"],
        body: `
- **Otto** (encendido por chispa): $\\eta = 1 - r^{1-\\gamma}$, con $r$ la relación de compresión. Limitada por el **autoencendido** (knock).
- **Diesel** (encendido por compresión): $\\eta = 1 - \\frac{1}{r^{\\gamma-1}}\\frac{r_c^\\gamma - 1}{\\gamma(r_c - 1)}$, con $r_c$ la relación de corte. Mayor $r$ posible (~20:1) → mejor rendimiento.

**Ejemplo.** Motor Otto con $r=10$ y $\\gamma=1{,}4$: $\\eta \\approx 1 - 10^{-0{,}4} \\approx 60\\%$. El rendimiento real ronda el 30 % por pérdidas mecánicas y de bombeo.
`,
      },
    ],
  },
  {
    slug: "investigacion-operativa",
    title: "Investigación operativa",
    category: "ingenieria",
    level: "intermedio",
    readingMinutes: 18,
    summary:
      "Programación lineal, colas y simulación: optimizar decisiones bajo restricciones e incertidumbre.",
    sections: [
      {
        id: "historia",
        title: "Nacimiento durante la guerra",
        keywords: ["Dantzig", "simplex", "RAND", "logística"],
        body: `
La investigación operativa cristalizó durante la **Segunda Guerra Mundial**, cuando equipos científicos británicos y estadounidenses optimizaron rutas de convoyes, tamaños de cargas de bombardeo y patrones de búsqueda anti-submarino. Tras la guerra, **George Dantzig** publicó el **método simplex (1947)** para programación lineal en la Fuerza Aérea, dando origen a una disciplina civil aplicada hoy en logística, planificación, finanzas y telecomunicaciones.
`,
      },
      {
        id: "lp",
        title: "Programación lineal",
        keywords: ["LP", "simplex", "optimización lineal"],
        body: `
$$\\min\\,c^T x \\quad \\text{sujeto a} \\quad A x \\le b,\\; x \\ge 0$$

| Símbolo | Significado |
|---------|-------------|
| $x$ | Variables de decisión |
| $c$ | Coeficientes de coste |
| $A,b$ | Restricciones lineales |

El **simplex** recorre vértices del poliedro factible en busca del óptimo; en la práctica resuelve problemas con miles de variables en milisegundos.

**Ejemplo: producción.** Una fábrica produce sillas (5 €/u) y mesas (8 €/u). Sillas requieren 1 h y 2 kg, mesas 3 h y 1 kg. Disponibilidad: 12 h y 10 kg. Maximizar $5s + 8m$ s.a. $s + 3m \\le 12$, $2s + m \\le 10$, $s,m\\ge 0$. Solución: $s=2{,}4$, $m=3{,}2$, beneficio 37,6 €.
`,
      },
      {
        id: "colas",
        title: "Teoría de colas: M/M/1",
        keywords: ["cola", "Markov", "tasa", "ρ", "Little"],
        body: `
Llegadas de Poisson con tasa $\\lambda$, servicios exponenciales con tasa $\\mu$, un único servidor. Utilización $\\rho = \\lambda/\\mu < 1$.

| Magnitud | Fórmula |
|----------|---------|
| Long. media en sistema $L$ | $\\rho/(1-\\rho)$ |
| Long. media en cola $L_q$ | $\\rho^2/(1-\\rho)$ |
| Tiempo medio en sistema $W$ | $1/(\\mu-\\lambda)$ |
| Tiempo medio en cola $W_q$ | $\\rho/(\\mu-\\lambda)$ |

Cumplen la **ley de Little**: $L = \\lambda W$.

**Ejemplo.** Caja de supermercado con $\\lambda=0{,}5$ clientes/min y $\\mu=0{,}6$ clientes/min: $\\rho=0{,}83$, $L=5$ clientes, $W=10$ minutos. Una pequeña subida de demanda colapsa el sistema.
`,
        widget: "eng-queue",
      },
      {
        id: "monte-carlo",
        title: "Simulación de Monte Carlo",
        keywords: ["Monte Carlo", "muestreo", "estimación", "Manhattan"],
        body: `
Bautizada por **Stanislaw Ulam** y **John von Neumann** durante el Proyecto Manhattan, estima cantidades $\\theta = \\mathbb E[g(X)]$ mediante el promedio:

$$\\hat\\theta_n = \\frac{1}{n}\\sum_{i=1}^n g(X_i)$$

con $X_i$ iid. El error decrece como $O(1/\\sqrt n)$, independientemente de la dimensión — por eso es competitivo en integrales de alta dimensión (finanzas, física de partículas, gráficos).

**Ejemplo simple — estimar $\\pi$.** Lanza puntos aleatorios en $[0,1]^2$; la fracción que cae dentro del cuarto de círculo unidad estima $\\pi/4$.
`,
      },
    ],
  },
  {
    slug: "circuitos-electricos",
    title: "Circuitos eléctricos",
    category: "ingenieria",
    level: "intermedio",
    readingMinutes: 18,
    summary:
      "Leyes de Kirchhoff, equivalentes y análisis fasorial: la base de todo lo eléctrico, desde un timbre hasta una red de distribución.",
    sections: [
      {
        id: "historia",
        title: "Origen histórico",
        keywords: ["Ohm", "Kirchhoff", "Steinmetz"],
        body: `
**Georg Ohm (1827)** estableció empíricamente $V = IR$ tras experimentos cuidadosos con cables de distintas longitudes. **Gustav Kirchhoff (1845)**, con apenas 21 años, publicó las dos leyes que llevan su nombre, generalizando el análisis a redes complejas. A finales del siglo XIX, **Charles Steinmetz** introdujo el cálculo fasorial, haciendo tratable la corriente alterna que Tesla y Westinghouse acababan de imponer industrialmente.
`,
      },
      {
        id: "kirchhoff",
        title: "Leyes de Kirchhoff",
        keywords: ["Kirchhoff", "nodos", "mallas", "KCL", "KVL"],
        body: `
- **KCL (corriente)**: $\\sum I_{entrantes} = \\sum I_{salientes}$ en cada nodo. Conservación de la carga.
- **KVL (tensión)**: $\\sum V = 0$ alrededor de cualquier malla cerrada. Conservación de la energía.

Combinadas con la ley de Ohm $V=IR$ permiten resolver cualquier red lineal de DC. Para CA se generalizan con impedancias complejas.

**Ejemplo divisor de tensión.** Dos resistencias en serie $R_1, R_2$ con tensión $V$: $V_{R_2} = V\\,R_2/(R_1+R_2)$.
`,
      },
      {
        id: "thevenin",
        title: "Equivalentes Thévenin y Norton",
        keywords: ["Thevenin", "Norton", "equivalente"],
        body: `
**Teorema de Thévenin (1883):** cualquier red lineal vista desde dos terminales se reduce a una fuente de tensión $V_{th}$ en serie con $R_{th}$.

**Teorema de Norton:** equivalente dual con fuente de corriente $I_N = V_{th}/R_{th}$ en paralelo con $R_{th}$.

Permite analizar cómo cambia la corriente al conectar distintas cargas sin recalcular toda la red.

**Cálculo:** $V_{th}$ es la tensión en circuito abierto; $R_{th}$ se obtiene apagando las fuentes independientes y mirando la resistencia equivalente desde los terminales.
`,
      },
      {
        id: "fasores",
        title: "Análisis fasorial en CA",
        keywords: ["fasor", "impedancia", "CA"],
        body: `
Para señales senoidales $V(t) = V_m\\cos(\\omega t + \\varphi)$ se define el **fasor** $\\tilde V = V_m e^{j\\varphi}$. Las impedancias son:

| Elemento | Impedancia | Comportamiento |
|----------|-----------|----------------|
| Resistencia $R$ | $R$ | en fase |
| Inductor $L$ | $j\\omega L$ | corriente atrasa 90° |
| Condensador $C$ | $1/(j\\omega C)$ | corriente adelanta 90° |

Las leyes de Kirchhoff y Ohm se aplican directamente a fasores, reduciendo el análisis de CA al álgebra compleja.

**Resonancia RLC serie:** ocurre a $\\omega_0 = 1/\\sqrt{LC}$, con factor de calidad $Q = \\omega_0 L/R$. Es el principio de los circuitos sintonizadores de radio.
`,
      },
    ],
  },
  {
    slug: "mecanica-de-fluidos-ing",
    title: "Mecánica de fluidos aplicada",
    category: "ingenieria",
    level: "avanzado",
    readingMinutes: 16,
    summary:
      "Pérdidas en tuberías, número de Reynolds y bombas: dimensionar instalaciones hidráulicas reales.",
    sections: [
      {
        id: "historia",
        title: "Contexto histórico",
        keywords: ["Bernoulli", "Reynolds", "Moody"],
        body: `
**Daniel Bernoulli (1738)** publicó en *Hydrodynamica* la ecuación que relaciona presión, velocidad y altura en un fluido ideal. **Osborne Reynolds (1883)** identificó experimentalmente los regímenes laminar y turbulento mediante un hilo de tinta en un tubo de vidrio. **Lewis Moody** publicó en 1944 el diagrama que sintetiza el factor de fricción en función del número de Reynolds y la rugosidad relativa, herramienta cotidiana de la ingeniería hidráulica.
`,
      },
      {
        id: "reynolds",
        title: "Número de Reynolds y régimen",
        keywords: ["Reynolds", "laminar", "turbulento"],
        body: `
$$\\mathrm{Re} = \\frac{\\rho v D}{\\mu}$$

| Símbolo | Significado |
|---------|-------------|
| $\\rho$ | Densidad |
| $v$ | Velocidad media |
| $D$ | Diámetro hidráulico |
| $\\mu$ | Viscosidad dinámica |

Régimen: **laminar** si $\\mathrm{Re} < 2300$, **transición** entre 2300 y 4000, **turbulento** por encima.

**Ejemplo.** Agua ($\\rho=1000$, $\\mu=10^{-3}$) en tubería de 5 cm a 1 m/s: $\\mathrm{Re}=50000$ → turbulento. Por eso el grifo doméstico no fluye en láminas suaves.
`,
      },
      {
        id: "darcy",
        title: "Pérdidas de carga (Darcy–Weisbach)",
        keywords: ["Darcy", "Weisbach", "factor fricción", "Moody"],
        body: `
$$h_f = f\\,\\frac{L}{D}\\,\\frac{v^2}{2g}$$

| Símbolo | Significado |
|---------|-------------|
| $h_f$ | Pérdida de carga (m de columna) |
| $f$ | Factor de fricción (adimensional) |
| $L, D$ | Longitud y diámetro de tubo |
| $v$ | Velocidad media |
| $g$ | 9,81 m/s² |

$f$ se obtiene del **diagrama de Moody** o de la **ecuación de Colebrook** (implícita) o de aproximaciones explícitas como **Swamee–Jain**:

$$f = \\frac{0{,}25}{\\left[\\log_{10}\\!\\left(\\dfrac{\\varepsilon/D}{3{,}7} + \\dfrac{5{,}74}{\\mathrm{Re}^{0{,}9}}\\right)\\right]^2}$$

**Ejemplo.** Tubería de PVC ($\\varepsilon\\approx0{,}0015$ mm) de 100 m, $D=50$ mm, $v=2$ m/s: $\\mathrm{Re}=10^5$, $f\\approx0{,}018$, $h_f\\approx 7{,}3\\,\\mathrm{m}$. La bomba debe aportar al menos esa altura más la geométrica.
`,
      },
      {
        id: "bombas",
        title: "Bombas centrífugas",
        keywords: ["bomba", "altura manométrica", "potencia hidráulica", "NPSH"],
        body: `
Potencia hidráulica entregada al fluido:

$$P_h = \\rho g Q H$$

con $Q$ caudal y $H$ altura manométrica. La eficiencia $\\eta = P_h/P_{eje}$ ronda 60–85 % en bombas industriales. El **punto de operación** es la intersección entre la curva característica de la bomba y la curva resistente del sistema (estática + pérdidas).

Conviene vigilar el **NPSH disponible > NPSH requerido** para evitar **cavitación** (formación de burbujas que erosionan el rodete).
`,
      },
    ],
  },
];
