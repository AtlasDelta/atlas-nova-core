import { useEffect, useMemo, useRef } from "react";
import { marked } from "marked";
import katex from "katex";
import "katex/dist/katex.min.css";

interface Props {
  markdown: string;
  className?: string;
}

export function MarkdownArticle({ markdown, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const html = useMemo(() => renderMarkdownWithMath(markdown), [markdown]);
  useEffect(() => {
    if (ref.current) ref.current.innerHTML = html;
  }, [html]);
  return <div ref={ref} className={className} />;
}

function renderMarkdownWithMath(src: string): string {
  const slots: string[] = [];
  const slot = (h: string) => {
    slots.push(h);
    return `@@MATH${slots.length - 1}@@`;
  };
  let s = src.replace(/\$\$([\s\S]+?)\$\$/g, (_m, e) => slot(renderKatex(e.trim(), true)));
  s = s.replace(/\\\[([\s\S]+?)\\\]/g, (_m, e) => slot(renderKatex(e.trim(), true)));
  s = s.replace(/\$([^$\n]+?)\$/g, (_m, e) => slot(renderKatex(e.trim(), false)));
  let html = marked.parse(s, { async: false }) as string;
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
    return `<span style="color:var(--danger)">${String(e)}</span>`;
  }
}
