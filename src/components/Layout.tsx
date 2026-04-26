import { Link, Outlet, useLocation } from "@tanstack/react-router";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useAuth, signOut } from "@/hooks/useAuth";
import { useState, useEffect } from "react";

const NAV: { to: string; label: string; section?: string }[] = [
  { to: "/", label: "Inicio", section: "PRODUCTO" },
  { to: "/library", label: "Repositorio científico" },
  { to: "/architecture", label: "Arquitectura", section: "DOCUMENTACIÓN TÉCNICA" },
  { to: "/modules", label: "Módulos" },
  { to: "/simulation", label: "Motor de simulación" },
  { to: "/intelligence", label: "Asistente IA" },
  { to: "/performance", label: "Rendimiento" },
  { to: "/interface", label: "Interfaz de usuario" },
  { to: "/extensibility", label: "Extensibilidad" },
  { to: "/migration", label: "Migración" },
  { to: "/risks", label: "Riesgos" },
  { to: "/roadmap", label: "Hoja de ruta" },
];

export function Layout() {
  const loc = useLocation();
  const { user, loading } = useAuth();
  const [navOpen, setNavOpen] = useState(true);

  // Collapse by default on small screens
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setNavOpen(false);
    }
  }, []);

  // Close on route change (mobile UX)
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setNavOpen(false);
    }
  }, [loc.pathname]);

  // Workspace routes use their own shell (full-bleed, no marketing chrome)
  const isWorkspace = loc.pathname === "/app" || loc.pathname.startsWith("/app/");
  if (isWorkspace) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-[1600px] mx-auto px-6 h-14 flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 font-display font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 rounded-full bg-primary pulse-dot text-primary" />
              <span className="relative rounded-full bg-primary h-2 w-2" />
            </span>
            <span className="text-foreground">AtlasDelta</span>
          </Link>
          <span className="text-xs text-muted-foreground hidden md:inline">
            Plataforma de modelado y simulación física
          </span>
          <div className="ml-auto flex items-center gap-4 text-xs">
            <Link to="/library" className="hidden sm:inline text-muted-foreground hover:text-foreground">
              Repositorio
            </Link>
            {!loading && (user ? (
              <div className="flex items-center gap-3">
                <Link to="/app" className="border border-primary/40 text-primary px-3 py-1 hover:bg-primary hover:text-primary-foreground transition-colors">
                  Abrir workspace
                </Link>
                <button onClick={signOut} className="text-muted-foreground hover:text-foreground">
                  salir
                </button>
              </div>
            ) : (
              <Link to="/auth" className="border border-border-strong px-3 py-1 hover:border-primary hover:text-primary transition-colors">
                Acceder
              </Link>
            ))}
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-[1600px] mx-auto w-full px-6 py-8 flex flex-col lg:flex-row gap-6">
        <nav className={`flex-none w-full lg:w-56 ${navOpen ? "" : "lg:w-auto"}`}>
          <div className="sticky top-20">
            <button
              type="button"
              onClick={() => setNavOpen((o) => !o)}
              className="w-full flex items-center justify-between gap-2 text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground mb-3 px-2 py-1 border-l-2 border-transparent hover:border-border-strong transition-colors"
              aria-expanded={navOpen}
              aria-controls="spec-index-list"
            >
              <span>· navegación ·</span>
              {navOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            </button>
            {navOpen && (
              <div id="spec-index-list" className="space-y-0.5">
                {NAV.map((n) => {
                  const active = loc.pathname === n.to;
                  return (
                    <div key={n.to}>
                      {n.section && (
                        <div className="text-[10px] uppercase tracking-widest text-muted-foreground/60 mt-4 mb-1.5 px-3">
                          {n.section}
                        </div>
                      )}
                      <Link
                        to={n.to}
                        className={`block text-xs px-3 py-1.5 border-l-2 transition-all ${
                          active
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border text-muted-foreground hover:border-border-strong hover:text-foreground"
                        }`}
                      >
                        {n.label}
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>

      <footer className="border-t border-border mt-12">
        <div className="max-w-[1600px] mx-auto px-6 py-6 flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
          <div>AtlasDelta · Plataforma de modelado físico-matemático</div>
          <div className="flex gap-6">
            <Link to="/library" className="hover:text-foreground">Repositorio</Link>
            <Link to="/architecture" className="hover:text-foreground">Documentación</Link>
            <Link to="/roadmap" className="hover:text-foreground">Hoja de ruta</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
