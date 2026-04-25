import { createFileRoute, Outlet, redirect, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { signOut } from "@/hooks/useAuth";

export const Route = createFileRoute("/app")({
  // Client-side guard: check session and redirect if missing
  beforeLoad: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw redirect({ to: "/auth" });
    }
  },
  component: AppShell,
});

function AppShell() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, sess) => {
      if (!sess) navigate({ to: "/auth" });
      setEmail(sess?.user.email ?? null);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setEmail(session?.user.email ?? null);
      setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="px-6 h-12 flex items-center gap-6">
          <Link to="/app" className="font-display font-semibold text-sm">
            ATLASDELTA<span className="text-primary">·workspace</span>
          </Link>
          <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">
            ← spec
          </Link>
          <div className="ml-auto flex items-center gap-4 text-xs">
            <span className="text-muted-foreground hidden sm:inline">{email}</span>
            <button onClick={signOut} className="text-muted-foreground hover:text-foreground">
              salir
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1 min-h-0 flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}
