import type { Article } from "@/lib/articles";

export const CHEMISTRY_ARTICLES: Article[] = [
  {
    slug: "estructura-atomica",
    title: "Estructura atómica",
    category: "quimica",
    level: "introductorio",
    readingMinutes: 22,
    summary:
      "Modelos atómicos, números cuánticos, configuración electrónica y tendencias periódicas. Cómo la estructura del átomo explica el comportamiento de cada elemento.",
    sections: [
      {
        id: "historia-y-contexto",
        title: "Historia y contexto",
        keywords: ["historia", "contexto", "origen"],
        body: `
La idea atómica sobrevivió como especulación filosófica durante 2000 años hasta que **John Dalton (1808)** la convirtió en hipótesis científica. La tabla periódica de **Mendeléyev (1869)** organizó los elementos por propiedades, prediciendo huecos (galio, germanio) que se confirmaron años después. La estructura interna se reveló entre 1897 y 1932: electrón (Thomson), núcleo (Rutherford), neutrón (Chadwick).
`,
      },
      {
        id: "modelos",
        title: "De Dalton a Bohr: la evolución del átomo",
        keywords: ["átomo", "Dalton", "Thomson", "Rutherford", "Bohr"],
        body: `
La idea del átomo es muy antigua —Demócrito (s. V a.C.) ya hablaba de partículas indivisibles—, pero la **química moderna** del átomo arranca con Dalton y termina, en su versión clásica, con Bohr. Cada modelo nació para explicar un experimento que el anterior no podía:

- **Dalton (1808)**: postula átomos indivisibles e indistinguibles dentro de un mismo elemento. Explica las leyes de proporciones definidas y múltiples, pero no dice nada sobre la estructura interna.
- **Thomson (1897)**: descubre el electrón con sus tubos de rayos catódicos. Propone el modelo de "pudín de pasas": una esfera positiva con electrones incrustados.
- **Rutherford (1911)**: el experimento de la lámina de oro muestra que la mayor parte de las partículas $\\alpha$ atraviesan la lámina, pero algunas rebotan a grandes ángulos. Conclusión: la masa y la carga positiva están concentradas en un **núcleo** diminuto.
- **Bohr (1913)**: añade que los electrones solo ocupan **órbitas cuantizadas**. Para el hidrógeno predice los niveles de energía:

$$E_n = -\\frac{13{,}6}{n^2}\\;\\text{eV}, \\quad n = 1, 2, 3, \\ldots$$

Esta fórmula explica con precisión las **líneas espectrales** del hidrógeno (Balmer, Lyman, Paschen) que ningún modelo previo justificaba.

> **Por qué importa.** El modelo de Bohr es incorrecto en los detalles —los electrones no son planetas en órbitas— pero introdujo el concepto clave de **cuantización**: la energía de un sistema ligado solo puede tomar ciertos valores discretos. Sin esa idea no hay química moderna.

El modelo definitivo llega con la **mecánica cuántica** (Schrödinger, Heisenberg, 1925-26): el electrón ya no es una partícula en una órbita, sino una nube de probabilidad descrita por una **función de onda** $\\psi$. La densidad $|\\psi|^2$ dice dónde es probable encontrarlo. Las "órbitas" se reemplazan por **orbitales**, y los niveles cuantizados surgen naturalmente como soluciones de la ecuación de Schrödinger.
`,
      },
      {
        id: "numeros-cuanticos",
        title: "Los cuatro números cuánticos",
        keywords: ["números cuánticos", "n", "l", "m", "s", "orbital"],
        body: `
Cada electrón en un átomo se identifica de forma única por **cuatro números cuánticos**, que son los "ingredientes" que distinguen un orbital de otro. Surgen como consecuencia matemática de resolver la ecuación de Schrödinger en el potencial coulombiano del núcleo.

| Símbolo | Nombre | Valores posibles | Qué describe |
|---------|--------|------------------|--------------|
| $n$ | principal | $1, 2, 3, \\ldots$ | Tamaño y energía del orbital |
| $\\ell$ | azimutal | $0, 1, \\ldots, n-1$ | Forma del orbital |
| $m_\\ell$ | magnético | $-\\ell, \\ldots, +\\ell$ | Orientación espacial |
| $m_s$ | espín | $\\pm 1/2$ | Giro intrínseco del electrón |

El número $\\ell$ se nombra con letras por motivos históricos:

- $\\ell = 0$: subcapa $s$ (sharp). Orbital esférico, una sola orientación.
- $\\ell = 1$: subcapa $p$ (principal). Forma de "pesa", tres orientaciones ($p_x$, $p_y$, $p_z$).
- $\\ell = 2$: subcapa $d$ (diffuse). Cinco orbitales con formas más complejas.
- $\\ell = 3$: subcapa $f$ (fundamental). Siete orbitales, esenciales en lantánidos y actínidos.

> **Principio de exclusión de Pauli.** Dos electrones del mismo átomo no pueden tener los cuatro números cuánticos iguales. Por eso cada orbital aloja **a lo sumo dos electrones**, con espines opuestos. Sin Pauli toda la materia colapsaría al estado de mínima energía y no existiría la tabla periódica.

El número de orbitales por capa es $n^2$ y el de electrones por capa, $2n^2$. De ahí salen los famosos $2, 8, 18, 32$ de las primeras cuatro filas.
`,
      },
      {
        id: "configuracion",
        title: "Configuración electrónica y reglas de llenado",
        keywords: ["configuración", "Aufbau", "Hund", "Pauli"],
        body: `
La **configuración electrónica** dice qué orbitales están ocupados en el estado fundamental de un átomo. Tres reglas la determinan:

1. **Principio de Aufbau** ("construcción"): los electrones llenan primero los orbitales de **menor energía**. El orden no es estrictamente $1s, 2s, 2p, 3s, 3p, 3d, \\ldots$ porque, a partir de $n=3$, los efectos de penetración hacen que $4s$ sea ligeramente más estable que $3d$. La regla práctica es la **diagonal de Madelung**: ordenar por valor creciente de $n + \\ell$ y, ante empate, por menor $n$.

2. **Principio de exclusión de Pauli**: cada orbital admite máximo dos electrones, con espines opuestos.

3. **Regla de Hund**: en una subcapa con varios orbitales degenerados (misma energía), se ocupa primero **cada orbital con un electrón de espín paralelo** antes de empezar a aparearlos. Maximizar el espín total minimiza la repulsión electrónica.

**Ejemplo: hierro ($Z = 26$).**

$$\\text{Fe}: 1s^2\\,2s^2\\,2p^6\\,3s^2\\,3p^6\\,4s^2\\,3d^6$$

Los 6 electrones $3d$ se distribuyen en 5 orbitales: cuatro de ellos solos (Hund) y dos apareados. Esto deja al hierro con **4 electrones desapareados**, responsables de su famoso magnetismo.

> **Excepciones notables.** Cromo ($\\text{Cr}: [Ar]\\,4s^1\\,3d^5$) y cobre ($\\text{Cu}: [Ar]\\,4s^1\\,3d^{10}$) "roban" un electrón del $4s$ para tener subcapas $d$ semillena o llena, energéticamente más estables. La química está llena de estas pequeñas anomalías que un buen químico aprende de memoria.

La configuración determina el **comportamiento químico**: los electrones de la última capa (electrones de valencia) son los que participan en enlaces y reacciones. Por eso los gases nobles, con la última capa completa, son tan inertes.
`,
      },
      {
        id: "tabla-periodica",
        title: "Tabla periódica: un mapa del comportamiento químico",
        keywords: ["tabla periódica", "electronegatividad", "radio atómico", "energía ionización"],
        body: `
Mendeléyev (1869) ordenó los elementos por masa atómica creciente y descubrió que las propiedades químicas se **repetían periódicamente**. La versión moderna ordena por **número atómico** $Z$ y agrupa por configuración electrónica. La tabla no es una mera lista: es un mapa del que se leen tendencias predictivas.

**Tendencias principales** (todas se explican por la **carga nuclear efectiva** $Z_{eff}$, que es la atracción real que siente un electrón después de descontar el apantallamiento de los electrones internos):

- **Radio atómico**: aumenta hacia abajo (más capas) y hacia la izquierda (menos carga nuclear efectiva). El cesio es enorme; el flúor, minúsculo.
- **Energía de ionización** ($E_i$, energía para arrancar un electrón): aumenta hacia arriba y hacia la derecha. Los gases nobles tienen las $E_i$ más altas; los alcalinos, las más bajas.
- **Afinidad electrónica**: energía liberada al ganar un electrón. Máxima en los halógenos, casi nula en los gases nobles.
- **Electronegatividad** $\\chi$ (escala de Pauling): tendencia de un átomo en un enlace a atraer electrones. Máxima en el flúor ($\\chi = 3{,}98$), mínima en el francio. Combina $E_i$ y afinidad electrónica.

**Por qué saltos al cambiar de fila.** Cada vez que se empieza una nueva capa principal, el radio aumenta de golpe y la $E_i$ cae. Por eso litio y sodio reaccionan violentamente con el agua: su único electrón de valencia es muy fácil de arrancar.

| Bloque | $\\ell$ máx | Familias |
|--------|-----------|----------|
| s | 0 | Alcalinos, alcalinotérreos |
| p | 1 | Bóridos a halógenos + gases nobles |
| d | 2 | Metales de transición |
| f | 3 | Lantánidos y actínidos |

> **Aplicación.** Conocer las tendencias permite predecir, sin medir, que el cesio será mejor reductor que el potasio, que el oxígeno será más electronegativo que el azufre, o que el francio sería líquido a temperatura ambiente (si fuese estable).
`,
      },
          {
        id: "problemas-resueltos",
        title: "Problemas resueltos y aplicaciones",
        keywords: ["ejemplos", "problemas resueltos", "aplicaciones"],
        body: `
**Problema 1 — configuración del oxígeno.** $\text{O}\,(Z=8)$: $1s^2 2s^2 2p^4$. En $2p$ hay 4 electrones en 3 orbitales: por Hund, dos quedan desapareados → el O$_2$ es paramagnético (lo demuestra un imán cerca de oxígeno líquido).

**Problema 2 — energía del hidrógeno.** Transición $n=3\to n=2$: $\Delta E = 13{,}6(1/4 - 1/9) = 1{,}89\,\mathrm{eV}$ → $\lambda = 656\,\mathrm{nm}$, la línea H$_\alpha$ roja de la serie de Balmer.

**Aplicaciones:** espectroscopía, láseres, datación isotópica, química nuclear.
`,
      },
    ],
  },
  {
    slug: "enlace-quimico",
    title: "Enlace químico y geometría molecular",
    category: "quimica",
    level: "intermedio",
    readingMinutes: 20,
    summary:
      "Enlaces iónico, covalente y metálico, hibridación de orbitales y la geometría de las moléculas según VSEPR. La forma molecular determina función.",
    sections: [
      {
        id: "historia-y-contexto",
        title: "Historia y contexto",
        keywords: ["historia", "contexto", "origen"],
        body: `
**Gilbert Lewis (1916)** propuso que los enlaces consisten en pares de electrones compartidos, dibujando los famosos diagramas de puntos. **Linus Pauling**, en *The Nature of the Chemical Bond* (1939), unió química y mecánica cuántica explicando hibridación, electronegatividad y resonancia — trabajo que le valió el Nobel.
`,
      },
      {
        id: "tipos-enlace",
        title: "Tipos de enlace y su origen",
        keywords: ["iónico", "covalente", "metálico", "polar", "apolar"],
        body: `
Los enlaces químicos son interacciones electrostáticas entre núcleos y electrones que reducen la energía total del sistema. Aunque en realidad existe un **continuo**, conviene distinguir tres tipos extremos según cómo se reparten los electrones de valencia:

**Iónico.** Un átomo muy electronegativo (típicamente un halógeno) le arranca un electrón a otro muy electropositivo (un alcalino). Se forman iones $A^+$ y $B^-$ que se atraen por Coulomb. El sólido resultante es una **red cristalina** mantenida por atracciones a largo alcance. Propiedades típicas: alto punto de fusión, frágil, conductor en disolución pero no en sólido.

**Covalente.** Dos átomos comparten uno o más pares de electrones. Si tienen electronegatividades parecidas, la nube electrónica se reparte simétricamente (covalente apolar). Si no, queda desplazada hacia el más electronegativo (covalente polar) y el enlace adquiere un **momento dipolar** $\\mu = qd$.

**Metálico.** Los átomos metálicos contribuyen sus electrones de valencia a un "mar" deslocalizado que rodea a una red de cationes. Esto explica la **conductividad eléctrica**, el brillo y la maleabilidad.

Una regla práctica usa la diferencia de electronegatividad:

| $\\Delta\\chi$ | Tipo predicho | Ejemplo |
|--------------|---------------|---------|
| $> 1{,}7$ | Iónico | NaCl ($\\Delta\\chi = 2{,}1$) |
| $0{,}4$ – $1{,}7$ | Covalente polar | H₂O ($\\Delta\\chi = 1{,}24$) |
| $< 0{,}4$ | Covalente apolar | Cl₂ ($\\Delta\\chi = 0$) |
| 0, entre metales | Metálico | Cu, Fe |

> **No es una clasificación rígida.** El AlCl₃ tiene $\\Delta\\chi = 1{,}5$ pero se comporta más como covalente debido al pequeño radio del Al³⁺ (regla de Fajans: cationes pequeños y aniones grandes y polarizables empujan al carácter covalente).

Las propiedades macroscópicas de una sustancia (estado físico, punto de fusión, solubilidad, conductividad) son consecuencias directas del tipo de enlace y de las interacciones intermoleculares.
`,
      },
      {
        id: "hibridacion",
        title: "Hibridación de orbitales: cómo el átomo se prepara para enlazar",
        keywords: ["hibridación", "sp", "sp2", "sp3"],
        body: `
La hibridación es un truco matemático **muy útil** para describir geometrías moleculares. La idea es que, antes de enlazar, los orbitales atómicos del átomo central se "mezclan" dando un nuevo conjunto de orbitales con energía intermedia y orientaciones más convenientes.

El número de orbitales híbridos resultante es **igual al número de orbitales atómicos mezclados** (la mecánica cuántica no crea ni destruye estados).

| Hibridación | Mezcla | Geometría | Ángulo | Ejemplos |
|-------------|--------|-----------|--------|----------|
| $sp$ | 1s + 1p | Lineal | 180° | $\\mathrm{BeCl_2}$, $\\mathrm{CO_2}$, $\\mathrm{C_2H_2}$ |
| $sp^2$ | 1s + 2p | Trigonal plana | 120° | $\\mathrm{BF_3}$, $\\mathrm{C_2H_4}$, benceno |
| $sp^3$ | 1s + 3p | Tetraédrica | 109,5° | $\\mathrm{CH_4}$, $\\mathrm{H_2O}$, $\\mathrm{NH_3}$ |
| $sp^3d$ | 1s + 3p + 1d | Bipirámide trigonal | 90°/120° | $\\mathrm{PCl_5}$ |
| $sp^3d^2$ | 1s + 3p + 2d | Octaédrica | 90° | $\\mathrm{SF_6}$ |

**Enlaces $\\sigma$ y $\\pi$.** Los orbitales híbridos forman enlaces **sigma** (axiales, máxima superposición). Los orbitales $p$ no hibridados que sobran pueden formar enlaces **pi** (laterales, menor superposición). Por eso un doble enlace tiene un $\\sigma$ + un $\\pi$, y un triple, un $\\sigma$ + dos $\\pi$.

> **Caso del carbono.** El carbono pasa de su configuración fundamental $2s^2\\,2p^2$ a una excitada $2s^1\\,2p^3$ y se hibrida según el contexto: $sp^3$ en metano (cuatro enlaces simples), $sp^2$ en eteno (un doble), $sp$ en etino (un triple). Este "camaleonismo" del carbono está en la raíz de toda la **química orgánica**.

La hibridación no es la única explicación posible —la teoría de orbitales moleculares es más rigurosa— pero ofrece la mejor combinación de simplicidad y poder predictivo para razonar sobre geometrías.
`,
      },
      {
        id: "vsepr",
        title: "Modelo VSEPR y geometría molecular",
        keywords: ["VSEPR", "geometría molecular", "pares libres"],
        body: `
El modelo **VSEPR** (Valence Shell Electron Pair Repulsion) parte de una idea muy simple: los pares de electrones de valencia alrededor de un átomo central se **repelen entre sí** y se acomodan tan lejos como pueden. La geometría observada es la que minimiza esta repulsión.

Un par electrónico puede ser:

- **Enlazante** (compartido en un enlace).
- **Libre** o **no enlazante** (par solitario).

Los pares libres son más "voluminosos" porque solo están atraídos por un núcleo, no dos. Por eso comprimen los ángulos entre los pares enlazantes.

| Pares electrónicos totales | Geometría electrónica | Sin pares libres | Con 1 par libre | Con 2 pares libres |
|--|--|--|--|--|
| 2 | Lineal | Lineal | — | — |
| 3 | Trigonal plana | Trigonal plana | Angular | — |
| 4 | Tetraédrica | Tetraédrica | Pirámide trigonal | Angular |
| 5 | Bipirámide trigonal | Bipirámide trigonal | Sube-baja | T |
| 6 | Octaédrica | Octaédrica | Pirámide cuadrada | Cuadrada plana |

**Ejemplos clásicos** que muestran el efecto de los pares libres:

- $\\mathrm{CH_4}$: 4 pares enlazantes → tetraédrica perfecta, 109,5°.
- $\\mathrm{NH_3}$: 3 enlazantes + 1 libre → pirámide trigonal, ángulo H–N–H ≈ 107°.
- $\\mathrm{H_2O}$: 2 enlazantes + 2 libres → angular, ángulo H–O–H ≈ 104,5°.

> **¿Por qué importa la geometría?** Porque determina la **polaridad neta** y, con ella, el comportamiento físico. CO₂ es lineal y, aunque cada enlace C=O es muy polar, los dipolos se cancelan: la molécula es apolar y por eso es un gas a temperatura ambiente. H₂O es angular y los dipolos *no* se cancelan: es un líquido extraordinariamente polar y forma puentes de hidrógeno, lo cual explica todo desde la flotabilidad del hielo hasta la existencia de la vida.

VSEPR es predictivo pero no explica *por qué* aparecen pares libres ni la naturaleza energética del enlace; para eso se necesita la teoría de orbitales moleculares.
`,
      },
          {
        id: "problemas-resueltos",
        title: "Problemas resueltos y aplicaciones",
        keywords: ["ejemplos", "problemas resueltos", "aplicaciones"],
        body: `
**Problema 1 — geometría del agua.** O con 2 enlaces y 2 pares libres → AX$_2$E$_2$ → angular, $\sim 104{,}5°$ (menor que 109,5° tetraédrico por repulsión de los pares libres). Polaridad → momento dipolar 1,85 D, responsable de los puentes de hidrógeno.

**Problema 2 — CO$_2$ vs H$_2$O.** Ambos triatómicos, pero CO$_2$ es lineal (sin pares libres en C) y apolar; H$_2$O es angular y polar. Por eso CO$_2$ sublima fácil y H$_2$O hierve a 100 °C.

**Aplicaciones:** diseño de fármacos, polímeros, materiales semiconductores, bioquímica.
`,
      },
    ],
  },
  {
    slug: "reacciones-y-estequiometria",
    title: "Reacciones químicas y estequiometría",
    category: "quimica",
    level: "introductorio",
    readingMinutes: 18,
    summary:
      "Tipos de reacción, balance de ecuaciones, mol y reactivo limitante. La contabilidad cuantitativa de la química.",
    sections: [
      {
        id: "historia-y-contexto",
        title: "Historia y contexto",
        keywords: ["historia", "contexto", "origen"],
        body: `
**Antoine Lavoisier**, considerado padre de la química moderna, demostró en el s. XVIII la conservación de la masa en reacciones químicas y rebatió la teoría del flogisto. Su mujer **Marie-Anne Paulze** ilustró sus libros y tradujo trabajos clave del inglés. Lavoisier murió guillotinado en 1794: "la República no necesita sabios".
`,
      },
      {
        id: "tipos-reaccion",
        title: "Clasificación de las reacciones químicas",
        keywords: ["combustión", "redox", "ácido-base", "precipitación"],
        body: `
Aunque existen millones de reacciones químicas, casi todas caen en unos pocos patrones reconocibles. Aprender a clasificarlas ayuda a **predecir productos** y a balancear con menos esfuerzo.

| Tipo | Patrón general | Ejemplo |
|------|----------------|---------|
| Síntesis (combinación) | $A + B \\to AB$ | $2\\,H_2 + O_2 \\to 2\\,H_2O$ |
| Descomposición | $AB \\to A + B$ | $2\\,H_2O_2 \\to 2\\,H_2O + O_2$ |
| Sustitución simple | $A + BC \\to AC + B$ | $Zn + 2\\,HCl \\to ZnCl_2 + H_2$ |
| Doble sustitución | $AB + CD \\to AD + CB$ | $AgNO_3 + NaCl \\to AgCl\\!\\downarrow + NaNO_3$ |
| Combustión | hidrocarburo + $O_2$ | $CH_4 + 2\\,O_2 \\to CO_2 + 2\\,H_2O$ |
| Ácido-base | $\\text{ácido} + \\text{base} \\to \\text{sal} + H_2O$ | $HCl + NaOH \\to NaCl + H_2O$ |
| Redox | transferencia de electrones | $2\\,Fe + 3\\,Cl_2 \\to 2\\,FeCl_3$ |
| Precipitación | iones forman sólido insoluble | $Pb^{2+} + 2I^- \\to PbI_2\\!\\downarrow$ |

**Cómo balancear ecuaciones.**

1. Escribe la ecuación con fórmulas correctas.
2. Cuenta átomos de cada elemento a ambos lados.
3. Ajusta **coeficientes** (nunca subíndices) hasta que cuadren.
4. Comprueba la conservación de carga si hay iones.

Las reacciones cumplen siempre dos leyes: **conservación de la masa** (Lavoisier) y, en sistemas iónicos, **conservación de la carga**. Si tu ecuación no las cumple, está mal balanceada.

> **Pista para balancear redox.** Cuando aparecen estados de oxidación variables (típico de metales de transición), usa el método del **ion-electrón**: separa la reacción en semireacciones de oxidación y reducción, balancea masas y cargas en cada una, y suma multiplicando para que los electrones se cancelen.

Las reacciones también pueden clasificarse por la **dirección del cambio térmico**: exotérmicas ($\\Delta H < 0$) liberan calor, endotérmicas ($\\Delta H > 0$) lo absorben. La combustión es siempre exotérmica; muchas síntesis biológicas son endotérmicas y necesitan acoplarse a hidrólisis de ATP.
`,
      },
      {
        id: "mol-estequio",
        title: "El mol y los cálculos estequiométricos",
        keywords: ["mol", "Avogadro", "masa molar", "estequiometría"],
        body: `
El **mol** es el puente entre el mundo microscópico (átomos individuales) y el macroscópico (gramos en la balanza). Un mol de cualquier sustancia contiene exactamente:

$$N_A = 6{,}022\\times 10^{23}\\;\\text{partículas}$$

Este número, la **constante de Avogadro**, se eligió para que la masa de un mol de átomos en gramos coincida con la masa atómica relativa que figura en la tabla periódica. Así, 1 mol de carbono-12 pesa 12 g exactamente.

**De la ecuación química a las cantidades.** Una ecuación balanceada $aA + bB \\to cC + dD$ se lee en moles: $a$ moles de $A$ reaccionan con $b$ moles de $B$ para dar $c$ moles de $C$. La estequiometría aprovecha estos cocientes:

$$n_C = n_A \\cdot \\frac{c}{a}$$

**Reactivo limitante.** Si las cantidades de partida no están en proporción estequiométrica, la reacción se detiene cuando se agota uno de los reactivos. Para identificarlo:

$$\\text{limitante} = \\arg\\min_i \\frac{n_i}{\\nu_i}$$

donde $\\nu_i$ es el coeficiente estequiométrico. El reactivo con el cociente más pequeño es el que se acaba primero. Los demás están en **exceso** y queda parte sin reaccionar.

**Rendimiento.**

$$\\eta = \\frac{m_{\\text{real}}}{m_{\\text{teórico}}} \\times 100\\%$$

Casi nunca alcanza el 100 % por reacciones secundarias, equilibrios incompletos o pérdidas de manipulación. Los procesos industriales se diseñan para maximizarlo: cada punto porcentual ahorra millones.

> **Trabajando con gases.** A condiciones ideales, el volumen molar es $22{,}4\\,\\text{L/mol}$ a 0 °C y 1 atm. Más en general, $V = nRT/p$ permite convertir entre moles y volumen a cualquier presión y temperatura.

**Ejemplo.** Quemamos $32\\,\\text{g}$ de metano ($CH_4$, $M = 16$ g/mol) con suficiente $O_2$:

$$CH_4 + 2\\,O_2 \\to CO_2 + 2\\,H_2O$$

$n_{CH_4} = 32/16 = 2$ mol → produce 2 mol de $CO_2$ ($88\\,\\text{g}$) y consume 4 mol de $O_2$ ($128\\,\\text{g}$). Si solo dispusiéramos de $96\\,\\text{g}$ de $O_2$ (3 mol), el oxígeno sería el limitante y solo reaccionaría $1{,}5$ mol de $CH_4$, sobrando $0{,}5$ mol.
`,
      },
          {
        id: "problemas-resueltos",
        title: "Problemas resueltos y aplicaciones",
        keywords: ["ejemplos", "problemas resueltos", "aplicaciones"],
        body: `
**Problema 1 — combustión del metano.** $\mathrm{CH_4 + 2O_2 \to CO_2 + 2H_2O}$. Quemar 16 g (1 mol) de CH$_4$ requiere 64 g de O$_2$ y produce 44 g de CO$_2$ + 36 g de H$_2$O. Energía liberada: $\sim 890\,\mathrm{kJ}$.

**Problema 2 — reactivo limitante.** 4 g de H$_2$ (2 mol) y 32 g de O$_2$ (1 mol) para formar agua: $2H_2 + O_2 \to 2H_2O$ requiere proporción 2:1. Aquí los 2 mol de H$_2$ reaccionan con 1 mol de O$_2$ → 2 mol de H$_2$O = 36 g. No sobra nada (proporción exacta).

**Aplicaciones:** procesos industriales, farmacia, metalurgia, alimentación.
`,
      },
    ],
  },
  {
    slug: "cinetica-quimica",
    title: "Cinética química",
    category: "quimica",
    level: "intermedio",
    readingMinutes: 20,
    summary:
      "Velocidad de reacción, leyes de velocidad, mecanismos y dependencia con la temperatura. Cómo de rápido ocurren las reacciones y por qué.",
    sections: [
      {
        id: "historia-y-contexto",
        title: "Historia y contexto",
        keywords: ["historia", "contexto", "origen"],
        body: `
A finales del XIX, **Svante Arrhenius** (Nobel 1903) propuso que la velocidad de reacción depende exponencialmente de la temperatura, idea que tardó años en aceptarse. **Henry Eyring (1935)** desarrolló la teoría del estado de transición, base de la cinética moderna y de la enzimología.
`,
      },
      {
        id: "velocidad",
        title: "Velocidad de reacción y ley de velocidad",
        keywords: ["velocidad", "ley de velocidad", "orden"],
        body: `
La **termodinámica** dice si una reacción puede ocurrir; la **cinética** dice cuán rápido lo hace. Una reacción puede ser termodinámicamente espontánea ($\\Delta G < 0$) y al mismo tiempo prácticamente infinitamente lenta a temperatura ambiente: el diamante a grafito es el ejemplo de manual.

La **velocidad de reacción** mide cuánto cambian las concentraciones por unidad de tiempo. Para $aA + bB \\to cC + dD$:

$$v = -\\frac{1}{a}\\frac{d[A]}{dt} = -\\frac{1}{b}\\frac{d[B]}{dt} = \\frac{1}{c}\\frac{d[C]}{dt} = \\frac{1}{d}\\frac{d[D]}{dt}$$

Los signos negativos para reactivos hacen que $v$ siempre sea positiva, y los coeficientes garantizan que el valor no dependa de qué especie midamos.

**Ley de velocidad.** Empíricamente se observa una dependencia con las concentraciones del tipo:

$$v = k\\,[A]^\\alpha[B]^\\beta$$

donde $k$ es la **constante de velocidad** (depende de $T$ pero no de las concentraciones) y los exponentes $\\alpha, \\beta$ se llaman **órdenes parciales**. La suma $\\alpha + \\beta + \\ldots$ es el **orden global** de la reacción.

> **Atención.** Los órdenes se determinan **experimentalmente** y, en general, **no coinciden con los coeficientes estequiométricos**. Una reacción puede ser estequiométricamente $A + 2B \\to C$ y cinéticamente de orden 1 en $A$ y 0 en $B$. Esto pasa cuando el mecanismo real ocurre en varios pasos.

**Métodos para determinar órdenes:**

- **Velocidades iniciales**: variar una concentración a la vez y observar cómo cambia $v_0$.
- **Integración**: ajustar los datos de $[A]$ vs $t$ a las leyes integradas (orden 0, 1, 2).
- **Vida media**: si $t_{1/2}$ no depende de $[A]_0$, es de primer orden; si es proporcional a $1/[A]_0$, de segundo.

**Mecanismos y paso determinante.** Una reacción global rara vez es elemental. Suele constar de varias etapas y la velocidad la fija el **paso más lento** (paso determinante). Por eso la ley de velocidad observada da pistas valiosísimas sobre el mecanismo subyacente.
`,
      },
      {
        id: "primer-orden",
        title: "Cinética de primer orden",
        keywords: ["primer orden", "exponencial", "vida media"],
        body: `
Las reacciones de primer orden son las más comunes (decaimiento radiactivo, hidrólisis catalizada, muchas reacciones biológicas). Su ley es:

$$v = k[A] \\quad\\Longrightarrow\\quad \\frac{d[A]}{dt} = -k[A]$$

Integrando esta EDO separable obtenemos la **ley exponencial**:

$$[A](t) = [A]_0\\,e^{-kt}$$

equivalente a una recta en escala logarítmica:

$$\\ln[A] = \\ln[A]_0 - kt$$

**Vida media** $t_{1/2}$, el tiempo para que $[A]$ caiga a la mitad:

$$t_{1/2} = \\frac{\\ln 2}{k} \\approx \\frac{0{,}693}{k}$$

Una propiedad notable: $t_{1/2}$ **no depende de la concentración inicial**. Por eso, en el decaimiento radiactivo, hablar de "la vida media del C-14" tiene sentido sin especificar cuánto carbono tienes.

**Aplicaciones reales:**

- Datación con $^{14}\\text{C}$: $t_{1/2} = 5730$ años. Permite fechar materia orgánica de hasta ~50 000 años.
- Farmacocinética: la mayoría de los medicamentos se eliminan con cinética de primer orden. Si un fármaco tiene $t_{1/2} = 6$ h, después de 24 h queda solo $1/16$ de la dosis original.
- Hidrólisis enzimática a baja concentración de sustrato.

> **Truco práctico.** Tras $n$ vidas medias queda una fracción $1/2^n$ del reactivo. Después de 5 vidas medias queda menos del 4 %; después de 10, menos del 0,1 %. Por eso los desechos radiactivos con $t_{1/2}$ de miles de años son un problema persistente.
`,
        widget: "chem-firstorder",
      },
      {
        id: "arrhenius",
        title: "Ecuación de Arrhenius: por qué la temperatura acelera",
        keywords: ["Arrhenius", "energía activación", "Ea", "T"],
        body: `
La constante de velocidad $k$ depende drásticamente de la temperatura. Empíricamente, Arrhenius (1889) propuso:

$$k(T) = A\\,e^{-E_a/(RT)}$$

Dos parámetros gobiernan el comportamiento:

- $A$ (**factor preexponencial**): frecuencia de "intentos" de reacción. Tiene las mismas unidades que $k$.
- $E_a$ (**energía de activación**): barrera energética que las moléculas deben superar para reaccionar.

**Interpretación molecular.** Aunque una colisión sea favorable termodinámicamente, las moléculas deben acercarse con la **orientación correcta** y con suficiente energía cinética para romper enlaces existentes y formar otros. La fracción de colisiones con energía $\\geq E_a$ se distribuye según Boltzmann, y vale precisamente $e^{-E_a/(RT)}$.

**Forma logarítmica útil:**

$$\\ln k = \\ln A - \\frac{E_a}{R}\\cdot\\frac{1}{T}$$

Una gráfica de $\\ln k$ frente a $1/T$ es una **recta** de pendiente $-E_a/R$. Es el método estándar para medir energías de activación.

**Regla del pulgar.** Para muchas reacciones cerca de la temperatura ambiente, $k$ se duplica aproximadamente cada $10$ °C de aumento. Esto se sigue de Arrhenius con $E_a \\approx 50$ kJ/mol y $T = 298$ K.

**Catalizadores.** Un catalizador funciona **bajando $E_a$** sin alterar $\\Delta G$ ni el equilibrio: ofrece un camino de reacción alternativo con menor barrera. Si un catalizador reduce $E_a$ en 30 kJ/mol a 25 °C, $k$ se multiplica por $e^{30000/(8{,}314\\cdot 298)} \\approx 200\\,000$. Por eso las enzimas, que pueden acelerar reacciones por factores de $10^6$ a $10^{12}$, son tan extraordinarias.

> **Limitaciones.** Arrhenius no es exacto en todo el rango: $A$ y $E_a$ pueden depender débilmente de $T$, y reacciones con tunelamiento cuántico (transferencias de protón a baja temperatura) violan esta dependencia. Aun así, sigue siendo la herramienta cinética más usada.
`,
        widget: "chem-arrhenius",
      },
          {
        id: "problemas-resueltos",
        title: "Problemas resueltos y aplicaciones",
        keywords: ["ejemplos", "problemas resueltos", "aplicaciones"],
        body: `
**Problema 1 — vida media.** Reacción de primer orden con $k = 0{,}01\,\mathrm{s^{-1}}$. $t_{1/2} = \ln 2/k \approx 69\,\mathrm{s}$. Tras 5 vidas medias (345 s) queda $1/32 \approx 3\%$.

**Problema 2 — Arrhenius.** Una reacción se duplica entre 25 y 35 °C. $E_a = R T_1 T_2 \ln 2/(T_2 - T_1) \approx 53\,\mathrm{kJ/mol}$ — típico de reacciones bioquímicas, por eso la fiebre acelera el metabolismo.

**Aplicaciones:** caducidad de medicamentos, conservación de alimentos (Q$_{10}$ del frigorífico), catálisis industrial.
`,
      },
    ],
  },
  {
    slug: "equilibrio-quimico",
    title: "Equilibrio químico",
    category: "quimica",
    level: "intermedio",
    readingMinutes: 18,
    summary:
      "Constante de equilibrio, principio de Le Chatelier y conexión con la termodinámica. Por qué casi ninguna reacción es completa.",
    sections: [
      {
        id: "historia-y-contexto",
        title: "Historia y contexto",
        keywords: ["historia", "contexto", "origen"],
        body: `
**Cato Guldberg y Peter Waage (1864)** formularon la ley de acción de masas. **Le Chatelier (1884)** enunció su famoso principio cualitativo de respuesta al estrés. La conexión rigurosa entre equilibrio y termodinámica vino con **J. W. Gibbs**.
`,
      },
      {
        id: "constante",
        title: "La constante de equilibrio",
        keywords: ["equilibrio", "K", "Q"],
        body: `
La mayoría de las reacciones son **reversibles**: ocurren simultáneamente en ambos sentidos. El sistema alcanza un **equilibrio dinámico** cuando las velocidades directa e inversa se igualan; las concentraciones macroscópicas dejan de cambiar pero las moléculas siguen reaccionando individualmente.

Para la reacción $aA + bB \\rightleftharpoons cC + dD$ se define la **constante de equilibrio**:

$$K_c = \\frac{[C]^c\\,[D]^d}{[A]^a\\,[B]^b}$$

(en concentraciones; existe la análoga $K_p$ usando presiones parciales para gases). Su valor depende **solo de la temperatura**, no de las concentraciones iniciales ni del camino seguido.

**Cómo interpretar $K$:**

- $K \\gg 1$: en el equilibrio dominan los productos. Reacción "casi completa".
- $K \\ll 1$: en el equilibrio dominan los reactivos. Reacción muy poco favorecida.
- $K \\approx 1$: cantidades comparables de unos y otros.

**Cociente de reacción $Q$.** Tiene la misma forma que $K$ pero con concentraciones **arbitrarias**, no necesariamente las del equilibrio. La comparación de $Q$ con $K$ predice la dirección del cambio:

| Comparación | Dirección | Interpretación |
|-------------|-----------|----------------|
| $Q < K$ | Avanza hacia productos | Sobran reactivos relativos |
| $Q = K$ | Equilibrio | No hay cambio neto |
| $Q > K$ | Retrocede hacia reactivos | Sobran productos relativos |

**Cálculo típico (tabla ICE).** Las concentraciones se organizan en una tabla con tres filas: **I**niciales, **C**ambio y de **E**quilibrio. El cambio se expresa con una incógnita $x$ proporcional a los coeficientes estequiométricos. Sustituir en $K$ produce, normalmente, una ecuación cuadrática o cúbica en $x$.

> **Sólidos y líquidos puros no aparecen.** Por convención, las actividades de sólidos y líquidos puros son 1 y se omiten en la expresión de $K$. Por eso en $\\mathrm{CaCO_3 \\rightleftharpoons CaO + CO_2}$ basta $K = [CO_2]$ (o $K_p = p_{CO_2}$).
`,
      },
      {
        id: "le-chatelier",
        title: "Principio de Le Chatelier",
        keywords: ["Le Chatelier", "perturbación", "desplazamiento"],
        body: `
El principio de Le Chatelier (1884) ofrece una regla cualitativa para anticipar cómo responde un sistema en equilibrio cuando se le perturba:

> **Si se altera una de las variables que definen el equilibrio (concentración, temperatura, presión), el sistema se desplaza en el sentido que tiende a contrarrestar la perturbación.**

**Cambios de concentración.**

- Añadir $A$: el sistema consume $A$ desplazándose hacia productos.
- Retirar $C$: el sistema regenera $C$ desplazándose hacia productos.

**Cambios de presión** (solo afectan a gases, y solo si los moles de gas cambian con la reacción).

- Aumentar $p$ (comprimir): se favorece el lado con **menos moles** gaseosos.
- Disminuir $p$ (expandir): se favorece el lado con **más moles** gaseosos.

Para $\\mathrm{N_2 + 3H_2 \\rightleftharpoons 2NH_3}$ (4 → 2 moles), comprimir favorece la formación de amoníaco. Por eso el proceso Haber industrial trabaja a 150–300 atm.

**Cambios de temperatura.** Aquí $K$ sí cambia (no solo las concentraciones): la temperatura es la única variable que altera la propia constante de equilibrio.

- Endotérmica ($\\Delta H > 0$): aumentar $T$ desplaza hacia productos. $K$ aumenta.
- Exotérmica ($\\Delta H < 0$): aumentar $T$ desplaza hacia reactivos. $K$ disminuye.

**Catalizadores.** No desplazan el equilibrio. Aceleran tanto la reacción directa como la inversa por igual y solo reducen el tiempo necesario para alcanzar el equilibrio.

> **Aplicación industrial.** El **proceso Haber-Bosch** sintetiza amoníaco a alta presión (favorece la formación), temperatura intermedia (~450 °C, compromiso entre velocidad y posición del equilibrio) y con catalizador de hierro (acelera). El compromiso fino entre cinética y equilibrio es típico de la ingeniería química.
`,
        widget: "chem-lechatelier",
      },
      {
        id: "termo-equilibrio",
        title: "Equilibrio y termodinámica",
        keywords: ["ΔG", "Van't Hoff"],
        body: `
La constante de equilibrio no es solo empírica: surge directamente de la termodinámica. La energía libre de Gibbs estándar de la reacción y $K$ están conectadas por:

$$\\Delta G^\\circ = -RT\\ln K$$

Consecuencias inmediatas:

- $\\Delta G^\\circ < 0 \\;\\Leftrightarrow\\; K > 1$: el equilibrio favorece a productos en condiciones estándar.
- $\\Delta G^\\circ = 0 \\;\\Leftrightarrow\\; K = 1$: equilibrio "balanceado".
- $\\Delta G^\\circ > 0 \\;\\Leftrightarrow\\; K < 1$: el equilibrio favorece a reactivos.

Fuera del estándar:

$$\\Delta G = \\Delta G^\\circ + RT\\ln Q$$

En el equilibrio $\\Delta G = 0$ y $Q = K$, recuperando la primera relación.

**Ecuación de Van't Hoff.** Combina $\\Delta G^\\circ = \\Delta H^\\circ - T\\Delta S^\\circ$ con la expresión anterior:

$$\\ln K = -\\frac{\\Delta H^\\circ}{R}\\cdot\\frac{1}{T} + \\frac{\\Delta S^\\circ}{R}$$

Una representación de $\\ln K$ frente a $1/T$ da una recta de pendiente $-\\Delta H^\\circ/R$ y ordenada $\\Delta S^\\circ/R$. Es **el** método para medir $\\Delta H^\\circ$ de un equilibrio sin calorimetría.

> **Forma diferencial.** $\\dfrac{d\\ln K}{dT} = \\dfrac{\\Delta H^\\circ}{RT^2}$. Si $\\Delta H^\\circ > 0$ (endo), $K$ aumenta con $T$, en consonancia con Le Chatelier.

**Equilibrio y "fuerza motriz".** Que una reacción tenga $\\Delta G < 0$ no garantiza que ocurra rápido: la cinética puede ser muy lenta (aquí no decimos nada sobre $E_a$). Termodinámica y cinética son disciplinas complementarias y a menudo independientes en la práctica.
`,
        widget: "chem-equilibrium",
      },
          {
        id: "problemas-resueltos",
        title: "Problemas resueltos y aplicaciones",
        keywords: ["ejemplos", "problemas resueltos", "aplicaciones"],
        body: `
**Problema 1 — síntesis de Haber.** $N_2 + 3H_2 \rightleftharpoons 2NH_3$, $\Delta H < 0$. Temperaturas altas favorecen la cinética pero perjudican el equilibrio; alta presión favorece NH$_3$ (4 mol → 2 mol gas). Por eso se trabaja a 200 atm y 450 °C con catalizador de Fe.

**Problema 2 — cociente de reacción.** Si $K=10$ y $Q=0{,}1$ → $Q<K$, la reacción avanza hacia productos.

**Aplicaciones:** producción de fertilizantes, refinería, biomedicina (hemoglobina-O$_2$).
`,
      },
    ],
  },
  {
    slug: "acido-base",
    title: "Equilibrio ácido-base",
    category: "quimica",
    level: "intermedio",
    readingMinutes: 20,
    summary:
      "pH, ácidos y bases débiles, sistemas tampón y curvas de titulación. La química del agua y de la vida.",
    sections: [
      {
        id: "historia-y-contexto",
        title: "Historia y contexto",
        keywords: ["historia", "contexto", "origen"],
        body: `
**Arrhenius** definió ácidos y bases (1884) por la liberación de H$^+$ y OH$^-$. **Brønsted y Lowry (1923)** generalizaron a transferencia de protones. **G. N. Lewis** abstrajo aún más: aceptores y donores de pares de electrones. **Søren Sørensen** introdujo el pH en 1909 trabajando para la cervecería Carlsberg.
`,
      },
      {
        id: "ph",
        title: "Definición y escala de pH",
        keywords: ["pH", "pOH", "Brönsted", "Arrhenius"],
        body: `
Un **ácido** es una especie capaz de ceder protones; una **base**, de aceptarlos (definición de Brønsted-Lowry, más general que la de Arrhenius). En agua, el equilibrio fundamental es el de **autoionización**:

$$2\\,H_2O \\rightleftharpoons H_3O^+ + OH^-, \\qquad K_w = [H^+][OH^-] = 10^{-14}\\;(25°C)$$

La concentración de iones $H^+$ varía en muchos órdenes de magnitud, así que se usa una escala logarítmica:

$$pH = -\\log_{10}[H^+], \\qquad pOH = -\\log_{10}[OH^-]$$

con la relación universal:

$$pH + pOH = 14 \\;(25°C)$$

| Solución | $[H^+]$ (M) | pH |
|----------|-------------|-----|
| Ácido de batería | $\\sim 10^{0}$ | 0 |
| Jugo de limón | $\\sim 10^{-2}$ | 2 |
| Agua pura | $10^{-7}$ | 7 |
| Sangre humana | $\\sim 4\\cdot 10^{-8}$ | 7,4 |
| Lejía | $\\sim 10^{-13}$ | 13 |

**Por qué la sangre debe estar en 7,35–7,45.** Variaciones de tan solo $\\pm 0{,}3$ unidades pueden ser letales: muchas proteínas pierden actividad al cambiar la protonación de sus residuos. El sistema buffer carbonato/bicarbonato mantiene la homeostasis (lo veremos en la sección de buffers).

> **Cuidado con la temperatura.** $K_w$ aumenta con $T$. A $50$ °C, $K_w \\approx 5{,}5\\times 10^{-14}$ y el agua **neutra** tiene $pH \\approx 6{,}6$. La definición de "neutro" no es $pH = 7$ sino $pH = pOH$.

**Ácidos y bases fuertes.** Disocian completamente. Para HCl 0,01 M: $[H^+] = 0{,}01 \\Rightarrow pH = 2$. Para NaOH 0,01 M: $[OH^-] = 0{,}01 \\Rightarrow pOH = 2 \\Rightarrow pH = 12$. Cuidado: por debajo de $\\sim 10^{-6}$ M debes considerar la contribución del propio agua.
`,
      },
      {
        id: "debiles",
        title: "Ácidos y bases débiles",
        keywords: ["pKa", "Ka", "ácido débil", "fórmula pH"],
        body: `
La mayoría de los ácidos cotidianos (acético en el vinagre, cítrico en frutas, fórmico en hormigas, carbónico en bebidas gaseosas) son **débiles**: solo una fracción se disocia en agua. El equilibrio:

$$HA \\rightleftharpoons H^+ + A^-, \\qquad K_a = \\frac{[H^+][A^-]}{[HA]}$$

Se define $pK_a = -\\log K_a$. Cuanto **menor** sea $pK_a$, **más fuerte** es el ácido.

| Ácido | $K_a$ | $pK_a$ |
|-------|-------|--------|
| Acético ($CH_3COOH$) | $1{,}8\\times 10^{-5}$ | 4,75 |
| Fórmico ($HCOOH$) | $1{,}8\\times 10^{-4}$ | 3,75 |
| Cítrico (1ª disoc.) | $7{,}4\\times 10^{-4}$ | 3,13 |
| Carbónico ($H_2CO_3$, 1ª) | $4{,}3\\times 10^{-7}$ | 6,37 |

Para una concentración inicial $C$ de un ácido débil con $K_a$ pequeña ($\\alpha \\ll 1$), la resolución del equilibrio da la aproximación:

$$[H^+] \\approx \\sqrt{K_a\\,C} \\;\\Longrightarrow\\; pH \\approx \\tfrac{1}{2}(pK_a - \\log C)$$

> **Cuándo no usar la aproximación.** Si la disociación supera el 5 % ($\\alpha > 0{,}05$), debes resolver la cuadrática completa. Esto pasa en ácidos relativamente fuertes o muy diluidos.

**Ácidos polipróticos.** Algunos ácidos pueden ceder más de un protón ($H_2SO_4$, $H_3PO_4$, $H_2CO_3$). Cada disociación tiene su propio $K_a$ y normalmente $K_{a1} \\gg K_{a2} \\gg K_{a3}$, lo que permite tratar las disociaciones de manera secuencial.

**Bases débiles.** Análogamente, $K_b$ y $pK_b$. Para un par conjugado en agua: $K_a \\cdot K_b = K_w$, equivalente a $pK_a + pK_b = 14$. Una base es tan fuerte como débil sea su ácido conjugado.

**Hidrólisis de sales.** Las sales no son siempre neutras. $\\mathrm{NH_4Cl}$ es ácida porque $\\mathrm{NH_4^+}$ es el ácido conjugado del amoníaco débil. $\\mathrm{Na_2CO_3}$ es básica porque $\\mathrm{CO_3^{2-}}$ es la base conjugada de un ácido débil.
`,
        widget: "chem-ph",
      },
      {
        id: "buffer",
        title: "Sistemas tampón (buffers)",
        keywords: ["buffer", "Henderson-Hasselbalch", "tampón"],
        body: `
Un **tampón** o **buffer** es una solución que resiste cambios de pH cuando se le añaden cantidades moderadas de ácido o base. Se construyen con un par conjugado: un ácido débil $HA$ y su base conjugada $A^-$ (típicamente añadida como sal).

**Mecanismo.** Si añadimos $H^+$, la base conjugada lo neutraliza: $A^- + H^+ \\to HA$. Si añadimos $OH^-$, el ácido lo neutraliza: $HA + OH^- \\to A^- + H_2O$. Las concentraciones cambian pero el cociente $[A^-]/[HA]$ apenas se mueve mientras los componentes no se agoten.

**Ecuación de Henderson-Hasselbalch.** Tomando logaritmo en la expresión de $K_a$:

$$pH = pK_a + \\log\\!\\left(\\frac{[A^-]}{[HA]}\\right)$$

Esta fórmula es de uso constante en bioquímica y química analítica.

**Capacidad tampón.** Es máxima cuando $[A^-] = [HA]$, es decir cuando $pH = pK_a$. Por eso para preparar un buffer a un pH objetivo se elige un ácido débil cuyo $pK_a$ esté **cerca** de ese pH, idealmente dentro de $\\pm 1$ unidad.

| pH objetivo | Sistema buffer típico | $pK_a$ |
|-------------|----------------------|--------|
| 4–5 | Acético/acetato | 4,75 |
| 6–7 | Fosfato $H_2PO_4^-/HPO_4^{2-}$ | 7,2 |
| 7–8 | Tris-HCl | 8,1 |
| 9–10 | Carbonato $HCO_3^-/CO_3^{2-}$ | 10,3 |

**Buffer fisiológico.** La sangre se mantiene en $pH \\approx 7{,}4$ gracias principalmente al sistema $H_2CO_3/HCO_3^-$, acoplado al CO₂ pulmonar y al riñón. La ecuación se reescribe:

$$pH = 6{,}1 + \\log\\!\\left(\\frac{[HCO_3^-]}{0{,}03\\cdot p_{CO_2}}\\right)$$

con $p_{CO_2}$ en mmHg. Hiperventilar baja $p_{CO_2}$ y sube el pH (alcalosis respiratoria).

> **Por qué los buffers fallan.** Cuando se neutraliza demasiado de uno de los componentes el cociente $[A^-]/[HA]$ se vuelve extremo y un pequeño exceso de ácido o base produce cambios bruscos. La capacidad práctica de un buffer también depende de su concentración total.
`,
        widget: "chem-buffer",
      },
      {
        id: "titulacion",
        title: "Curvas de titulación",
        keywords: ["titulación", "punto equivalencia", "indicador"],
        body: `
Una **titulación** (o valoración) es la adición controlada de un **valorante** de concentración conocida sobre un **analito** de concentración desconocida hasta alcanzar el punto en que han reaccionado en cantidades estequiométricamente equivalentes. La gráfica de pH frente a volumen añadido se llama **curva de titulación**.

**Ácido fuerte – base fuerte.** La curva tiene una zona inicial casi plana, un salto vertical brusco (de 4-5 unidades de pH) en torno al **punto de equivalencia**, y una zona final también plana. El punto de equivalencia está exactamente en $pH = 7$ porque la sal resultante (NaCl) no hidroliza.

**Ácido débil – base fuerte.** Tres zonas características:

1. **Antes del punto de equivalencia**: existe un buffer del ácido débil con su sal. El pH se calcula con Henderson-Hasselbalch.
2. **Punto de semineutralización**: cuando se ha añadido la mitad de la base necesaria, $[HA] = [A^-]$ y $pH = pK_a$. Es el método más simple para medir $pK_a$.
3. **Punto de equivalencia**: $pH > 7$ porque la sal $A^-$ es básica e hidroliza.
4. Tras el equivalencia, el pH se rige por el exceso de base fuerte añadido.

**Selección de indicador.** Un indicador es un ácido (o base) débil cuyas formas protonada y desprotonada tienen colores distintos. Cambia de color en torno a su $pK_a \\pm 1$. Para que la valoración sea precisa, el cambio de color del indicador debe coincidir con el salto vertical de la curva.

| Indicador | Rango pH | Cambio |
|-----------|---------|--------|
| Naranja de metilo | 3,1 – 4,4 | rojo → amarillo |
| Rojo de metilo | 4,2 – 6,3 | rojo → amarillo |
| Tornasol | 5,0 – 8,0 | rojo → azul |
| Fenolftaleína | 8,2 – 10,0 | incoloro → rosa |

> **Punto de equivalencia vs punto final.** El primero es teórico (estequiométrico); el segundo es lo que el indicador detecta visualmente. La diferencia se llama **error de titulación** y se minimiza eligiendo bien el indicador.

Las titulaciones modernas suelen seguirse con un **pH-metro** para mayor precisión. Su derivada $dpH/dV$ presenta un pico agudo en el punto de equivalencia, más nítido que el cambio cromático.
`,
        widget: "chem-titration",
      },
          {
        id: "problemas-resueltos",
        title: "Problemas resueltos y aplicaciones",
        keywords: ["ejemplos", "problemas resueltos", "aplicaciones"],
        body: `
**Problema 1 — pH de un ácido fuerte.** HCl 0,01 M → $[\mathrm{H^+}]=10^{-2}$ → pH 2.

**Problema 2 — buffer.** Tampón ácido acético/acetato 0,1 M cada uno: pH = pKa = 4,74. Añadir 1 mmol de HCl a 100 mL: el pH baja sólo a $\sim 4{,}66$. Sin tampón habría caído a 2.

**Aplicaciones:** sangre humana (pH 7,40 ± 0,05), agricultura, fermentación, depuración.
`,
      },
    ],
  },
  {
    slug: "termodinamica-quimica",
    title: "Termodinámica química",
    category: "quimica",
    level: "avanzado",
    readingMinutes: 18,
    summary:
      "Entalpía, entropía y energía libre. La maquinaria que decide qué reacciones son posibles.",
    sections: [
      {
        id: "historia-y-contexto",
        title: "Historia y contexto",
        keywords: ["historia", "contexto", "origen"],
        body: `
**Hess (1840)** demostró que el calor de reacción es independiente del camino. **Gibbs (1875)** y **Helmholtz** introdujeron las energías libres que predicen espontaneidad. La síntesis con la mecánica estadística (**Boltzmann, Gibbs**) cerró la fundamentación.
`,
      },
      {
        id: "entalpia",
        title: "Entalpía y termoquímica",
        keywords: ["entalpía", "ΔH", "Hess"],
        body: `
La **entalpía** $H$ es una función de estado definida por $H = U + pV$, donde $U$ es la energía interna. A presión constante (lo habitual en química), su variación equivale al **calor intercambiado**:

$$\\Delta H = q_p$$

Convención: $\\Delta H < 0$ exotérmica (libera calor), $\\Delta H > 0$ endotérmica (absorbe calor). Como es función de estado, $\\Delta H$ depende solo de los estados inicial y final, no del camino.

**Entalpía de formación estándar** $\\Delta H_f^\\circ$: variación al formar 1 mol de un compuesto a partir de sus elementos en su forma estándar (25 °C, 1 atm). Por convención, $\\Delta H_f^\\circ$ de los elementos en su forma más estable es **cero**.

Para una reacción cualquiera:

$$\\Delta H_{rxn}^\\circ = \\sum \\nu_i\\,\\Delta H_f^\\circ(\\text{prod}_i) - \\sum \\nu_j\\,\\Delta H_f^\\circ(\\text{reac}_j)$$

**Ley de Hess.** Si una reacción se descompone en pasos, $\\Delta H$ total es la suma de los $\\Delta H$ de cada paso:

$$\\Delta H_{total} = \\sum_i \\Delta H_i$$

Esto permite calcular entalpías de reacciones difíciles de medir directamente. Por ejemplo, el $\\Delta H$ de combustión incompleta de carbono a CO se obtiene combinando $C + O_2 \\to CO_2$ y $CO + \\tfrac{1}{2}O_2 \\to CO_2$.

> **Energías de enlace.** Una estimación rápida: $\\Delta H_{rxn} \\approx \\sum E_{rotos} - \\sum E_{formados}$. Útil para gases y enlaces covalentes; falla para sólidos iónicos o reacciones en disolución, donde dominan otras interacciones.

**Calorímetros.** $\\Delta H$ se mide directamente en un calorímetro a presión constante (vaso aislado, o bomba si el volumen es constante y se obtiene $\\Delta U$). De ahí se construyen las tablas de $\\Delta H_f^\\circ$ tabuladas en cualquier libro de fisicoquímica.
`,
      },
      {
        id: "entropia",
        title: "Entropía y la flecha del tiempo",
        keywords: ["entropía", "S", "Boltzmann"],
        body: `
La **entropía** $S$ es una medida del **desorden** o, más rigurosamente, del número de microestados $\\Omega$ compatibles con un macroestado dado. La famosa fórmula de Boltzmann (grabada en su tumba) es:

$$S = k_B \\ln\\Omega$$

donde $k_B = 1{,}381\\times 10^{-23}$ J/K es la constante de Boltzmann.

**Segundo principio de la termodinámica.** En un sistema aislado, la entropía nunca disminuye:

$$\\Delta S_{universo} \\geq 0$$

Es la única ley física que distingue el pasado del futuro: explica por qué el café se enfría pero nunca se calienta espontáneamente, por qué el aire de una habitación no se concentra en una esquina y por qué el tiempo "fluye" en una dirección.

**Variaciones de entropía típicas.**

| Cambio | $\\Delta S$ |
|--------|------------|
| Sólido → líquido (fusión) | $> 0$ |
| Líquido → gas (vaporización) | $\\gg 0$ |
| Disolución de un gas en líquido | $< 0$ |
| Aumentar moles de gas en una reacción | $> 0$ |
| Polimerización | $< 0$ |

**Tercer principio.** La entropía de un cristal perfecto a $T = 0$ K es exactamente cero. Esto permite asignar valores **absolutos** de $S^\\circ$ (no solo diferencias) y construir tablas tabuladas.

> **Entropía y vida.** Que los seres vivos sean estructuras altamente ordenadas (baja entropía local) no contradice el segundo principio: para mantenernos así disipamos enormes cantidades de calor al entorno, aumentando la entropía global del universo. La vida es, termodinámicamente, una pequeña isla de orden flotando en un mar creciente de desorden.

**Cálculo en reacciones.** Igual que con la entalpía:

$$\\Delta S_{rxn}^\\circ = \\sum \\nu_i\\,S_i^\\circ(\\text{prod}) - \\sum \\nu_j\\,S_j^\\circ(\\text{reac})$$
`,
      },
      {
        id: "energia-libre",
        title: "Energía libre de Gibbs y espontaneidad",
        keywords: ["Gibbs", "ΔG", "espontaneidad"],
        body: `
A presión y temperatura constantes (las condiciones más comunes en química), el criterio de espontaneidad combina entalpía y entropía en una sola función de estado: la **energía libre de Gibbs**:

$$G = H - TS, \\qquad \\Delta G = \\Delta H - T\\Delta S$$

Una reacción es **espontánea** si $\\Delta G < 0$, está en **equilibrio** si $\\Delta G = 0$, y es **no espontánea** (espontánea en sentido inverso) si $\\Delta G > 0$.

**Las cuatro combinaciones.**

| $\\Delta H$ | $\\Delta S$ | $\\Delta G$ | Espontaneidad |
|------------|------------|-------------|---------------|
| $< 0$ | $> 0$ | siempre $< 0$ | Siempre espontánea |
| $> 0$ | $< 0$ | siempre $> 0$ | Nunca espontánea |
| $< 0$ | $< 0$ | depende de $T$ | Espontánea a baja $T$ |
| $> 0$ | $> 0$ | depende de $T$ | Espontánea a alta $T$ |

Para los dos casos dependientes, la temperatura crítica de cambio se obtiene resolviendo $\\Delta H = T\\Delta S$:

$$T^* = \\frac{\\Delta H}{\\Delta S}$$

> **Ejemplo.** La fusión del hielo: $\\Delta H > 0$ (rompe enlaces), $\\Delta S > 0$ (aumenta desorden). $T^* = 273$ K. Por encima funde, por debajo solidifica. Lo mismo razona la evaporación a $T^* = 373$ K.

**Conexión con el equilibrio.** Como vimos antes, en condiciones estándar $\\Delta G^\\circ = -RT\\ln K$. En condiciones cualesquiera $\\Delta G = \\Delta G^\\circ + RT\\ln Q$. Cuando $\\Delta G = 0$ se alcanza el equilibrio.

**Reacciones acopladas.** Una reacción no espontánea puede *empujarse* acoplándola a una espontánea con $|\\Delta G|$ mayor. La hidrólisis del ATP ($\\Delta G^\\circ \\approx -30{,}5$ kJ/mol) impulsa miles de reacciones biosintéticas no favorables por sí solas. Es el motor energético de la vida.

**Trabajo útil.** $\\Delta G$ representa el **trabajo máximo no expansivo** (eléctrico, químico, etc.) que una reacción puede entregar. En una pila electroquímica: $\\Delta G = -nFE$.
`,
      },
          {
        id: "problemas-resueltos",
        title: "Problemas resueltos y aplicaciones",
        keywords: ["ejemplos", "problemas resueltos", "aplicaciones"],
        body: `
**Problema 1 — espontaneidad.** Disolución de NH$_4$NO$_3$: $\Delta H > 0$ (endotérmica) pero $\Delta S \gg 0$ (gran aumento de desorden). A T ambiente $\Delta G < 0$ → espontánea (las bolsas frías comerciales).

**Problema 2 — entalpía de combustión.** Combustión completa de octano (C$_8$H$_{18}$): $\Delta H \approx -5470\,\mathrm{kJ/mol}$. Por gramo: $\sim 48\,\mathrm{kJ/g}$, similar a la gasolina real.

**Aplicaciones:** baterías, biocombustibles, refrigeración, diseño de procesos.
`,
      },
    ],
  },
  {
    slug: "redox-electroquimica",
    title: "Reacciones redox y electroquímica",
    category: "quimica",
    level: "avanzado",
    readingMinutes: 16,
    summary:
      "Estados de oxidación, balance de redox, celdas galvánicas y ecuación de Nernst. Cómo se convierte energía química en eléctrica y viceversa.",
    sections: [
      {
        id: "historia-y-contexto",
        title: "Historia y contexto",
        keywords: ["historia", "contexto", "origen"],
        body: `
**Alessandro Volta** inventó la pila (1800) apilando discos de zinc y cobre. **Michael Faraday** estableció las leyes cuantitativas de la electrólisis (1834). En el s. XX la electroquímica permitió la producción industrial de aluminio (Hall–Héroult) y, hoy, las baterías de ion-litio (Nobel 2019 a Goodenough, Whittingham y Yoshino).
`,
      },
      {
        id: "oxidacion",
        title: "Estados de oxidación y reacciones redox",
        keywords: ["oxidación", "reducción", "número oxidación"],
        body: `
Una reacción **redox** implica transferencia de electrones de una especie a otra. La especie que pierde electrones se **oxida** (su número de oxidación aumenta); la que los gana se **reduce** (su número de oxidación disminuye). Acrónimo útil: **OIL RIG** (*Oxidation Is Loss, Reduction Is Gain*).

**Reglas para asignar números de oxidación:**

1. Elemento libre: 0 ($\\mathrm{O_2}$, $\\mathrm{Fe}$, $\\mathrm{S_8}$).
2. Ion monoatómico: igual a su carga.
3. H: $+1$ (excepto en hidruros metálicos: $-1$).
4. O: $-2$ (excepto peróxidos $-1$, superóxidos $-1/2$, $\\mathrm{OF_2}$ $+2$).
5. Halógenos: $-1$ con metales y H, otros valores con O.
6. La suma de números de oxidación en una molécula neutra es 0; en un ion, igual a su carga.

**Balance de redox por ion-electrón** (medio ácido):

1. Identifica las especies que cambian de número de oxidación.
2. Escribe dos **semirreacciones** (oxidación y reducción).
3. Balancea átomos distintos de O y H.
4. Balancea O añadiendo $\\mathrm{H_2O}$.
5. Balancea H añadiendo $\\mathrm{H^+}$.
6. Balancea cargas con electrones.
7. Multiplica las semirreacciones para que los electrones se cancelen.
8. Suma y simplifica.

En medio básico se hacen los pasos 4-6 igual y luego se suman $\\mathrm{OH^-}$ a ambos lados para neutralizar los $\\mathrm{H^+}$.

> **Ejemplo.** $\\mathrm{MnO_4^- + Fe^{2+} \\to Mn^{2+} + Fe^{3+}}$ en medio ácido. La semirreacción de reducción es $\\mathrm{MnO_4^- + 8H^+ + 5e^- \\to Mn^{2+} + 4H_2O}$ (Mn pasa de +7 a +2, gana 5 electrones). La de oxidación: $\\mathrm{Fe^{2+} \\to Fe^{3+} + e^-}$. Multiplicamos la segunda por 5 y sumamos.

**Agentes oxidantes y reductores fuertes.**

- Oxidantes: $\\mathrm{F_2}, \\mathrm{O_3}, \\mathrm{MnO_4^-}, \\mathrm{Cr_2O_7^{2-}}, \\mathrm{H_2O_2}$.
- Reductores: $\\mathrm{Li}, \\mathrm{Na}, \\mathrm{H_2}, \\mathrm{C} \\text{ (carbón)}, \\mathrm{Zn}$.

Las redox están en la respiración, la fotosíntesis, la corrosión, las baterías y los procesos metalúrgicos. Son el motor energético de buena parte del mundo natural y tecnológico.
`,
      },
      {
        id: "celdas",
        title: "Celdas galvánicas y potenciales estándar",
        keywords: ["pila", "celda", "ánodo", "cátodo", "FEM"],
        body: `
Una **celda galvánica** convierte energía química en eléctrica separando físicamente las dos semirreacciones de un proceso redox espontáneo. Los electrones fluyen por el **circuito externo** desde el ánodo (donde ocurre la oxidación) hasta el cátodo (donde ocurre la reducción), generando trabajo eléctrico aprovechable.

**Componentes:**

- **Ánodo** (electrodo negativo): aquí ocurre la oxidación, el metal se "consume".
- **Cátodo** (electrodo positivo): aquí ocurre la reducción, el metal se "deposita".
- **Puente salino**: cierra el circuito iónico y mantiene la electroneutralidad de cada compartimento.

Notación abreviada de pila (Daniell, por ejemplo):

$$\\mathrm{Zn(s)\\,|\\,Zn^{2+}(1\\,M)\\,||\\,Cu^{2+}(1\\,M)\\,|\\,Cu(s)}$$

A la izquierda el ánodo, a la derecha el cátodo, "$|$" cambio de fase, "$||$" puente salino.

**Potenciales estándar de electrodo** $E^\\circ$. Tabulados respecto al **electrodo estándar de hidrógeno (SHE)** al que se le asigna $E^\\circ = 0{,}00$ V por convención. Algunos valores típicos:

| Semirreacción | $E^\\circ$ (V) |
|---------------|----------------|
| $\\mathrm{F_2 + 2e^- \\to 2F^-}$ | +2,87 |
| $\\mathrm{Au^{3+} + 3e^- \\to Au}$ | +1,50 |
| $\\mathrm{Cu^{2+} + 2e^- \\to Cu}$ | +0,34 |
| $\\mathrm{2H^+ + 2e^- \\to H_2}$ | 0,00 |
| $\\mathrm{Zn^{2+} + 2e^- \\to Zn}$ | −0,76 |
| $\\mathrm{Li^+ + e^- \\to Li}$ | −3,04 |

**FEM de la celda:**

$$E^\\circ_{cell} = E^\\circ_{cátodo} - E^\\circ_{ánodo}$$

Si $E^\\circ_{cell} > 0$, la reacción global es espontánea ($\\Delta G^\\circ = -nFE^\\circ < 0$). Para Daniell ($\\mathrm{Cu^{2+}/Cu}$ vs $\\mathrm{Zn^{2+}/Zn}$): $E^\\circ_{cell} = 0{,}34 - (-0{,}76) = 1{,}10$ V.

> **Series de actividad.** Los metales con $E^\\circ$ muy negativo son fuertes reductores: pueden desplazar a metales menos activos de sus disoluciones. Por eso el zinc desplaza al cobre pero no al revés.

**Pilas vs electrólisis.** En una pila la reacción espontánea genera corriente; en una **celda electrolítica** se invierte el proceso aplicando un voltaje externo para forzar una reacción no espontánea (electroplateado, producción de Al, descomposición del agua).
`,
      },
      {
        id: "nernst",
        title: "Ecuación de Nernst y dependencia con la concentración",
        keywords: ["Nernst", "potencial", "concentración"],
        body: `
Los potenciales tabulados son válidos en condiciones estándar (1 M, 25 °C, 1 atm). Para concentraciones arbitrarias se usa la **ecuación de Nernst**:

$$E = E^\\circ - \\frac{RT}{nF}\\ln Q$$

con $R = 8{,}314$ J/(mol·K), $T$ en K, $n$ el número de electrones intercambiados, $F = 96\\,485$ C/mol (constante de Faraday), y $Q$ el cociente de reacción (productos sobre reactivos, igual que en el equilibrio pero usando concentraciones reales).

A 25 °C y pasando a logaritmo decimal:

$$E = E^\\circ - \\frac{0{,}0592}{n}\\log Q$$

**Comportamiento cualitativo:**

- Aumentar concentración de productos → $Q$ sube → $E$ baja.
- Aumentar concentración de reactivos → $Q$ baja → $E$ sube.
- A medida que la pila funciona, $Q \\to K$ y $E \\to 0$. La pila se "agota" cuando alcanza el equilibrio.

**En el equilibrio, $E = 0$ y $Q = K$**, lo que da una conexión preciosa entre electroquímica y termodinámica:

$$E^\\circ = \\frac{RT}{nF}\\ln K \\;\\Longleftrightarrow\\; \\Delta G^\\circ = -nFE^\\circ = -RT\\ln K$$

**Aplicaciones.**

- **pH-metro**: usa un electrodo de vidrio cuyo potencial responde a la actividad de $\\mathrm{H^+}$ según Nernst.
- **Sensores de gases** (electroquímicos de O₂, CO).
- **Pilas de concentración**: dos compartimentos del mismo metal con concentraciones distintas. Generan voltaje sin reacción química neta, hasta que ambas concentraciones se igualan.

> **Pilas reales.** En baterías comerciales (alcalinas, Li-ion) el voltaje real es algo menor que el termodinámico debido a sobrepotenciales (cinética lenta) y caídas óhmicas (resistencia interna). Por eso el voltaje de una batería cae cuando se le exige mucha corriente.

**Corrosión.** Es una reacción electroquímica espontánea: el hierro se oxida ($\\mathrm{Fe \\to Fe^{2+} + 2e^-}$) y el O₂ atmosférico se reduce. Las técnicas de protección incluyen pintura (barrera), galvanizado (Zn como ánodo de sacrificio) y protección catódica (conectar a un metal aún más activo, como Mg).
`,
      },
          {
        id: "problemas-resueltos",
        title: "Problemas resueltos y aplicaciones",
        keywords: ["ejemplos", "problemas resueltos", "aplicaciones"],
        body: `
**Problema 1 — pila Daniell.** Zn|Zn$^{2+}$ || Cu$^{2+}$|Cu. $E°_{cat}-E°_{an} = 0{,}34 - (-0{,}76) = 1{,}10\,\mathrm{V}$.

**Problema 2 — Nernst.** Si $[\mathrm{Cu^{2+}}]=10^{-3}$ M y $[\mathrm{Zn^{2+}}]=1$ M: $E = 1{,}10 - (0{,}0592/2)\log(1/10^{-3}) \approx 1{,}01\,\mathrm{V}$.

**Aplicaciones:** baterías, electrólisis del agua para hidrógeno verde, galvanoplastia, sensores de glucosa.
`,
      },
    ],
  },
];
