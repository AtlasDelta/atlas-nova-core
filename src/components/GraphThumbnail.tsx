import { useMemo } from "react";
import type { Graph } from "./GraphEditor";
import { getBlockType, DOMAIN_COLOR, type BlockType } from "@/lib/blocks";

interface Props {
  graph: Graph;
  width?: number;
  height?: number;
  className?: string;
  /** Si true, dibuja un fondo claro tipo paper en vez del surface. */
  paper?: boolean;
}

const NODE_W = 160;
const HEADER_H = 28;
const PORT_SPACING = 18;

function nodeHeight(b: BlockType): number {
  return HEADER_H + 12 + b.ports.length * PORT_SPACING + 8;
}
function portY(b: BlockType, idx: number): number {
  return HEADER_H + 14 + idx * PORT_SPACING;
}

/**
 * Mini-render estático del grafo. Réplica fiel del editor pero no interactiva.
 * Pensado para previews y para insertar en el LaTeX preview.
 */
export function GraphThumbnail({ graph, width = 360, height = 220, className, paper = true }: Props) {
  const { viewBox, nodes, edges } = useMemo(() => {
    if (graph.nodes.length === 0) {
      return { viewBox: "0 0 100 60", nodes: [], edges: [] };
    }
    const enriched = graph.nodes
      .map((n) => {
        const b = getBlockType(n.blockTypeId);
        if (!b) return null;
        return { n, b, h: nodeHeight(b) };
      })
      .filter(Boolean) as { n: Graph["nodes"][number]; b: BlockType; h: number }[];

    const minX = Math.min(...enriched.map((e) => e.n.x)) - 24;
    const minY = Math.min(...enriched.map((e) => e.n.y)) - 24;
    const maxX = Math.max(...enriched.map((e) => e.n.x + NODE_W)) + 24;
    const maxY = Math.max(...enriched.map((e) => e.n.y + e.h)) + 24;
    const w = maxX - minX;
    const h = maxY - minY;

    // Posiciones absolutas de cada puerto, indexadas por nodeId+portId
    const portPositions = new Map<string, { x: number; y: number; side: "left" | "right"; domain: string }>();
    for (const { n, b } of enriched) {
      b.ports.forEach((p, idx) => {
        const isOut = p.direction === "out";
        portPositions.set(`${n.id}:${p.id}`, {
          x: n.x + (isOut ? NODE_W : 0),
          y: n.y + portY(b, idx),
          side: isOut ? "right" : "left",
          domain: p.domain,
        });
      });
    }

    const edgesGeom = graph.edges
      .map((edge) => {
        const a = portPositions.get(`${edge.fromNode}:${edge.fromPort}`);
        const b = portPositions.get(`${edge.toNode}:${edge.toPort}`);
        if (!a || !b) return null;
        const dx = Math.max(40, Math.abs(b.x - a.x) * 0.5);
        const c1x = a.x + (a.side === "right" ? dx : -dx);
        const c2x = b.x + (b.side === "right" ? dx : -dx);
        const path = `M ${a.x} ${a.y} C ${c1x} ${a.y}, ${c2x} ${b.y}, ${b.x} ${b.y}`;
        return { id: edge.id, path, color: DOMAIN_COLOR[a.domain as keyof typeof DOMAIN_COLOR] ?? "#888" };
      })
      .filter(Boolean) as { id: string; path: string; color: string }[];

    return {
      viewBox: `${minX} ${minY} ${w} ${h}`,
      nodes: enriched,
      edges: edgesGeom,
    };
  }, [graph]);

  if (graph.nodes.length === 0) {
    return (
      <div
        className={`flex items-center justify-center text-[10px] border ${className ?? ""}`}
        style={{
          width,
          height,
          background: paper ? "#fafaf7" : "#1a1a1a",
          color: paper ? "#888" : "#888",
          borderColor: paper ? "#d4d4d0" : "#333",
        }}
      >
        grafo vacío
      </div>
    );
  }

  // Paleta fija — independiente del tema del documento contenedor
  const bgColor = paper ? "#fafaf7" : "#1a1a1a";
  const nodeBg = paper ? "#ffffff" : "#222";
  const nodeText = paper ? "#1a1a1a" : "#e5e5e5";
  const nodeMuted = paper ? "#666" : "#999";
  const borderColor = paper ? "#d4d4d0" : "#333";

  return (
    <svg
      viewBox={viewBox}
      width={width}
      height={height}
      preserveAspectRatio="xMidYMid meet"
      className={className}
      style={{ background: bgColor, border: `1px solid ${borderColor}`, display: "block" }}
    >
      {/* Edges con curvas Bézier */}
      {edges.map((e) => (
        <path key={e.id} d={e.path} stroke={e.color} strokeWidth={1.6} fill="none" opacity={0.85} />
      ))}

      {/* Nodos */}
      {nodes.map(({ n, b, h }) => {
        const dom = b.ports[0]?.domain;
        const accent = dom ? DOMAIN_COLOR[dom] : "#666";
        return (
          <g key={n.id}>
            {/* cuerpo */}
            <rect
              x={n.x}
              y={n.y}
              width={NODE_W}
              height={h}
              fill={nodeBg}
              stroke={accent}
              strokeWidth={1.5}
              rx={2}
            />
            {/* header */}
            <rect x={n.x} y={n.y} width={NODE_W} height={HEADER_H} fill={accent} opacity={0.18} />
            <text
              x={n.x + 8}
              y={n.y + 12}
              fontSize={9}
              fontFamily="monospace"
              fill={nodeMuted}
              style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}
            >
              {b.name}
            </text>
            <text
              x={n.x + 8}
              y={n.y + 23}
              fontSize={11}
              fontFamily="monospace"
              fill={nodeText}
              fontWeight={600}
            >
              {n.label.length > 22 ? n.label.slice(0, 22) + "…" : n.label}
            </text>

            {/* puertos */}
            {b.ports.map((p, idx) => {
              const isOut = p.direction === "out";
              const px = n.x + (isOut ? NODE_W : 0);
              const py = n.y + portY(b, idx);
              const labelX = isOut ? n.x + NODE_W - 8 : n.x + 8;
              const anchor = isOut ? "end" : "start";
              return (
                <g key={p.id}>
                  <circle
                    cx={px}
                    cy={py}
                    r={3}
                    fill={DOMAIN_COLOR[p.domain]}
                    stroke={nodeBg}
                    strokeWidth={1}
                  />
                  <text
                    x={labelX}
                    y={py + 3}
                    fontSize={9}
                    fontFamily="monospace"
                    fill={nodeText}
                    textAnchor={anchor}
                  >
                    {p.label}
                  </text>
                </g>
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}
