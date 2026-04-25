import { useState, useRef, useCallback, useEffect } from "react";
import { BLOCK_LIBRARY, CATEGORIES, getBlockType, DOMAIN_COLOR, type BlockType } from "@/lib/blocks";
import { Search, Trash2, Copy } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────
export interface GraphNode {
  id: string;
  blockTypeId: string;
  label: string;
  x: number;
  y: number;
  params: Record<string, number>;
}
export interface GraphEdge {
  id: string;
  fromNode: string;
  fromPort: string;
  toNode: string;
  toPort: string;
}
export interface Graph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

const NODE_W = 160;
const PORT_R = 5;
const HEADER_H = 28;
const PORT_SPACING = 18;

function nodeHeight(b: BlockType): number {
  return HEADER_H + 12 + b.ports.length * PORT_SPACING + 8;
}
function portY(b: BlockType, idx: number): number {
  return HEADER_H + 14 + idx * PORT_SPACING;
}
function portPos(node: GraphNode, b: BlockType, portId: string): { x: number; y: number; side: "left" | "right" } {
  const idx = b.ports.findIndex((p) => p.id === portId);
  const port = b.ports[idx];
  const isOut = port.direction === "out";
  return {
    x: node.x + (isOut ? NODE_W : 0),
    y: node.y + portY(b, idx),
    side: isOut ? "right" : "left",
  };
}

function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

// ─── Component ────────────────────────────────────────────────────────
export function GraphEditor({
  graph,
  onChange,
}: {
  graph: Graph;
  onChange: (g: Graph) => void;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [view, setView] = useState({ x: 0, y: 0, scale: 1 });
  const [selected, setSelected] = useState<string | null>(null);
  const [dragging, setDragging] = useState<{ id: string; offX: number; offY: number } | null>(null);
  const [panning, setPanning] = useState<{ startX: number; startY: number; viewX: number; viewY: number } | null>(null);
  const [connecting, setConnecting] = useState<{ nodeId: string; portId: string; x: number; y: number } | null>(null);
  const [search, setSearch] = useState("");
  const [pickerOpen, setPickerOpen] = useState<string | null>("source");

  // ─── Coordinate helpers ──
  const screenToWorld = useCallback((sx: number, sy: number) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const r = svg.getBoundingClientRect();
    return {
      x: (sx - r.left - view.x) / view.scale,
      y: (sy - r.top - view.y) / view.scale,
    };
  }, [view]);

  // ─── Mouse handlers ──
  function handleNodeMouseDown(e: React.MouseEvent, n: GraphNode) {
    e.stopPropagation();
    setSelected(n.id);
    const w = screenToWorld(e.clientX, e.clientY);
    setDragging({ id: n.id, offX: w.x - n.x, offY: w.y - n.y });
  }

  function handleSvgMouseDown(e: React.MouseEvent) {
    if (e.button === 1 || e.shiftKey || e.button === 2) {
      e.preventDefault();
      setPanning({ startX: e.clientX, startY: e.clientY, viewX: view.x, viewY: view.y });
    } else {
      setSelected(null);
    }
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (dragging) {
      const w = screenToWorld(e.clientX, e.clientY);
      onChange({
        ...graph,
        nodes: graph.nodes.map((n) =>
          n.id === dragging.id ? { ...n, x: w.x - dragging.offX, y: w.y - dragging.offY } : n
        ),
      });
    } else if (panning) {
      setView((v) => ({ ...v, x: panning.viewX + (e.clientX - panning.startX), y: panning.viewY + (e.clientY - panning.startY) }));
    } else if (connecting) {
      const w = screenToWorld(e.clientX, e.clientY);
      setConnecting({ ...connecting, x: w.x, y: w.y });
    }
  }

  function handleMouseUp() {
    setDragging(null);
    setPanning(null);
    setConnecting(null);
  }

  function handleWheel(e: React.WheelEvent) {
    e.preventDefault();
    const delta = -e.deltaY * 0.001;
    const newScale = Math.max(0.3, Math.min(2.5, view.scale + delta));
    const svg = svgRef.current;
    if (!svg) return;
    const r = svg.getBoundingClientRect();
    const mx = e.clientX - r.left;
    const my = e.clientY - r.top;
    const dx = mx - view.x;
    const dy = my - view.y;
    const f = newScale / view.scale;
    setView({ scale: newScale, x: mx - dx * f, y: my - dy * f });
  }

  function handlePortMouseDown(e: React.MouseEvent, nodeId: string, portId: string) {
    e.stopPropagation();
    const n = graph.nodes.find((nn) => nn.id === nodeId)!;
    const b = getBlockType(n.blockTypeId)!;
    const p = portPos(n, b, portId);
    setConnecting({ nodeId, portId, x: p.x, y: p.y });
  }

  function handlePortMouseUp(e: React.MouseEvent, nodeId: string, portId: string) {
    e.stopPropagation();
    if (!connecting || connecting.nodeId === nodeId) {
      setConnecting(null);
      return;
    }
    const fromNode = graph.nodes.find((n) => n.id === connecting.nodeId)!;
    const toNode = graph.nodes.find((n) => n.id === nodeId)!;
    const fromBlock = getBlockType(fromNode.blockTypeId)!;
    const toBlock = getBlockType(toNode.blockTypeId)!;
    const fromPort = fromBlock.ports.find((p) => p.id === connecting.portId)!;
    const toPort = toBlock.ports.find((p) => p.id === portId)!;

    if (fromPort.domain !== toPort.domain) {
      alert(`Conexión inválida: dominio ${fromPort.domain} ↔ ${toPort.domain}`);
      setConnecting(null);
      return;
    }

    onChange({
      ...graph,
      edges: [
        ...graph.edges,
        {
          id: uid(),
          fromNode: connecting.nodeId,
          fromPort: connecting.portId,
          toNode: nodeId,
          toPort: portId,
        },
      ],
    });
    setConnecting(null);
  }

  // ─── Add / delete ──
  function addBlock(typeId: string) {
    const b = getBlockType(typeId);
    if (!b) return;
    const r = svgRef.current?.getBoundingClientRect();
    const cx = r ? (r.width / 2 - view.x) / view.scale - NODE_W / 2 : 100;
    const cy = r ? (r.height / 2 - view.y) / view.scale - 50 : 100;
    const params: Record<string, number> = {};
    b.params.forEach((p) => (params[p.key] = p.default));
    onChange({
      ...graph,
      nodes: [
        ...graph.nodes,
        { id: uid(), blockTypeId: typeId, label: b.name, x: cx + Math.random() * 60, y: cy + Math.random() * 60, params },
      ],
    });
  }

  function deleteSelected() {
    if (!selected) return;
    onChange({
      nodes: graph.nodes.filter((n) => n.id !== selected),
      edges: graph.edges.filter((e) => e.fromNode !== selected && e.toNode !== selected),
    });
    setSelected(null);
  }

  function deleteEdge(id: string) {
    onChange({ ...graph, edges: graph.edges.filter((e) => e.id !== id) });
  }

  function duplicateSelected() {
    if (!selected) return;
    const n = graph.nodes.find((nn) => nn.id === selected);
    if (!n) return;
    const newId = uid();
    onChange({
      ...graph,
      nodes: [...graph.nodes, { ...n, id: newId, x: n.x + 30, y: n.y + 30, params: { ...n.params } }],
    });
    setSelected(newId);
  }

  function updateParam(key: string, value: number) {
    if (!selected) return;
    onChange({
      ...graph,
      nodes: graph.nodes.map((n) => (n.id === selected ? { ...n, params: { ...n.params, [key]: value } } : n)),
    });
  }

  function updateLabel(label: string) {
    if (!selected) return;
    onChange({ ...graph, nodes: graph.nodes.map((n) => (n.id === selected ? { ...n, label } : n)) });
  }

  // Keyboard shortcuts
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.key === "Delete" || e.key === "Backspace") deleteSelected();
      if ((e.key === "d" || e.key === "D") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        duplicateSelected();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const filteredLib = BLOCK_LIBRARY.filter((b) =>
    !search || b.name.toLowerCase().includes(search.toLowerCase()) || b.description.toLowerCase().includes(search.toLowerCase())
  );

  const selectedNode = selected ? graph.nodes.find((n) => n.id === selected) : null;
  const selectedBlockType = selectedNode ? getBlockType(selectedNode.blockTypeId) : null;

  return (
    <div className="flex-1 min-h-0 grid grid-cols-12">
      {/* ── LIBRARY ── */}
      <aside className="col-span-3 lg:col-span-2 border-r border-border bg-surface flex flex-col min-h-0">
        <div className="p-3 border-b border-border">
          <div className="text-[10px] tracking-widest text-muted-foreground mb-2">// BLOCK LIBRARY</div>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="buscar…"
              className="w-full bg-background border border-border pl-7 pr-2 py-1.5 text-xs font-mono focus:border-primary focus:outline-none"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {CATEGORIES.map((cat) => {
            const items = filteredLib.filter((b) => b.category === cat.id);
            if (items.length === 0) return null;
            const open = pickerOpen === cat.id || !!search;
            return (
              <div key={cat.id} className="border-b border-border/50">
                <button
                  onClick={() => setPickerOpen(open ? null : cat.id)}
                  className="w-full px-3 py-1.5 text-[10px] tracking-widest text-muted-foreground hover:text-foreground flex items-center justify-between"
                >
                  <span>{cat.label}</span>
                  <span>{open ? "−" : "+"}</span>
                </button>
                {open && (
                  <div className="pb-2">
                    {items.map((b) => (
                      <button
                        key={b.id}
                        onClick={() => addBlock(b.id)}
                        title={b.description}
                        className="w-full px-3 py-1.5 text-left text-xs hover:bg-surface-2 flex items-center gap-2 group"
                      >
                        <span className="text-primary text-base w-5 text-center">{b.icon}</span>
                        <span className="truncate group-hover:text-foreground">{b.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </aside>

      {/* ── CANVAS ── */}
      <div className="col-span-6 lg:col-span-7 relative bg-background overflow-hidden" style={{
        backgroundImage: "radial-gradient(circle, var(--border) 1px, transparent 1px)",
        backgroundSize: `${24 * view.scale}px ${24 * view.scale}px`,
        backgroundPosition: `${view.x}px ${view.y}px`,
      }}>
        <svg
          ref={svgRef}
          className="w-full h-full cursor-default"
          onMouseDown={handleSvgMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          onContextMenu={(e) => e.preventDefault()}
        >
          <g transform={`translate(${view.x},${view.y}) scale(${view.scale})`}>
            {/* edges */}
            {graph.edges.map((edge) => {
              const fromN = graph.nodes.find((n) => n.id === edge.fromNode);
              const toN = graph.nodes.find((n) => n.id === edge.toNode);
              if (!fromN || !toN) return null;
              const fromB = getBlockType(fromN.blockTypeId)!;
              const toB = getBlockType(toN.blockTypeId)!;
              const a = portPos(fromN, fromB, edge.fromPort);
              const b = portPos(toN, toB, edge.toPort);
              const port = fromB.ports.find((p) => p.id === edge.fromPort)!;
              const color = DOMAIN_COLOR[port.domain];
              const dx = Math.abs(b.x - a.x) * 0.5;
              const path = `M ${a.x} ${a.y} C ${a.x + dx} ${a.y}, ${b.x - dx} ${b.y}, ${b.x} ${b.y}`;
              return (
                <g key={edge.id} className="cursor-pointer" onDoubleClick={() => deleteEdge(edge.id)}>
                  <path d={path} stroke={color} strokeWidth={2} fill="none" opacity={0.85} />
                  <path d={path} stroke="transparent" strokeWidth={10} fill="none" />
                </g>
              );
            })}

            {/* connecting preview */}
            {connecting && (() => {
              const fromN = graph.nodes.find((n) => n.id === connecting.nodeId)!;
              const fromB = getBlockType(fromN.blockTypeId)!;
              const a = portPos(fromN, fromB, connecting.portId);
              return (
                <line x1={a.x} y1={a.y} x2={connecting.x} y2={connecting.y} stroke="oklch(0.78 0.18 195)" strokeWidth={2} strokeDasharray="4 4" opacity={0.7} />
              );
            })()}

            {/* nodes */}
            {graph.nodes.map((n) => {
              const b = getBlockType(n.blockTypeId);
              if (!b) return null;
              const h = nodeHeight(b);
              const isSel = n.id === selected;
              return (
                <g key={n.id} transform={`translate(${n.x},${n.y})`} onMouseDown={(e) => handleNodeMouseDown(e, n)} className="cursor-move">
                  {/* body */}
                  <rect
                    width={NODE_W} height={h}
                    fill="oklch(0.18 0.025 240)"
                    stroke={isSel ? "oklch(0.78 0.18 195)" : "oklch(0.28 0.03 240)"}
                    strokeWidth={isSel ? 2 : 1}
                  />
                  {/* header */}
                  <rect width={NODE_W} height={HEADER_H} fill="oklch(0.22 0.03 240)" stroke="oklch(0.28 0.03 240)" />
                  <text x={8} y={HEADER_H / 2 + 5} fill="oklch(0.78 0.18 195)" fontSize={14} fontFamily="JetBrains Mono">{b.icon}</text>
                  <text x={26} y={HEADER_H / 2 + 5} fill="oklch(0.94 0.01 220)" fontSize={11} fontFamily="Space Grotesk" fontWeight={500}>
                    {n.label.length > 16 ? n.label.slice(0, 14) + "…" : n.label}
                  </text>
                  {/* ports */}
                  {b.ports.map((p, idx) => {
                    const y = portY(b, idx);
                    const isOut = p.direction === "out";
                    const cx = isOut ? NODE_W : 0;
                    const color = DOMAIN_COLOR[p.domain];
                    return (
                      <g key={p.id}>
                        <text x={isOut ? NODE_W - 8 : 8} y={y + 3} fill="oklch(0.65 0.02 230)" fontSize={9} fontFamily="JetBrains Mono"
                          textAnchor={isOut ? "end" : "start"}>{p.label}</text>
                        <circle
                          cx={cx} cy={y} r={PORT_R + 4}
                          fill="transparent" className="cursor-crosshair"
                          onMouseDown={(e) => handlePortMouseDown(e, n.id, p.id)}
                          onMouseUp={(e) => handlePortMouseUp(e, n.id, p.id)}
                        />
                        <circle cx={cx} cy={y} r={PORT_R} fill={color} stroke="oklch(0.14 0.02 240)" strokeWidth={1.5} pointerEvents="none" />
                      </g>
                    );
                  })}
                </g>
              );
            })}
          </g>
        </svg>

        {/* HUD */}
        <div className="absolute bottom-3 left-3 flex gap-2 text-[10px] text-muted-foreground bg-surface/80 backdrop-blur border border-border px-2 py-1">
          <span>{Math.round(view.scale * 100)}%</span>
          <span>·</span>
          <span>{graph.nodes.length} bloques</span>
          <span>·</span>
          <span>{graph.edges.length} conex.</span>
        </div>
        <div className="absolute bottom-3 right-3 text-[10px] text-muted-foreground bg-surface/80 backdrop-blur border border-border px-2 py-1">
          shift+drag = pan · scroll = zoom · delete = borrar
        </div>
        {graph.nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center text-muted-foreground">
              <div className="text-sm font-display">Canvas vacío</div>
              <div className="text-xs mt-1">Arrastra bloques desde la biblioteca de la izquierda</div>
            </div>
          </div>
        )}
      </div>

      {/* ── INSPECTOR ── */}
      <aside className="col-span-3 lg:col-span-3 border-l border-border bg-surface flex flex-col min-h-0">
        {selectedNode && selectedBlockType ? (
          <div className="flex flex-col min-h-0">
            <div className="p-3 border-b border-border">
              <div className="text-[10px] tracking-widest text-muted-foreground">// INSPECTOR</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-primary">{selectedBlockType.icon}</span>
                <span className="font-display font-medium text-sm">{selectedBlockType.name}</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">{selectedBlockType.description}</p>
            </div>
            <div className="flex-1 overflow-y-auto">
              <div className="p-3 space-y-3 border-b border-border">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-1">Etiqueta</label>
                  <input
                    value={selectedNode.label}
                    onChange={(e) => updateLabel(e.target.value)}
                    className="w-full bg-background border border-border px-2 py-1 text-xs font-mono focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
              {selectedBlockType.params.length > 0 && (
                <div className="p-3 border-b border-border">
                  <div className="text-[10px] tracking-widest text-muted-foreground mb-2">PARAMS</div>
                  <div className="space-y-2">
                    {selectedBlockType.params.map((p) => (
                      <div key={p.key} className="grid grid-cols-12 gap-2 items-center">
                        <label className="col-span-5 text-[11px] text-foreground">{p.label}</label>
                        <input
                          type="number"
                          value={selectedNode.params[p.key] ?? p.default}
                          onChange={(e) => updateParam(p.key, parseFloat(e.target.value))}
                          step="any"
                          className="col-span-5 bg-background border border-border px-2 py-1 text-xs font-mono focus:border-primary focus:outline-none"
                        />
                        <span className="col-span-2 text-[10px] text-muted-foreground">{p.unit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="p-3 border-b border-border">
                <div className="text-[10px] tracking-widest text-muted-foreground mb-2">PORTS</div>
                <div className="space-y-1">
                  {selectedBlockType.ports.map((p) => (
                    <div key={p.id} className="flex items-center gap-2 text-[11px]">
                      <span className="w-2 h-2 rounded-full" style={{ background: DOMAIN_COLOR[p.domain] }} />
                      <span className="font-mono">{p.label}</span>
                      <span className="text-muted-foreground ml-auto">{p.domain} · {p.direction}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-3">
                <div className="text-[10px] tracking-widest text-muted-foreground mb-2">EQUATIONS</div>
                <div className="space-y-1">
                  {selectedBlockType.equations.map((eq, i) => (
                    <div key={i} className="font-mono text-[11px] text-foreground bg-background border border-border px-2 py-1">{eq}</div>
                  ))}
                </div>
              </div>
            </div>
            <div className="border-t border-border p-2 flex gap-1">
              <button onClick={duplicateSelected} className="flex-1 text-xs text-muted-foreground hover:text-foreground border border-border px-2 py-1.5 flex items-center justify-center gap-1">
                <Copy className="h-3 w-3" /> Duplicar
              </button>
              <button onClick={deleteSelected} className="flex-1 text-xs text-muted-foreground hover:text-danger border border-border hover:border-danger/50 px-2 py-1.5 flex items-center justify-center gap-1">
                <Trash2 className="h-3 w-3" /> Borrar
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4 text-center text-xs text-muted-foreground">
            <div className="text-[10px] tracking-widest mb-3">// INSPECTOR</div>
            <p>Selecciona un bloque para ver y editar sus parámetros, puertos y ecuaciones.</p>
          </div>
        )}
      </aside>
    </div>
  );
}
