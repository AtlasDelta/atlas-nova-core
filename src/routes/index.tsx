import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AtlasDelta — Modelado y simulación física" },
      {
        name: "description",
        content:
          "Plataforma para construir modelos físicos por bloques, redactar documentos científicos en LaTeX y consultar artículos explicativos de Física, Química, Matemática e Ingeniería.",
      },
      { property: "og:title", content: "AtlasDelta — Modelado y simulación física" },
      {
        property: "og:description",
        content:
          "Editor visual de modelos, documentos LaTeX colaborativos y un repositorio científico abierto.",
      },
    ],
  }),
  component: Home,
});

const ROTATING_HEADLINES: { pre: string; highlight: string; post: string }[] = [
  { pre: "Un lugar para", highlight: "imaginar cómo funciona el mundo", post: "y verlo cobrar vida." },
  { pre: "Aprende ciencia", highlight: "jugando con ideas", post: "en lugar de memorizarlas." },
  { pre: "Convierte tus dudas en", highlight: "experimentos visuales", post: "que puedes tocar y modificar." },
  { pre: "Una biblioteca abierta de", highlight: "ciencia explicada con claridad", post: "para curiosos de cualquier nivel." },
  { pre: "Crea, escribe y comparte", highlight: "tus propias ideas", post: "junto a otras mentes inquietas." },
  { pre: "Donde los dibujos, las fórmulas", highlight: "y la intuición", post: "se encuentran en un mismo lugar." },
  { pre: "Explora la ciencia", highlight: "sin necesidad de programar", post: "ni saberlo todo de antemano." },
  { pre: "Un espacio pensado para", highlight: "estudiantes, curiosos y creadores", post: "que quieren entender el porqué." },
];

function Home() {
  const [idx, setIdx] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const tick = setInterval(() => {
      setFade(false);
      const swap = setTimeout(() => {
        setIdx((i) => (i + 1) % ROTATING_HEADLINES.length);
        setFade(true);
      }, 350);
      return () => clearTimeout(swap);
    }, 4500);
    return () => clearInterval(tick);
  }, []);

  const current = ROTATING_HEADLINES[idx];

  return (
    <div className="space-y-12">
      <section className="relative overflow-hidden">
        <div className="relative p-10 md:p-14">
          <h1
            aria-live="polite"
            className={`text-4xl md:text-6xl font-display font-semibold text-balance leading-[1.05] min-h-[180px] md:min-h-[260px] transition-opacity duration-300 ${
              fade ? "opacity-100" : "opacity-0"
            }`}
          >
            {current.pre}
            <br />
            <span className="text-primary">{current.highlight}</span>
            <br />
            {current.post}
          </h1>
        </div>
      </section>
    </div>
  );
}
