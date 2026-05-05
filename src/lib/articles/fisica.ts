import type { Article } from "@/lib/articles";

export const PHYSICS_ARTICLES: Article[] = [
  // ─────────────────────────── 1
  {
    slug: "mecanica-clasica",
    title: "Mecánica clásica",
    category: "fisica",
    level: "introductorio",
    readingMinutes: 28,
    summary:
      "Cinemática, leyes de Newton, fuerzas, fricción, trabajo, energía y momento. La columna vertebral de la física no relativista.",
    sections: [
      {
        id: "historia-y-contexto",
        title: "Historia y contexto",
        keywords: ["historia", "contexto", "origen"],
        body: `
La mecánica clásica nace con **Galileo Galilei** (s. XVII), quien con planos inclinados midió la caída de los cuerpos y demostró que aceleran uniformemente bajo gravedad, derribando 2000 años de física aristotélica. **Isaac Newton**, en sus *Principia Mathematica* (1687), sintetizó los trabajos previos de Galileo, Kepler y Descartes en tres leyes y la ley de gravitación universal: por primera vez una sola teoría predecía tanto la caída de una manzana como el movimiento de los planetas. **Lagrange (1788)** y **Hamilton (1833)** reformularon la mecánica con principios variacionales más generales, base de la física moderna.
`,
      },
      {
        id: "cinematica",
        title: "Cinemática: posición, velocidad y aceleración",
        keywords: ["cinemática", "MRU", "MRUA", "velocidad", "aceleración", "posición"],
        body: `
La **cinemática** es la rama de la mecánica que describe *cómo* se mueven los cuerpos sin entrar en *por qué* lo hacen. Reduce el cuerpo a un punto material y estudia tres magnitudes acopladas por derivación: posición, velocidad y aceleración.

La **posición** $x(t)$ ubica al cuerpo en cada instante; su derivada temporal es la **velocidad** y la derivada de ésta, la **aceleración**:

$$v(t) = \\frac{dx}{dt}, \\qquad a(t) = \\frac{dv}{dt} = \\frac{d^2 x}{dt^2}$$

Esta cadena de derivadas es la base de toda la mecánica clásica. Si conocemos $a(t)$ y dos condiciones iniciales $x_0$, $v_0$, integramos dos veces y reconstruimos completamente la trayectoria. Para aceleración constante $a_0$ obtenemos las ecuaciones que aparecen en cualquier libro de bachillerato:

$$v(t) = v_0 + a_0\\,t, \\qquad x(t) = x_0 + v_0\\,t + \\tfrac{1}{2}\\,a_0\\,t^2$$

Y, eliminando el tiempo, una identidad muy útil cuando no nos importa $t$:

$$v^2 = v_0^2 + 2 a_0 (x - x_0)$$

> **Intuición:** la velocidad mide *cuánto cambia la posición por unidad de tiempo*; la aceleración, *cuánto cambia la velocidad por unidad de tiempo*. Que un cuerpo tenga velocidad cero **no implica** aceleración cero (piensa en una pelota lanzada al aire en su altura máxima).

| Movimiento | Condición | Ejemplo |
|------------|-----------|---------|
| Uniforme (MRU) | $a = 0$ | Auto en autopista a velocidad constante |
| Uniformemente acelerado (MRUA) | $a$ constante | Caída libre en vacío |
| Variado | $a(t)$ no constante | Cohete con masa variable |

En tres dimensiones todas estas magnitudes son **vectores**: $\\vec r(t)$, $\\vec v = d\\vec r/dt$, $\\vec a = d\\vec v/dt$. Eso permite descomponer movimientos complicados en problemas más simples por componentes (lo que haremos enseguida con el tiro parabólico).
`,
      },
      {
        id: "tiro-parabolico",
        title: "Tiro parabólico",
        keywords: ["tiro parabólico", "proyectil", "alcance", "altura máxima"],
        body: `
El tiro parabólico es el ejemplo prototípico de un movimiento bidimensional: en horizontal no actúa fuerza (MRU) y en vertical actúa la gravedad (MRUA). Como las componentes son **independientes**, podemos analizarlas por separado.

Si lanzamos un proyectil con velocidad inicial $v_0$ y ángulo $\\theta$ respecto a la horizontal:

$$x(t) = v_0\\cos\\theta\\,t, \\qquad y(t) = v_0\\sin\\theta\\,t - \\tfrac{1}{2}g\\,t^2$$

Eliminando el tiempo entre ambas obtenemos la ecuación de la trayectoria, que es una **parábola**:

$$y(x) = x\\tan\\theta - \\frac{g\\,x^2}{2v_0^2\\cos^2\\theta}$$

Las dos magnitudes que más se preguntan en problemas son el **alcance** (distancia horizontal recorrida sobre terreno horizontal) y la **altura máxima**:

$$R = \\frac{v_0^2 \\sin(2\\theta)}{g}, \\qquad H = \\frac{v_0^2 \\sin^2\\theta}{2g}$$

> **Resultado clave:** el alcance es máximo en $\\theta = 45°$ porque $\\sin(2\\theta)$ alcanza su máximo allí. Además, ángulos complementarios ($30°$ y $60°$, por ejemplo) producen el mismo alcance pero distinta altura y tiempo de vuelo.

Mueve los sliders de la simulación y observa cómo cambia el perfil de la trayectoria al variar $v_0$, $\\theta$ y $g$ (prueba $g = 1{,}6$ para simular la Luna).
`,
        widget: "phys-projectile",
      },
      {
        id: "leyes-newton",
        title: "Las tres leyes de Newton",
        keywords: ["Newton", "inercia", "F=ma", "acción reacción"],
        body: `
Las leyes de Newton son los axiomas que conectan **fuerza** con **movimiento**. Sin ellas la cinemática sería puramente descriptiva; con ellas se vuelve predictiva.

**Primera ley (inercia).** Un cuerpo libre permanece en reposo o en MRU. Esta ley define implícitamente los **sistemas inerciales** y rompe la intuición aristotélica de que "para mantener algo en movimiento hay que empujarlo".

$$\\sum \\vec{F} = 0 \\;\\Longleftrightarrow\\; \\vec{v} = \\text{cte}$$

**Segunda ley (dinámica).** La fuerza neta sobre un cuerpo es la tasa de cambio de su momento lineal:

$$\\vec{F}_{\\text{neta}} = \\frac{d\\vec{p}}{dt} = m\\,\\vec{a} \\quad \\text{(masa constante)}$$

Esta es la ecuación más importante de la mecánica clásica: dada la fuerza sobre un cuerpo, predice su trayectoria. La forma con $d\\vec p/dt$ es preferible a $m\\vec a$ porque sigue siendo válida cuando la masa varía (cohetes).

**Tercera ley (acción-reacción).** Si A ejerce una fuerza sobre B, B ejerce sobre A una fuerza igual y opuesta:

$$\\vec{F}_{A\\to B} = -\\vec{F}_{B\\to A}$$

> **Trampa típica:** las dos fuerzas del par acción-reacción **nunca actúan sobre el mismo cuerpo**. Por eso no se cancelan en el diagrama de fuerzas individual. Que el suelo te empuje hacia arriba con la misma fuerza con que tú lo empujas hacia abajo no significa que tu peso "desaparezca": tu peso lo ejerce la Tierra entera, y su reacción es la fuerza que tú ejerces sobre la Tierra (que tampoco se cancela con tu peso, porque actúan sobre cuerpos distintos).

Estas tres leyes valen en cualquier sistema inercial. En un sistema acelerado (un autobús que frena) aparecen *fuerzas ficticias* que son artefactos del cambio de marco: matemáticamente útiles, físicamente inexistentes.
`,
      },
      {
        id: "fuerza-friccion",
        title: "Fuerza de fricción",
        keywords: ["fricción", "rozamiento", "estática", "cinética", "coeficiente", "μ"],
        body: `
La fricción es lo que hace que la mecánica del mundo real sea *interesante*. Sin ella ningún coche frenaría, ningún clavo se sostendría y caminar sería imposible.

Cuando dos superficies en contacto deslizan o tienden a deslizar, aparece una fuerza tangencial **opuesta al movimiento (o a la tendencia)**. Hay dos regímenes:

$$f_s \\le \\mu_s\\,N \\qquad\\text{(estática, antes de deslizar)}$$
$$f_k = \\mu_k\\,N \\qquad\\text{(cinética, durante el deslizamiento)}$$

donde $N$ es la **fuerza normal** (la que comprime las superficies) y los coeficientes $\\mu_s$, $\\mu_k$ dependen del par de materiales. Típicamente $\\mu_s > \\mu_k$, por eso *cuesta* arrancar un mueble pesado pero, una vez en movimiento, mantenerlo deslizando es más fácil.

> **Hecho contraintuitivo:** la fricción de Coulomb **no depende del área aparente de contacto**. Lo que importa es la fuerza normal. Microscópicamente, las superficies solo se tocan en pequeñas asperezas; mayor área aparente reparte la presión sin cambiar la fuerza total de adhesión.

**Plano inclinado.** En un plano de ángulo $\\theta$, el bloque empieza a deslizar cuando la componente del peso paralela al plano supera a la fricción estática máxima:

$$\\tan\\theta > \\mu_s$$

Una vez en movimiento, su aceleración es:

$$a = g(\\sin\\theta - \\mu_k\\cos\\theta)$$

Si $\\tan\\theta \\le \\mu_s$, el bloque se queda en reposo y la fricción se ajusta exactamente para equilibrar las fuerzas (pero nunca más allá del máximo $\\mu_s N$). Juega con los sliders del simulador para encontrar la transición.
`,
        widget: "phys-friction",
      },
      {
        id: "trabajo-energia",
        title: "Trabajo y energía cinética",
        keywords: ["trabajo", "energía cinética", "teorema trabajo-energía", "potencia"],
        body: `
La idea de **energía** unifica fenómenos que parecían distintos. En mecánica nace del concepto de trabajo.

El **trabajo** de una fuerza $\\vec{F}$ sobre un desplazamiento es la integral de línea:

$$W = \\int_C \\vec{F} \\cdot d\\vec{r}$$

Solo la componente de la fuerza paralela al desplazamiento hace trabajo. Una fuerza perpendicular (la normal sobre un cuerpo que desliza, la tensión de una cuerda en un péndulo) hace trabajo cero.

El **teorema del trabajo y la energía** establece que el trabajo neto sobre un cuerpo es igual al cambio de su energía cinética:

$$W_{\\text{neto}} = \\Delta E_c = \\tfrac{1}{2} m v_f^2 - \\tfrac{1}{2} m v_i^2$$

Es una consecuencia directa de $F = ma$, no un postulado independiente. Pero su forma escalar lo hace mucho más útil: en muchos problemas (caída por una rampa con curvas) calcular $\\int \\vec F\\cdot d\\vec r$ es trivial mientras que resolver la trayectoria con Newton es tortuoso.

La **potencia** instantánea mide la rapidez con que se transfiere energía:

$$P = \\frac{dW}{dt} = \\vec{F} \\cdot \\vec{v}$$

en watts (1 W = 1 J/s). Un coche de 100 kW que sube una pendiente larga puede producir más trabajo total que uno de 200 kW si circula más tiempo: potencia y energía no son lo mismo.
`,
      },
      {
        id: "energia-mecanica",
        title: "Energía potencial y conservación",
        keywords: ["energía potencial", "conservación", "energía mecánica"],
        body: `
Cuando una fuerza es **conservativa**, el trabajo que realiza al ir de A a B no depende del camino, solo de los puntos extremos. Eso permite definir una función escalar $U(\\vec r)$ —la **energía potencial**— tal que:

$$\\vec{F} = -\\nabla U$$

El signo menos es convención: la fuerza apunta hacia donde $U$ disminuye (las cosas tienden a "rodar cuesta abajo" en el paisaje energético).

Ejemplos canónicos:

- **Gravitatoria** cerca de la Tierra: $U = mgh$ (el cero es arbitrario; solo importan diferencias).
- **Elástica** (resorte de Hooke): $U = \\tfrac{1}{2} k x^2$.
- **Gravitatoria entre cuerpos**: $U = -GMm/r$.
- **Eléctrica** entre cargas puntuales: $U = kq_1q_2/r$.

Si **solo** actúan fuerzas conservativas, la suma cinética + potencial se conserva:

$$E = E_c + U = \\text{cte}$$

Esta es la **conservación de la energía mecánica**, una herramienta poderosísima: convierte problemas dinámicos en algebraicos. ¿Velocidad de un péndulo en el punto bajo? Iguala $mgh$ inicial a $\\tfrac{1}{2}mv^2$ final. Listo, sin integrar nada.

Las fuerzas **no conservativas** (fricción cinética, resistencia del aire) sí dependen del camino y no admiten una $U$. En su presencia la energía mecánica se disipa, normalmente como calor. Pero la energía total (incluyendo el calor) sigue conservándose: ese es el primer principio de la termodinámica.
`,
        widget: "phys-energy",
      },
      {
        id: "momento-lineal",
        title: "Momento lineal y colisiones",
        keywords: ["momento lineal", "impulso", "colisión elástica", "inelástica"],
        body: `
El **momento lineal** $\\vec{p} = m\\vec{v}$ es —junto con la energía— la magnitud conservada más útil. Procede directamente de la segunda ley en su forma original: $\\vec F = d\\vec p/dt$.

Si integramos en el tiempo la fuerza:

$$\\vec{J} = \\int \\vec{F}\\,dt = \\Delta \\vec{p}$$

es el **impulso**. Permite analizar choques sin conocer en detalle la fuerza durante el impacto: solo importa su integral. Por eso un airbag salva vidas: estira el tiempo de desaceleración y reduce la fuerza máxima para el mismo impulso.

En un sistema **aislado** (suma de fuerzas externas igual a cero), el momento total se conserva. Esto es independiente de la energía: el momento siempre se conserva en colisiones, la energía no necesariamente.

| Tipo | $\\vec p$ | $E_c$ | Ejemplo |
|------|----------|--------|---------|
| Elástica | conservado | conservada | Bolas de billar idealizadas |
| Inelástica | conservado | parcialmente perdida | Choque de coches con deformación |
| Perfectamente inelástica | conservado | máxima pérdida | Meteorito que se incrusta en la Tierra |

El **coeficiente de restitución** $e$ cuantifica la "elasticidad": $e = 1$ elástica, $e = 0$ perfectamente inelástica. La animación interactiva permite variarlo y comprobar cuánta energía se pierde en cada caso.
`,
        widget: "phys-collision",
      },
          {
        id: "problemas-resueltos",
        title: "Problemas resueltos y aplicaciones",
        keywords: ["ejemplos", "problemas resueltos", "aplicaciones"],
        body: `
**Problema 1 — frenado.** Un coche a $108\,\mathrm{km/h}$ (30 m/s) frena con $\mu_k = 0{,}7$ sobre asfalto seco. ¿Distancia de frenado?

Aceleración de frenado: $a = -\mu_k g = -6{,}87\,\mathrm{m/s^2}$. Con $v^2 = v_0^2 + 2ad$ y $v=0$: $d = v_0^2/(2|a|) = 900/13{,}74 \approx 65{,}5\,\mathrm{m}$.

**Problema 2 — colisión inelástica.** Una bala de 10 g a 400 m/s se incrusta en un bloque de 2 kg en reposo sobre superficie sin fricción. ¿Velocidad final?

Conservación del momento: $m_b v_b = (m_b + m_B)\,v_f \Rightarrow v_f = (0{,}01 \cdot 400)/2{,}01 \approx 1{,}99\,\mathrm{m/s}$. Energía cinética perdida: $99\%$ (transformada en calor y deformación).

**Aplicaciones reales:** sistemas ABS, diseño de cinturones de seguridad, balística forense, montañas rusas (conservación de energía).
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
    readingMinutes: 24,
    summary:
      "Oscilador armónico, péndulos, ondas mecánicas, superposición, efecto Doppler.",
    sections: [
      {
        id: "historia-y-contexto",
        title: "Historia y contexto",
        keywords: ["historia", "contexto", "origen"],
        body: `
**Christian Huygens** construyó el primer reloj de péndulo en 1656, observando que su periodo casi no depende de la amplitud (isocronismo aproximado). En el siglo XIX, **Helmholtz**, **Rayleigh** y **Fourier** establecieron la teoría matemática de las ondas, fundamento de la acústica, la óptica y, mucho después, la mecánica cuántica.
`,
      },
      {
        id: "oscilador-armonico",
        title: "Oscilador armónico simple",
        keywords: ["oscilador", "armónico", "MAS", "frecuencia natural"],
        body: `
El **oscilador armónico** es el modelo más recurrente de la física. Cualquier sistema cerca de un mínimo de energía potencial se comporta —en primera aproximación— como un oscilador armónico. Por eso aparece en mecánica, electromagnetismo, mecánica cuántica y procesamiento de señales.

Un sistema gobernado por una fuerza restauradora lineal $F = -kx$ obedece la ecuación diferencial:

$$m\\ddot{x} + kx = 0$$

cuya solución general es:

$$x(t) = A\\cos(\\omega_n t + \\varphi)$$

con **frecuencia natural** $\\omega_n = \\sqrt{k/m}$ y **periodo** $T = 2\\pi/\\omega_n$. Los parámetros $A$ y $\\varphi$ se fijan con las condiciones iniciales.

> **Observación clave:** el periodo **no depende de la amplitud**. Esta propiedad —el *isocronismo*— es lo que hizo a Galileo proponer el péndulo como medidor de tiempo. Solo es exacta para el oscilador armónico ideal; se viola en cuanto la fuerza deja de ser exactamente lineal.

La **energía mecánica** total se conserva y oscila entre cinética y potencial:

$$E = \\tfrac{1}{2}kA^2 = \\tfrac{1}{2}mv_{\\max}^2$$

con $v_{\\max} = \\omega_n A$. Cuanto mayor es la amplitud, mayor es la velocidad máxima y la energía almacenada.
`,
      },
      {
        id: "amortiguamiento",
        title: "Oscilador amortiguado",
        keywords: ["amortiguamiento", "subamortiguado", "crítico", "sobreamortiguado", "ζ"],
        body: `
En el mundo real toda oscilación se extingue: el aire roza, los rodamientos disipan, el material se calienta. Modelamos esa pérdida con un término de fricción viscosa $-c\\dot x$ proporcional a la velocidad:

$$m\\ddot x + c\\dot x + k x = 0$$

Definimos el **factor de amortiguamiento adimensional** $\\zeta = c/(2\\sqrt{km})$. Según su valor obtenemos tres regímenes cualitativamente distintos:

| Régimen | Condición | Comportamiento |
|---------|-----------|----------------|
| Subamortiguado | $\\zeta < 1$ | Oscila con envolvente exponencial decreciente |
| Crítico | $\\zeta = 1$ | Vuelve al reposo lo más rápido posible **sin oscilar** |
| Sobreamortiguado | $\\zeta > 1$ | Vuelve al reposo lentamente, sin oscilar |

El amortiguamiento crítico es el ideal en aplicaciones de ingeniería: las suspensiones de un coche se diseñan cerca de $\\zeta = 1$ para que el chasis vuelva al equilibrio rápidamente sin rebotar.

En el régimen subamortiguado la frecuencia angular real es $\\omega_d = \\omega_n\\sqrt{1-\\zeta^2}$, ligeramente menor que $\\omega_n$, y la amplitud decae como $e^{-\\zeta\\omega_n t}$. La animación permite recorrer los tres regímenes deslizando $c$.
`,
        widget: "phys-spring",
      },
      {
        id: "pendulo",
        title: "Péndulo simple",
        keywords: ["péndulo", "pequeñas oscilaciones", "isocronismo"],
        body: `
El péndulo simple —una masa puntual colgando de un hilo inextensible sin masa— es el segundo oscilador clásico. Su ecuación exacta es:

$$\\ddot\\theta + \\frac{g}{L}\\sin\\theta = 0$$

que **no es lineal** y, en general, no tiene solución elemental. Pero para ángulos pequeños, $\\sin\\theta \\approx \\theta$, y recuperamos el oscilador armónico:

$$\\ddot\\theta + \\frac{g}{L}\\theta = 0, \\qquad T = 2\\pi\\sqrt{L/g}$$

El periodo **no depende de la amplitud** ni de la masa: solo de la longitud y de $g$. Esta es la ley de **isocronismo** que descubrió Galileo observando una lámpara en la catedral de Pisa, y que dio origen al reloj de péndulo.

> **¿Hasta qué ángulo es válida la aproximación?** El error en el periodo crece con $\\theta_0^2$. Para $\\theta_0 = 15°$ es ~0,4 %; para $30°$ ya ~1,7 %; para $90°$ ~18 %. La corrección a primer orden es $T \\approx T_0(1 + \\theta_0^2/16)$.

Como el periodo depende de $L$ y $g$, un péndulo es también un **gravímetro**: mediciones precisas del periodo permiten medir variaciones locales de $g$ (útil en geofísica). La animación permite explorar cómo cambia $T$ con $L$ y $g$ (prueba simular Marte con $g = 3{,}7$).
`,
        widget: "phys-pendulum",
      },
      {
        id: "ondas-armonicas",
        title: "Ondas armónicas y ecuación de onda",
        keywords: ["onda", "longitud de onda", "frecuencia", "número de onda"],
        body: `
Una **onda** es una perturbación que se propaga transportando energía y cantidad de movimiento, pero **no materia**. La forma más sencilla es la onda armónica unidimensional:

$$y(x, t) = A\\sin(kx - \\omega t + \\varphi)$$

con cuatro magnitudes interrelacionadas:

- **Amplitud** $A$: máximo desplazamiento desde el equilibrio.
- **Número de onda** $k = 2\\pi/\\lambda$: cuántos radianes de fase entran en un metro.
- **Pulsación** $\\omega = 2\\pi f$: cuántos radianes de fase pasan por un punto fijo en un segundo.
- **Velocidad de fase** $v = \\omega/k = \\lambda f$: velocidad a la que se propaga un patrón de fase constante.

La ecuación que las ondas satisfacen, deducible de leyes locales (Newton para una cuerda, Maxwell para la luz), es la **ecuación de onda** clásica:

$$\\frac{\\partial^2 y}{\\partial t^2} = v^2 \\frac{\\partial^2 y}{\\partial x^2}$$

Es lineal: cualquier combinación de soluciones es solución (principio de superposición). Y admite no solo armónicas sino *cualquier* función de la forma $f(x - vt)$ —pulsos arbitrarios que viajan a velocidad $v$ sin deformarse.

> **Confusión típica:** una onda transversal no transporta materia. Las moléculas del medio oscilan localmente alrededor de su posición de equilibrio; lo que viaja es la perturbación, no las partículas. Por eso una boya en el mar sube y baja, no se va con la ola.
`,
        widget: "phys-wave",
      },
      {
        id: "superposicion",
        title: "Superposición e interferencia",
        keywords: ["interferencia", "constructiva", "destructiva", "batidos"],
        body: `
Como la ecuación de onda es lineal, dos ondas que coexisten en una región se **suman algebraicamente**. La onda resultante depende crucialmente de la diferencia de fase entre ambas.

Para dos ondas armónicas coherentes (igual frecuencia, fase relativa estable) de amplitudes $A_1$ y $A_2$:

$$A_R^2 = A_1^2 + A_2^2 + 2A_1 A_2 \\cos\\Delta\\varphi$$

Casos extremos:

- **Interferencia constructiva**: $\\Delta\\varphi = 2\\pi n$. Las amplitudes se suman: $A_R = A_1 + A_2$. Si $A_1 = A_2$, la intensidad se cuadruplica (no se duplica).
- **Interferencia destructiva**: $\\Delta\\varphi = (2n+1)\\pi$. Las amplitudes se restan: $A_R = |A_1 - A_2|$. Si $A_1 = A_2$, anulación total.

La interferencia es la huella digital del comportamiento ondulatorio. Cuando se observó interferencia con electrones (Davisson–Germer, 1927) quedó probado que las partículas tienen también naturaleza ondulatoria.

**Batidos.** Si las dos ondas tienen frecuencias muy próximas $f_1 \\approx f_2$, la suma se modula: la amplitud envolvente oscila a frecuencia $|f_1 - f_2|$. Por eso un afinador de oído puede igualar dos cuerdas de guitarra escuchando los batidos: cuando desaparecen, las frecuencias coinciden.

$$\\sin(2\\pi f_1 t) + \\sin(2\\pi f_2 t) = 2\\cos\\!\\left(2\\pi\\frac{f_1-f_2}{2}t\\right)\\sin\\!\\left(2\\pi\\frac{f_1+f_2}{2}t\\right)$$
`,
      },
      {
        id: "doppler",
        title: "Efecto Doppler",
        keywords: ["doppler", "frecuencia percibida", "fuente", "observador"],
        body: `
Cuando emisor y receptor se mueven respecto al medio, la frecuencia percibida no coincide con la emitida. Es lo que provoca el cambio característico de tono cuando una ambulancia pasa a tu lado.

La fórmula general (movimientos a lo largo de la línea fuente-observador):

$$f' = f_0 \\,\\frac{c + v_o}{c - v_s}$$

donde:

- $c$ es la velocidad de propagación de la onda en el medio (343 m/s para sonido en aire).
- $v_o$ es la velocidad del observador, **positiva si se acerca** a la fuente.
- $v_s$ es la velocidad de la fuente, **positiva si se acerca** al observador.

Cuando la fuente se acerca, $f' > f_0$ (sonido más agudo). Cuando se aleja, $f' < f_0$ (más grave). Lo mismo si quien se mueve es el observador.

> **Aplicaciones reales:** medición de velocidad por radar (luz reflejada en un coche), ecografía Doppler para medir flujo sanguíneo, corrimiento al rojo cosmológico (galaxias alejándose) que llevó a Hubble a postular la expansión del universo. En ese caso la fórmula es relativista, no la de arriba.

Caso especial: si la fuente alcanza a la propia onda ($v_s \\to c$), la fórmula explota. Es la onda de choque (Mach cone): una concentración brusca de energía que percibimos como un *bang* sónico. Aviones supersónicos, balas y rayos producen este fenómeno.
`,
        widget: "phys-doppler",
      },
          {
        id: "problemas-resueltos",
        title: "Problemas resueltos y aplicaciones",
        keywords: ["ejemplos", "problemas resueltos", "aplicaciones"],
        body: `
**Problema 1 — masa-resorte.** Un resorte de $k = 200\,\mathrm{N/m}$ con masa de 0,5 kg oscila. Frecuencia angular $\omega = \sqrt{k/m} = 20\,\mathrm{rad/s}$ → $f \approx 3{,}18\,\mathrm{Hz}$. Si la amplitud es 5 cm, la velocidad máxima es $v_{max} = \omega A = 1\,\mathrm{m/s}$.

**Problema 2 — onda en una cuerda.** Cuerda de guitarra de 65 cm afinada en La (440 Hz) en su modo fundamental. La longitud de onda es $2L = 1{,}3\,\mathrm{m}$, así que la velocidad de propagación es $v = f\lambda = 572\,\mathrm{m/s}$. De $v=\sqrt{T/\mu}$ con $\mu \sim 10^{-3}\,\mathrm{kg/m}$ se obtiene $T\approx 327\,\mathrm{N}$ — sí, tu guitarra tira con esa fuerza.

**Aplicaciones:** instrumentos musicales, sismología, ecografías, antenas.
`,
      },
    ],
  },

  // ─────────────────────────── 3
  {
    slug: "termodinamica",
    title: "Termodinámica",
    category: "fisica",
    level: "intermedio",
    readingMinutes: 22,
    summary:
      "Temperatura, calor, leyes de la termodinámica, ciclos y entropía.",
    sections: [
      {
        id: "historia-y-contexto",
        title: "Historia y contexto",
        keywords: ["historia", "contexto", "origen"],
        body: `
La termodinámica nació con la **revolución industrial**. **Sadi Carnot (1824)** estudió la eficiencia máxima de las máquinas de vapor antes incluso de que existiera el concepto formal de energía. **James Joule** demostró experimentalmente la equivalencia entre calor y trabajo (1843). **Clausius (1865)** introdujo la entropía y la flecha del tiempo. **Boltzmann** dio interpretación estadística a la entropía: $S = k_B \ln W$, fórmula grabada en su tumba en Viena.
`,
      },
      {
        id: "temperatura-calor",
        title: "Temperatura, calor y trabajo",
        keywords: ["temperatura", "calor", "capacidad calorífica"],
        body: `
La termodinámica es la teoría que relaciona magnitudes macroscópicas (presión, temperatura, volumen) sin necesidad de seguir cada átomo individualmente. Tres conceptos fundamentales:

- **Temperatura** $T$: mide la energía cinética media de las partículas. No es energía, sino una medida estadística. Su escala absoluta es el kelvin: $T = 0$ K corresponde al mínimo posible (no a la ausencia total de movimiento, por la mecánica cuántica).
- **Calor** $Q$: energía en tránsito por **diferencia de temperatura**. Fluye espontáneamente del cuerpo caliente al frío. No es una propiedad almacenada en el cuerpo (ese sería su *energía interna*).
- **Trabajo** $W$: energía intercambiada por **desplazamiento de fronteras** o ejes. Un pistón que comprime un gas le transfiere energía como trabajo.

La distinción calor/trabajo es histórica: ambos son formas de energía en tránsito, pero termodinámicamente se cuentan por separado porque son cualitativamente distintos (el segundo principio dirá que no son intercambiables sin pérdida).

Para calentar una masa $m$ de una sustancia una temperatura $\\Delta T$ sin cambio de fase:

$$Q = m c \\Delta T$$

donde $c$ es el **calor específico** (J/kg·K). El agua tiene un $c$ excepcionalmente alto (4186 J/kg·K), por eso modera el clima costero y la usamos como refrigerante.

Para cambios de fase a temperatura constante: $Q = m L$, con $L$ el **calor latente** de fusión o vaporización.
`,
      },
      {
        id: "primer-principio",
        title: "Primer principio",
        keywords: ["primer principio", "energía interna", "ΔU = Q − W"],
        body: `
El primer principio es **la conservación de la energía** aplicada a sistemas termodinámicos. Establece que existe una función de estado $U$ —la **energía interna**— tal que:

$$\\Delta U = Q - W$$

donde $Q$ es el calor entrante (positivo si el sistema lo absorbe) y $W$ es el trabajo hecho **por** el sistema (positivo si se expande contra el entorno). En forma diferencial:

$$dU = \\delta Q - \\delta W$$

(usamos $\\delta$ para señalar que $Q$ y $W$ no son funciones de estado: dependen del camino).

> **Trampa de signos:** algunos textos definen $W$ como trabajo *hecho sobre* el sistema; entonces aparece $\\Delta U = Q + W$. No es un error físico, solo de convenio. Comprueba siempre la convención antes de aplicar la fórmula.

La **entalpía** $H = U + pV$ es una función de estado especialmente útil cuando el proceso ocurre a presión constante: en ese caso $\\Delta H = Q_p$. Por eso las tablas químicas dan entalpías de reacción: la presión atmosférica es prácticamente constante en el laboratorio.

Una consecuencia inmediata es la imposibilidad de un **móvil perpetuo de primera especie**: una máquina que produzca trabajo sin consumir energía violaría el primer principio.
`,
      },
      {
        id: "gas-ideal",
        title: "Gas ideal",
        keywords: ["gas ideal", "pV=nRT", "isoterma", "adiabática"],
        body: `
Un **gas ideal** es un modelo: partículas puntuales sin interacciones más allá de choques elásticos. Real para gases reales a baja presión y alta temperatura.

La ecuación de estado:

$$pV = nRT$$

con $R = 8{,}314\\,\\mathrm{J/(mol\\cdot K)}$. Establece una relación rígida entre las tres variables; solo dos son independientes.

Procesos típicos en el plano $p$-$V$:

| Proceso | Constante | $W = \\int p\\,dV$ | Q | ΔU |
|---------|-----------|-------------------|---|-----|
| Isócoro | $V$ | $0$ | $nC_v\\Delta T$ | $Q$ |
| Isobárico | $p$ | $p\\Delta V$ | $nC_p\\Delta T$ | $Q - W$ |
| Isotermo | $T$ | $nRT\\ln(V_2/V_1)$ | $W$ | $0$ |
| Adiabático | $Q = 0$ | $-\\Delta U$ | $0$ | $-W$ |

El proceso adiabático satisface además $pV^\\gamma = \\text{cte}$, con $\\gamma = C_p/C_v$ (5/3 para gases monoatómicos, 7/5 para diatómicos como el aire). Por eso el aire que se comprime rápidamente en una bomba de bicicleta se calienta: la compresión adiabática no permite tiempo para que el calor escape.

Manipula la simulación para observar isotermas: a mayor $T$, la isoterma se aleja del origen; cambiar $n$ escala todo verticalmente.
`,
        widget: "chem-gas",
      },
      {
        id: "segundo-principio",
        title: "Segundo principio y entropía",
        keywords: ["segundo principio", "entropía", "Carnot", "irreversibilidad"],
        body: `
El primer principio prohíbe procesos que violen la conservación de la energía. El segundo principio prohíbe procesos que **sí** la conservan pero no ocurren nunca: una taza de café no se calienta espontáneamente enfriando el aire que la rodea, aunque la energía total se conservaría.

Existe una función de estado $S$ —la **entropía**— tal que en un proceso reversible:

$$dS = \\frac{\\delta Q_\\text{rev}}{T}$$

y, para todo proceso real (incluyendo el aislado universo):

$$\\Delta S_{\\text{universo}} \\ge 0$$

La igualdad solo se alcanza en procesos reversibles, que son una idealización. Todo proceso real es irreversible y aumenta la entropía del universo.

> **Interpretación estadística (Boltzmann):** $S = k_B \\ln \\Omega$, donde $\\Omega$ es el número de microestados compatibles con el macroestado. La entropía mide el desorden o, mejor dicho, la *multiplicidad*: hay muchísimos más microestados que corresponden a "gas uniforme en la habitación" que a "todo el gas en una esquina". Por eso las cosas tienden a desordenarse.

**Carnot.** El rendimiento máximo posible para una máquina que opera entre dos focos a $T_h$ y $T_c$:

$$\\eta_C = 1 - \\frac{T_c}{T_h}$$

Este límite es **independiente del fluido y del diseño**. Por eso las centrales térmicas modernas se diseñan con vapor a 600 °C y agua de refrigeración a 30 °C: cada grado adicional de $T_h$ o cada grado menos de $T_c$ ganan eficiencia.
`,
      },
      {
        id: "transferencia-calor",
        title: "Modos de transferencia de calor",
        keywords: ["conducción", "convección", "radiación", "Fourier", "Stefan-Boltzmann"],
        body: `
El calor se transfiere por tres mecanismos distintos, normalmente actuando en simultáneo.

**Conducción** (sólidos, fluidos en reposo). Ley de Fourier:

$$\\dot q = -k A\\,\\frac{dT}{dx}$$

El signo menos refleja que el calor fluye de mayor a menor temperatura. La conductividad $k$ varía cinco órdenes de magnitud entre el aire ($k \\approx 0{,}025$) y el cobre ($k \\approx 400$ W/m·K). Por eso aislamos con materiales porosos que atrapan aire estanco.

**Convección** (transferencia entre una superficie y un fluido en movimiento). Ley de Newton del enfriamiento:

$$\\dot q = h A (T_s - T_\\infty)$$

El coeficiente $h$ depende del régimen (laminar/turbulento), la geometría y las propiedades del fluido. Convección natural: el fluido se mueve por su propia diferencia de densidad. Convección forzada: hay un ventilador o bomba.

**Radiación** (transferencia por ondas electromagnéticas, sin medio). Ley de Stefan–Boltzmann:

$$\\dot q = \\varepsilon\\sigma A(T_s^4 - T_\\infty^4)$$

con $\\sigma = 5{,}67\\times 10^{-8}\\,\\mathrm{W/(m^2 K^4)}$ y $\\varepsilon$ la emisividad de la superficie (1 para un cuerpo negro ideal). La dependencia con $T^4$ hace que la radiación sea despreciable a temperatura ambiente y dominante en superficies muy calientes (filamentos, fundiciones, el Sol).

En ingeniería se trata cada modo con su propia "resistencia térmica" y se combinan en serie/paralelo como en un circuito eléctrico. La simulación muestra el perfil estacionario en una pared compuesta.
`,
        widget: "eng-heat",
      },
          {
        id: "problemas-resueltos",
        title: "Problemas resueltos y aplicaciones",
        keywords: ["ejemplos", "problemas resueltos", "aplicaciones"],
        body: `
**Problema 1 — gas ideal.** 2 mol de aire a 27 °C y 1 atm. Volumen: $V = nRT/P = 2 \cdot 8{,}314 \cdot 300/101325 \approx 0{,}049\,\mathrm{m^3}$ = 49 L.

**Problema 2 — eficiencia Carnot.** Una central térmica opera entre 550 °C (caldera) y 30 °C (río). $\eta_{max} = 1 - 303/823 \approx 63\%$. Las plantas reales rondan el 40 % por irreversibilidades.

**Aplicaciones:** motores, frigoríficos, climatización, biología (metabolismo), cosmología.
`,
      },
    ],
  },

  // ─────────────────────────── 4
  {
    slug: "electromagnetismo",
    title: "Electromagnetismo",
    category: "fisica",
    level: "avanzado",
    readingMinutes: 26,
    summary:
      "Ley de Coulomb, campos eléctrico y magnético, leyes de Maxwell y ondas EM.",
    sections: [
      {
        id: "historia-y-contexto",
        title: "Historia y contexto",
        keywords: ["historia", "contexto", "origen"],
        body: `
**Coulomb (1785)** estableció con su balanza de torsión la ley de fuerzas entre cargas. **Oersted (1820)** descubrió por accidente que una corriente desvía una brújula, conectando electricidad y magnetismo. **Faraday** descubrió la inducción (1831) sin conocer matemáticas avanzadas. **James Clerk Maxwell (1865)** unificó todo en cuatro ecuaciones y predijo que la luz es una onda electromagnética — confirmado por **Hertz** en 1887.
`,
      },
      {
        id: "coulomb",
        title: "Ley de Coulomb y campo eléctrico",
        keywords: ["Coulomb", "campo eléctrico", "carga"],
        body: `
La interacción electromagnética es la responsable de prácticamente todos los fenómenos macroscópicos no gravitatorios: enlaces químicos, propiedades de los materiales, luz, electrónica. Tiene dos manifestaciones unificadas: campo eléctrico y campo magnético.

La fuerza entre dos cargas puntuales en reposo es la **ley de Coulomb**:

$$\\vec F = \\frac{1}{4\\pi\\varepsilon_0}\\,\\frac{q_1 q_2}{r^2}\\,\\hat r$$

con $1/(4\\pi\\varepsilon_0) \\approx 9 \\times 10^9$ N·m²/C². Es atractiva entre cargas opuestas, repulsiva entre iguales. Su forma $1/r^2$ es idéntica a la de Newton para gravedad, pero la constante de Coulomb es ~$10^{36}$ veces mayor que la gravitatoria por par electrón-protón. Por eso la gravedad solo importa para masas enormes: a escala atómica no se nota.

El **campo eléctrico** $\\vec E$ se define como la fuerza por unidad de carga de prueba:

$$\\vec E(\\vec r) = \\vec F/q$$

Esto convierte a la fuerza en un campo: una propiedad del espacio que rodea a las cargas, independiente de la carga de prueba. El campo de una carga puntual:

$$\\vec E = \\frac{1}{4\\pi\\varepsilon_0}\\,\\frac{q}{r^2}\\,\\hat r$$

Para distribuciones complejas usamos el **principio de superposición** (las fuentes se suman vectorialmente) o la **ley de Gauss**:

$$\\oint \\vec E \\cdot d\\vec A = \\frac{Q_\\text{enc}}{\\varepsilon_0}$$

Útil cuando hay simetría esférica, cilíndrica o plana: convierte un cálculo integral en uno trivial.
`,
      },
      {
        id: "ley-ohm",
        title: "Corriente, resistencia y ley de Ohm",
        keywords: ["corriente", "resistencia", "Ohm", "potencia eléctrica"],
        body: `
La **corriente eléctrica** $I = dq/dt$ mide la carga que atraviesa una sección por unidad de tiempo. Se mide en amperios (1 A = 1 C/s). Por convención fluye en el sentido de las cargas positivas, aunque en metales los portadores son electrones que se mueven en sentido opuesto.

Para un conductor "óhmico" (la mayoría de metales a temperatura moderada), la corriente es proporcional a la diferencia de potencial:

$$V = I R$$

con $R$ la **resistencia** en ohmios. La ley de Ohm no es una ley fundamental sino una propiedad empírica de ciertos materiales; los semiconductores y los componentes electrónicos no óhmicos (diodos, transistores) la violan deliberadamente.

Microscópicamente, $R = \\rho L/A$ donde $\\rho$ es la **resistividad** del material (Ω·m), $L$ la longitud y $A$ la sección. Un cable largo y delgado tiene más resistencia que uno corto y grueso.

La **potencia disipada** por efecto Joule:

$$P = VI = I^2 R = \\frac{V^2}{R}$$

Es la energía eléctrica que se convierte en calor por las colisiones de los electrones con la red cristalina. Por eso las líneas de alta tensión transportan electricidad a cientos de kV: para el mismo $P$, un $V$ alto significa un $I$ bajo y por tanto pérdidas $I^2R$ pequeñas.
`,
        widget: "phys-ohm",
      },
      {
        id: "circuito-rc",
        title: "Circuitos RC",
        keywords: ["RC", "constante de tiempo", "carga", "descarga"],
        body: `
Un circuito RC en serie con una fuente de tensión continua $V$ es el ejemplo más simple de respuesta dinámica: el condensador no se carga instantáneamente sino siguiendo una exponencial.

La ecuación que rige la carga $q(t)$ del condensador, aplicando Kirchhoff:

$$R\\frac{dq}{dt} + \\frac{q}{C} = V$$

Resolviéndola con condición inicial $q(0) = 0$:

$$V_C(t) = V\\left(1 - e^{-t/\\tau}\\right), \\qquad \\tau = RC$$

La **constante de tiempo** $\\tau = RC$ tiene unidades de segundos y mide la rapidez de carga. Tras $1\\tau$ la tensión alcanza ~63%; tras $3\\tau$, ~95%; tras $5\\tau$, ~99% (en la práctica se considera "cargado").

La corriente, por su parte, decae:

$$I(t) = \\frac{V}{R} e^{-t/\\tau}$$

Empieza máxima ($V/R$, como si el condensador fuera un cortocircuito) y termina nula (cuando el condensador iguala la tensión de la fuente, no hay diferencia de potencial que mueva carga).

El RC aparece en filtros, temporizadores, antirrebote de pulsadores, modelos de membranas neuronales… Es la primera ecuación diferencial que un ingeniero electrónico aprende a resolver.
`,
        widget: "phys-rc",
      },
      {
        id: "induccion",
        title: "Inducción electromagnética",
        keywords: ["inducción", "Faraday", "flujo", "Lenz"],
        body: `
Faraday descubrió en 1831 que un campo magnético variable induce una **fuerza electromotriz** en un circuito:

$$\\varepsilon = -\\frac{d\\Phi_B}{dt}$$

donde $\\Phi_B = \\int \\vec B \\cdot d\\vec A$ es el flujo magnético. El signo menos (ley de Lenz) indica que la corriente inducida se opone al cambio de flujo: la naturaleza "resiste" a la perturbación.

Esta ley es la base de:

- **Generadores eléctricos**: una bobina gira en un campo magnético, el flujo varía sinusoidalmente y se induce una corriente alterna.
- **Transformadores**: dos bobinas acopladas magnéticamente; la relación de tensiones es la relación de espiras.
- **Frenos electromagnéticos**, **inducción en placas de cocina**, **dinamos**.

La inducción es uno de los puentes que unifican electricidad y magnetismo: campos eléctricos y magnéticos no son entidades separadas sino dos caras del mismo tensor electromagnético.
`,
      },
      {
        id: "maxwell",
        title: "Ecuaciones de Maxwell",
        keywords: ["Maxwell", "Gauss", "Faraday", "Ampère"],
        body: `
Las cuatro ecuaciones de Maxwell condensan **toda** la electrodinámica clásica. En el vacío y forma diferencial:

$$\\nabla\\cdot\\vec E = \\rho/\\varepsilon_0 \\quad \\text{(Gauss eléctrica: las cargas son fuentes de E)}$$

$$\\nabla\\cdot\\vec B = 0 \\quad \\text{(Gauss magnética: no hay monopolos magnéticos)}$$

$$\\nabla\\times\\vec E = -\\frac{\\partial \\vec B}{\\partial t} \\quad \\text{(Faraday: B variable induce E rotacional)}$$

$$\\nabla\\times\\vec B = \\mu_0 \\vec J + \\mu_0\\varepsilon_0\\,\\frac{\\partial\\vec E}{\\partial t} \\quad \\text{(Ampère–Maxwell)}$$

El último término —**la corriente de desplazamiento**, contribución original de Maxwell— es el que cierra el sistema y permite predecir las **ondas electromagnéticas**: combinando las dos ecuaciones rotacionales se obtiene la ecuación de onda para $\\vec E$ y $\\vec B$, con velocidad:

$$c = \\frac{1}{\\sqrt{\\mu_0\\varepsilon_0}} \\approx 3 \\times 10^8 \\,\\text{m/s}$$

Maxwell calculó esta velocidad en 1865 y observó que coincidía con la velocidad medida de la luz. **Conclusión:** la luz es una onda electromagnética. Una de las síntesis teóricas más impresionantes de la historia.

Las ondas EM existen en todo el espectro, desde las ondas de radio (km) hasta los rayos gamma (fm), pasando por microondas, infrarrojo, visible, UV y rayos X. Todas se propagan a $c$ en el vacío.
`,
        widget: "phys-em-wave",
      },
          {
        id: "problemas-resueltos",
        title: "Problemas resueltos y aplicaciones",
        keywords: ["ejemplos", "problemas resueltos", "aplicaciones"],
        body: `
**Problema 1 — campo de un cable.** Un cable largo lleva $I = 10\,\mathrm{A}$. A 5 cm: $B = \mu_0 I/(2\pi r) = 4\times 10^{-5}\,\mathrm{T}$, comparable al campo magnético terrestre.

**Problema 2 — circuito RC.** $R = 10\,\mathrm{k\Omega}$, $C = 100\,\mathrm{\mu F}$ → $\tau = 1\,\mathrm{s}$. Tras 5 constantes (5 s) está cargado al 99,3 %.

**Aplicaciones:** generadores, motores, transformadores, comunicaciones, MRI.
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
    readingMinutes: 18,
    summary:
      "Reflexión, refracción, lentes delgadas, difracción y polarización.",
    sections: [
      {
        id: "historia-y-contexto",
        title: "Historia y contexto",
        keywords: ["historia", "contexto", "origen"],
        body: `
**Snell (1621)** y **Descartes (1637)** formularon la ley de refracción. **Newton** defendió la teoría corpuscular de la luz; **Huygens** la ondulatoria. La cuestión se zanjó con el experimento de la doble rendija de **Thomas Young (1801)**, que mostró interferencia. Más tarde la mecánica cuántica restituyó parcialmente el carácter corpuscular: la luz es ambas cosas a la vez.
`,
      },
      {
        id: "reflexion-refraccion",
        title: "Reflexión y refracción",
        keywords: ["reflexión", "refracción", "Snell", "índice"],
        body: `
La óptica geométrica trata la luz como rayos rectilíneos, una aproximación válida cuando la longitud de onda es muy pequeña frente a los objetos involucrados.

**Ley de la reflexión.** El ángulo de incidencia es igual al de reflexión, ambos medidos desde la normal a la superficie. El rayo incidente, el reflejado y la normal son coplanarios.

**Ley de Snell** (refracción al pasar a un medio con distinto índice $n$):

$$n_1 \\sin\\theta_1 = n_2 \\sin\\theta_2$$

El índice de refracción $n = c/v$ mide cuánto se ralentiza la luz en el medio (1 en vacío, 1,33 en agua, 1,5 en vidrio común, ~2,4 en diamante). Cuanto mayor $n$, más se "dobla" el rayo hacia la normal.

> **Reflexión total interna.** Si $n_1 > n_2$ y $\\theta_1$ supera el ángulo crítico $\\theta_c = \\arcsin(n_2/n_1)$, no hay refracción posible: toda la luz se refleja. Es lo que permite que la fibra óptica conduzca luz por kilómetros sin pérdidas significativas, y lo que hace que los diamantes brillen tanto (ángulo crítico pequeño, atrapan la luz dentro).

La simulación permite explorar la dependencia $\\theta_2(\\theta_1)$ y observar la transición a reflexión total.
`,
        widget: "phys-snell",
      },
      {
        id: "lentes",
        title: "Lentes delgadas",
        keywords: ["lente", "distancia focal", "imagen"],
        body: `
Una lente convergente concentra rayos paralelos en un único punto, el **foco**, situado a distancia $f$ del centro óptico. Las divergentes los esparcen como si vinieran de un foco virtual.

La **ecuación de la lente delgada** relaciona la distancia objeto $s_o$, la distancia imagen $s_i$ y la focal $f$:

$$\\frac{1}{f} = \\frac{1}{s_o} + \\frac{1}{s_i}$$

con aumento lateral:

$$M = -\\frac{s_i}{s_o}$$

Convenio (Hecht): distancias positivas si están del lado donde corresponden físicamente al rayo (objeto a la izquierda, imagen real a la derecha). $f > 0$ para convergente, $f < 0$ para divergente. $M < 0$ significa imagen invertida; $|M| > 1$ aumentada.

**Casos típicos** (lente convergente):

| Posición del objeto | Imagen | Aplicación |
|---------------------|--------|------------|
| $s_o > 2f$ | Real, invertida, reducida | Cámara fotográfica |
| $s_o = 2f$ | Real, invertida, igual tamaño | Fotocopiadora 1:1 |
| $f < s_o < 2f$ | Real, invertida, aumentada | Proyector |
| $s_o = f$ | En el infinito | Colimador |
| $s_o < f$ | **Virtual**, derecha, aumentada | Lupa |

La animación permite mover el objeto y ver la imagen formarse en tiempo real.
`,
        widget: "phys-lens",
      },
      {
        id: "difraccion",
        title: "Difracción y patrón de doble rendija",
        keywords: ["difracción", "Young", "doble rendija", "interferencia"],
        body: `
Cuando la luz pasa por una abertura comparable a su longitud de onda, deja de comportarse como rayos: se difracta y, si hay varias aberturas, interfiere.

El **experimento de Young** (1801) usó dos rendijas paralelas iluminadas por una fuente monocromática y observó franjas oscuras y brillantes en una pantalla lejana. La separación entre máximos sucesivos:

$$\\Delta y = \\frac{\\lambda L}{d}$$

donde $d$ es la separación entre rendijas y $L$ la distancia a la pantalla. De esta fórmula se puede medir $\\lambda$ con precisión —fue así como se establecieron las longitudes de onda del visible.

Este experimento fue **la prueba decisiva** de la naturaleza ondulatoria de la luz. Pero su versión cuántica (un solo fotón a la vez, o un solo electrón) reveló además que las partículas individuales también producen el patrón de interferencia: la materia tiene naturaleza ondulatoria. Es uno de los fenómenos más profundos y desconcertantes de la física.

Las redes de difracción (muchas rendijas) producen máximos muy estrechos en posiciones $d\\sin\\theta = m\\lambda$ y son la base de los espectrómetros.
`,
      },
      {
        id: "polarizacion",
        title: "Polarización",
        keywords: ["polarización", "Malus", "luz polarizada"],
        body: `
La luz es una onda **transversal**: $\\vec E$ y $\\vec B$ vibran perpendicularmente a la dirección de propagación. La **polarización** indica en qué dirección oscila $\\vec E$.

La luz solar y la de las bombillas es **no polarizada**: superposición aleatoria de todas las direcciones transversales. Un **polarizador** transmite solo una componente. Si la luz polarizada con intensidad $I_0$ pasa por un segundo polarizador a ángulo $\\theta$ del primero:

$$I = I_0 \\cos^2\\theta \\quad \\text{(ley de Malus)}$$

Aplicaciones: gafas de sol polarizadas (filtran reflejos del agua o el asfalto, polarizados horizontalmente), pantallas LCD, fotografía profesional, tensiones en materiales transparentes (fotoelasticidad).
`,
      },
          {
        id: "problemas-resueltos",
        title: "Problemas resueltos y aplicaciones",
        keywords: ["ejemplos", "problemas resueltos", "aplicaciones"],
        body: `
**Problema 1 — lente convergente.** Objeto a $d_o = 30\,\mathrm{cm}$ de una lente con $f = 20\,\mathrm{cm}$. $1/d_i = 1/f - 1/d_o = 1/60$ → $d_i = 60\,\mathrm{cm}$, aumento $-2$ (invertida, doble de tamaño).

**Problema 2 — doble rendija.** Rendijas separadas $d=0{,}1\,\mathrm{mm}$, pantalla a $L=2\,\mathrm{m}$, luz de $\lambda=600\,\mathrm{nm}$. Separación de franjas: $\Delta y = \lambda L/d = 1{,}2\,\mathrm{cm}$.

**Aplicaciones:** gafas, cámaras, microscopios, fibras ópticas, holografía, LIDAR.
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
    readingMinutes: 16,
    summary: "Postulados de Einstein, dilatación temporal, contracción de Lorentz, equivalencia masa-energía.",
    sections: [
      {
        id: "historia-y-contexto",
        title: "Historia y contexto",
        keywords: ["historia", "contexto", "origen"],
        body: `
A finales del XIX las ecuaciones de Maxwell parecían incompatibles con la mecánica de Newton. **Michelson y Morley (1887)** intentaron medir el "éter" sin éxito. **Einstein (1905)**, con apenas 26 años y trabajando en una oficina de patentes en Berna, publicó cuatro artículos que revolucionaron la física. Uno postulaba que la velocidad de la luz es la misma para todos los observadores: nacía la relatividad especial.
`,
      },
      {
        id: "postulados",
        title: "Postulados de Einstein",
        keywords: ["relatividad", "postulado", "velocidad de la luz"],
        body: `
La relatividad especial (1905) reemplaza la mecánica de Newton para velocidades comparables a $c$. Se construye sobre dos postulados engañosamente simples:

1. **Principio de relatividad**: las leyes de la física son las mismas en todo sistema de referencia inercial. Ningún experimento mecánico, óptico o electromagnético interno permite saber si te mueves o estás en reposo.
2. **Constancia de $c$**: la velocidad de la luz en el vacío es la misma para todos los observadores inerciales, **sin importar el movimiento de la fuente o el observador**.

El segundo postulado entra en conflicto frontal con el sentido común galileano. Si voy a 100 km/h y enciendo los faros, los fotones no salen a $c + 100$ km/h: salen a $c$. Y un observador en reposo también los mide a $c$. ¿Cómo es posible? La respuesta de Einstein fue radical: **el tiempo y el espacio no son absolutos**. Cada observador tiene su propio reloj y su propia regla, y se relacionan por las transformaciones de Lorentz.

Toda la estructura siguiente —dilatación del tiempo, contracción de longitudes, $E = mc^2$— se deduce de estos dos postulados, sin más hipótesis físicas adicionales.
`,
      },
      {
        id: "dilatacion-tiempo",
        title: "Dilatación del tiempo y contracción de longitudes",
        keywords: ["dilatación", "Lorentz", "γ", "contracción"],
        body: `
Definimos el **factor de Lorentz**:

$$\\gamma = \\frac{1}{\\sqrt{1 - v^2/c^2}}$$

Para $v \\ll c$, $\\gamma \\approx 1$ y recuperamos la mecánica newtoniana. Para $v \\to c$, $\\gamma \\to \\infty$.

**Dilatación del tiempo.** Un reloj que se mueve a velocidad $v$ respecto a ti tic-taquea más lento por un factor $\\gamma$:

$$\\Delta t = \\gamma\\,\\Delta t_0$$

donde $\\Delta t_0$ es el intervalo medido en el sistema propio del reloj. Si fueras a 0,866 c, $\\gamma = 2$: tus relojes irían a la mitad de velocidad para un observador en Tierra.

**Contracción de longitudes.** Un objeto que se mueve a velocidad $v$ se mide más corto en la dirección del movimiento por un factor $\\gamma$:

$$L = L_0/\\gamma$$

Estos efectos son simétricos: cada observador mide los relojes y reglas del otro como dilatados/contraídos. **No hay paradoja**: simplemente "ahora" no significa lo mismo para ambos (relatividad de la simultaneidad).

> **Verificación experimental:** los muones cósmicos producidos en la alta atmósfera deberían decaer antes de llegar al suelo si solo viviesen $\\tau_0 \\approx 2{,}2\\,\\mu$s. Llegan en grandes cantidades porque, vistos desde Tierra, su tiempo propio se dilata por $\\gamma$ (~10 a velocidades típicas). Los GPS también requieren correcciones relativistas (especial y general) para no acumular errores de kilómetros al día.
`,
      },
      {
        id: "energia-masa",
        title: "Energía y masa",
        keywords: ["E=mc²", "energía relativista", "masa-energía"],
        body: `
La famosa relación de Einstein no aparece como postulado sino como consecuencia. Para una partícula libre de masa $m$ y momento $p$:

$$E^2 = (pc)^2 + (mc^2)^2$$

Casos especiales:

- En reposo ($p = 0$): $E = mc^2$. La masa es energía. Una manzana de 100 g almacena $\\sim 10^{16}$ J, equivalente a varias bombas atómicas. Esta energía es accesible solo en procesos nucleares.
- Para fotones ($m = 0$): $E = pc$. Los fotones tienen energía y momento sin tener masa en reposo.
- A bajas velocidades: $E \\approx mc^2 + \\tfrac{1}{2}mv^2$. Recuperamos la cinética newtoniana más una "energía en reposo" constante (que no afecta a la dinámica clásica).

La equivalencia masa-energía se confirma diariamente en aceleradores de partículas (creación de pares, fisión, fusión) y es la base del balance energético en estrellas y reactores nucleares.

La energía cinética relativista verdadera es:

$$E_c = (\\gamma - 1)mc^2$$

que diverge cuando $v \\to c$: por eso ningún cuerpo masivo puede alcanzar la velocidad de la luz; haría falta energía infinita.
`,
      },
          {
        id: "problemas-resueltos",
        title: "Problemas resueltos y aplicaciones",
        keywords: ["ejemplos", "problemas resueltos", "aplicaciones"],
        body: `
**Problema 1 — dilatación.** Un muón viaja al 99 % de $c$. $\gamma \approx 7$. Su vida propia es 2,2 µs; en el laboratorio dura $\approx 15{,}4\,\mathrm{\mu s}$, lo que explica que muones cósmicos lleguen a la superficie terrestre.

**Problema 2 — equivalencia masa-energía.** Aniquilar 1 g de materia con 1 g de antimateria libera $E = (2\times 10^{-3})c^2 \approx 1{,}8\times 10^{14}\,\mathrm{J}$ — equivalente a 43 kilotones de TNT.

**Aplicaciones:** GPS (corrige relatividad), aceleradores de partículas, energía nuclear.
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
    readingMinutes: 20,
    summary:
      "Función de onda, principio de incertidumbre, ecuación de Schrödinger y ejemplos elementales.",
    sections: [
      {
        id: "historia-y-contexto",
        title: "Historia y contexto",
        keywords: ["historia", "contexto", "origen"],
        body: `
A principios del s. XX surgieron varios "fallos" de la física clásica: el espectro del cuerpo negro, el efecto fotoeléctrico, las líneas espectrales. **Planck (1900)** introdujo la cuantización ad hoc para explicar el cuerpo negro. **Einstein (1905)** explicó el efecto fotoeléctrico con cuantos de luz (fotones). **De Broglie**, **Schrödinger**, **Heisenberg**, **Born** y **Dirac** construyeron entre 1924 y 1928 la mecánica cuántica moderna, base de toda la tecnología semiconductora actual.
`,
      },
      {
        id: "dualidad",
        title: "Dualidad onda-partícula",
        keywords: ["de Broglie", "fotón", "dualidad"],
        body: `
A finales del siglo XIX la física parecía cerrada: Newton para mecánica, Maxwell para electromagnetismo. Pero algunos experimentos (radiación del cuerpo negro, efecto fotoeléctrico, espectros atómicos) no encajaban. La salida fue postular que la energía está **cuantizada**.

Einstein (1905) explicó el efecto fotoeléctrico postulando que la luz se compone de paquetes discretos —**fotones**— de energía $E = hf$. Hasta entonces se la creía estrictamente onda.

De Broglie (1924) extendió la idea: si las ondas tienen propiedades de partícula, ¿por qué no las partículas propiedades de onda? Postuló que a toda partícula de momento $p$ se asocia una longitud de onda:

$$\\lambda = \\frac{h}{p}, \\qquad h = 6{,}626\\times 10^{-34}\\,\\mathrm{J\\cdot s}$$

Para objetos macroscópicos (una pelota de tenis), $\\lambda$ es ~$10^{-34}$ m: indetectable. Para electrones ($p$ pequeño), $\\lambda$ es ~Å, comparable a distancias atómicas. Por eso los electrones difractan en cristales (Davisson–Germer, 1927) y se usan microscopios electrónicos para resolver detalles más finos que los del óptico.

La dualidad no es una contradicción: las partículas cuánticas son entidades nuevas que se manifiestan como onda en unos experimentos y como partícula en otros. La descripción correcta es la mecánica cuántica.
`,
      },
      {
        id: "incertidumbre",
        title: "Principio de incertidumbre de Heisenberg",
        keywords: ["incertidumbre", "Heisenberg", "Δx Δp"],
        body: `
La famosa relación de Heisenberg (1927):

$$\\Delta x \\,\\Delta p \\ge \\frac{\\hbar}{2}$$

establece que **no es posible** conocer simultáneamente la posición y el momento de una partícula con precisión arbitraria. Cuanto más estrechamente localizamos un electrón, más se dispersa su distribución de momentos, y viceversa.

> No es una limitación instrumental sino una propiedad intrínseca de la naturaleza cuántica. No depende del experimento ni del observador.

Una relación análoga existe para energía y tiempo:

$$\\Delta E\\,\\Delta t \\ge \\hbar/2$$

que permite la existencia de partículas virtuales (responsables de las fuerzas fundamentales) durante intervalos de tiempo muy breves.

Una consecuencia es que el "estado fundamental" de un oscilador cuántico no tiene energía cero: tendría $\\Delta x = 0$ y $\\Delta p = 0$, prohibido. Existe una **energía de punto cero** $E_0 = \\tfrac{1}{2}\\hbar\\omega$ que persiste incluso a 0 K.
`,
      },
      {
        id: "schrodinger",
        title: "Ecuación de Schrödinger",
        keywords: ["Schrödinger", "función de onda", "Hamiltoniano"],
        body: `
El estado cuántico de un sistema se describe por una **función de onda compleja** $\\Psi(\\vec r, t)$. Su interpretación (Born) es probabilística: $|\\Psi|^2$ es la densidad de probabilidad de encontrar la partícula en $\\vec r$ en el instante $t$.

La evolución temporal está gobernada por la **ecuación de Schrödinger**:

$$i\\hbar\\frac{\\partial \\Psi}{\\partial t} = -\\frac{\\hbar^2}{2m}\\nabla^2\\Psi + V\\Psi$$

El operador del miembro derecho es el **Hamiltoniano** $\\hat H$ (energía cinética + potencial). La ecuación es lineal: vale el principio de superposición (los estados pueden combinarse y el resultado es otro estado válido).

Para sistemas estacionarios separamos variables: $\\Psi(\\vec r, t) = \\psi(\\vec r) e^{-iEt/\\hbar}$, y obtenemos la **ecuación de Schrödinger independiente del tiempo**:

$$\\hat H \\psi = E \\psi$$

un problema de autovalores. Las energías permitidas $E_n$ son los autovalores del Hamiltoniano. Para un átomo de hidrógeno: $E_n = -13{,}6/n^2$ eV, exactamente lo que Bohr postuló por intuición.

Para una partícula en un pozo unidimensional infinito de anchura $L$:

$$E_n = \\frac{n^2 \\pi^2 \\hbar^2}{2mL^2}, \\qquad n = 1, 2, 3, \\dots$$

La cuantización surge naturalmente al imponer que $\\psi$ se anule en las paredes.
`,
      },
      {
        id: "decaimiento",
        title: "Decaimiento radiactivo",
        keywords: ["decaimiento", "vida media", "exponencial", "λ"],
        body: `
El decaimiento radiactivo es un proceso cuántico genuino: cada núcleo individual decae aleatoriamente, pero el conjunto sigue una ley estadística precisa. Si la probabilidad de decaimiento por unidad de tiempo es $\\lambda$ (constante), la población restante sigue:

$$N(t) = N_0 e^{-\\lambda t}$$

La **vida media** $t_{1/2}$ es el tiempo necesario para que la mitad de los núcleos haya decaído:

$$t_{1/2} = \\frac{\\ln 2}{\\lambda}$$

Es independiente de la edad del núcleo (los átomos no "envejecen": un C-14 de hace mil años tiene la misma probabilidad de decaer en el próximo segundo que uno recién creado).

Aplicaciones:

- **Datación radiactiva**: el C-14 tiene $t_{1/2} \\approx 5730$ años, útil para arqueología hasta ~50 mil años. El U-Pb tiene $t_{1/2}$ del orden de miles de millones de años, útil en geocronología.
- **Medicina nuclear**: isótopos como Tc-99m (6 h) marcan tejidos en gammagrafías y se eliminan rápidamente.
- **Reactores y armas**: la cinética del decaimiento gobierna el comportamiento de la fisión.
`,
        widget: "phys-decay",
      },
          {
        id: "problemas-resueltos",
        title: "Problemas resueltos y aplicaciones",
        keywords: ["ejemplos", "problemas resueltos", "aplicaciones"],
        body: `
**Problema 1 — longitud de onda de De Broglie.** Electrón a $v = 10^6\,\mathrm{m/s}$. $\lambda = h/(mv) = 6{,}63\times 10^{-34}/(9{,}11\times 10^{-31}\cdot 10^6) \approx 0{,}73\,\mathrm{nm}$, comparable a distancias atómicas → de ahí la difracción de electrones.

**Problema 2 — incertidumbre.** Si conocemos la posición de un electrón con precisión $\Delta x = 10^{-10}\,\mathrm{m}$ (un átomo): $\Delta p \ge \hbar/(2\Delta x) \Rightarrow \Delta v \ge 5{,}8\times 10^5\,\mathrm{m/s}$. Imposible "ver" un electrón quieto.

**Aplicaciones:** transistores, láseres, MRI, criptografía cuántica, computación cuántica.
`,
      },
    ],
  },

  // ───────── 8
  {
    slug: "fluidos",
    title: "Mecánica de fluidos",
    category: "fisica",
    level: "intermedio",
    readingMinutes: 16,
    summary: "Presión, principio de Arquímedes, ecuación de Bernoulli, viscosidad.",
    sections: [
      {
        id: "historia-y-contexto",
        title: "Historia y contexto",
        keywords: ["historia", "contexto", "origen"],
        body: `
**Arquímedes (s. III a.C.)** descubrió en su famoso baño el principio del empuje. **Daniel Bernoulli (1738)**, en *Hydrodynamica*, formuló la conservación de la energía para fluidos ideales. **Navier (1822)** y **Stokes (1845)** derivaron las ecuaciones que gobiernan los fluidos viscosos, todavía objeto de uno de los Problemas del Milenio del Clay Institute.
`,
      },
      {
        id: "presion",
        title: "Presión y principio de Pascal",
        keywords: ["presión", "Pascal", "estática"],
        body: `
La **presión** es la fuerza por unidad de área que un fluido ejerce sobre las paredes (o sobre cualquier superficie inmersa). Se mide en pascales (1 Pa = 1 N/m²). En un fluido en reposo es **isotrópica**: actúa con el mismo valor en todas las direcciones desde un punto.

$$p = \\frac{F}{A}$$

En un líquido en reposo bajo gravedad la presión crece linealmente con la profundidad:

$$p(h) = p_0 + \\rho g h$$

donde $p_0$ es la presión en la superficie. Por eso la presión a 10 m de profundidad en agua es ya $\\sim 2$ atm.

**Principio de Pascal.** Una variación de presión aplicada a un fluido confinado se transmite íntegramente a todos sus puntos. Es la base de la **prensa hidráulica**: aplicas una fuerza pequeña sobre un pistón pequeño y obtienes una fuerza grande sobre uno grande, mantenida la presión constante. La amplificación es la razón de áreas; la conservación de energía exige que el desplazamiento sea inversamente proporcional.
`,
      },
      {
        id: "arquimedes",
        title: "Empuje de Arquímedes",
        keywords: ["Arquímedes", "empuje", "flotación"],
        body: `
Todo cuerpo total o parcialmente sumergido experimenta una fuerza vertical hacia arriba —el **empuje** o **boyante**— igual al peso del fluido desplazado:

$$E = \\rho_f \\, g \\, V_{\\text{desplazado}}$$

La explicación es directa: la presión hidrostática es mayor en la base inferior del cuerpo que en la superior, y la diferencia neta es exactamente el peso del fluido desplazado.

**Condiciones de flotación:**

| Condición | Resultado |
|-----------|-----------|
| $\\rho_{\\text{cuerpo}} < \\rho_f$ | Flota |
| $\\rho_{\\text{cuerpo}} = \\rho_f$ | Equilibrio neutro (suspendido) |
| $\\rho_{\\text{cuerpo}} > \\rho_f$ | Hunde |

Un barco de acero flota porque su densidad **media** (incluyendo el aire interior) es menor que la del agua. Un submarino regula su flotabilidad llenando o vaciando tanques de lastre con agua.

> El principio le sirvió a Arquímedes para detectar adulteración en una corona supuestamente de oro. Si el peso aparente sumergido era menor del esperado, había mezcla con un metal menos denso (plata).
`,
      },
      {
        id: "bernoulli",
        title: "Ecuación de Bernoulli",
        keywords: ["Bernoulli", "conservación energía", "velocidad presión"],
        body: `
Para un flujo **estacionario, incompresible y sin viscosidad** a lo largo de una línea de corriente, se conserva la suma:

$$p + \\tfrac{1}{2}\\rho v^2 + \\rho g h = \\text{cte}$$

Es la conservación de la energía mecánica por unidad de volumen: presión + cinética + potencial gravitatoria.

**Consecuencia contraintuitiva.** Donde la velocidad aumenta, la presión disminuye. Es el efecto Venturi y explica:

- La sustentación de un perfil aerodinámico (el aire sobre el ala viaja más rápido que bajo ella → menor presión arriba → fuerza neta hacia arriba). Atención: este es el modelo *de divulgación*; la sustentación real involucra también deflexión del flujo (Newton).
- Un atomizador o una pistola de pintura: aire rápido sobre el extremo de un tubo crea baja presión que succiona el líquido.
- El medidor Venturi para caudales en tuberías.

La animación interactiva muestra el perfil de presión y velocidad en un tubo con estrechamiento. Mueve los radios y observa cómo, por la ecuación de continuidad $A\\,v = $ cte, la velocidad sube en la garganta y la presión cae.
`,
        widget: "phys-fluid",
      },
      {
        id: "viscosidad",
        title: "Viscosidad y régimen de flujo",
        keywords: ["viscosidad", "Reynolds", "laminar", "turbulento"],
        body: `
La **viscosidad** $\\mu$ mide la resistencia interna de un fluido a deformarse. La miel tiene $\\mu \\sim 10$ Pa·s, el agua $10^{-3}$, el aire $\\sim 1{,}8\\times 10^{-5}$.

Para un flujo en un tubo, el cociente entre fuerzas inerciales y viscosas es el **número de Reynolds**:

$$\\mathrm{Re} = \\frac{\\rho v D}{\\mu}$$

- $\\mathrm{Re} < 2300$: **flujo laminar**, capas paralelas, perfil parabólico de velocidad. Predecible, ordenado.
- $\\mathrm{Re} > 4000$: **flujo turbulento**, remolinos caóticos, mezcla intensa. Aumenta drásticamente las pérdidas por fricción.
- $2300 < \\mathrm{Re} < 4000$: zona de transición, comportamiento errático.

La distinción es crucial en ingeniería: el flujo de sangre en capilares es laminar; en una tubería de agua doméstica, turbulento; en aerodinámica de aviones, mixto con regiones de cada tipo. La transición fue uno de los grandes problemas del siglo XX y sigue sin tener una teoría completa.
`,
      },
          {
        id: "problemas-resueltos",
        title: "Problemas resueltos y aplicaciones",
        keywords: ["ejemplos", "problemas resueltos", "aplicaciones"],
        body: `
**Problema 1 — flotación.** Un iceberg ($\rho_{hielo}=917\,\mathrm{kg/m^3}$) en agua de mar ($\rho=1025$): la fracción sumergida es $917/1025 \approx 89\%$. Sólo el 11 % asoma sobre la superficie.

**Problema 2 — Bernoulli.** Aire a 200 km/h sobre un ala vs 180 km/h debajo: diferencia de presión $\Delta P = \tfrac{1}{2}\rho(v_1^2-v_2^2)\approx 630\,\mathrm{Pa}$. Sobre $20\,\mathrm{m^2}$: 12,6 kN de sustentación, suficiente para un avión ligero.

**Aplicaciones:** aerodinámica, hidráulica, hemodinámica, meteorología.
`,
      },
    ],
  },
];
