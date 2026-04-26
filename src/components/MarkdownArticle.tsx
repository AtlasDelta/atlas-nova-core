import { useEffect, useRef } from "react";
import { marked } from "marked";
import katex from "katex";
import "katex/dist/katex.min.css";

interface Props {
  markdown: string;
  className?: string;
}

/**
 * Renderiza markdown con bloques de matemáticas LaTeX:
 *   - Display: $$ ... $$  o  \[ ... \]
 *   - Inline:  $ ... $
 *
 * Estrategia: extraer las matemáticas a placeholders ANTES de pasar a marked,
 * renderizarlas con KaTeX, y reinsertar el HTML resultante después.
 */
export function MarkdownArticle({ markdown, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const html = renderMarkdownWithMath(markdown);
    ref.current.innerHTML = html;
  }, [markdown]);

  return <div ref={ref} className={className} />;
}

function renderMarkdownWithMath(src: string): string {
  const slots: string[] = [];
  const slot = (html: string) => {
    slots.push(html);
    return `@@MATH${slots.length - 1}@@`;
  };

  // Display math: $$ ... $$  (no greedy, multilínea)
  let s = src.replace(/\$\$([\s\S]+?)\$\$/g, (_m, expr) =>
    slot(renderKatex(expr.trim(), true)),
  );
  // Display math: \[ ... \]
  s = s.replace(/\\\[([\s\S]+?)\\\]/g, (_m, expr) =>
    slot(renderKatex(expr.trim(), true)),
  );
  // Inline math: $ ... $  (sin saltos de línea)
  s = s.replace(/\$([^$\n]+?)\$/g, (_m, expr) =>
    slot(renderKatex(expr.trim(), false)),
  );

  // marked.parse es síncrono cuando async=false (default).
  let html = marked.parse(s, { async: false }) as string;

  // Reinsertar las matemáticas
  html = html.replace(/@@MATH(\d+)@@/g, (_m, i) => slots[Number(i)] ?? "");
  return html;
}

function renderKatex(expr: string, displayMode: boolean): string {
  try {
    return katex.renderToString(expr, {
      displayMode,
      throwOnError: false,
      output: "html",
      strict: "ignore",
    });
  } catch (e) {
    return `<span style="color:var(--danger,#f55)">${String(e)}</span>`;
  }
}
