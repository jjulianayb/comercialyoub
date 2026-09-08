ALTER TABLE public.proposals
  ADD COLUMN IF NOT EXISTS series_id uuid NOT NULL DEFAULT gen_random_uuid(),
  ADD COLUMN IF NOT EXISTS previous_version_id uuid REFERENCES public.proposals(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS is_current boolean NOT NULL DEFAULT true;
CREATE INDEX IF NOT EXISTS idx_proposals_series ON public.proposals(series_id, version DESC);

CREATE TABLE IF NOT EXISTS public.proposal_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL, category text NOT NULL DEFAULT 'Geral',
  commercial_description text NOT NULL DEFAULT '', billing_unit text NOT NULL DEFAULT 'projeto',
  base_price numeric(14,2) NOT NULL DEFAULT 0, default_quantity numeric(14,2) NOT NULL DEFAULT 1,
  periodicity text NOT NULL DEFAULT 'única', is_required boolean NOT NULL DEFAULT false,
  can_remove boolean NOT NULL DEFAULT true, display_order integer NOT NULL DEFAULT 0, active boolean NOT NULL DEFAULT true,
  owner_id uuid, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.proposal_services ALTER COLUMN owner_id DROP NOT NULL;
GRANT SELECT, INSERT, UPDATE ON public.proposal_services TO authenticated; GRANT ALL ON public.proposal_services TO service_role;
ALTER TABLE public.proposal_services ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "proposal_services_select_authenticated" ON public.proposal_services;
CREATE POLICY "proposal_services_select_authenticated" ON public.proposal_services FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "proposal_services_admin_write" ON public.proposal_services;
CREATE POLICY "proposal_services_admin_write" ON public.proposal_services FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE INDEX IF NOT EXISTS idx_proposal_services_active_order ON public.proposal_services(active, display_order);

CREATE TABLE IF NOT EXISTS public.proposal_line_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), proposal_id uuid NOT NULL REFERENCES public.proposals(id) ON DELETE CASCADE,
  service_id uuid REFERENCES public.proposal_services(id) ON DELETE SET NULL, name text NOT NULL,
  category text NOT NULL DEFAULT 'Geral', commercial_description text NOT NULL DEFAULT '', billing_unit text NOT NULL DEFAULT 'projeto',
  quantity numeric(14,2) NOT NULL DEFAULT 1, unit_price numeric(14,2) NOT NULL DEFAULT 0, periodicity text NOT NULL DEFAULT 'única',
  is_required boolean NOT NULL DEFAULT false, can_remove boolean NOT NULL DEFAULT true, display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.proposal_line_items TO authenticated; GRANT ALL ON public.proposal_line_items TO service_role;
ALTER TABLE public.proposal_line_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "proposal_line_items_select_owner_or_admin" ON public.proposal_line_items;
CREATE POLICY "proposal_line_items_select_owner_or_admin" ON public.proposal_line_items FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.proposals p WHERE p.id = proposal_id AND (p.owner_id = auth.uid() OR public.is_admin())));
CREATE INDEX IF NOT EXISTS idx_proposal_line_items_proposal ON public.proposal_line_items(proposal_id, display_order);

CREATE TABLE IF NOT EXISTS public.proposal_drafts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), owner_id uuid NOT NULL DEFAULT auth.uid(), opportunity_id uuid REFERENCES public.opportunities(id) ON DELETE SET NULL,
  title text NOT NULL DEFAULT 'Rascunho de proposta', wizard_step integer NOT NULL DEFAULT 0, payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now(), created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.proposal_drafts TO authenticated; GRANT ALL ON public.proposal_drafts TO service_role;
ALTER TABLE public.proposal_drafts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "proposal_drafts_owner_or_admin" ON public.proposal_drafts;
CREATE POLICY "proposal_drafts_owner_or_admin" ON public.proposal_drafts FOR ALL TO authenticated USING (owner_id = auth.uid() OR public.is_admin()) WITH CHECK (owner_id = auth.uid() OR public.is_admin());

GRANT SELECT ON public.proposal_access_log TO authenticated;
DROP POLICY IF EXISTS "proposal_access_log_select_owner_or_admin" ON public.proposal_access_log;
CREATE POLICY "proposal_access_log_select_owner_or_admin" ON public.proposal_access_log FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.proposals p WHERE p.id = proposal_id AND (p.owner_id = auth.uid() OR public.is_admin())));

INSERT INTO public.proposal_services (name, category, commercial_description, billing_unit, base_price, default_quantity, periodicity, is_required, can_remove, display_order)
SELECT * FROM (VALUES
('Diagnóstico de cultura, liderança e DHO','Diagnóstico','Levantamento de contexto, maturidade, percepções e prioridades de desenvolvimento.','projeto',0::numeric,1::numeric,'única',true,false,10),
('Modelo de DHO','Estrutura','Desenho de papéis, processos, rituais e agenda de desenvolvimento.','projeto',0::numeric,1::numeric,'única',false,true,20),
('Formação de líderes','Desenvolvimento','Jornada aplicada de comunicação, feedback, gestão e desenvolvimento de pessoas.','turma',0::numeric,1::numeric,'única',false,true,30),
('Trilhas de desenvolvimento','Desenvolvimento','Criação e acompanhamento de trilhas por público, competência e necessidade.','trilha',0::numeric,1::numeric,'única',false,true,40),
('Plano de carreira e competências','Estrutura','Base para evolução profissional, conversas de desenvolvimento e sucessão.','projeto',0::numeric,1::numeric,'única',false,true,50),
('Plataforma youB','Tecnologia','Tecnologia para registrar jornadas, acompanhar indicadores e dar continuidade ao DHO.','mês',7000::numeric,1::numeric,'mensal',false,false,60),
('Reunião estratégica com Juliana','Acompanhamento','Reunião mensal para análise de indicadores e definição dos próximos passos.','mês',0::numeric,1::numeric,'mensal',false,true,70)
) AS seed(name,category,commercial_description,billing_unit,base_price,default_quantity,periodicity,is_required,can_remove,display_order)
WHERE NOT EXISTS (SELECT 1 FROM public.proposal_services existing WHERE existing.name = seed.name);
