-- Only administrators may create or replace an individual proposal password.
-- The hash itself is never exposed by the CRM query.
CREATE OR REPLACE FUNCTION public.prevent_non_admin_proposal_password_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.access_password_hash IS DISTINCT FROM OLD.access_password_hash
     AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'Only administrators can change proposal access credentials';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS proposals_password_admin_only ON public.proposals;
CREATE TRIGGER proposals_password_admin_only
  BEFORE UPDATE ON public.proposals
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_non_admin_proposal_password_change();
