import { createFileRoute, Link } from "@tanstack/react-router";
import { Tag } from "../components/ui-bits";
import { ArrowRight, BookOpen } from "lucide-react";
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
  { pre: "Una plataforma para", highlight: "modelar fenómenos físicos", post: "y documentarlos con rigor." },
  { pre: "Un entorno para", highlight: "construir sistemas por bloques", post: "con puertos físicos tipados." },
  { pre: "Un espacio para", highlight: "redactar papers en LaTeX", post: "junto a tus colegas en tiempo real." },
  { pre: "Un repositorio de", highlight: "artículos científicos abiertos", post: "en Física, Química, Matemática e Ingeniería." },
  { pre: "Una herramienta para", highlight: "simular sistemas dinámicos", post: "sin escribir una sola línea de código." },
  { pre: "Un lugar donde", highlight: "el diagrama y la ecuación", post: "viven en el mismo documento." },
  { pre: "Un asistente para", highlight: "explorar intuiciones físicas", post: "antes de comprometerlas en código." },
  { pre: "Una IDE pensada para", highlight: "ingenieros e investigadores", post: "que necesitan rigor y velocidad." },
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
      {/* Hero */}
      <section className="relative border border-border bg-surface overflow-hidden corner-marks">
        <div className="absolute inset-0 bg-grid-fade pointer-events-none" />
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

          <div className="mt-4 flex gap-1.5" aria-hidden="true">
            {ROTATING_HEADLINES.map((_, i) => (
              <span
                key={i}
                className={`h-1 w-6 transition-colors ${
                  i === idx ? "bg-primary" : "bg-border"
                }`}
              />
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/app"
              className="group inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium hover:opacity-90 transition-all"
            >
              Abrir workspace
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/library"
              className="inline-flex items-center gap-2 border border-border-strong px-5 py-2.5 text-sm hover:border-primary hover:text-primary transition-colors"
            >
              <BookOpen className="h-4 w-4" />
              Explorar el repositorio
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
