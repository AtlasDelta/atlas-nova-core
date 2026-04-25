import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { Layout } from "../components/Layout";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center font-mono">
        <div className="text-xs text-primary mb-2">ERR_ROUTE_404</div>
        <h1 className="text-7xl font-display font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-display font-semibold text-foreground">Segmento no encontrado</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          La ruta solicitada no existe en la spec de AtlasDelta Revamped.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            ▸ Volver al overview
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "AtlasDelta Revamped — Spec Completa" },
      { name: "description", content: "Especificación de ingeniería de AtlasDelta Revamped: digital twin universal, kernel físico-matemático, simulación multi-dominio e IA integrada." },
      { name: "author", content: "AtlasDelta Engineering" },
      { property: "og:title", content: "AtlasDelta Revamped — Spec Completa" },
      { property: "og:description", content: "Sucesor de Simulink + OpenFOAM + Modelica con IA integrada." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: () => <Layout />,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
