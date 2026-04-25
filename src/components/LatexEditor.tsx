import { useEffect, useRef } from "react";
import * as Y from "yjs";
import { Awareness } from "y-protocols/awareness";
import { EditorState } from "@codemirror/state";
import { EditorView, keymap, lineNumbers, highlightActiveLine } from "@codemirror/view";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { StreamLanguage } from "@codemirror/language";
import { stex } from "@codemirror/legacy-modes/mode/stex";
import { oneDark } from "@codemirror/theme-one-dark";
import { yCollab } from "y-codemirror.next";

export interface LatexEditorProps {
  doc: Y.Doc;
  awareness: Awareness;
  className?: string;
}

export function LatexEditor({ doc, awareness, className }: LatexEditorProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    if (!hostRef.current) return;
    const ytext = doc.getText("latex");

    const state = EditorState.create({
      doc: ytext.toString(),
      extensions: [
        lineNumbers(),
        highlightActiveLine(),
        history(),
        keymap.of([...defaultKeymap, ...historyKeymap]),
        StreamLanguage.define(stex),
        oneDark,
        yCollab(ytext, awareness),
        EditorView.lineWrapping,
        EditorView.theme({
          "&": { height: "100%", fontSize: "13px" },
          ".cm-scroller": { fontFamily: "'JetBrains Mono', monospace" },
          ".cm-content": { padding: "12px 0" },
        }),
      ],
    });

    const view = new EditorView({ state, parent: hostRef.current });
    viewRef.current = view;
    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, [doc, awareness]);

  return <div ref={hostRef} className={className} />;
}
