import { Link, Outlet, useLocation } from "@tanstack/react-router";
import { useAuth, signOut } from "@/hooks/useAuth";

export function Layout() {
  const loc = useLocation();
  const { user, loading } = useAuth();

  // Workspace routes use their own shell (full-bleed, no marketing chrome)
  const isWorkspace = loc.pathname === "/app" || loc.pathname.startsWith("/app/");
  if (isWorkspace) {
    return <Outlet />;
  }

  const navLink = (to: string, label: string, exact = false) => {
    const active = exact ? loc.pathname === to : loc.pathname === to || loc.pathname.startsWith(to + "/");
    return (
      <Link
        to={to}
        className={`text-xs px-2 py-1 border-b-2 transition-colors ${
          active
            ? "border-primary text-primary"
            : "border-transparent text-muted-foreground hover:text-foreground"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-[1600px] mx-auto px-6 h-14 flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 font-display font-semibold">
            <span className="text-foreground">AtlasDelta</span>
          </Link>

          <nav className="hidden sm:flex items-center gap-1 ml-4">
            {navLink("/", "Inicio", true)}
            {navLink("/library", "Repositorio")}
            {!loading && user && navLink("/app", "Workspace")}
          </nav>

          <div className="ml-auto flex items-center gap-4 text-xs">
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

      <main className="flex-1 max-w-[1600px] mx-auto w-full px-6 py-8 min-w-0">
        <Outlet />
      </main>

      <footer className="border-t border-border mt-12">
        <div className="max-w-[1600px] mx-auto px-6 py-6 flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
          <div>AtlasDelta · Plataforma de modelado físico-matemático</div>
          <div className="flex gap-6">
            <Link to="/" className="hover:text-foreground">Inicio</Link>
            <Link to="/library" className="hover:text-foreground">Repositorio</Link>
            {!loading && user && (
              <Link to="/app" className="hover:text-foreground">Workspace</Link>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
