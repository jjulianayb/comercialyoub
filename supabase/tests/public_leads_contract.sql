-- Rollback-only contract tests for the public lead capture migration.
-- Execute only after the migration in an isolated staging database.
BEGIN;

DO $$
BEGIN
  IF to_regclass('public.lead_consents') IS NULL THEN
    RAISE EXCEPTION 'lead_consents table is missing';
  END IF;
  IF to_regclass('public.public_lead_requests') IS NULL THEN
    RAISE EXCEPTION 'public_lead_requests table is missing';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'companies' AND column_name = 'normalized_domain'
  ) THEN
    RAISE EXCEPTION 'companies.normalized_domain is missing';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'opportunities' AND column_name = 'interest'
  ) THEN
    RAISE EXCEPTION 'opportunities.interest is missing';
  END IF;
END;
$$;

DO $$
BEGIN
  IF NOT has_function_privilege('service_role', 'public.create_public_lead(jsonb,uuid,text,text,text,text)', 'EXECUTE') THEN
    RAISE EXCEPTION 'service_role cannot execute create_public_lead';
  END IF;
  IF has_function_privilege('anon', 'public.create_public_lead(jsonb,uuid,text,text,text,text)', 'EXECUTE') THEN
    RAISE EXCEPTION 'anon can execute create_public_lead';
  END IF;
  IF has_function_privilege('authenticated', 'public.create_public_lead(jsonb,uuid,text,text,text,text)', 'EXECUTE') THEN
    RAISE EXCEPTION 'authenticated can execute create_public_lead';
  END IF;
END;
$$;

-- The function must reject direct calls that do not represent the trusted server role.
SELECT set_config('request.jwt.claim.role', 'authenticated', true);
DO $$
BEGIN
  BEGIN
    PERFORM public.create_public_lead('{}'::jsonb, gen_random_uuid(), 'ip', 'email', 'request', 'https://rhyoub.com.br');
    RAISE EXCEPTION 'untrusted role was allowed to call create_public_lead';
  EXCEPTION WHEN insufficient_privilege THEN
    NULL;
  END;
END;
$$;

-- The server-owned fields are fixed by the database function even if a hostile payload includes them.
SELECT set_config('request.jwt.claim.role', 'service_role', true);
DO $$
DECLARE
  admin_id uuid := gen_random_uuid();
  result jsonb;
  opportunity_id uuid;
  opportunity_count integer;
  consent_count integer;
BEGIN
  INSERT INTO public.user_roles (user_id, role) VALUES (admin_id, 'admin');

  result := public.create_public_lead(
    jsonb_build_object(
      'name', 'Lead de teste',
      'email', 'lead-teste@staging.example',
      'company', 'Empresa Staging',
      'role', 'RH',
      'interest', 'Plataforma',
      'commercialContactOptIn', true,
      'newsletterOptIn', true,
      'consentVersion', 'test-1',
      'landingPath', '/plataforma',
      'source', 'Ganho',
      'stage', 'ganha',
      'owner_id', gen_random_uuid(),
      'estimated_value', 999999
    ),
    admin_id,
    'ip-hash-test-1',
    'email-hash-test-1',
    'request-hash-test-1',
    'https://rhyoub.com.br'
  );

  opportunity_id := (result ->> 'opportunity_id')::uuid;
  SELECT count(*) INTO opportunity_count FROM public.opportunities WHERE id = opportunity_id AND stage = 'lead_novo' AND source = 'Site' AND estimated_value = 0 AND owner_id = admin_id;
  IF opportunity_count <> 1 THEN RAISE EXCEPTION 'server-owned opportunity fields were not enforced'; END IF;

  SELECT count(*) INTO consent_count FROM public.lead_consents WHERE contact_id = (result ->> 'lead_id')::uuid AND consent_version = 'test-1';
  IF consent_count <> 2 THEN RAISE EXCEPTION 'separate commercial/newsletter consent records were not created'; END IF;

  -- Same contact, interest, source and open opportunity inside 30 days must deduplicate.
  result := public.create_public_lead(
    jsonb_build_object(
      'name', 'Lead de teste atualizado',
      'email', 'LEAD-TESTE@STAGING.EXAMPLE',
      'company', 'Empresa Staging',
      'role', 'Diretoria de RH',
      'interest', 'Plataforma',
      'commercialContactOptIn', true,
      'newsletterOptIn', false,
      'consentVersion', 'test-2',
      'landingPath', '/'
    ),
    admin_id,
    'ip-hash-test-2',
    'email-hash-test-1',
    'request-hash-test-2',
    'https://rhyoub.com.br'
  );

  SELECT count(*) INTO opportunity_count FROM public.opportunities WHERE contact_id = (result ->> 'lead_id')::uuid AND interest = 'Plataforma' AND source = 'Site';
  IF opportunity_count <> 1 THEN RAISE EXCEPTION 'open opportunity was duplicated'; END IF;
END;
$$;

ROLLBACK;
