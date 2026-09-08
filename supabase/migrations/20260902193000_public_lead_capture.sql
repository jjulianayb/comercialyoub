-- Public website lead capture foundation.
-- This migration is additive and must be validated in isolated staging first.

ALTER TABLE public.companies
  ADD COLUMN IF NOT EXISTS normalized_domain text;

ALTER TABLE public.opportunities
  ADD COLUMN IF NOT EXISTS interest text;

CREATE INDEX IF NOT EXISTS companies_normalized_domain_idx
  ON public.companies (normalized_domain)
  WHERE normalized_domain IS NOT NULL;

CREATE INDEX IF NOT EXISTS companies_normalized_name_idx
  ON public.companies ((lower(regexp_replace(btrim(name), '\\s+', ' ', 'g'))));

CREATE INDEX IF NOT EXISTS contacts_normalized_email_idx
  ON public.contacts ((lower(btrim(email))))
  WHERE email IS NOT NULL;

CREATE INDEX IF NOT EXISTS opportunities_public_lead_dedupe_idx
  ON public.opportunities (contact_id, interest, source, created_at)
  WHERE source = 'Site';

CREATE TABLE IF NOT EXISTS public.lead_consents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id uuid NOT NULL REFERENCES public.contacts(id) ON DELETE CASCADE,
  email text NOT NULL,
  consent_type text NOT NULL CHECK (consent_type IN ('commercial_contact', 'newsletter')),
  consented boolean NOT NULL,
  consent_version text NOT NULL,
  source text NOT NULL,
  landing_path text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  ip_hash text,
  user_agent_hash text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS lead_consents_contact_idx
  ON public.lead_consents (contact_id, consent_type, created_at DESC);

CREATE INDEX IF NOT EXISTS lead_consents_email_idx
  ON public.lead_consents (email, created_at DESC);

ALTER TABLE public.lead_consents ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.lead_consents TO authenticated;
GRANT ALL ON public.lead_consents TO service_role;
DROP POLICY IF EXISTS lead_consents_admin_select ON public.lead_consents;
CREATE POLICY lead_consents_admin_select ON public.lead_consents
  FOR SELECT TO authenticated
  USING (public.is_admin());

CREATE TABLE IF NOT EXISTS public.public_lead_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_hash text NOT NULL UNIQUE,
  ip_hash text NOT NULL,
  email_hash text NOT NULL,
  source text NOT NULL,
  origin text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS public_lead_requests_ip_created_idx
  ON public.public_lead_requests (ip_hash, created_at DESC);

CREATE INDEX IF NOT EXISTS public_lead_requests_email_created_idx
  ON public.public_lead_requests (email_hash, created_at DESC);

ALTER TABLE public.public_lead_requests ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.public_lead_requests FROM PUBLIC, anon, authenticated;
GRANT ALL ON public.public_lead_requests TO service_role;

CREATE OR REPLACE FUNCTION public.create_public_lead(
  p_payload jsonb,
  p_owner_id uuid,
  p_ip_hash text,
  p_email_hash text,
  p_request_hash text,
  p_origin text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_name text := btrim(coalesce(p_payload ->> 'name', ''));
  v_email text := lower(btrim(coalesce(p_payload ->> 'email', '')));
  v_company_name text := btrim(coalesce(p_payload ->> 'company', ''));
  v_role text := btrim(coalesce(p_payload ->> 'role', ''));
  v_interest text := btrim(coalesce(p_payload ->> 'interest', ''));
  v_message text := btrim(coalesce(p_payload ->> 'message', ''));
  v_consent_version text := btrim(coalesce(p_payload ->> 'consentVersion', ''));
  v_landing_path text := nullif(btrim(coalesce(p_payload ->> 'landingPath', '')), '');
  v_utm_source text := nullif(btrim(coalesce(p_payload ->> 'utmSource', '')), '');
  v_utm_medium text := nullif(btrim(coalesce(p_payload ->> 'utmMedium', '')), '');
  v_utm_campaign text := nullif(btrim(coalesce(p_payload ->> 'utmCampaign', '')), '');
  v_newsletter_opt_in boolean := coalesce((p_payload ->> 'newsletterOptIn')::boolean, false);
  v_domain text := split_part(v_email, '@', 2);
  v_domain_key text;
  v_company_name_key text := lower(regexp_replace(v_company_name, '\\s+', ' ', 'g'));
  v_company_id uuid;
  v_contact_id uuid;
  v_existing_company_id uuid;
  v_opportunity_id uuid;
  v_request_rows integer;
  v_ip_count integer;
  v_email_count integer;
BEGIN
  IF coalesce(current_setting('request.jwt.claim.role', true), '') <> 'service_role' THEN
    RAISE EXCEPTION 'PUBLIC_LEAD_SERVICE_ONLY' USING ERRCODE = '42501';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = p_owner_id AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'PUBLIC_LEAD_OWNER_MUST_BE_ADMIN' USING ERRCODE = '23514';
  END IF;

  IF v_name = '' OR v_email = '' OR v_company_name = '' OR v_role = '' OR v_interest = '' OR v_consent_version = '' THEN
    RAISE EXCEPTION 'PUBLIC_LEAD_INVALID_PAYLOAD' USING ERRCODE = '22023';
  END IF;

  IF coalesce((p_payload ->> 'commercialContactOptIn')::boolean, false) IS NOT TRUE THEN
    RAISE EXCEPTION 'PUBLIC_LEAD_CONTACT_CONSENT_REQUIRED' USING ERRCODE = '22023';
  END IF;

  SELECT count(*)::integer INTO v_ip_count
  FROM public.public_lead_requests
  WHERE ip_hash = p_ip_hash AND created_at >= now() - interval '15 minutes';

  SELECT count(*)::integer INTO v_email_count
  FROM public.public_lead_requests
  WHERE email_hash = p_email_hash AND created_at >= now() - interval '15 minutes';

  IF v_ip_count >= 5 OR v_email_count >= 3 THEN
    RAISE EXCEPTION 'RATE_LIMITED' USING ERRCODE = 'P0001';
  END IF;

  INSERT INTO public.public_lead_requests (request_hash, ip_hash, email_hash, source, origin)
  VALUES (p_request_hash, p_ip_hash, p_email_hash, 'Site', p_origin)
  ON CONFLICT (request_hash) DO NOTHING;
  GET DIAGNOSTICS v_request_rows = ROW_COUNT;

  IF v_request_rows = 0 THEN
    RETURN jsonb_build_object('duplicate_request', true);
  END IF;

  IF v_domain NOT IN ('gmail.com', 'googlemail.com', 'hotmail.com', 'outlook.com', 'live.com', 'icloud.com', 'yahoo.com', 'yahoo.com.br', 'uol.com.br', 'bol.com.br') THEN
    v_domain_key := v_domain;
  END IF;

  IF v_domain_key IS NOT NULL THEN
    SELECT id INTO v_company_id
    FROM public.companies
    WHERE normalized_domain = v_domain_key
       OR lower(regexp_replace(regexp_replace(regexp_replace(coalesce(website, ''), '^https?://', ''), '^www\\.', ''), '/.*$', '')) = v_domain_key
    ORDER BY created_at ASC
    LIMIT 1;
  END IF;

  IF v_company_id IS NULL THEN
    SELECT id INTO v_company_id
    FROM public.companies
    WHERE lower(regexp_replace(btrim(name), '\\s+', ' ', 'g')) = v_company_name_key
    ORDER BY created_at ASC
    LIMIT 1;
  END IF;

  IF v_company_id IS NULL THEN
    INSERT INTO public.companies (name, normalized_domain, owner_id)
    VALUES (v_company_name, v_domain_key, p_owner_id)
    RETURNING id INTO v_company_id;
  END IF;

  SELECT id, company_id INTO v_contact_id, v_existing_company_id
  FROM public.contacts
  WHERE lower(btrim(coalesce(email, ''))) = v_email
  ORDER BY created_at ASC
  LIMIT 1;

  IF v_contact_id IS NULL THEN
    INSERT INTO public.contacts (company_id, name, role_title, email, owner_id)
    VALUES (v_company_id, v_name, v_role, v_email, p_owner_id)
    RETURNING id INTO v_contact_id;
  ELSE
    UPDATE public.contacts
    SET name = CASE WHEN v_name <> '' THEN v_name ELSE name END,
        role_title = CASE WHEN v_role <> '' THEN v_role ELSE role_title END,
        company_id = coalesce(company_id, v_company_id),
        updated_at = now()
    WHERE id = v_contact_id;
  END IF;

  SELECT id INTO v_opportunity_id
  FROM public.opportunities
  WHERE contact_id = v_contact_id
    AND interest = v_interest
    AND source = 'Site'
    AND stage NOT IN ('ganha', 'perdida')
    AND created_at >= now() - interval '30 days'
  ORDER BY created_at DESC
  LIMIT 1;

  IF v_opportunity_id IS NULL THEN
    INSERT INTO public.opportunities (title, company_id, contact_id, owner_id, stage, estimated_value, source, interest, notes)
    VALUES (
      format('Demonstração youB — %s', v_company_name),
      v_company_id,
      v_contact_id,
      p_owner_id,
      'lead_novo',
      0,
      'Site',
      v_interest,
      nullif(format('Interesse: %s%s%s', v_interest, CASE WHEN v_message <> '' THEN E'\\nContexto: ' ELSE '' END, v_message), '')
    )
    RETURNING id INTO v_opportunity_id;
  ELSE
    UPDATE public.opportunities
    SET updated_at = now()
    WHERE id = v_opportunity_id;
  END IF;

  INSERT INTO public.lead_consents (
    contact_id, email, consent_type, consented, consent_version, source,
    landing_path, utm_source, utm_medium, utm_campaign, ip_hash
  )
  VALUES
    (v_contact_id, v_email, 'commercial_contact', true, v_consent_version, 'Site', v_landing_path, v_utm_source, v_utm_medium, v_utm_campaign, p_ip_hash),
    (v_contact_id, v_email, 'newsletter', v_newsletter_opt_in, v_consent_version, 'Site', v_landing_path, v_utm_source, v_utm_medium, v_utm_campaign, p_ip_hash);

  RETURN jsonb_build_object(
    'lead_id', v_contact_id,
    'opportunity_id', v_opportunity_id,
    'duplicate_opportunity', false
  );
END;
$$;

REVOKE ALL ON FUNCTION public.create_public_lead(jsonb, uuid, text, text, text, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.create_public_lead(jsonb, uuid, text, text, text, text) TO service_role;
