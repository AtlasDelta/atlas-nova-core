import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ARTICLES, CATEGORY_META, getArticle, type Article } from "@/lib/articles";
import { MarkdownArticle } from "@/components/MarkdownArticle";
import { ArrowLeft, Clock } from "lucide-react";
import { Tag } from "@/components/ui-bits";

export const Route = createFileRoute("/library/$slug")({
  loader: ({ params }) => {
    const article = getArticle(params.slug);
    if (!article) throw notFound();
    return { article };
  },
  head: ({ loaderData }) => {
    const a = loaderData?.article;
    if (!a) {
      return { meta: [{ title: "Artículo no encontrado — AtlasDelta" }] };
    }
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
  const { article } = Route.useLoaderData();
  const meta = CATEGORY_META[article.category];
  const related = ARTICLES.filter(
    (a) => a.category === article.category && a.slug !== article.slug,
  ).slice(0, 3);

  return (
    <div className="max-w-3xl mx-auto">
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

      {/* Volver */}
      <Link
        to="/library"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-8"
      >
        <ArrowLeft className="h-3 w-3" /> Volver al repositorio
      </Link>

      {/* Header */}
      <header className="mb-10 pb-8 border-b border-border">
        <div className="flex items-center gap-3 mb-4">
          <Tag tone="primary">{meta.label}</Tag>
          <Tag tone={article.level === "introductorio" ? "muted" : article.level === "intermedio" ? "primary" : "warn"}>
            {article.level}
          </Tag>
          <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
            <Clock className="h-3 w-3" /> {article.readingMinutes} min de lectura
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-display font-semibold leading-tight mb-4">
          {article.title}
        </h1>
        <p className="text-lg text-muted-foreground text-balance">{article.summary}</p>
      </header>

      {/* Cuerpo */}
      <MarkdownArticle markdown={article.body} className="article-body" />

      {/* Relacionados */}
      {related.length > 0 && (
        <section className="mt-16 pt-8 border-t border-border">
          <h2 className="text-sm uppercase tracking-widest text-muted-foreground mb-4">
            Otros artículos de {meta.label}
          </h2>
          <div className="space-y-2">
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
