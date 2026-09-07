import type { PublicProposalContent } from "@/components/proposta-interativa";

export const DEFAULT_PROPOSAL_CONTENT: PublicProposalContent = {
  template: "youb-proposal-v1",
  companyName: "Empresa cliente",
  recipientName: "Aos cuidados da direção e RH",
  eyebrow: "DHO e inteligência de pessoas",
  title: "Pessoas preparadas para sustentar a estratégia.",
  subtitle: "Uma plataforma de DHO e inteligência de pessoas para transformar percepção em gestão mensurável.",
  context: "Esta proposta organiza uma arquitetura SaaS conectada às prioridades de pessoas e ao negócio.",
  metrics: [["01", "DHO estruturado"], ["02", "Gestão mensurável"], ["03", "Inteligência executiva"], ["04", "Tecnologia youB"]],
  numbers: [["1", "Plataforma integrada"], ["12", "Meses de vigência"], ["3", "Caminhos de evolução"]],
  objectives: ["Estruturar o DHO com dados, rituais e gestão mensurável.", "Dar visibilidade executiva para decisões de pessoas.", "Acompanhar desempenho, desenvolvimento e potencial.", "Transformar planos de ação em evolução acompanhável.", "Criar uma base SaaS para continuidade e escala."],
  fronts: [],
  methodology: [["01", "Entender", "Leitura do contexto, prioridades e maturidade de pessoas."], ["02", "Estruturar", "Configuração da jornada SaaS e dos módulos contratados."], ["03", "Acompanhar", "Ciclos de gestão, desenvolvimento e planos de ação."], ["04", "Decidir", "Indicadores para priorizar e agir com consistência."]],
  software: [["01", "Base de pessoas", "Organização de públicos, avaliações, jornadas e histórico."], ["02", "Visibilidade executiva", "Dashboards e relatórios para decisões de pessoas."], ["03", "Inteligência", "Analytics, potencial e evolução em uma visão integrada."], ["04", "Continuidade", "A plataforma mantém o DHO vivo entre os ciclos."]],
  plans: [],
  enterprise: { price: "Sob consulta", description: "Integre e escale a arquitetura de pessoas com governança, integrações e condições técnicas específicas.", items: ["API / Integration Hub", "SSO e governança avançada", "Multiempresa e múltiplas unidades", "Integrações e customizações sob consulta", "SLA e arquitetura específicos"] },
  logistics: ["Vigência contratual padrão de 12 meses.", "A implantação é onboarding do SaaS, não consultoria profissional.", "A mensalidade corresponde aos colaboradores cobertos pelo contrato.", "A seleção de plano demonstra interesse comercial e não representa aceite contratual."],
  validity: "Vigência padrão de 12 meses",
};

function money(value: any) { return value == null ? "Sob consulta" : new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(value || 0)); }
const planCopy: Record<string, { name: string; subtitle: string; description: string }> = {
  estrutural: { name: "Estrutural", subtitle: "Estruture", description: "Estruture o DHO e transforme percepção em gestão mensurável." },
  estrategico: { name: "Estratégico", subtitle: "Decida com inteligência", description: "Amplie a visão de pessoas, performance e decisões executivas com inteligência." },
  enterprise: { name: "Enterprise", subtitle: "Integre e escale", description: "Integre, governe e escale a arquitetura de pessoas conforme a necessidade da organização." },
};

export function buildProposalContent(base: PublicProposalContent, fields: { companyName: string; recipientName?: string; context: string; objective: string; modules: any[]; planCode: string; plans: any[]; quote: any; headcount: number; validityDays: number }) {
  const modules = fields.modules || [];
  const fronts = modules.slice(0, 8).map((module, index) => [String(index + 1).padStart(2, "0"), module.module_name, module.commercial_description] as [string, string, string]);
  const plans = (fields.plans || []).map((entry: any) => {
    const copy = planCopy[entry.code]; const q = entry.quote;
    return { name: copy.name, subtitle: copy.subtitle, price: entry.code === "enterprise" ? "Sob consulta" : money(q?.final_monthly ?? q?.reference_monthly), period: entry.code === "enterprise" ? "sob consulta" : "mês · vigência de 12 meses", description: copy.description, featured: entry.code === "estrategico", items: (entry.modules || []).slice(0, 10).map((module: any) => module.module_name) };
  });
  return { ...base, companyName: fields.companyName || "Empresa cliente", recipientName: fields.recipientName || "Aos cuidados da direção e RH", eyebrow: "DHO e inteligência de pessoas", title: fields.objective || base.title, subtitle: `Uma arquitetura SaaS youB desenhada para ${fields.companyName || "a organização"}, com foco em gestão mensurável e decisões de pessoas.`, context: fields.context, fronts, metrics: [["01", "DHO estruturado"], ["02", `${fields.headcount} colaboradores cobertos`], ["03", "Gestão mensurável"], ["04", "Tecnologia youB"]] as [string, string][], numbers: [[String(modules.length), "Módulos no plano"], ["12", "Meses de vigência"], ["3", "Caminhos de evolução"]] as [string, string][], objectives: [fields.objective || base.objectives[0], ...base.objectives.slice(1)], plans, enterprise: base.enterprise, validity: "Vigência contratual de 12 meses" };
}
