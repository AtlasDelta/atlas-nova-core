import * as Y from "yjs";
import { Awareness, encodeAwarenessUpdate, applyAwarenessUpdate, removeAwarenessStates } from "y-protocols/awareness";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

// ─── Helpers base64 (Uint8Array <-> string) ────────────────────────────
function u8ToB64(u: Uint8Array): string {
  let s = "";
  for (let i = 0; i < u.length; i++) s += String.fromCharCode(u[i]);
  return btoa(s);
}
function b64ToU8(b: string): Uint8Array {
  const bin = atob(b);
  const u = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
  return u;
}

type Msg =
  | { t: "update"; d: string; from: number }
  | { t: "sync-request"; from: number }
  | { t: "sync-state"; sv: string; from: number; to: number }
  | { t: "sync-diff"; d: string; from: number; to: number }
  | { t: "awareness"; d: string; from: number };

export interface YjsSupabaseProviderOptions {
  documentId: string;
  doc: Y.Doc;
  awareness?: Awareness;
  onStatus?: (s: { connected: boolean; peers: number }) => void;
  onSynced?: () => void;
}

/**
 * Provider Yjs sobre Supabase Realtime.
 * - Sincroniza updates entre clientes vía broadcast.
 * - Awareness (cursores, presencia) vía broadcast.
 * - Persistencia: snapshot binario en columna `yjs_state` cada 5s tras cambios.
 */
export class YjsSupabaseProvider {
  private channel: RealtimeChannel;
  private clientId: number;
  private docUpdateHandler: (update: Uint8Array, origin: unknown) => void;
  private awarenessHandler: (changes: { added: number[]; updated: number[]; removed: number[] }, origin: unknown) => void;
  private persistTimer: ReturnType<typeof setTimeout> | null = null;
  private dirty = false;
  private destroyed = false;

  constructor(private opts: YjsSupabaseProviderOptions) {
    this.clientId = opts.doc.clientID;

    this.channel = supabase.channel(`doc:${opts.documentId}`, {
      config: { broadcast: { self: false, ack: false }, presence: { key: String(this.clientId) } },
    });

    // Outgoing: doc updates
    this.docUpdateHandler = (update, origin) => {
      if (origin === "remote") return;
      this.channel.send({ type: "broadcast", event: "msg", payload: { t: "update", d: u8ToB64(update), from: this.clientId } satisfies Msg });
      this.dirty = true;
      this.schedulePersist();
    };
    opts.doc.on("update", this.docUpdateHandler);

    // Outgoing: awareness
    this.awarenessHandler = ({ added, updated, removed }) => {
      if (!opts.awareness) return;
      const changedClients = [...added, ...updated, ...removed];
      const update = encodeAwarenessUpdate(opts.awareness, changedClients);
      this.channel.send({ type: "broadcast", event: "msg", payload: { t: "awareness", d: u8ToB64(update), from: this.clientId } satisfies Msg });
    };
    opts.awareness?.on("update", this.awarenessHandler);

    // Incoming
    this.channel.on("broadcast", { event: "msg" }, ({ payload }) => {
      const m = payload as Msg;
      if (m.from === this.clientId) return;
      this.handleMessage(m);
    });

    // Presence → peer count
    this.channel.on("presence", { event: "sync" }, () => {
      const state = this.channel.presenceState();
      const peers = Object.keys(state).length;
      opts.onStatus?.({ connected: true, peers });
    });

    this.channel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await this.channel.track({ id: this.clientId, ts: Date.now() });
        // Pedir sync inicial a peers
        this.channel.send({ type: "broadcast", event: "msg", payload: { t: "sync-request", from: this.clientId } satisfies Msg });
        // Si nadie responde en 800ms, marcamos como sincronizado (somos primeros).
        setTimeout(() => opts.onSynced?.(), 800);
      } else if (status === "CHANNEL_ERROR" || status === "CLOSED") {
        opts.onStatus?.({ connected: false, peers: 0 });
      }
    });
  }

  private handleMessage(m: Msg) {
    const { doc, awareness, onSynced } = this.opts;
    switch (m.t) {
      case "update":
        Y.applyUpdate(doc, b64ToU8(m.d), "remote");
        break;
      case "sync-request": {
        // Le mandamos nuestro state vector para que nos envíe diff
        const sv = Y.encodeStateVector(doc);
        this.channel.send({ type: "broadcast", event: "msg", payload: { t: "sync-state", sv: u8ToB64(sv), from: this.clientId, to: m.from } satisfies Msg });
        // Y también nuestro estado completo por si somos los primeros
        const update = Y.encodeStateAsUpdate(doc);
        this.channel.send({ type: "broadcast", event: "msg", payload: { t: "sync-diff", d: u8ToB64(update), from: this.clientId, to: m.from } satisfies Msg });
        break;
      }
      case "sync-state": {
        if (m.to !== this.clientId) return;
        const sv = b64ToU8(m.sv);
        const diff = Y.encodeStateAsUpdate(doc, sv);
        this.channel.send({ type: "broadcast", event: "msg", payload: { t: "sync-diff", d: u8ToB64(diff), from: this.clientId, to: m.from } satisfies Msg });
        break;
      }
      case "sync-diff": {
        if (m.to !== this.clientId) return;
        Y.applyUpdate(doc, b64ToU8(m.d), "remote");
        onSynced?.();
        break;
      }
      case "awareness": {
        if (awareness) applyAwarenessUpdate(awareness, b64ToU8(m.d), "remote");
        break;
      }
    }
  }

  private schedulePersist() {
    if (this.persistTimer) return;
    this.persistTimer = setTimeout(() => {
      this.persistTimer = null;
      if (!this.dirty || this.destroyed) return;
      this.dirty = false;
      this.persistSnapshot();
    }, 5000);
  }

  private async persistSnapshot() {
    const update = Y.encodeStateAsUpdate(this.opts.doc);
    // Extraer texto plano del documento para columna `content`
    const ytext = this.opts.doc.getText("latex");
    const content = ytext.toString();
    // bytea via base64 (Postgres acepta '\\x' hex; usamos hex para evitar ambigüedad)
    let hex = "\\x";
    for (let i = 0; i < update.length; i++) hex += update[i].toString(16).padStart(2, "0");
    await supabase
      .from("documents")
      .update({ yjs_state: hex as unknown as never, content })
      .eq("id", this.opts.documentId);
  }

  async destroy() {
    this.destroyed = true;
    if (this.persistTimer) clearTimeout(this.persistTimer);
    this.opts.doc.off("update", this.docUpdateHandler);
    this.opts.awareness?.off("update", this.awarenessHandler);
    if (this.opts.awareness) {
      removeAwarenessStates(this.opts.awareness, [this.clientId], "local");
    }
    // Persist final si hay cambios
    if (this.dirty) await this.persistSnapshot();
    await supabase.removeChannel(this.channel);
  }
}
