import { Link, Outlet, useLocation } from "@tanstack/react-router";
import { Activity, ChevronDown, ChevronRight } from "lucide-react";
import { useAuth, signOut } from "@/hooks/useAuth";
import { useState, useEffect } from "react";

const NAV = [
  { to: "/", label: "00 / OVERVIEW" },
  { to: "/architecture", label: "01 / ARCHITECTURE" },
  { to: "/modules", label: "02 / MODULES" },
  { to: "/simulation", label: "03 / SIMULATION" },
  { to: "/intelligence", label: "04 / INTELLIGENCE" },
  { to: "/performance", label: "05 / PERFORMANCE" },
  { to: "/interface", label: "06 / INTERFACE" },
  { to: "/extensibility", label: "07 / EXTENSIBILITY" },
  { to: "/migration", label: "08 / MIGRATION" },
  { to: "/risks", label: "09 / RISKS" },
  { to: "/roadmap", label: "10 / ROADMAP" },
] as const;

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

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-[1600px] mx-auto px-6 h-14 flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 font-display font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 rounded-full bg-primary pulse-dot text-primary" />
              <span className="relative rounded-full bg-primary h-2 w-2" />
            </span>
            <span className="text-foreground">ATLASDELTA</span>
            <span className="text-primary">·REVAMPED</span>
          </Link>
          <span className="text-xs text-muted-foreground hidden md:inline">
            v2.0 · spec/2026-Q2 · build #∞
          </span>
          <div className="ml-auto flex items-center gap-4 text-xs">
            <div className="hidden sm:flex items-center gap-2 text-muted-foreground">
              <Activity className="h-3.5 w-3.5 text-success" />
              <span>SYSTEM NOMINAL</span>
            </div>
            {!loading && (user ? (
              <div className="flex items-center gap-3">
                <Link to="/app" className="border border-primary/40 text-primary px-3 py-1 hover:bg-primary hover:text-primary-foreground transition-colors">
                  ▸ WORKSPACE
                </Link>
                <button onClick={signOut} className="text-muted-foreground hover:text-foreground">
                  salir
                </button>
              </div>
            ) : (
              <Link to="/auth" className="border border-border-strong px-3 py-1 hover:border-primary hover:text-primary transition-colors">
                ▸ ACCEDER
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
              <span>· spec index ·</span>
              {navOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            </button>
            {navOpen && (
              <div id="spec-index-list" className="space-y-1">
                {NAV.map((n) => {
                  const active = loc.pathname === n.to;
                  return (
                    <Link
                      key={n.to}
                      to={n.to}
                      className={`block text-xs px-3 py-2 border-l-2 transition-all ${
                        active
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border text-muted-foreground hover:border-border-strong hover:text-foreground"
                      }`}
                    >
                      {n.label}
                    </Link>
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
          <div>ATLASDELTA REVAMPED · System Specification</div>
          <div className="flex gap-6">
            <span>RFC: AD-2.0-001</span>
            <span>STATUS: <span className="text-accent">DRAFT</span></span>
            <span>CLASS: ENGINEERING</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
