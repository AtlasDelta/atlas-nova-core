import { useEffect, useRef } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

interface LatexPreviewProps {
  source: string;
  className?: string;
}

/**
 * Renderiza un subset de LaTeX:
 * - \section, \subsection, \subsubsection
 * - \textbf, \textit, \emph, \texttt
 * - \begin{equation}/\end{equation}, \[...\], $...$, $$...$$
 * - \begin{itemize}/\begin{enumerate}
 * - \title, \author, \date, \maketitle
 * Ignora preámbulo (\documentclass, \usepackage, \begin{document}, \end{document}).
 */
export function LatexPreview({ source, className }: LatexPreviewProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = renderLatex(source);
  }, [source]);

  return <div ref={ref} className={className} />;
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

  // Quitar comentarios %... (preservando \%)
  s = s.replace(/(^|[^\\])%[^\n]*/g, "$1");

  // Extraer título / autor / fecha
  const titleMatch = s.match(/\\title\{([^}]*)\}/);
  const authorMatch = s.match(/\\author\{([^}]*)\}/);
  const dateMatch = s.match(/\\date\{([^}]*)\}/);

  // Quedarnos con el body (lo que esté dentro de document, o todo si no hay)
  const bodyMatch = s.match(/\\begin\{document\}([\s\S]*?)\\end\{document\}/);
  let body = bodyMatch ? bodyMatch[1] : s;

  // Quitar comandos de preámbulo si quedan sueltos
  body = body
    .replace(/\\documentclass(\[[^\]]*\])?\{[^}]*\}/g, "")
    .replace(/\\usepackage(\[[^\]]*\])?\{[^}]*\}/g, "")
    .replace(/\\title\{[^}]*\}/g, "")
    .replace(/\\author\{[^}]*\}/g, "")
    .replace(/\\date\{[^}]*\}/g, "");

  const parts: string[] = [];

  // Cabecera con \maketitle
  if (/\\maketitle/.test(body)) {
    parts.push('<div style="text-align:center;margin-bottom:1.5rem">');
    if (titleMatch) parts.push(`<h1 style="font-size:1.8rem;margin:0 0 .5rem">${escapeHtml(titleMatch[1])}</h1>`);
    if (authorMatch) parts.push(`<div style="opacity:.85">${escapeHtml(authorMatch[1])}</div>`);
    if (dateMatch) parts.push(`<div style="opacity:.65;font-size:.85rem;margin-top:.25rem">${escapeHtml(dateMatch[1])}</div>`);
    parts.push("</div>");
    body = body.replace(/\\maketitle/g, "");
  }

  // Procesar bloques: equation, displaymath, itemize, enumerate
  // Reemplazos por placeholders → markdown-like → html final
  const placeholders: string[] = [];
  const ph = (html: string) => {
    placeholders.push(html);
    return `\u0000PH${placeholders.length - 1}\u0000`;
  };

  // \begin{equation} ... \end{equation} y equation*
  body = body.replace(/\\begin\{equation\*?\}([\s\S]*?)\\end\{equation\*?\}/g, (_m, expr) =>
    ph(`<div class="lp-eq">${renderMath(expr.trim(), true)}</div>`)
  );
  // align / align*
  body = body.replace(/\\begin\{align\*?\}([\s\S]*?)\\end\{align\*?\}/g, (_m, expr) =>
    ph(`<div class="lp-eq">${renderMath(`\\begin{aligned}${expr}\\end{aligned}`, true)}</div>`)
  );
  // \[ ... \]
  body = body.replace(/\\\[([\s\S]*?)\\\]/g, (_m, expr) => ph(`<div class="lp-eq">${renderMath(expr.trim(), true)}</div>`));
  // $$ ... $$
  body = body.replace(/\$\$([\s\S]*?)\$\$/g, (_m, expr) => ph(`<div class="lp-eq">${renderMath(expr.trim(), true)}</div>`));
  // $ ... $ (inline)
  body = body.replace(/\$([^$\n]+)\$/g, (_m, expr) => ph(renderMath(expr.trim(), false)));

  // itemize / enumerate
  body = body.replace(/\\begin\{(itemize|enumerate)\}([\s\S]*?)\\end\{\1\}/g, (_m, kind, inner) => {
    const items = inner.split(/\\item\s*/).slice(1).map((it: string) => `<li>${it.trim()}</li>`).join("");
    return ph(`<${kind === "itemize" ? "ul" : "ol"}>${items}</${kind === "itemize" ? "ul" : "ol"}>`);
  });

  // Secciones
  body = body.replace(/\\section\*?\{([^}]*)\}/g, (_m, t) => ph(`<h2 class="lp-h2">${escapeHtml(t)}</h2>`));
  body = body.replace(/\\subsection\*?\{([^}]*)\}/g, (_m, t) => ph(`<h3 class="lp-h3">${escapeHtml(t)}</h3>`));
  body = body.replace(/\\subsubsection\*?\{([^}]*)\}/g, (_m, t) => ph(`<h4 class="lp-h4">${escapeHtml(t)}</h4>`));

  // Texto enriquecido inline
  body = body.replace(/\\textbf\{([^}]*)\}/g, "<strong>$1</strong>");
  body = body.replace(/\\textit\{([^}]*)\}/g, "<em>$1</em>");
  body = body.replace(/\\emph\{([^}]*)\}/g, "<em>$1</em>");
  body = body.replace(/\\texttt\{([^}]*)\}/g, '<code class="lp-code">$1</code>');
  body = body.replace(/\\\\/g, "<br/>");

  // Escape resto y párrafos por dobles saltos
  const paragraphs = body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => {
      // Si el párrafo es solo un placeholder, no lo envolvemos en <p>
      if (/^\u0000PH\d+\u0000$/.test(p.trim())) return p;
      // Escapar HTML manteniendo placeholders
      const tokens = p.split(/(\u0000PH\d+\u0000)/g);
      const html = tokens
        .map((tok) => (tok.startsWith("\u0000PH") ? tok : escapeHtml(tok).replace(/\n/g, " ")))
        .join("");
      return `<p>${html}</p>`;
    });

  let out = parts.join("") + paragraphs.join("\n");
  // Restaurar placeholders
  out = out.replace(/\u0000PH(\d+)\u0000/g, (_m, i) => placeholders[Number(i)] ?? "");
  return out;
}
