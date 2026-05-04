import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Acceso — AtlasDelta Revamped" },
      { name: "description", content: "Accede al workspace de AtlasDelta Revamped." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate({ to: "/app" });
    });
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/app` },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      navigate({ to: "/app" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      if (msg.toLowerCase().includes("invalid login")) {
        setError("Credenciales inválidas. Verifica email y contraseña.");
      } else if (msg.toLowerCase().includes("already registered")) {
        setError("Este email ya tiene cuenta. Cambia a modo Iniciar sesión.");
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  }

  async function googleSignIn() {
    setError(null);
    setLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: `${window.location.origin}/app`,
      });
      if (result.error) throw result.error;
      if (result.redirected) return;
      navigate({ to: "/app" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión con Google");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="block text-center mb-8">
          <div className="font-display text-2xl font-semibold">
            ATLASDELTA<span className="text-primary">·REVAMPED</span>
          </div>
          <div className="text-xs text-muted-foreground mt-1">workspace · acceso</div>
        </Link>

        <div className="border border-border bg-surface corner-marks">
          <div className="border-b border-border px-5 py-3 flex items-center justify-between">
            <h1 className="font-display font-semibold text-lg">
              {mode === "signin" ? "Iniciar sesión" : "Crear cuenta"}
            </h1>
            <span className="text-[10px] tracking-widest text-muted-foreground">SECURE · TLS</span>
          </div>

          <form onSubmit={submit} className="p-5 space-y-4">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-1.5">
                Email
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-background border border-border px-3 py-2 text-sm font-mono focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-1.5">
                Contraseña
              </label>
              <input
                type="password"
                required
                minLength={6}
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-background border border-border px-3 py-2 text-sm font-mono focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {error && (
              <div className="border border-danger/50 bg-danger/5 text-danger text-xs px-3 py-2">
                ▸ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground px-4 py-2.5 text-sm font-medium hover:glow-primary transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === "signin" ? "▸ Acceder al workspace" : "▸ Crear workspace"}
            </button>

            <button
              type="button"
              onClick={() => {
                setMode(mode === "signin" ? "signup" : "signin");
                setError(null);
              }}
              className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors py-1"
            >
              {mode === "signin"
                ? "¿No tienes cuenta? Crear una nueva →"
                : "¿Ya tienes cuenta? Iniciar sesión →"}
            </button>
          </form>
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">
            ← Volver al overview de la spec
          </Link>
        </div>
      </div>
    </div>
  );
}
