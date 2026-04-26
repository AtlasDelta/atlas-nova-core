import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import * as Y from "yjs";
import { Awareness } from "y-protocols/awareness";
import { supabase } from "@/integrations/supabase/client";
import { LatexEditor, type LatexEditorHandle } from "@/components/LatexEditor";
import { LatexPreview } from "@/components/LatexPreview";
import { LinksDialog, LinksSidebar } from "@/components/DocumentLinks";
import { fetchLinkedModels, fetchLinkedDocuments, type LinkedModel, type LinkedDocument } from "@/lib/document-links";
import { YjsSupabaseProvider } from "@/lib/yjs-supabase-provider";
import type { Graph } from "@/components/GraphEditor";
import { ChevronLeft, Loader2, Users, Wifi, WifiOff, Download, Link2, PanelRightClose, PanelRightOpen } from "lucide-react";

export const Route = createFileRoute("/app/d/$id")({
  component: DocumentEditor,
});

const STARTER = `\\documentclass{article}
\\title{Documento sin título}
\\author{}
\\date{}

\\begin{document}
\\maketitle

\\section{Introducción}
Escribe aquí. Soporta \\textbf{negrita}, \\emph{cursiva} y matemáticas en línea como $E = mc^2$.

\\begin{equation}
  \\frac{\\partial u}{\\partial t} + (u \\cdot \\nabla) u = -\\frac{1}{\\rho}\\nabla p + \\nu \\nabla^2 u
\\end{equation}

\\subsection{Lista}
\\begin{itemize}
  \\item Primer punto
  \\item Segundo punto
\\end{itemize}

% Vincula modelos y documentos desde el panel lateral, después insértalos:
% \\includemodel{<id-del-modelo>}[Esquema del sistema]
% \\input{<id-del-documento>}

\\end{document}
`;

const PALETTE = ["#22d3ee", "#a78bfa", "#f472b6", "#fbbf24", "#34d399", "#f87171", "#60a5fa"];

interface DocMeta {
  id: string;
  title: string;
  model_id: string;
  model_name?: string;
}

function DocumentEditor() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [meta, setMeta] = useState<DocMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [previewSrc, setPreviewSrc] = useState("");
  const [connected, setConnected] = useState(false);
  const [peers, setPeers] = useState(0);
  const [synced, setSynced] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [view, setView] = useState<"split" | "editor" | "preview">("split");

  // Vínculos
  const [linkedModels, setLinkedModels] = useState<LinkedModel[]>([]);
  const [linkedDocs, setLinkedDocs] = useState<LinkedDocument[]>([]);
  const [linksOpen, setLinksOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const previewRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<LatexEditorHandle>(null);

  const { doc, awareness } = useMemo(() => {
    const d = new Y.Doc();
    const a = new Awareness(d);
    return { doc: d, awareness: a };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Cargar vínculos al montar y construir mapas para el preview
  useEffect(() => {
    (async () => {
      try {
        const [m, d] = await Promise.all([fetchLinkedModels(id), fetchLinkedDocuments(id)]);
        setLinkedModels(m);
        setLinkedDocs(d);
      } catch (e) {
        console.warn("Failed to load links", e);
      }
    })();
  }, [id]);

  const modelMap = useMemo(() => {
    const m = new Map<string, { name: string; graph: Graph }>();
    linkedModels.forEach((lm) => m.set(lm.model_id, { name: lm.model.name, graph: lm.model.graph }));
    return m;
  }, [linkedModels]);

  const docMap = useMemo(() => {
    const m = new Map<string, { title: string; content: string }>();
    linkedDocs.forEach((ld) => m.set(ld.target_document_id, { title: ld.target.title, content: ld.target.content }));
    return m;
  }, [linkedDocs]);

  useEffect(() => {
    let cancelled = false;
    let provider: YjsSupabaseProvider | null = null;

    (async () => {
      const { data, error } = await supabase
        .from("documents")
        .select("id,title,model_id,yjs_state,content,models(name)")
        .eq("id", id)
        .single();

      if (cancelled) return;
      if (error || !data) {
        setErr(error?.message ?? "Documento no encontrado");
        setLoading(false);
        return;
      }

      const modelName = (data.models as { name?: string } | null)?.name;
      setMeta({ id: data.id, title: data.title, model_id: data.model_id, model_name: modelName });

      if (data.yjs_state) {
        try {
          const raw = data.yjs_state as string;
          const hex = raw.startsWith("\\x") ? raw.slice(2) : raw;
          const u = new Uint8Array(hex.length / 2);
          for (let i = 0; i < u.length; i++) u[i] = parseInt(hex.substr(i * 2, 2), 16);
          if (u.length > 0) Y.applyUpdate(doc, u, "init");
        } catch (e) {
          console.warn("Failed to load yjs snapshot", e);
        }
      }
      const ytext = doc.getText("latex");
      if (ytext.length === 0 && !data.content) {
        ytext.insert(0, STARTER);
      } else if (ytext.length === 0 && data.content) {
        ytext.insert(0, data.content);
      }

      const { data: userData } = await supabase.auth.getUser();
      const email = userData.user?.email ?? "anónimo";
      const name = email.split("@")[0];
      const color = PALETTE[Math.abs(hash(userData.user?.id ?? "x")) % PALETTE.length];
      awareness.setLocalStateField("user", { name, color });

      provider = new YjsSupabaseProvider({
        documentId: id,
        doc,
        awareness,
        onStatus: ({ connected: c, peers: p }) => {
          if (cancelled) return;
          setConnected(c);
          setPeers(p);
        },
        onSynced: () => !cancelled && setSynced(true),
      });

      const updatePreview = () => setPreviewSrc(doc.getText("latex").toString());
      updatePreview();
      doc.on("update", updatePreview);

      setLoading(false);
    })();

    return () => {
      cancelled = true;
      provider?.destroy();
      doc.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function updateTitle(newTitle: string) {
    if (!meta) return;
    setMeta({ ...meta, title: newTitle });
    await supabase.from("documents").update({ title: newTitle }).eq("id", id);
  }

  async function exportPDF() {
    if (!previewRef.current) return;
    setExporting(true);
    try {
      const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
        import("jspdf"),
        import("html2canvas"),
      ]);

      const A4_W = 210;
      const A4_H = 297;
      const MARGIN = 15;
      const CONTENT_W = A4_W - MARGIN * 2;
      const PAGE_USABLE_H = A4_H - MARGIN * 2;
      const GAP = 3;

      const sections = Array.from(
        previewRef.current.querySelectorAll<HTMLElement>("[data-pdf-section]"),
      );
      const targets = sections.length > 0 ? sections : [previewRef.current];

      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      let cursorY = MARGIN;

      for (const node of targets) {
        const canvas = await html2canvas(node, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
          logging: false,
        });
        const wPx = canvas.width / 2;
        const hPx = canvas.height / 2;
        const scale = CONTENT_W / wPx;
        const hMM = hPx * scale;

        // Si la sección no cabe en lo que queda, salto de página
        const remaining = A4_H - MARGIN - cursorY;
        if (hMM > remaining && cursorY > MARGIN) {
          pdf.addPage();
          cursorY = MARGIN;
        }

        // Si la sección es más alta que una página entera, troceo en bandas
        if (hMM > PAGE_USABLE_H) {
          const pages = Math.ceil(hMM / PAGE_USABLE_H);
          const sliceHpx = canvas.height / pages;
          for (let i = 0; i < pages; i++) {
            const slice = document.createElement("canvas");
            slice.width = canvas.width;
            slice.height = sliceHpx;
            const ctx = slice.getContext("2d")!;
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, slice.width, slice.height);
            ctx.drawImage(canvas, 0, -i * sliceHpx);
            const sliceMM = (sliceHpx / 2) * scale;
            if (i > 0) {
              pdf.addPage();
              cursorY = MARGIN;
            }
            pdf.addImage(slice.toDataURL("image/jpeg", 0.95), "JPEG", MARGIN, cursorY, CONTENT_W, sliceMM);
            cursorY += sliceMM;
          }
        } else {
          pdf.addImage(canvas.toDataURL("image/jpeg", 0.95), "JPEG", MARGIN, cursorY, CONTENT_W, hMM);
          cursorY += hMM + GAP;
        }
      }

      pdf.save(`${meta?.title ?? "documento"}.pdf`);
    } finally {
      setExporting(false);
    }
  }

  function insertSnippet(snippet: string) {
    editorRef.current?.insertAtCursor(snippet);
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

  const states = Array.from(awareness.getStates().values()) as Array<{ user?: { name: string; color: string } }>;
  const collaborators = states.map((s) => s.user).filter(Boolean) as Array<{ name: string; color: string }>;

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Top bar */}
      <div className="border-b border-border px-4 py-2 flex items-center gap-3 bg-surface/50">
        <Link to="/app" className="text-muted-foreground hover:text-foreground"><ChevronLeft className="h-4 w-4" /></Link>
        <input
          value={meta?.title ?? ""}
          onChange={(e) => updateTitle(e.target.value)}
          className="bg-transparent border border-transparent hover:border-border focus:border-primary px-2 py-1 text-sm font-display font-medium focus:outline-none flex-1 max-w-md"
        />
        {meta?.model_id && (
          <Link to="/app/m/$id" params={{ id: meta.model_id }} className="text-[11px] text-muted-foreground hover:text-primary border border-border px-2 py-1">
            ◇ {meta.model_name ?? "modelo"}
          </Link>
        )}
        <div className="ml-auto flex items-center gap-3 text-[11px] text-muted-foreground">
          <button
            onClick={() => setLinksOpen(true)}
            className="flex items-center gap-1 border border-border px-2 py-1 hover:border-primary hover:text-foreground"
            title="Gestionar vínculos"
          >
            <Link2 className="h-3 w-3" /> vínculos ({linkedModels.length + linkedDocs.length})
          </button>
          <div className="flex border border-border">
            {(["editor", "split", "preview"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-2 py-1 ${view === v ? "bg-primary text-primary-foreground" : "hover:text-foreground"}`}
              >
                {v}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <div className="flex -space-x-1">
              {collaborators.slice(0, 5).map((c, i) => (
                <span
                  key={i}
                  title={c.name}
                  className="w-5 h-5 rounded-full border border-background flex items-center justify-center text-[9px] font-mono text-black"
                  style={{ background: c.color }}
                >
                  {c.name[0]?.toUpperCase()}
                </span>
              ))}
            </div>
            <span>{peers}</span>
          </div>
          {connected ? (
            <span className="flex items-center gap-1 text-success"><Wifi className="h-3 w-3" /> {synced ? "sync" : "…"}</span>
          ) : (
            <span className="flex items-center gap-1 text-muted-foreground"><WifiOff className="h-3 w-3" /> off</span>
          )}
          <button
            onClick={exportPDF}
            disabled={exporting}
            className="flex items-center gap-1 border border-border px-2 py-1 hover:border-primary hover:text-foreground disabled:opacity-50"
          >
            {exporting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Download className="h-3 w-3" />} PDF
          </button>
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="text-muted-foreground hover:text-foreground"
            title={sidebarOpen ? "Ocultar panel" : "Mostrar panel"}
          >
            {sidebarOpen ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 min-h-0 flex">
        <div
          className="flex-1 min-h-0 grid"
          style={{
            gridTemplateColumns: view === "split" ? "1fr 1fr" : view === "editor" ? "1fr 0fr" : "0fr 1fr",
          }}
        >
          {view !== "preview" && (
            <div className="border-r border-border min-h-0 overflow-hidden bg-[#282c34]">
              <LatexEditor ref={editorRef} doc={doc} awareness={awareness} className="h-full" />
            </div>
          )}
          {view !== "editor" && (
            <div className="min-h-0 overflow-auto bg-white">
              <div ref={previewRef} className="lp-doc max-w-3xl mx-auto p-10 text-black">
                <LatexPreview source={previewSrc} models={modelMap} docs={docMap} />
              </div>
            </div>
          )}
        </div>

        {sidebarOpen && (
          <LinksSidebar
            models={linkedModels}
            docs={linkedDocs}
            onOpenManager={() => setLinksOpen(true)}
            onInsertModel={(lm) => insertSnippet(`\n\\includemodel{${lm.model_id}}[${lm.model.name}]\n`)}
            onInsertDoc={(ld) => insertSnippet(`\n\\input{${ld.target_document_id}}\n`)}
          />
        )}
      </div>

      <LinksDialog
        documentId={id}
        open={linksOpen}
        onClose={() => setLinksOpen(false)}
        onChange={({ models, docs }) => {
          setLinkedModels(models);
          setLinkedDocs(docs);
        }}
        onInsert={insertSnippet}
      />
    </div>
  );
}

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
}
