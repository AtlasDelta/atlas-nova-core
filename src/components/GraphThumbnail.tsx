import { useMemo } from "react";
import type { Graph } from "./GraphEditor";
import { getBlockType, DOMAIN_COLOR } from "@/lib/blocks";

interface Props {
  graph: Graph;
  width?: number;
  height?: number;
  className?: string;
  /** Si true, dibuja un fondo claro tipo paper en vez del surface. */
  paper?: boolean;
}

/**
 * Mini-render estático del grafo. Encaja todos los nodos en el viewBox.
 * No interactivo. Pensado para previews y para insertar en el LaTeX preview.
 */
export function GraphThumbnail({ graph, width = 320, height = 200, className, paper = false }: Props) {
  const { viewBox, nodes, edges } = useMemo(() => {
    const NODE_W = 160;
    const HEADER_H = 28;
    if (graph.nodes.length === 0) {
      return { viewBox: "0 0 100 60", nodes: [], edges: [] };
    }
    const enriched = graph.nodes.map((n) => {
      const b = getBlockType(n.blockTypeId);
      const h = b ? HEADER_H + 12 + b.ports.length * 18 + 8 : 60;
      return { n, b, h };
    });
    const minX = Math.min(...enriched.map((e) => e.n.x)) - 16;
    const minY = Math.min(...enriched.map((e) => e.n.y)) - 16;
    const maxX = Math.max(...enriched.map((e) => e.n.x + NODE_W)) + 16;
    const maxY = Math.max(...enriched.map((e) => e.n.y + e.h)) + 16;
    const w = maxX - minX;
    const h = maxY - minY;
    const positions = new Map<string, { cx: number; cy: number }>();
    enriched.forEach((e) => positions.set(e.n.id, { cx: e.n.x + NODE_W / 2, cy: e.n.y + e.h / 2 }));
    return {
      viewBox: `${minX} ${minY} ${w} ${h}`,
      nodes: enriched,
      edges: graph.edges
        .map((edge) => {
          const a = positions.get(edge.fromNode);
          const b = positions.get(edge.toNode);
          if (!a || !b) return null;
          return { id: edge.id, x1: a.cx, y1: a.cy, x2: b.cx, y2: b.cy };
        })
        .filter(Boolean) as { id: string; x1: number; y1: number; x2: number; y2: number }[],
    };
  }, [graph]);

  if (graph.nodes.length === 0) {
    return (
      <div
        className={`flex items-center justify-center text-[10px] text-muted-foreground border border-border ${className ?? ""}`}
        style={{ width, height, background: paper ? "#fafafa" : undefined }}
      >
        grafo vacío
      </div>
    );
  }

  return (
    <svg
      viewBox={viewBox}
      width={width}
      height={height}
      preserveAspectRatio="xMidYMid meet"
      className={className}
      style={{ background: paper ? "#fafafa" : "transparent", border: "1px solid var(--border)" }}
    >
      {edges.map((e) => (
        <line key={e.id} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} stroke={paper ? "#888" : "currentColor"} strokeWidth={1.5} opacity={0.6} />
      ))}
      {nodes.map(({ n, b, h }) => {
        const color = b ? DOMAIN_COLOR[b.domain] : "#666";
        return (
          <g key={n.id}>
            <rect x={n.x} y={n.y} width={160} height={h} fill={paper ? "#fff" : "var(--surface, #1a1a1a)"} stroke={color} strokeWidth={1.5} />
            <rect x={n.x} y={n.y} width={160} height={28} fill={color} opacity={0.18} />
            <text x={n.x + 8} y={n.y + 18} fontSize={11} fontFamily="monospace" fill={paper ? "#222" : "currentColor"}>
              {n.label.length > 20 ? n.label.slice(0, 20) + "…" : n.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
