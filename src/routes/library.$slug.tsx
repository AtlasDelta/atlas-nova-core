import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect } from "react";
import { ARTICLES, CATEGORY_META, getArticle, type Article } from "@/lib/articles";
import { MarkdownArticle } from "@/components/MarkdownArticle";
import { Widget } from "@/components/widgets/Widget";
import { ArrowLeft, Clock, Hash } from "lucide-react";
import { Tag } from "@/components/ui-bits";

export const Route = createFileRoute("/library/$slug")({
  loader: ({ params }) => {
    const article = getArticle(params.slug);
    if (!article) throw notFound();
    return { article };
  },
  head: ({ loaderData }) => {
    const a = loaderData?.article;
    if (!a) return { meta: [{ title: "Artículo no encontrado — AtlasDelta" }] };
    return {
      meta: [
        { title: `${a.title} — AtlasDelta` },
        { name: "description", content: a.summary },
        { property: "og:title", content: a.title },
        { property: "og:description", content: a.summary },
      ],
    };
  },
  notFoundComponent: NotFound,
  component: ArticleView,
});

function ArticleView() {
  const data = Route.useLoaderData() as { article: Article };
  const article = data.article;
  const meta = CATEGORY_META[article.category];
  const related = ARTICLES.filter(
    (a) => a.category === article.category && a.slug !== article.slug,
  ).slice(0, 4);

  // Scroll al hash al cargar (para deep-links desde el buscador)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const id = window.location.hash.replace("#", "");
    if (!id) return;
    const t = setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
    return () => clearTimeout(t);
  }, [article.slug]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-10 max-w-6xl mx-auto">
      <article className="min-w-0">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 mb-6 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Inicio</Link>
          <span>/</span>
          <Link to="/library" className="hover:text-foreground">Repositorio</Link>
          <span>/</span>
          <Link to="/library" hash={article.category} className="hover:text-foreground">
            {meta.label}
          </Link>
        </nav>

        <Link
          to="/library"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="h-3 w-3" /> Volver al repositorio
        </Link>

        {/* Header */}
        <header className="mb-10 pb-8 border-b border-border">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Tag tone="primary">{meta.label}</Tag>
            <Tag
              tone={
                article.level === "introductorio"
                  ? "muted"
                  : article.level === "intermedio"
                  ? "primary"
                  : "warn"
              }
            >
              {article.level}
            </Tag>
            <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
              <Clock className="h-3 w-3" /> {article.readingMinutes} min
            </span>
            <span className="text-xs text-muted-foreground">
              {article.sections.length} secciones
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-semibold leading-tight mb-4">
            {article.title}
          </h1>
          <p className="text-lg text-muted-foreground text-balance">{article.summary}</p>
        </header>

        {/* Secciones */}
        <div className="space-y-12">
          {article.sections.map((s, i) => (
            <section key={s.id} id={s.id} className="scroll-mt-24">
              <h2 className="group text-2xl font-display font-semibold mb-4 flex items-center gap-2">
                <span className="text-xs text-muted-foreground tabular-nums mr-2">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {s.title}
                <a
                  href={`#${s.id}`}
                  className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-primary transition-opacity"
                  aria-label="Enlace a sección"
                >
                  <Hash className="h-4 w-4" />
                </a>
              </h2>
              <MarkdownArticle markdown={s.body} className="article-body" />
              {s.widget && <Widget name={s.widget} />}
            </section>
          ))}
        </div>

        {/* Relacionados */}
        {related.length > 0 && (
          <section className="mt-16 pt-8 border-t border-border">
            <h2 className="text-sm uppercase tracking-widest text-muted-foreground mb-4">
              Más en {meta.label}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  to="/library/$slug"
                  params={{ slug: r.slug }}
                  className="block border border-border p-4 hover:border-primary transition-colors"
                >
                  <div className="font-display font-medium text-sm mb-1">{r.title}</div>
                  <div className="text-xs text-muted-foreground">{r.summary}</div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>

      {/* TOC lateral */}
      <aside className="hidden lg:block">
        <div className="sticky top-20 border-l border-border pl-4">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3">
            Contenido
          </div>
          <ol className="space-y-2 text-xs">
            {article.sections.map((s, i) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="text-muted-foreground hover:text-primary transition-colors block leading-snug"
                >
                  <span className="tabular-nums mr-2">{String(i + 1).padStart(2, "0")}</span>
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </div>
      </aside>
    </div>
  );
}

function NotFound() {
  return (
    <div className="max-w-xl mx-auto text-center py-16">
      <h1 className="text-2xl font-display font-semibold mb-3">Artículo no encontrado</h1>
      <p className="text-muted-foreground mb-6">
        El artículo que buscas no existe o ha sido movido.
      </p>
      <Link
        to="/library"
        className="inline-flex items-center gap-2 border border-border-strong px-4 py-2 text-sm hover:border-primary hover:text-primary transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Volver al repositorio
      </Link>
    </div>
  );
}
