-- youB CRM Comercial SaaS DHO V1
-- Não remove histórico: serviços antigos permanecem para versões históricas,
-- mas deixam de alimentar novas propostas SaaS.

create table if not exists public.saas_plans (
  id uuid primary key default gen_random_uuid(),
  code text not null unique check (code in ('estrutural','estrategico','enterprise')),
  name text not null,
  tagline text not null,
  description text not null,
  recommended boolean not null default false,
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.saas_plan_modules (
  id uuid primary key default gen_random_uuid(),
  plan_code text not null references public.saas_plans(code),
  module_key text not null,
  module_name text not null,
  commercial_description text not null default '',
  display_order integer not null default 0,
  active boolean not null default true,
  unique (plan_code, module_key)
);

create table if not exists public.saas_pricing_matrix (
  id uuid primary key default gen_random_uuid(),
  min_headcount integer not null check (min_headcount > 0),
  max_headcount integer,
  structural_monthly numeric(14,2),
  strategic_monthly numeric(14,2),
  active boolean not null default true,
  valid_from date not null default current_date,
  valid_until date,
  check (max_headcount is null or max_headcount >= min_headcount),
  check ((max_headcount is null and structural_monthly is null and strategic_monthly is null) or structural_monthly is not null or strategic_monthly is not null)
);

create table if not exists public.saas_implementation_pricing (
  id uuid primary key default gen_random_uuid(),
  min_headcount integer not null check (min_headcount > 0),
  max_headcount integer,
  list_price numeric(14,2),
  active boolean not null default true,
  check (max_headcount is null or max_headcount >= min_headcount)
);
create unique index if not exists ux_saas_pricing_band_valid_from on public.saas_pricing_matrix (min_headcount, coalesce(max_headcount,-1), valid_from);
create unique index if not exists ux_saas_setup_band on public.saas_implementation_pricing (min_headcount, coalesce(max_headcount,-1));

alter table public.proposal_services add column if not exists service_scope text not null default 'professional_legacy';
alter table public.proposal_line_items add column if not exists plan_code text;
alter table public.proposals add column if not exists commercial_model text not null default 'legacy';
alter table public.proposals add column if not exists plan_code text;
alter table public.proposals add column if not exists headcount integer;
alter table public.proposals add column if not exists headcount_band text;
alter table public.proposals add column if not exists pricing_matrix_id uuid;
alter table public.proposals add column if not exists reference_monthly numeric(14,2);
alter table public.proposals add column if not exists manual_monthly numeric(14,2);
alter table public.proposals add column if not exists discount_percent numeric(7,2) not null default 0;
alter table public.proposals add column if not exists discount_amount numeric(14,2) not null default 0;
alter table public.proposals add column if not exists final_monthly numeric(14,2);
alter table public.proposals add column if not exists contract_months integer not null default 12;
alter table public.proposals add column if not exists mrr numeric(14,2);
alter table public.proposals add column if not exists arr numeric(14,2);
alter table public.proposals add column if not exists tcv numeric(14,2);
alter table public.proposals add column if not exists setup_list_price numeric(14,2);
alter table public.proposals add column if not exists setup_bonus_percent numeric(5,2) not null default 0;
alter table public.proposals add column if not exists setup_adjustment numeric(14,2) not null default 0;
alter table public.proposals add column if not exists setup_discount_amount numeric(14,2) not null default 0;
alter table public.proposals add column if not exists setup_final_price numeric(14,2);
alter table public.proposals add column if not exists commercial_alert_level text not null default 'none';
alter table public.proposals add column if not exists commercial_justification text;
alter table public.proposals add column if not exists pricing_status text not null default 'calculated';
alter table public.proposals add column if not exists setup_pricing_id uuid;

insert into public.saas_plans (code,name,tagline,description,recommended,sort_order)
values
 ('estrutural','Estrutural','Estruture','Estruture o DHO e transforme percepção em gestão mensurável.',false,1),
 ('estrategico','Estratégico','Decida com inteligência','Amplie a visão de pessoas, performance e decisões executivas com inteligência.',true,2),
 ('enterprise','Enterprise','Integre e escale','Integre, governe e escale a arquitetura de pessoas conforme a necessidade da organização.',false,3)
on conflict (code) do update set name=excluded.name,tagline=excluded.tagline,description=excluded.description,recommended=excluded.recommended,sort_order=excluded.sort_order,active=true;

insert into public.saas_plan_modules (plan_code,module_key,module_name,commercial_description,display_order)
values
 ('estrutural','dashboard_executivo','Dashboard executivo','Visão executiva dos principais indicadores de pessoas.',1),
 ('estrutural','diagnostico_organizacional','Diagnóstico organizacional','Leitura estruturada do momento e das prioridades da organização.',2),
 ('estrutural','clima_cultura','Clima e cultura','Acompanhamento de clima, cultura e percepção das pessoas.',3),
 ('estrutural','disc_perfil','DISC / perfil comportamental','Leitura de perfis e preferências comportamentais.',4),
 ('estrutural','assessments','Assessments','Avaliações estruturadas para apoiar decisões de desenvolvimento.',5),
 ('estrutural','performance_competencias','Avaliação de desempenho e competências','Ciclos de desempenho, competências e evolução.',6),
 ('estrutural','feedback_360','Feedback 360°','Visão ampla de comportamentos e percepções de liderança.',7),
 ('estrutural','pdi','PDI','Planos individuais de desenvolvimento acompanháveis.',8),
 ('estrutural','planos_acao','Planos de ação','Ações, responsáveis e acompanhamento de evolução.',9),
 ('estrutural','analytics_essenciais','Analytics e relatórios essenciais','Relatórios para acompanhar adesão, evolução e prioridades.',10),
 ('estrategico','trilhas','Trilhas de desenvolvimento','Jornadas por público, competência e necessidade.',11),
 ('estrategico','lms','Aprendizagem / LMS','Experiências de aprendizagem e conteúdos organizados.',12),
 ('estrategico','performance_potencial','Performance × Potencial','Leitura integrada de performance e potencial.',13),
 ('estrategico','nine_box','9-Box','Matriz para apoiar decisões de talento e desenvolvimento.',14),
 ('estrategico','sucessao','Sucessão','Planejamento de sucessão para posições relevantes.',15),
 ('estrategico','posicoes_criticas','Posições críticas e sucessores','Mapeamento de posições críticas, riscos e sucessores.',16),
 ('estrategico','people_analytics_avancado','People Analytics avançado','Análises avançadas para decisões estratégicas de pessoas.',17),
 ('estrategico','bee','IA Mentora Bee','Apoio inteligente para desenvolvimento e decisões de pessoas.',18),
 ('estrategico','impacto_roi','Impacto / ROI','Visão de impacto e retorno das iniciativas de pessoas.',19),
 ('estrategico','inteligencia_executiva','Dashboards e inteligência executiva avançada','Camada avançada de inteligência para a liderança executiva.',20),
 ('enterprise','api_integration_hub','API / Integration Hub','Base para integrações conforme disponibilidade técnica.',21),
 ('enterprise','integracoes_ecossistema','Integrações com HRIS, folha, ERP, ATS, LMS e BI','Integrações contratadas conforme escopo e disponibilidade.',22),
 ('enterprise','sso','SSO','Autenticação corporativa e acesso centralizado.',23),
 ('enterprise','multiempresa','Multiempresa / múltiplas unidades','Governança de diferentes empresas e unidades.',24),
 ('enterprise','governanca_avancada','Governança e permissões avançadas','Controles avançados de governança, acesso e permissões.',25),
 ('enterprise','customizacoes_sla','Customizações, SLA e arquitetura específicos','Condições técnicas e comerciais específicas sob consulta.',26)
on conflict (plan_code,module_key) do update set module_name=excluded.module_name,commercial_description=excluded.commercial_description,display_order=excluded.display_order,active=true;

insert into public.saas_pricing_matrix (min_headcount,max_headcount,structural_monthly,strategic_monthly)
values
 (1,100,5900,8900),(101,300,7900,11900),(301,500,9900,14900),
 (501,1000,12900,18900),(1001,2500,16900,24900),(2501,null,null,null)
on conflict do nothing;

insert into public.saas_implementation_pricing (min_headcount,max_headcount,list_price)
values (1,300,3500),(301,1000,5000),(1001,2500,7500),(2501,null,null)
on conflict do nothing;

-- Desativa apenas a participação dos serviços profissionais na oferta padrão.
-- Nenhuma linha histórica é apagada.
update public.proposal_services set service_scope='professional_legacy', active=false
where lower(name) like any (array['%diagnóstico%','%modelo de dho%','%forma% de líder%','%trilha%','%carreira%','%reunião estratégica%','%projeto%','%consult%','%mentoria%','%academia%']);

update public.proposal_services set service_scope='saas_legacy', active=false where lower(name) like '%plataforma youb%';

create or replace function public.calculate_saas_quote_v1(
  p_headcount integer,
  p_plan_code text,
  p_manual_monthly numeric default null,
  p_setup_bonus_percent numeric default 0,
  p_setup_adjustment numeric default 0,
  p_contract_months integer default 12
) returns jsonb language plpgsql security definer set search_path=public as $$
declare m public.saas_pricing_matrix; s public.saas_implementation_pricing; ref numeric; final_value numeric; discount numeric; setup_final numeric; alert text := 'none'; band text;
begin
  if p_headcount is null or p_headcount < 1 then raise exception 'headcount_invalid'; end if;
  if p_plan_code not in ('estrutural','estrategico','enterprise') then raise exception 'plan_invalid'; end if;
  if p_contract_months is null or p_contract_months < 1 then raise exception 'contract_months_invalid'; end if;
  if p_setup_bonus_percent not in (0,25,50,75,100) then raise exception 'setup_bonus_invalid'; end if;
  select * into m from public.saas_pricing_matrix where active and p_headcount >= min_headcount and (max_headcount is null or p_headcount <= max_headcount) order by min_headcount desc limit 1;
  select * into s from public.saas_implementation_pricing where active and p_headcount >= min_headcount and (max_headcount is null or p_headcount <= max_headcount) order by min_headcount desc limit 1;
  band := case when m.max_headcount is null then 'Acima de 2.500' else case when m.min_headcount=1 then 'Até '||m.max_headcount else m.min_headcount||'–'||m.max_headcount end end;
  if p_plan_code='enterprise' then
    return jsonb_build_object('plan_code',p_plan_code,'headcount',p_headcount,'headcount_band',band,'pricing_matrix_id',m.id,'reference_monthly',null,'manual_monthly',null,'discount_percent',0,'discount_amount',0,'final_monthly',null,'contract_months',p_contract_months,'mrr',null,'arr',null,'tcv',null,'setup_pricing_id',s.id,'setup_list_price',s.list_price,'setup_bonus_percent',p_setup_bonus_percent,'setup_adjustment',coalesce(p_setup_adjustment,0),'setup_discount_amount',coalesce(s.list_price,0)*p_setup_bonus_percent/100,'setup_final_price',case when s.list_price is null then null else greatest(0,s.list_price-(s.list_price*p_setup_bonus_percent/100)+coalesce(p_setup_adjustment,0)) end,'commercial_alert_level','quote','pricing_status','sob_consulta');
  end if;
  ref := case when p_plan_code='estrutural' then m.structural_monthly else m.strategic_monthly end;
  if ref is null then raise exception 'pricing_not_available'; end if;
  final_value := greatest(0,coalesce(p_manual_monthly,ref)); discount := greatest(0,ref-final_value);
  if discount/ref*100 > 20 then alert := 'critical'; elsif discount/ref*100 >= 10 then alert := 'warning'; elsif discount > 0 then alert := 'info'; end if;
  setup_final := case when s.list_price is null then null else greatest(0,s.list_price-(s.list_price*p_setup_bonus_percent/100)+coalesce(p_setup_adjustment,0)) end;
  return jsonb_build_object('plan_code',p_plan_code,'headcount',p_headcount,'headcount_band',band,'pricing_matrix_id',m.id,'reference_monthly',ref,'manual_monthly',p_manual_monthly,'discount_percent',round((discount/ref*100)::numeric,2),'discount_amount',discount,'final_monthly',final_value,'contract_months',p_contract_months,'mrr',final_value,'arr',final_value*12,'tcv',final_value*p_contract_months+coalesce(setup_final,0),'setup_pricing_id',s.id,'setup_list_price',s.list_price,'setup_bonus_percent',p_setup_bonus_percent,'setup_adjustment',coalesce(p_setup_adjustment,0),'setup_discount_amount',case when s.list_price is null then null else s.list_price-setup_final end,'setup_final_price',setup_final,'commercial_alert_level',alert,'pricing_status','calculated');
end; $$;

grant execute on function public.calculate_saas_quote_v1(integer,text,numeric,numeric,numeric,integer) to authenticated;

create or replace function public.validate_saas_proposal_v1() returns trigger language plpgsql security definer set search_path=public as $$
declare q jsonb;
begin
  if new.commercial_model <> 'saas_dho_v1' then return new; end if;
  q := public.calculate_saas_quote_v1(new.headcount,new.plan_code,new.manual_monthly,new.setup_bonus_percent,new.setup_adjustment,new.contract_months);
  new.headcount_band := q->>'headcount_band'; new.pricing_matrix_id := (q->>'pricing_matrix_id')::uuid; new.setup_pricing_id := (q->>'setup_pricing_id')::uuid;
  new.reference_monthly := nullif(q->>'reference_monthly','')::numeric; new.discount_percent := coalesce((q->>'discount_percent')::numeric,0); new.discount_amount := coalesce((q->>'discount_amount')::numeric,0); new.final_monthly := nullif(q->>'final_monthly','')::numeric; new.mrr := nullif(q->>'mrr','')::numeric; new.arr := nullif(q->>'arr','')::numeric; new.tcv := nullif(q->>'tcv','')::numeric; new.setup_list_price := nullif(q->>'setup_list_price','')::numeric; new.setup_discount_amount := nullif(q->>'setup_discount_amount','')::numeric; new.setup_final_price := nullif(q->>'setup_final_price','')::numeric; new.commercial_alert_level := q->>'commercial_alert_level'; new.pricing_status := q->>'pricing_status';
  if new.commercial_alert_level in ('warning','critical') and nullif(trim(new.commercial_justification),'') is null then raise exception 'commercial_justification_required'; end if;
  return new;
end; $$;

drop trigger if exists trg_validate_saas_proposal_v1 on public.proposals;
create trigger trg_validate_saas_proposal_v1 before insert or update of commercial_model,headcount,plan_code,manual_monthly,setup_bonus_percent,setup_adjustment,contract_months,commercial_justification on public.proposals for each row execute function public.validate_saas_proposal_v1();

create or replace function public.prevent_saas_snapshot_mutation() returns trigger language plpgsql security definer set search_path=public as $$
begin
  if old.commercial_model = 'saas_dho_v1' and (
    new.commercial_model is distinct from old.commercial_model or new.plan_code is distinct from old.plan_code or new.headcount is distinct from old.headcount or new.headcount_band is distinct from old.headcount_band or new.pricing_matrix_id is distinct from old.pricing_matrix_id or new.reference_monthly is distinct from old.reference_monthly or new.manual_monthly is distinct from old.manual_monthly or new.discount_percent is distinct from old.discount_percent or new.discount_amount is distinct from old.discount_amount or new.final_monthly is distinct from old.final_monthly or new.contract_months is distinct from old.contract_months or new.mrr is distinct from old.mrr or new.arr is distinct from old.arr or new.tcv is distinct from old.tcv or new.setup_list_price is distinct from old.setup_list_price or new.setup_bonus_percent is distinct from old.setup_bonus_percent or new.setup_adjustment is distinct from old.setup_adjustment or new.setup_discount_amount is distinct from old.setup_discount_amount or new.setup_final_price is distinct from old.setup_final_price or new.commercial_alert_level is distinct from old.commercial_alert_level or new.commercial_justification is distinct from old.commercial_justification or new.public_content is distinct from old.public_content
  ) then raise exception 'saas_proposal_snapshot_immutable'; end if;
  return new;
end; $$;
drop trigger if exists trg_saas_snapshot_immutable on public.proposals;
create trigger trg_saas_snapshot_immutable before update of commercial_model,plan_code,headcount,headcount_band,pricing_matrix_id,reference_monthly,manual_monthly,discount_percent,discount_amount,final_monthly,contract_months,mrr,arr,tcv,setup_list_price,setup_bonus_percent,setup_adjustment,setup_discount_amount,setup_final_price,commercial_alert_level,commercial_justification,public_content on public.proposals for each row execute function public.prevent_saas_snapshot_mutation();

alter table public.saas_plans enable row level security;
alter table public.saas_plan_modules enable row level security;
alter table public.saas_pricing_matrix enable row level security;
alter table public.saas_implementation_pricing enable row level security;
drop policy if exists saas_plans_authenticated_read on public.saas_plans;
drop policy if exists saas_plan_modules_authenticated_read on public.saas_plan_modules;
drop policy if exists saas_pricing_authenticated_read on public.saas_pricing_matrix;
drop policy if exists saas_setup_authenticated_read on public.saas_implementation_pricing;
create policy saas_plans_authenticated_read on public.saas_plans for select to authenticated using (active=true);
create policy saas_plan_modules_authenticated_read on public.saas_plan_modules for select to authenticated using (active=true);
create policy saas_pricing_authenticated_read on public.saas_pricing_matrix for select to authenticated using (active=true);
create policy saas_setup_authenticated_read on public.saas_implementation_pricing for select to authenticated using (active=true);
grant select on public.saas_plans, public.saas_plan_modules, public.saas_pricing_matrix, public.saas_implementation_pricing to authenticated;
