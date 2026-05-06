
CREATE TABLE public.plots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL DEFAULT 'Gráfica sin título',
  description text,
  kind text NOT NULL DEFAULT '2d',
  spec jsonb NOT NULL DEFAULT '{"series":[],"view":{}}'::jsonb,
  thumbnail text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_plots_user_id ON public.plots(user_id);
ALTER TABLE public.plots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users select own plots" ON public.plots FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "users insert own plots" ON public.plots FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users update own plots" ON public.plots FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users delete own plots" ON public.plots FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE TRIGGER trg_plots_updated_at BEFORE UPDATE ON public.plots FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.document_plots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  plot_id uuid NOT NULL REFERENCES public.plots(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  alias text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (document_id, plot_id)
);
CREATE INDEX idx_document_plots_document_id ON public.document_plots(document_id);
CREATE INDEX idx_document_plots_plot_id ON public.document_plots(plot_id);
ALTER TABLE public.document_plots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users select own document_plots" ON public.document_plots FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "users insert own document_plots" ON public.document_plots FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users update own document_plots" ON public.document_plots FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users delete own document_plots" ON public.document_plots FOR DELETE TO authenticated USING (auth.uid() = user_id);
