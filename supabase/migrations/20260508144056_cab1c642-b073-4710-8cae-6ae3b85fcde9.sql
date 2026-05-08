CREATE TABLE public.proposal_access_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  attempted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  success BOOLEAN NOT NULL,
  ip TEXT,
  user_agent TEXT,
  referer TEXT
);

ALTER TABLE public.proposal_access_log ENABLE ROW LEVEL SECURITY;

-- No policies → all client access denied. Only service role (server) can read/write.
CREATE INDEX idx_proposal_access_log_attempted_at ON public.proposal_access_log (attempted_at DESC);