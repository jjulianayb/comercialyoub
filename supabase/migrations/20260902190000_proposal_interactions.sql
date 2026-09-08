ALTER TABLE public.proposals
  ADD COLUMN IF NOT EXISTS public_content jsonb NOT NULL DEFAULT '{}'::jsonb;

COMMENT ON COLUMN public.proposals.public_content IS
  'Safe public proposal content. Never store passwords or internal notes here.';

CREATE TABLE IF NOT EXISTS public.proposal_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id uuid NOT NULL UNIQUE REFERENCES public.proposals(id) ON DELETE CASCADE,
  selected_plan text,
  comment text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.proposal_responses TO authenticated;
GRANT ALL ON public.proposal_responses TO service_role;
ALTER TABLE public.proposal_responses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "proposal_responses_select_owner_or_admin" ON public.proposal_responses;
CREATE POLICY "proposal_responses_select_owner_or_admin"
  ON public.proposal_responses FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.proposals p
      WHERE p.id = proposal_id
        AND (p.owner_id = auth.uid() OR public.is_admin())
    )
  );

CREATE OR REPLACE FUNCTION public.update_proposal_response_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

DROP TRIGGER IF EXISTS proposal_responses_updated_at ON public.proposal_responses;
CREATE TRIGGER proposal_responses_updated_at
  BEFORE UPDATE ON public.proposal_responses
  FOR EACH ROW EXECUTE FUNCTION public.update_proposal_response_updated_at();

CREATE INDEX IF NOT EXISTS idx_proposal_responses_proposal
  ON public.proposal_responses(proposal_id);
