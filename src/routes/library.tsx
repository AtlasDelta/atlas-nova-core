import { createFileRoute, Link } from "@tanstack/react-router";
import { ARTICLES, CATEGORY_META, type Category } from "@/lib/articles";
import { Panel, Tag } from "@/components/ui-bits";
import { ArrowRight, Clock } from "lucide-react";

export const Route = createFileRoute("/library")({
  head: () => ({
    meta: [
      { title: "Repositorio científico — AtlasDelta" },
      {
        name: "description",
        content:
          "Artículos breves y autocontenidos sobre conceptos de Física, Química, Matemática e Ingeniería.",
      },
      { property: "og:title", content: "Repositorio científico — AtlasDelta" },
      {
        property: "og:description",
        content:
          "Conceptos fundamentales explicados con notación cuidada y ecuaciones renderizadas.",
      },
    ],
  }),
  component: LibraryIndex,
});

function LibraryIndex() {
  const categories: Category[] = ["fisica", "quimica", "matematica", "ingenieria"];

  return (
    <div className="space-y-10">
      {/* Header */}
      <header className="border border-border bg-surface p-8 md:p-10">
        <div className="flex items-center gap-2 mb-4 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">
            Inicio
          </Link>
          <span>/</span>
          <span>Repositorio</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-display font-semibold mb-4">
          Repositorio científico
        </h1>
        <p className="text-muted-foreground max-w-2xl text-balance">
          Una colección curada de artículos cortos sobre conceptos
          fundamentales en cuatro áreas. Cada artículo es autocontenido, usa
          notación matemática estándar y se puede leer en pocos minutos.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {categories.map((c) => (
            <a
              key={c}
              href={`#${c}`}
              className="text-xs border border-border-strong px-3 py-1.5 hover:border-primary hover:text-primary transition-colors"
            >
              {CATEGORY_META[c].label} ·{" "}
              {ARTICLES.filter((a) => a.category === c).length}
            </a>
          ))}
        </div>
      </header>

      {/* Categorías */}
      {categories.map((c) => {
        const items = ARTICLES.filter((a) => a.category === c);
        const meta = CATEGORY_META[c];
        return (
          <section key={c} id={c} className="scroll-mt-20">
            <div className="flex items-baseline justify-between mb-4">
              <div>
                <h2 className="text-2xl font-display font-semibold">{meta.label}</h2>
                <p className="text-sm text-muted-foreground">{meta.description}</p>
              </div>
              <span className="text-xs text-muted-foreground">
                {items.length} artículo{items.length === 1 ? "" : "s"}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((a) => (
                <Link
                  key={a.slug}
                  to="/library/$slug"
                  params={{ slug: a.slug }}
                  className="group"
                >
                  <Panel>
                    <div className="flex flex-col gap-2 h-full">
                      <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-muted-foreground">
                        <Tag tone={levelTone(a.level)}>{a.level}</Tag>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {a.readingMinutes} min
                        </span>
                      </div>
                      <h3 className="font-display font-medium text-base group-hover:text-primary transition-colors">
                        {a.title}
                      </h3>
                      <p className="text-sm text-muted-foreground flex-1">{a.summary}</p>
                      <span className="text-xs text-primary inline-flex items-center gap-1 mt-2">
                        Leer artículo <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </Panel>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function levelTone(level: string): "muted" | "primary" | "warn" {
  if (level === "introductorio") return "muted";
  if (level === "intermedio") return "primary";
  return "warn";
}
