import { Link, Outlet, useLocation } from "@tanstack/react-router";
import { useAuth, signOut } from "@/hooks/useAuth";
import { InteractiveDotsBackground } from "@/components/InteractiveDotsBackground";

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
        className={`text-xs px-2 py-1 leading-none border-t-2 border-t-transparent border-b-2 transition-colors ${
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
    <div className="min-h-screen flex flex-col relative">
      <InteractiveDotsBackground />
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-[1600px] mx-auto px-6 h-14 flex items-center gap-3">
          <Link to="/" className="flex items-center font-display font-semibold leading-none">
            <span className="text-foreground">AtlasDelta<span className="text-muted-foreground">//</span>Revamped</span>
          </Link>

          <nav className="hidden sm:flex items-center gap-1">
            {navLink("/library", "Repositorio")}
            {!loading && user && navLink("/app", "Workspace")}
          </nav>

          <div className="ml-auto flex items-center gap-4 text-xs leading-none">
            {!loading && (user ? (
              <div className="flex items-center gap-3">
                <Link to="/app" className="border border-primary/40 text-primary px-3 py-1 leading-none hover:bg-primary hover:text-primary-foreground transition-colors">
                  Abrir workspace
                </Link>
                <button onClick={signOut} className="text-muted-foreground hover:text-foreground leading-none">
                  salir
                </button>
              </div>
            ) : (
              <Link to="/auth" className="border border-border-strong px-3 py-1 leading-none hover:border-primary hover:text-primary transition-colors">
                Acceder
              </Link>
            ))}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1600px] mx-auto w-full px-6 py-8 min-w-0 relative z-10">
        <Outlet />
      </main>
    </div>
  );
}
