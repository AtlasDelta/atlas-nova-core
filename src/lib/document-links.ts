import { supabase } from "@/integrations/supabase/client";
import type { Graph } from "@/components/GraphEditor";

export interface LinkedModel {
  id: string;
  model_id: string;
  alias: string | null;
  model: { id: string; name: string; graph: Graph };
}
export interface LinkedDocument {
  id: string;
  target_document_id: string;
  alias: string | null;
  target: { id: string; title: string; content: string };
}
export interface ModelOption {
  id: string;
  name: string;
}
export interface DocOption {
  id: string;
  title: string;
}

export async function fetchLinkedModels(documentId: string): Promise<LinkedModel[]> {
  const { data, error } = await supabase
    .from("document_models")
    .select("id,model_id,alias,models(id,name,graph)")
    .eq("document_id", documentId);
  if (error) throw error;
  return (data ?? [])
    .filter((r) => r.models)
    .map((r) => ({
      id: r.id,
      model_id: r.model_id,
      alias: r.alias,
      model: {
        id: (r.models as { id: string }).id,
        name: (r.models as { name: string }).name,
        graph: (r.models as { graph: unknown }).graph as Graph,
      },
    }));
}

export async function fetchLinkedDocuments(documentId: string): Promise<LinkedDocument[]> {
  const { data, error } = await supabase
    .from("document_links")
    .select("id,target_document_id,alias,target:documents!document_links_target_document_id_fkey(id,title,content)")
    .eq("source_document_id", documentId);
  if (error) throw error;
  return (data ?? [])
    .filter((r) => r.target)
    .map((r) => ({
      id: r.id,
      target_document_id: r.target_document_id,
      alias: r.alias,
      target: {
        id: (r.target as { id: string }).id,
        title: (r.target as { title: string }).title,
        content: (r.target as { content: string }).content,
      },
    }));
}

export async function listAvailableModels(): Promise<ModelOption[]> {
  const { data, error } = await supabase.from("models").select("id,name").order("updated_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function listAvailableDocuments(excludeId: string): Promise<DocOption[]> {
  const { data, error } = await supabase
    .from("documents")
    .select("id,title")
    .neq("id", excludeId)
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function linkModel(documentId: string, modelId: string): Promise<void> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("No autenticado");
  const { error } = await supabase
    .from("document_models")
    .insert({ document_id: documentId, model_id: modelId, user_id: userData.user.id });
  if (error && !error.message.includes("duplicate")) throw error;
}

export async function unlinkModel(linkId: string): Promise<void> {
  const { error } = await supabase.from("document_models").delete().eq("id", linkId);
  if (error) throw error;
}

export async function linkDocument(sourceId: string, targetId: string): Promise<void> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("No autenticado");
  const { error } = await supabase
    .from("document_links")
    .insert({ source_document_id: sourceId, target_document_id: targetId, user_id: userData.user.id });
  if (error && !error.message.includes("duplicate")) throw error;
}

export async function unlinkDocument(linkId: string): Promise<void> {
  const { error } = await supabase.from("document_links").delete().eq("id", linkId);
  if (error) throw error;
}
