import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Plus, Trash2, X, Box, FileText, Loader2, Search, LineChart } from "lucide-react";
import {
  fetchLinkedModels,
  fetchLinkedDocuments,
  listAvailableModels,
  listAvailableDocuments,
  linkModel,
  unlinkModel,
  linkDocument,
  unlinkDocument,
  type LinkedModel,
  type LinkedDocument,
  type ModelOption,
  type DocOption,
} from "@/lib/document-links";
import {
  listPlots,
  linkPlotToDoc,
  unlinkPlotFromDoc,
  resolveAccessiblePlots,
  type LinkedPlot,
  type PlotRow,
} from "@/lib/plots";
import { supabase } from "@/integrations/supabase/client";

export interface DocLinksData {
  models: LinkedModel[];
  docs: LinkedDocument[];
  /** Direct plot links on this document (with link id, for unlink). */
  directPlots: Array<{ linkId: string; plotId: string; name: string; kind: "2d" | "3d" }>;
  /** All plots accessible (direct + transitive via document_links). */
  accessiblePlots: LinkedPlot[];
}

interface Props {
  documentId: string;
  open: boolean;
  onClose: () => void;
  onChange: (data: DocLinksData) => void;
  onInsert: (snippet: string) => void;
}

type Tab = "models" | "docs" | "plots";

export function LinksDialog({ documentId, open, onClose, onChange, onInsert }: Props) {
  const [tab, setTab] = useState<Tab>("models");
  const [linkedModels, setLinkedModels] = useState<LinkedModel[]>([]);
  const [linkedDocs, setLinkedDocs] = useState<LinkedDocument[]>([]);
  const [directPlots, setDirectPlots] = useState<Array<{ linkId: string; plotId: string; name: string; kind: "2d" | "3d" }>>([]);
  const [accessiblePlots, setAccessiblePlots] = useState<LinkedPlot[]>([]);
  const [availModels, setAvailModels] = useState<ModelOption[]>([]);
  const [availDocs, setAvailDocs] = useState<DocOption[]>([]);
  const [availPlots, setAvailPlots] = useState<PlotRow[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);

  async function reload() {
    setLoading(true);
    try {
      const [lm, ld, am, ad, ap, accPlots, directRows] = await Promise.all([
        fetchLinkedModels(documentId),
        fetchLinkedDocuments(documentId),
        listAvailableModels(),
        listAvailableDocuments(documentId),
        listPlots(),
        resolveAccessiblePlots(documentId),
        supabase
          .from("document_plots")
          .select("id,plot_id,plots(id,name,kind)")
          .eq("document_id", documentId),
      ]);
      setLinkedModels(lm);
      setLinkedDocs(ld);
      setAvailModels(am);
      setAvailDocs(ad);
      setAvailPlots(ap);
      setAccessiblePlots(accPlots);
      const dp = (directRows.data ?? [])
        .filter((r) => r.plots)
        .map((r) => {
          const p = r.plots as unknown as { id: string; name: string; kind: "2d" | "3d" };
          return { linkId: r.id, plotId: r.plot_id, name: p.name, kind: p.kind };
        });
      setDirectPlots(dp);
      onChange({ models: lm, docs: ld, directPlots: dp, accessiblePlots: accPlots });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (open) reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, documentId]);

  if (!open) return null;

  const linkedModelIds = new Set(linkedModels.map((l) => l.model_id));
  const linkedDocIds = new Set(linkedDocs.map((l) => l.target_document_id));
  const directPlotIds = new Set(directPlots.map((p) => p.plotId));

  const filteredAvailModels = availModels.filter((m) => !linkedModelIds.has(m.id) && m.name.toLowerCase().includes(q.toLowerCase()));
  const filteredAvailDocs = availDocs.filter((d) => !linkedDocIds.has(d.id) && d.title.toLowerCase().includes(q.toLowerCase()));
  const filteredAvailPlots = availPlots.filter((p) => !directPlotIds.has(p.id) && p.name.toLowerCase().includes(q.toLowerCase()));

  // Plots transitively accessible (not directly linked)
  const transitivePlots = accessiblePlots.filter((p) => !directPlotIds.has(p.plot_id));

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-background border border-border w-full max-w-3xl max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center border-b border-border">
          <div className="flex">
            <button onClick={() => setTab("models")} className={`px-4 py-3 text-xs font-mono flex items-center gap-2 border-r border-border ${tab === "models" ? "bg-primary text-primary-foreground" : "hover:text-foreground text-muted-foreground"}`}>
              <Box className="h-3 w-3" /> Modelos ({linkedModels.length})
            </button>
            <button onClick={() => setTab("docs")} className={`px-4 py-3 text-xs font-mono flex items-center gap-2 border-r border-border ${tab === "docs" ? "bg-primary text-primary-foreground" : "hover:text-foreground text-muted-foreground"}`}>
              <FileText className="h-3 w-3" /> Documentos ({linkedDocs.length})
            </button>
            <button onClick={() => setTab("plots")} className={`px-4 py-3 text-xs font-mono flex items-center gap-2 border-r border-border ${tab === "plots" ? "bg-primary text-primary-foreground" : "hover:text-foreground text-muted-foreground"}`}>
              <LineChart className="h-3 w-3" /> Gráficas ({directPlots.length}{transitivePlots.length > 0 ? ` +${transitivePlots.length}` : ""})
            </button>
          </div>
          <button onClick={onClose} className="ml-auto p-3 text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-4">
          <div>
            <div className="text-[11px] font-mono text-muted-foreground mb-2">▸ vinculados</div>
            {loading ? (
              <div className="flex items-center gap-2 text-xs text-muted-foreground"><Loader2 className="h-3 w-3 animate-spin" /> cargando…</div>
            ) : tab === "models" ? (
              linkedModels.length === 0 ? (
                <div className="text-xs text-muted-foreground italic">Ningún modelo vinculado todavía.</div>
              ) : (
                <ul className="divide-y divide-border border border-border">
                  {linkedModels.map((lm) => (
                    <li key={lm.id} className="flex items-center gap-2 px-3 py-2 text-sm">
                      <Box className="h-3 w-3 text-primary" />
                      <Link to="/app/m/$id" params={{ id: lm.model_id }} className="hover:text-primary truncate flex-1">{lm.model.name}</Link>
                      <button onClick={async () => { await unlinkModel(lm.id); await reload(); }} className="text-muted-foreground hover:text-danger" title="Desvincular"><Trash2 className="h-3 w-3" /></button>
                    </li>
                  ))}
                </ul>
              )
            ) : tab === "docs" ? (
              linkedDocs.length === 0 ? (
                <div className="text-xs text-muted-foreground italic">Ningún documento vinculado todavía.</div>
              ) : (
                <ul className="divide-y divide-border border border-border">
                  {linkedDocs.map((ld) => (
                    <li key={ld.id} className="flex items-center gap-2 px-3 py-2 text-sm">
                      <FileText className="h-3 w-3 text-primary" />
                      <Link to="/app/d/$id" params={{ id: ld.target_document_id }} className="hover:text-primary truncate flex-1">{ld.target.title}</Link>
                      <button onClick={() => onInsert(`\n\\input{${ld.target_document_id}}\n`)} className="text-[11px] border border-border px-2 py-0.5 hover:border-primary hover:text-primary" title="Insertar transclusión">↓ insertar</button>
                      <button onClick={async () => { await unlinkDocument(ld.id); await reload(); }} className="text-muted-foreground hover:text-danger"><Trash2 className="h-3 w-3" /></button>
                    </li>
                  ))}
                </ul>
              )
            ) : (
              // Plots tab
              <>
                {directPlots.length === 0 && transitivePlots.length === 0 ? (
                  <div className="text-xs text-muted-foreground italic">Ninguna gráfica accesible. Vincula una directamente o vincula otro documento que tenga gráficas.</div>
                ) : (
                  <ul className="divide-y divide-border border border-border">
                    {directPlots.map((p) => (
                      <li key={p.linkId} className="flex items-center gap-2 px-3 py-2 text-sm">
                        <LineChart className="h-3 w-3 text-primary" />
                        <Link to="/app/p/$id" params={{ id: p.plotId }} className="hover:text-primary truncate flex-1">{p.name}</Link>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-widest">{p.kind}</span>
                        <button onClick={() => onInsert(`\n\\plot{${p.plotId}}\n`)} className="text-[11px] border border-border px-2 py-0.5 hover:border-primary hover:text-primary" title="Insertar gráfica">↓ insertar</button>
                        <button onClick={async () => { await unlinkPlotFromDoc(p.linkId); await reload(); }} className="text-muted-foreground hover:text-danger"><Trash2 className="h-3 w-3" /></button>
                      </li>
                    ))}
                    {transitivePlots.map((p) => (
                      <li key={p.id} className="flex items-center gap-2 px-3 py-2 text-sm bg-surface/40">
                        <LineChart className="h-3 w-3 text-muted-foreground" />
                        <Link to="/app/p/$id" params={{ id: p.plot_id }} className="hover:text-primary truncate flex-1">
                          {p.plot.name}
                          <span className="text-[10px] text-muted-foreground ml-2">via {p.via?.length ? p.via.join(" → ") + " → " : ""}{p.origin_document_title}</span>
                        </Link>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-widest">{p.plot.kind}</span>
                        <button onClick={() => onInsert(`\n\\plot{${p.plot_id}}\n`)} className="text-[11px] border border-border px-2 py-0.5 hover:border-primary hover:text-primary" title="Insertar (referenciada)">↓ insertar</button>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </div>

          <div>
            <div className="text-[11px] font-mono text-muted-foreground mb-2">▸ añadir</div>
            <div className="flex items-center gap-2 border border-border px-2 mb-2">
              <Search className="h-3 w-3 text-muted-foreground" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={tab === "models" ? "buscar modelo…" : tab === "docs" ? "buscar documento…" : "buscar gráfica…"} className="bg-transparent text-sm py-2 flex-1 focus:outline-none" />
            </div>
            {tab === "models" ? (
              filteredAvailModels.length === 0 ? (
                <div className="text-xs text-muted-foreground italic">No hay más modelos disponibles.</div>
              ) : (
                <ul className="divide-y divide-border border border-border max-h-64 overflow-auto">
                  {filteredAvailModels.map((m) => (
                    <li key={m.id} className="flex items-center gap-2 px-3 py-2 text-sm">
                      <Box className="h-3 w-3 text-muted-foreground" />
                      <span className="flex-1 truncate">{m.name}</span>
                      <button onClick={async () => { await linkModel(documentId, m.id); await reload(); }} className="text-[11px] flex items-center gap-1 border border-border px-2 py-0.5 hover:border-primary hover:text-primary"><Plus className="h-3 w-3" /> vincular</button>
                    </li>
                  ))}
                </ul>
              )
            ) : tab === "docs" ? (
              filteredAvailDocs.length === 0 ? (
                <div className="text-xs text-muted-foreground italic">No hay más documentos disponibles.</div>
              ) : (
                <ul className="divide-y divide-border border border-border max-h-64 overflow-auto">
                  {filteredAvailDocs.map((d) => (
                    <li key={d.id} className="flex items-center gap-2 px-3 py-2 text-sm">
                      <FileText className="h-3 w-3 text-muted-foreground" />
                      <span className="flex-1 truncate">{d.title}</span>
                      <button onClick={async () => { await linkDocument(documentId, d.id); await reload(); }} className="text-[11px] flex items-center gap-1 border border-border px-2 py-0.5 hover:border-primary hover:text-primary"><Plus className="h-3 w-3" /> vincular</button>
                    </li>
                  ))}
                </ul>
              )
            ) : (
              filteredAvailPlots.length === 0 ? (
                <div className="text-xs text-muted-foreground italic">No hay más gráficas disponibles.</div>
              ) : (
                <ul className="divide-y divide-border border border-border max-h-64 overflow-auto">
                  {filteredAvailPlots.map((p) => (
                    <li key={p.id} className="flex items-center gap-2 px-3 py-2 text-sm">
                      <LineChart className="h-3 w-3 text-muted-foreground" />
                      <span className="flex-1 truncate">{p.name}</span>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-widest">{p.kind}</span>
                      <button onClick={async () => { await linkPlotToDoc(documentId, p.id); await reload(); }} className="text-[11px] flex items-center gap-1 border border-border px-2 py-0.5 hover:border-primary hover:text-primary"><Plus className="h-3 w-3" /> vincular</button>
                    </li>
                  ))}
                </ul>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface SidebarProps {
  models: LinkedModel[];
  docs: LinkedDocument[];
  directPlots: Array<{ linkId: string; plotId: string; name: string; kind: "2d" | "3d" }>;
  transitivePlots: LinkedPlot[];
  onOpenManager: () => void;
  onInsertDoc: (linkedDoc: LinkedDocument) => void;
  onInsertPlot: (plotId: string) => void;
}

export function LinksSidebar({ models, docs, directPlots, transitivePlots, onOpenManager, onInsertDoc, onInsertPlot }: SidebarProps) {
  return (
    <aside className="w-56 border-l border-border bg-surface/30 flex flex-col text-xs">
      <div className="px-3 py-2 border-b border-border flex items-center justify-between">
        <span className="font-mono text-muted-foreground">▸ vínculos</span>
        <button onClick={onOpenManager} className="text-muted-foreground hover:text-primary" title="Gestionar vínculos"><Plus className="h-3 w-3" /></button>
      </div>

      <div className="flex-1 overflow-auto">
        <Section icon={<Box className="h-3 w-3" />} label="Modelos" empty={models.length === 0}>
          {models.map((m) => (
            <li key={m.id} className="group px-3 py-1.5 hover:bg-surface flex items-center gap-1">
              <Link to="/app/m/$id" params={{ id: m.model_id }} className="truncate flex-1 hover:text-primary" title={m.model.name}>◇ {m.model.name}</Link>
            </li>
          ))}
        </Section>

        <Section icon={<FileText className="h-3 w-3" />} label="Documentos" empty={docs.length === 0}>
          {docs.map((d) => (
            <li key={d.id} className="group px-3 py-1.5 hover:bg-surface flex items-center gap-1">
              <Link to="/app/d/$id" params={{ id: d.target_document_id }} className="truncate flex-1 hover:text-primary" title={d.target.title}>▤ {d.target.title}</Link>
              <button onClick={() => onInsertDoc(d)} className="opacity-0 group-hover:opacity-100 text-[10px] text-muted-foreground hover:text-primary" title="Insertar \\input">↓</button>
            </li>
          ))}
        </Section>

        <Section icon={<LineChart className="h-3 w-3" />} label="Gráficas" empty={directPlots.length === 0 && transitivePlots.length === 0}>
          {directPlots.map((p) => (
            <li key={p.linkId} className="group px-3 py-1.5 hover:bg-surface flex items-center gap-1">
              <Link to="/app/p/$id" params={{ id: p.plotId }} className="truncate flex-1 hover:text-primary" title={p.name}>∿ {p.name}</Link>
              <button onClick={() => onInsertPlot(p.plotId)} className="opacity-0 group-hover:opacity-100 text-[10px] text-muted-foreground hover:text-primary" title="Insertar \\plot">↓</button>
            </li>
          ))}
          {transitivePlots.map((p) => (
            <li key={p.id} className="group px-3 py-1.5 hover:bg-surface flex items-center gap-1 opacity-70">
              <Link to="/app/p/$id" params={{ id: p.plot_id }} className="truncate flex-1 hover:text-primary" title={`vía ${p.origin_document_title}`}>∿ {p.plot.name}</Link>
              <button onClick={() => onInsertPlot(p.plot_id)} className="opacity-0 group-hover:opacity-100 text-[10px] text-muted-foreground hover:text-primary" title="Insertar (referenciada)">↓</button>
            </li>
          ))}
        </Section>
      </div>
    </aside>
  );
}

function Section({ icon, label, empty, children }: { icon: React.ReactNode; label: string; empty: boolean; children: React.ReactNode }) {
  return (
    <>
      <div className="px-3 pt-3 pb-1 text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1">
        {icon} {label}
      </div>
      {empty ? <div className="px-3 py-1 text-[11px] text-muted-foreground italic">ninguno</div> : <ul>{children}</ul>}
    </>
  );
}
