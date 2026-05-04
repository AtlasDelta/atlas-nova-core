import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Plus, Trash2, X, Box, FileText, Loader2, Search } from "lucide-react";
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

interface Props {
  documentId: string;
  open: boolean;
  onClose: () => void;
  onChange: (data: { models: LinkedModel[]; docs: LinkedDocument[] }) => void;
  /** Inserta texto en el editor en la posición del cursor. */
  onInsert: (snippet: string) => void;
}

type Tab = "models" | "docs";

export function LinksDialog({ documentId, open, onClose, onChange, onInsert }: Props) {
  const [tab, setTab] = useState<Tab>("models");
  const [linkedModels, setLinkedModels] = useState<LinkedModel[]>([]);
  const [linkedDocs, setLinkedDocs] = useState<LinkedDocument[]>([]);
  const [availModels, setAvailModels] = useState<ModelOption[]>([]);
  const [availDocs, setAvailDocs] = useState<DocOption[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);

  async function reload() {
    setLoading(true);
    try {
      const [lm, ld, am, ad] = await Promise.all([
        fetchLinkedModels(documentId),
        fetchLinkedDocuments(documentId),
        listAvailableModels(),
        listAvailableDocuments(documentId),
      ]);
      setLinkedModels(lm);
      setLinkedDocs(ld);
      setAvailModels(am);
      setAvailDocs(ad);
      onChange({ models: lm, docs: ld });
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

  const filteredAvailModels = availModels.filter((m) => !linkedModelIds.has(m.id) && m.name.toLowerCase().includes(q.toLowerCase()));
  const filteredAvailDocs = availDocs.filter((d) => !linkedDocIds.has(d.id) && d.title.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-background border border-border w-full max-w-3xl max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center border-b border-border">
          <div className="flex">
            <button
              onClick={() => setTab("models")}
              className={`px-4 py-3 text-xs font-mono flex items-center gap-2 border-r border-border ${
                tab === "models" ? "bg-primary text-primary-foreground" : "hover:text-foreground text-muted-foreground"
              }`}
            >
              <Box className="h-3 w-3" /> Modelos ({linkedModels.length})
            </button>
            <button
              onClick={() => setTab("docs")}
              className={`px-4 py-3 text-xs font-mono flex items-center gap-2 border-r border-border ${
                tab === "docs" ? "bg-primary text-primary-foreground" : "hover:text-foreground text-muted-foreground"
              }`}
            >
              <FileText className="h-3 w-3" /> Documentos ({linkedDocs.length})
            </button>
          </div>
          <button onClick={onClose} className="ml-auto p-3 text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto p-4 space-y-4">
          {/* Vinculados */}
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
                      <Link to="/app/m/$id" params={{ id: lm.model_id }} className="hover:text-primary truncate flex-1">
                        {lm.model.name}
                      </Link>
                      <button
                        onClick={async () => {
                          await unlinkModel(lm.id);
                          await reload();
                        }}
                        className="text-muted-foreground hover:text-danger"
                        title="Desvincular"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </li>
                  ))}
                </ul>
              )
            ) : linkedDocs.length === 0 ? (
              <div className="text-xs text-muted-foreground italic">Ningún documento vinculado todavía.</div>
            ) : (
              <ul className="divide-y divide-border border border-border">
                {linkedDocs.map((ld) => (
                  <li key={ld.id} className="flex items-center gap-2 px-3 py-2 text-sm">
                    <FileText className="h-3 w-3 text-primary" />
                    <Link to="/app/d/$id" params={{ id: ld.target_document_id }} className="hover:text-primary truncate flex-1">
                      {ld.target.title}
                    </Link>
                    <button
                      onClick={() => onInsert(`\n\\input{${ld.target_document_id}}\n`)}
                      className="text-[11px] border border-border px-2 py-0.5 hover:border-primary hover:text-primary"
                      title="Insertar transclusión"
                    >
                      ↓ insertar
                    </button>
                    <button
                      onClick={async () => {
                        await unlinkDocument(ld.id);
                        await reload();
                      }}
                      className="text-muted-foreground hover:text-danger"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Buscar y añadir */}
          <div>
            <div className="text-[11px] font-mono text-muted-foreground mb-2">▸ añadir</div>
            <div className="flex items-center gap-2 border border-border px-2 mb-2">
              <Search className="h-3 w-3 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={tab === "models" ? "buscar modelo…" : "buscar documento…"}
                className="bg-transparent text-sm py-2 flex-1 focus:outline-none"
              />
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
                      <button
                        onClick={async () => {
                          await linkModel(documentId, m.id);
                          await reload();
                        }}
                        className="text-[11px] flex items-center gap-1 border border-border px-2 py-0.5 hover:border-primary hover:text-primary"
                      >
                        <Plus className="h-3 w-3" /> vincular
                      </button>
                    </li>
                  ))}
                </ul>
              )
            ) : filteredAvailDocs.length === 0 ? (
              <div className="text-xs text-muted-foreground italic">No hay más documentos disponibles.</div>
            ) : (
              <ul className="divide-y divide-border border border-border max-h-64 overflow-auto">
                {filteredAvailDocs.map((d) => (
                  <li key={d.id} className="flex items-center gap-2 px-3 py-2 text-sm">
                    <FileText className="h-3 w-3 text-muted-foreground" />
                    <span className="flex-1 truncate">{d.title}</span>
                    <button
                      onClick={async () => {
                        await linkDocument(documentId, d.id);
                        await reload();
                      }}
                      className="text-[11px] flex items-center gap-1 border border-border px-2 py-0.5 hover:border-primary hover:text-primary"
                    >
                      <Plus className="h-3 w-3" /> vincular
                    </button>
                  </li>
                ))}
              </ul>
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
  onOpenManager: () => void;
  onInsertDoc: (linkedDoc: LinkedDocument) => void;
}

export function LinksSidebar({ models, docs, onOpenManager, onInsertDoc }: SidebarProps) {
  return (
    <aside className="w-56 border-l border-border bg-surface/30 flex flex-col text-xs">
      <div className="px-3 py-2 border-b border-border flex items-center justify-between">
        <span className="font-mono text-muted-foreground">▸ vínculos</span>
        <button
          onClick={onOpenManager}
          className="text-muted-foreground hover:text-primary"
          title="Gestionar vínculos"
        >
          <Plus className="h-3 w-3" />
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="px-3 pt-3 pb-1 text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1">
          <Box className="h-3 w-3" /> Modelos
        </div>
        {models.length === 0 ? (
          <div className="px-3 py-1 text-[11px] text-muted-foreground italic">ninguno</div>
        ) : (
          <ul>
            {models.map((m) => (
              <li key={m.id} className="group px-3 py-1.5 hover:bg-surface flex items-center gap-1">
                <Link
                  to="/app/m/$id"
                  params={{ id: m.model_id }}
                  className="truncate flex-1 hover:text-primary"
                  title={`Abrir ${m.model.name} en el editor de grafos`}
                >
                  ◇ {m.model.name}
                </Link>
              </li>
            ))}
          </ul>
        )}

        <div className="px-3 pt-4 pb-1 text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1">
          <FileText className="h-3 w-3" /> Documentos
        </div>
        {docs.length === 0 ? (
          <div className="px-3 py-1 text-[11px] text-muted-foreground italic">ninguno</div>
        ) : (
          <ul>
            {docs.map((d) => (
              <li key={d.id} className="group px-3 py-1.5 hover:bg-surface flex items-center gap-1">
                <Link
                  to="/app/d/$id"
                  params={{ id: d.target_document_id }}
                  className="truncate flex-1 hover:text-primary"
                  title={d.target.title}
                >
                  ▤ {d.target.title}
                </Link>
                <button
                  onClick={() => onInsertDoc(d)}
                  className="opacity-0 group-hover:opacity-100 text-[10px] text-muted-foreground hover:text-primary"
                  title="Insertar \\input"
                >
                  ↓
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
