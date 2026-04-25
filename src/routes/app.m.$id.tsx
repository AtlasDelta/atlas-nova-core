import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ChevronLeft, Check } from "lucide-react";
import { GraphEditor, type Graph } from "@/components/GraphEditor";

export const Route = createFileRoute("/app/m/$id")({
  component: ModelEditor,
});

function ModelEditor() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [graph, setGraph] = useState<Graph>({ nodes: [], edges: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from("models").select("name,graph").eq("id", id).single();
      if (error || !data) {
        setErr(error?.message ?? "Modelo no encontrado");
      } else {
        setName(data.name);
        setGraph((data.graph as unknown as Graph) ?? { nodes: [], edges: [] });
      }
      setLoading(false);
    })();
  }, [id]);

  // Debounced autosave
  const scheduleSave = useCallback((nextName: string, nextGraph: Graph) => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      setSaving(true);
      const { error } = await supabase.from("models").update({ name: nextName, graph: nextGraph as unknown as import("@/integrations/supabase/types").Json }).eq("id", id);
      setSaving(false);
      if (error) setErr(error.message);
      else { setSavedAt(new Date()); setErr(null); }
    }, 700);
  }, [id]);

  function handleGraphChange(g: Graph) {
    setGraph(g);
    scheduleSave(name, g);
  }
  function handleNameChange(n: string) {
    setName(n);
    scheduleSave(n, graph);
  }

  if (loading) {
    return <div className="flex-1 flex items-center justify-center"><Loader2 className="h-6 w-6 text-primary animate-spin" /></div>;
  }
  if (err) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="text-danger mb-3">▸ {err}</div>
          <button onClick={() => navigate({ to: "/app" })} className="text-sm border border-border px-3 py-1.5 hover:border-primary">← Volver</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="border-b border-border px-4 py-2 flex items-center gap-3 bg-surface/50">
        <Link to="/app" className="text-muted-foreground hover:text-foreground"><ChevronLeft className="h-4 w-4" /></Link>
        <input
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          className="bg-transparent border border-transparent hover:border-border focus:border-primary px-2 py-1 text-sm font-display font-medium focus:outline-none flex-1 max-w-md"
        />
        <div className="ml-auto flex items-center gap-2 text-[11px] text-muted-foreground">
          {saving ? (<><Loader2 className="h-3 w-3 animate-spin text-primary" /><span>guardando…</span></>)
            : savedAt ? (<><Check className="h-3 w-3 text-success" /><span>guardado · {savedAt.toLocaleTimeString()}</span></>)
            : <span>listo</span>}
        </div>
      </div>
      <GraphEditor graph={graph} onChange={handleGraphChange} />
    </div>
  );
}
