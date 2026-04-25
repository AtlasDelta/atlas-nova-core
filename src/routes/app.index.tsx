import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Plus, Trash2, Copy, FileText } from "lucide-react";
import { Tag } from "@/components/ui-bits";

interface Model {
  id: string;
  name: string;
  description: string | null;
  domain: string;
  status: string;
  updated_at: string;
}

export const Route = createFileRoute("/app/")({
  component: Dashboard,
});

const DOMAINS = [
  { id: "general", label: "General" },
  { id: "aerospace", label: "Aeroespacial" },
  { id: "thermal", label: "Térmico" },
  { id: "fluid", label: "Fluidos" },
  { id: "mechanical", label: "Mecánico" },
  { id: "electrical", label: "Eléctrico" },
  { id: "control", label: "Control" },
];

function Dashboard() {
  const navigate = useNavigate();
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDomain, setNewDomain] = useState("general");
  const [creating, setCreating] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const fetchModels = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("models")
      .select("id,name,description,domain,status,updated_at")
      .order("updated_at", { ascending: false });
    if (error) setErr(error.message);
    setModels((data as Model[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchModels(); }, [fetchModels]);

  async function createModel(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setErr(null);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setErr("Sesión inválida"); setCreating(false); return; }
    const { data, error } = await supabase
      .from("models")
      .insert({
        user_id: user.id,
        name: newName.trim() || "Modelo sin título",
        domain: newDomain,
        graph: { nodes: [], edges: [] },
      })
      .select("id")
      .single();
    setCreating(false);
    if (error || !data) { setErr(error?.message ?? "Error"); return; }
    navigate({ to: "/app/m/$id", params: { id: data.id } });
  }

  async function deleteModel(id: string) {
    if (!confirm("¿Borrar este modelo?")) return;
    await supabase.from("models").delete().eq("id", id);
    fetchModels();
  }

  async function duplicateModel(m: Model) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: full } = await supabase.from("models").select("graph,parameters").eq("id", m.id).single();
    if (!full) return;
    await supabase.from("models").insert({
      user_id: user.id,
      name: `${m.name} (copia)`,
      domain: m.domain,
      description: m.description,
      graph: full.graph,
      parameters: full.parameters,
    });
    fetchModels();
  }

  return (
    <div className="flex-1 max-w-[1400px] w-full mx-auto px-6 py-10">
      <div className="flex items-end justify-between mb-8 border-b border-border pb-4">
        <div>
          <div className="text-xs text-primary tracking-widest mb-1">// MODELS</div>
          <h1 className="text-3xl font-display font-semibold">Tu biblioteca de sistemas</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {loading ? "cargando…" : `${models.length} modelo${models.length === 1 ? "" : "s"} en tu workspace`}
          </p>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="bg-primary text-primary-foreground px-4 py-2 text-sm flex items-center gap-2 hover:glow-primary transition-all"
        >
          <Plus className="h-4 w-4" /> Nuevo modelo
        </button>
      </div>

      {err && <div className="border border-danger/50 bg-danger/5 text-danger text-xs px-3 py-2 mb-4">▸ {err}</div>}

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 text-primary animate-spin" /></div>
      ) : models.length === 0 ? (
        <div className="border border-dashed border-border p-12 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-display text-lg mb-2">Sin modelos todavía</h3>
          <p className="text-sm text-muted-foreground mb-6">Crea tu primer sistema para empezar.</p>
          <button onClick={() => setShowNew(true)} className="border border-primary text-primary px-4 py-2 text-sm hover:bg-primary hover:text-primary-foreground transition-colors">
            ▸ Crear primer modelo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {models.map((m) => (
            <div key={m.id} className="border border-border bg-surface hover:border-primary/50 transition-colors group corner-marks">
              <Link to="/app/m/$id" params={{ id: m.id }} className="block p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-display font-medium text-base truncate flex-1">{m.name}</h3>
                  <Tag tone={m.status === "validated" ? "success" : m.status === "simulated" ? "primary" : "muted"}>{m.status}</Tag>
                </div>
                {m.description && <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{m.description}</p>}
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                  <Tag tone="muted">{DOMAINS.find(d => d.id === m.domain)?.label ?? m.domain}</Tag>
                  <span className="ml-auto">{new Date(m.updated_at).toLocaleDateString()}</span>
                </div>
              </Link>
              <div className="border-t border-border px-3 py-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => duplicateModel(m)} className="text-xs text-muted-foreground hover:text-foreground p-1 flex items-center gap-1">
                  <Copy className="h-3 w-3" /> Duplicar
                </button>
                <button onClick={() => deleteModel(m.id)} className="ml-auto text-xs text-muted-foreground hover:text-danger p-1 flex items-center gap-1">
                  <Trash2 className="h-3 w-3" /> Borrar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal nuevo modelo */}
      {showNew && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowNew(false)}>
          <form onClick={(e) => e.stopPropagation()} onSubmit={createModel} className="w-full max-w-md bg-surface border border-border corner-marks">
            <div className="border-b border-border px-5 py-3 flex items-center justify-between">
              <h2 className="font-display font-semibold">Nuevo modelo</h2>
              <span className="text-[10px] tracking-widest text-muted-foreground">INIT</span>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-1.5">Nombre</label>
                <input
                  autoFocus
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ej. Turbofán de 2 ejes"
                  className="w-full bg-background border border-border px-3 py-2 text-sm font-mono focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-1.5">Dominio</label>
                <select
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  className="w-full bg-background border border-border px-3 py-2 text-sm font-mono focus:border-primary focus:outline-none"
                >
                  {DOMAINS.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}
                </select>
              </div>
            </div>
            <div className="border-t border-border px-5 py-3 flex justify-end gap-2">
              <button type="button" onClick={() => setShowNew(false)} className="text-xs text-muted-foreground hover:text-foreground px-3 py-1.5">
                Cancelar
              </button>
              <button type="submit" disabled={creating} className="bg-primary text-primary-foreground px-4 py-1.5 text-sm flex items-center gap-2 disabled:opacity-50">
                {creating && <Loader2 className="h-3 w-3 animate-spin" />} Crear
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
