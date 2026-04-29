import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import Fuse from "fuse.js";
import {
  ARTICLES,
  CATEGORY_META,
  buildSearchIndex,
  type Category,
  type SearchEntry,
} from "@/lib/articles";
import { Panel, Tag } from "@/components/ui-bits";
import { ArrowRight, Clock, Search, X } from "lucide-react";

export const Route = createFileRoute("/library/")({
  head: () => ({
    meta: [
      { title: "Repositorio científico — AtlasDelta" },
      {
        name: "description",
        content:
          "Artículos sobre Física, Química, Matemática e Ingeniería. Buscador por concepto y secciones interactivas con gráficas.",
      },
      { property: "og:title", content: "Repositorio científico — AtlasDelta" },
      {
        property: "og:description",
        content:
          "Conceptos científicos explicados con notación rigurosa, gráficas y simulaciones interactivas.",
      },
    ],
  }),
  component: LibraryIndex,
});

function LibraryIndex() {
  const categories: Category[] = ["fisica", "quimica", "matematica", "ingenieria"];
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const fuse = useMemo(() => {
    const index: SearchEntry[] = buildSearchIndex();
    return new Fuse(index, {
      keys: [
        { name: "sectionTitle", weight: 0.4 },
        { name: "keywords", weight: 0.3 },
        { name: "articleTitle", weight: 0.2 },
        { name: "excerpt", weight: 0.1 },
      ],
      threshold: 0.38,
      ignoreLocation: true,
      minMatchCharLength: 2,
    });
  }, []);

  const results = useMemo(() => {
    if (q.trim().length < 2) return [];
    return fuse.search(q).slice(0, 10);
  }, [fuse, q]);

  const goToResult = (e: SearchEntry) => {
    setQ("");
    navigate({
      to: "/library/$slug",
      params: { slug: e.articleSlug },
      hash: e.sectionId,
    });
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <header className="border border-border bg-surface p-8 md:p-10">
        <div className="flex items-center gap-2 mb-4 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Inicio</Link>
          <span>/</span>
          <span>Repositorio</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-display font-semibold mb-4">
          Repositorio científico
        </h1>
        <p className="text-muted-foreground max-w-2xl text-balance mb-6">
          Una colección de artículos profundos sobre conceptos fundamentales en
          cuatro áreas. Cada artículo es una página-tema con varias secciones,
          ecuaciones renderizadas, tablas y gráficas o simulaciones interactivas.
        </p>

        {/* Buscador */}
        <div className="relative max-w-xl">
          <div className="flex items-center gap-2 border border-border-strong bg-surface-2/40 px-3 py-2.5">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder='Buscar por concepto, p. ej. "fricción", "Bernoulli", "PID"…'
              className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
            />
            {q && (
              <button
                type="button"
                onClick={() => setQ("")}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Limpiar"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {results.length > 0 && (
            <div className="absolute z-20 left-0 right-0 mt-1 border border-border-strong bg-surface shadow-xl max-h-96 overflow-auto">
              {results.map(({ item }) => {
                const cmeta = CATEGORY_META[item.category];
                return (
                  <button
                    key={`${item.articleSlug}#${item.sectionId}`}
                    type="button"
                    onClick={() => goToResult(item)}
                    className="w-full text-left px-3 py-2.5 border-b border-border last:border-b-0 hover:bg-surface-2 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] uppercase tracking-widest text-primary">
                        {cmeta.label}
                      </span>
                      <span className="text-[10px] text-muted-foreground truncate">
                        · {item.articleTitle}
                      </span>
                    </div>
                    <div className="text-sm font-display font-medium">
                      {item.sectionTitle}
                    </div>
                    <div className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                      {item.excerpt}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
          {q.trim().length >= 2 && results.length === 0 && (
            <div className="absolute z-20 left-0 right-0 mt-1 border border-border-strong bg-surface px-3 py-3 text-xs text-muted-foreground">
              Sin resultados para «{q}». Prueba con sinónimos o términos más generales.
            </div>
          )}
        </div>

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
                    <div className="flex flex-col gap-2 h-full p-1">
                      <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-muted-foreground">
                        <Tag tone={levelTone(a.level)}>{a.level}</Tag>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {a.readingMinutes} min
                        </span>
                      </div>
                      <h3 className="font-display font-medium text-base group-hover:text-primary transition-colors">
                        {a.title}
                      </h3>
                      <p className="text-sm text-muted-foreground flex-1">
                        {a.summary}
                      </p>
                      <div className="text-[10px] text-muted-foreground">
                        {a.sections.length} secciones
                      </div>
                      <span className="text-xs text-primary inline-flex items-center gap-1 mt-1">
                        Leer artículo{" "}
                        <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
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
