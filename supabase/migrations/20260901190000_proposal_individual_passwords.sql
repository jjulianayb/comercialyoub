-- Individual proposal access credentials.
-- Apply this migration only after reviewing it in the target Supabase project.
ALTER TABLE public.proposals
  ADD COLUMN IF NOT EXISTS access_password_hash text;

COMMENT ON COLUMN public.proposals.access_password_hash IS
  'PBKDF2 password verifier for the public proposal link; never stores the plaintext password.';
