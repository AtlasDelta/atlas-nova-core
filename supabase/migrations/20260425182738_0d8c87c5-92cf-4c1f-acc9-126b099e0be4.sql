-- Tabla de vínculos M:N entre documentos y modelos
CREATE TABLE public.document_models (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  model_id UUID NOT NULL REFERENCES public.models(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  alias TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (document_id, model_id)
);

CREATE INDEX idx_document_models_document ON public.document_models(document_id);
CREATE INDEX idx_document_models_model ON public.document_models(model_id);

ALTER TABLE public.document_models ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users select own document_models"
  ON public.document_models FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "users insert own document_models"
  ON public.document_models FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users update own document_models"
  ON public.document_models FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users delete own document_models"
  ON public.document_models FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Tabla de vínculos doc↔doc (dirigidos, transclusivos)
CREATE TABLE public.document_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source_document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  target_document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  alias TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (source_document_id, target_document_id),
  CHECK (source_document_id <> target_document_id)
);

CREATE INDEX idx_document_links_source ON public.document_links(source_document_id);
CREATE INDEX idx_document_links_target ON public.document_links(target_document_id);

ALTER TABLE public.document_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users select own document_links"
  ON public.document_links FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "users insert own document_links"
  ON public.document_links FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users update own document_links"
  ON public.document_links FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users delete own document_links"
  ON public.document_links FOR DELETE TO authenticated
  USING (auth.uid() = user_id);