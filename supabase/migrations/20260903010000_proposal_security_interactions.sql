ALTER TABLE public.proposal_access_log
  ADD COLUMN IF NOT EXISTS proposal_id uuid REFERENCES public.proposals(id) ON DELETE SET NULL;

GRANT SELECT, INSERT ON public.proposal_access_log TO service_role;
CREATE INDEX IF NOT EXISTS idx_proposal_access_log_proposal
  ON public.proposal_access_log(proposal_id, attempted_at DESC);

CREATE TABLE IF NOT EXISTS public.proposal_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id uuid NOT NULL REFERENCES public.proposals(id) ON DELETE CASCADE,
  actor text NOT NULL CHECK (actor IN ('client', 'team', 'system')),
  event_type text NOT NULL CHECK (event_type IN ('view', 'plan_selected', 'configuration_changed', 'comment', 'download_pdf', 'advance_intent', 'commercial_reply')),
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.proposal_interactions TO authenticated;
GRANT ALL ON public.proposal_interactions TO service_role;
ALTER TABLE public.proposal_interactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "proposal_interactions_select_owner_or_admin" ON public.proposal_interactions;
CREATE POLICY "proposal_interactions_select_owner_or_admin"
  ON public.proposal_interactions FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.proposals p
      WHERE p.id = proposal_id
        AND (p.owner_id = auth.uid() OR public.is_admin())
    )
  );

CREATE INDEX IF NOT EXISTS idx_proposal_interactions_proposal_time
  ON public.proposal_interactions(proposal_id, created_at DESC);
