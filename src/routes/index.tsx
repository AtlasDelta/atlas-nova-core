import { createFileRoute, Link } from "@tanstack/react-router";
import { Panel, KeyVal, Tag, Bullet } from "../components/ui-bits";
import { ArrowRight, BookOpen, FileText, Workflow, FlaskConical } from "lucide-react";

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

function Home() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="relative border border-border bg-surface overflow-hidden corner-marks">
        <div className="absolute inset-0 bg-grid-fade pointer-events-none" />
        <div className="relative p-10 md:p-14">
          <div className="flex items-center gap-3 mb-6">
            <Tag tone="muted">Beta</Tag>
            <Tag tone="primary">Modelado · Simulación · Documentación</Tag>
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-semibold text-balance leading-[1.05]">
            Una plataforma para
            <br />
            <span className="text-primary">modelar fenómenos físicos</span>
            <br />y documentarlos con rigor.
          </h1>
          <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-2xl text-balance">
            AtlasDelta combina un editor visual de modelos por bloques (fluido,
            térmico, mecánico, eléctrico…), un editor colaborativo de documentos
            LaTeX y un repositorio abierto de artículos científicos
            explicativos. Pensado para estudiantes, investigadores e ingenieros.
          </p>
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

      {/* Tres herramientas */}
      <section>
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="text-2xl font-display font-semibold">Tres herramientas, un mismo lugar</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              Icon: Workflow,
              title: "Editor de modelos",
              desc: "Construye modelos físicos por bloques con puertos tipados (fluido, térmico, mecánico, eléctrico, control). Cada bloque expone parámetros y ecuaciones explícitas.",
              href: "/app" as const,
              cta: "Crear un modelo",
            },
            {
              Icon: FileText,
              title: "Documentos LaTeX colaborativos",
              desc: "Edita en tiempo real con varios autores. Vincula modelos, inserta gráficos, exporta a PDF. Sintaxis LaTeX estándar.",
              href: "/app" as const,
              cta: "Abrir editor",
            },
            {
              Icon: BookOpen,
              title: "Repositorio científico",
              desc: "Artículos breves de Física, Química, Matemática e Ingeniería. Material de referencia con notación cuidada y ecuaciones renderizadas.",
              href: "/library" as const,
              cta: "Ver artículos",
            },
          ].map(({ Icon, title, desc, href, cta }) => (
            <Panel key={title}>
              <div className="flex flex-col h-full gap-3">
                <Icon className="h-5 w-5 text-primary" />
                <div className="font-display font-medium text-base">{title}</div>
                <p className="text-muted-foreground text-sm flex-1">{desc}</p>
                <Link
                  to={href}
                  className="text-xs text-primary hover:underline mt-2 inline-flex items-center gap-1"
                >
                  {cta} <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </Panel>
          ))}
        </div>
      </section>

      {/* Para quién */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Panel title="¿Para quién es esto?">
            <ul>
              <Bullet>
                <strong className="text-foreground">Estudiantes</strong> que necesitan
                construir intuición sobre sistemas físicos y entregar trabajos formateados.
              </Bullet>
              <Bullet>
                <strong className="text-foreground">Investigadores</strong> que prototipan
                modelos rápidamente y redactan papers en colaboración.
              </Bullet>
              <Bullet>
                <strong className="text-foreground">Ingenieros</strong> que documentan
                sistemas (térmicos, hidráulicos, eléctricos) junto al diagrama que los describe.
              </Bullet>
              <Bullet>
                <strong className="text-foreground">Profesores</strong> que preparan material
                didáctico ejecutable, no solo texto.
              </Bullet>
            </ul>
          </Panel>
        </div>
        <Panel title="Estado del producto">
          <div className="space-y-1">
            <KeyVal k="Versión" v="0.2 · Beta" />
            <KeyVal k="Editor de modelos" v={<Tag tone="success">Disponible</Tag>} />
            <KeyVal k="Documentos LaTeX" v={<Tag tone="success">Disponible</Tag>} />
            <KeyVal k="Simulación numérica" v={<Tag tone="warn">En desarrollo</Tag>} />
            <KeyVal k="Asistente IA" v={<Tag tone="muted">Planeado</Tag>} />
          </div>
        </Panel>
      </section>

      {/* Repositorio destacado */}
      <section>
        <Panel>
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <FlaskConical className="h-8 w-8 text-accent flex-none" />
            <div className="flex-1">
              <h3 className="font-display font-medium text-lg mb-2">
                Repositorio científico abierto
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                Una colección curada de artículos breves y autocontenidos sobre
                conceptos fundamentales en cuatro áreas. Pensados para refrescar
                un tema rápidamente o servir de referencia mientras modelas.
              </p>
              <div className="flex flex-wrap gap-2">
                {["Física", "Química", "Matemática", "Ingeniería"].map((c) => (
                  <Tag key={c} tone="muted">
                    {c}
                  </Tag>
                ))}
              </div>
              <Link
                to="/library"
                className="mt-4 inline-flex items-center gap-2 text-sm text-primary hover:underline"
              >
                Ir al repositorio <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </Panel>
      </section>
    </div>
  );
}
