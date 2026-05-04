import { useEffect, useRef } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

interface LatexPreviewProps {
  source: string;
  className?: string;
  /** Documentos vinculados accesibles vía \input{id|title}. */
  docs?: Map<string, { title: string; content: string }>;
}

/**
 * Renderiza un subset de LaTeX:
 * - \section, \subsection, \subsubsection
 * - \textbf, \textit, \emph, \texttt
 * - \begin{equation}/\end{equation}, \[...\], $...$, $$...$$
 * - \begin{itemize}/\begin{enumerate}
 * - \title, \author, \date, \maketitle
 * - \input{id-o-titulo} (transclusión recursiva, tope 8 niveles)
 *
 * Nota: el editor de grafos es una herramienta independiente. Los modelos
 * pueden vincularse al documento como referencia navegable, pero no se
 * embeben como figuras dentro del LaTeX.
 */
export function LatexPreview({ source, className, docs }: LatexPreviewProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const expanded = expandInputs(source, docs ?? new Map(), 8, new Set());
    ref.current.innerHTML = renderLatex(expanded);
  }, [source, docs]);

  return <div ref={ref} className={className} />;
}

function expandInputs(
  src: string,
  docs: Map<string, { title: string; content: string }>,
  depth: number,
  seen: Set<string>,
): string {
  if (depth <= 0) return src;
  return src.replace(/\\input\{([^}]+)\}/g, (_m, key: string) => {
    const k = key.trim();
    const doc =
      docs.get(k) ??
      Array.from(docs.values()).find((d) => d.title.toLowerCase() === k.toLowerCase());
    if (!doc) return `\\textit{[input no resuelto: ${escapeForLatex(k)}]}`;
    if (seen.has(k)) return `\\textit{[ciclo en input: ${escapeForLatex(k)}]}`;
    const next = new Set(seen);
    next.add(k);
    const body = doc.content.match(/\\begin\{document\}([\s\S]*?)\\end\{document\}/);
    const piece = body ? body[1] : doc.content;
    return expandInputs(piece, docs, depth - 1, next);
  });
}

function escapeForLatex(s: string): string {
  return s.replace(/[{}\\]/g, "");
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}

function renderMath(expr: string, displayMode: boolean): string {
  try {
    return katex.renderToString(expr, { displayMode, throwOnError: false, output: "html", strict: "ignore" });
  } catch (e) {
    return `<span style="color:var(--danger,#f55)">${escapeHtml(String(e))}</span>`;
  }
}

function renderLatex(src: string): string {
  let s = src;

  s = s.replace(/(^|[^\\])%[^\n]*/g, "$1");

  const titleMatch = s.match(/\\title\{([^}]*)\}/);
  const authorMatch = s.match(/\\author\{([^}]*)\}/);
  const dateMatch = s.match(/\\date\{([^}]*)\}/);

  const bodyMatch = s.match(/\\begin\{document\}([\s\S]*?)\\end\{document\}/);
  let body = bodyMatch ? bodyMatch[1] : s;

  body = body
    .replace(/\\documentclass(\[[^\]]*\])?\{[^}]*\}/g, "")
    .replace(/\\usepackage(\[[^\]]*\])?\{[^}]*\}/g, "")
    .replace(/\\title\{[^}]*\}/g, "")
    .replace(/\\author\{[^}]*\}/g, "")
    .replace(/\\date\{[^}]*\}/g, "");

  const parts: string[] = [];

  if (/\\maketitle/.test(body)) {
    parts.push('<div data-pdf-section style="text-align:center;margin-bottom:1.5rem">');
    if (titleMatch) parts.push(`<h1 style="font-size:1.8rem;margin:0 0 .5rem">${escapeHtml(titleMatch[1])}</h1>`);
    if (authorMatch) parts.push(`<div style="opacity:.85">${escapeHtml(authorMatch[1])}</div>`);
    if (dateMatch) parts.push(`<div style="opacity:.65;font-size:.85rem;margin-top:.25rem">${escapeHtml(dateMatch[1])}</div>`);
    parts.push("</div>");
    body = body.replace(/\\maketitle/g, "");
  }

  const placeholders: string[] = [];
  const ph = (html: string) => {
    placeholders.push(html);
    return `\u0000PH${placeholders.length - 1}\u0000`;
  };

  // Bloques matemáticos
  body = body.replace(/\\begin\{equation\*?\}([\s\S]*?)\\end\{equation\*?\}/g, (_m, expr) =>
    ph(`<div class="lp-eq" data-pdf-section>${renderMath(expr.trim(), true)}</div>`),
  );
  body = body.replace(/\\begin\{align\*?\}([\s\S]*?)\\end\{align\*?\}/g, (_m, expr) =>
    ph(`<div class="lp-eq" data-pdf-section>${renderMath(`\\begin{aligned}${expr}\\end{aligned}`, true)}</div>`),
  );
  body = body.replace(/\\\[([\s\S]*?)\\\]/g, (_m, expr) => ph(`<div class="lp-eq" data-pdf-section>${renderMath(expr.trim(), true)}</div>`));
  body = body.replace(/\$\$([\s\S]*?)\$\$/g, (_m, expr) => ph(`<div class="lp-eq" data-pdf-section>${renderMath(expr.trim(), true)}</div>`));
  body = body.replace(/\$([^$\n]+)\$/g, (_m, expr) => ph(renderMath(expr.trim(), false)));

  // itemize / enumerate
  body = body.replace(/\\begin\{(itemize|enumerate)\}([\s\S]*?)\\end\{\1\}/g, (_m, kind, inner) => {
    const items = inner.split(/\\item\s*/).slice(1).map((it: string) => `<li>${it.trim()}</li>`).join("");
    const tag = kind === "itemize" ? "ul" : "ol";
    return ph(`<${tag} data-pdf-section>${items}</${tag}>`);
  });

  // Secciones
  body = body.replace(/\\section\*?\{([^}]*)\}/g, (_m, t) => ph(`<h2 class="lp-h2" data-pdf-section>${escapeHtml(t)}</h2>`));
  body = body.replace(/\\subsection\*?\{([^}]*)\}/g, (_m, t) => ph(`<h3 class="lp-h3" data-pdf-section>${escapeHtml(t)}</h3>`));
  body = body.replace(/\\subsubsection\*?\{([^}]*)\}/g, (_m, t) => ph(`<h4 class="lp-h4" data-pdf-section>${escapeHtml(t)}</h4>`));

  // Texto inline
  body = body.replace(/\\textbf\{([^}]*)\}/g, "<strong>$1</strong>");
  body = body.replace(/\\textit\{([^}]*)\}/g, "<em>$1</em>");
  body = body.replace(/\\emph\{([^}]*)\}/g, "<em>$1</em>");
  body = body.replace(/\\texttt\{([^}]*)\}/g, '<code class="lp-code">$1</code>');
  body = body.replace(/\\\\/g, "<br/>");

  const paragraphs = body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => {
      if (/^\u0000PH\d+\u0000$/.test(p.trim())) return p;
      const tokens = p.split(/(\u0000PH\d+\u0000)/g);
      const html = tokens
        .map((tok) => (tok.startsWith("\u0000PH") ? tok : escapeHtml(tok).replace(/\n/g, " ")))
        .join("");
      return `<p data-pdf-section>${html}</p>`;
    });

  let out = parts.join("") + paragraphs.join("\n");
  out = out.replace(/\u0000PH(\d+)\u0000/g, (_m, i) => placeholders[Number(i)] ?? "");
  return out;
}
