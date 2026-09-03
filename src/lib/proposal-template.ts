import type { PublicProposalContent } from "@/components/proposta-interativa";

export const DEFAULT_PROPOSAL_CONTENT: PublicProposalContent = {
  template: "youb-proposal-v1",
  companyName: "Empresa cliente",
  recipientName: "Aos cuidados da direção e RH",
  eyebrow: "Cultura, desenvolvimento e inteligência de pessoas",
  title: "Pessoas preparadas para sustentar a estratégia.",
  subtitle: "Uma proposta youB personalizada para transformar prioridades de pessoas em uma jornada clara, prática e acompanhada.",
  context: "Esta proposta parte dos desafios e objetivos apresentados pela organização e organiza uma jornada de desenvolvimento conectada ao negócio.",
  metrics: [["01", "Contexto entendido"], ["02", "Jornada personalizada"], ["03", "Acompanhamento próximo"], ["04", "Tecnologia youB"]],
  numbers: [["1", "Jornada integrada"], ["3", "Dimensões de impacto"], ["30", "Dias de validade"]],
  objectives: ["Alinhar a agenda de pessoas às prioridades do negócio.", "Desenvolver líderes e equipes para os desafios atuais.", "Transformar intenção cultural em comportamentos e rituais.", "Criar visibilidade para acompanhar a evolução.", "Deixar uma base de continuidade para a organização."],
  fronts: [],
  methodology: [["01", "Entender", "Leitura do contexto e escuta das pessoas-chave."], ["02", "Desenhar", "Definição da jornada, prioridades e entregas."], ["03", "Aplicar", "Execução acompanhada com líderes e equipes."], ["04", "Medir", "Acompanhamento de adesão, evolução e próximos passos."]],
  software: [["01", "Base de desenvolvimento", "Organização da jornada, públicos, ações e histórico."], ["02", "Visibilidade executiva", "Indicadores e evolução para apoiar decisões."], ["03", "Continuidade", "A tecnologia mantém o desenvolvimento ativo."], ["04", "Inteligência de pessoas", "Apoio para priorizar e agir com consistência."]],
  plans: [{ name: "Configuração proposta", subtitle: "Jornada personalizada", price: "0", period: "conforme cronograma", description: "A configuração abaixo foi montada a partir do contexto e do escopo selecionados.", featured: true, items: [] }],
  enterprise: { price: "7.000", description: "Continuidade da plataforma youB e acompanhamento estratégico conforme contratação.", items: ["Plataforma youB", "Indicadores e próximos passos", "Reunião estratégica mensal, quando contratada"] },
  logistics: ["A primeira parcela é devida na assinatura; as demais seguem a condição comercial definida.", "O início ocorre após aprovação, assinatura e alinhamento do cronograma.", "Esta proposta tem validade de 30 dias."],
  validity: "Validade de 30 dias",
};

export function buildProposalContent(base: PublicProposalContent, fields: { companyName: string; recipientName?: string; context: string; objective: string; services: any[]; total: number; validityDays: number; }) {
  const services = fields.services;
  const fronts = services.map((service) => ["01", service.name, service.commercial_description] as [string, string, string]);
  const items = services.map((service) => `${service.name} · ${service.quantity} ${service.billing_unit}`);
  const amount = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(fields.total);
  return { ...base, companyName: fields.companyName || "Empresa cliente", recipientName: fields.recipientName || "Aos cuidados da direção e RH", title: fields.objective || base.title, subtitle: `Uma jornada youB desenhada para ${fields.companyName || "a organização"}, com foco nas prioridades apresentadas e execução acompanhada.`, context: fields.context, fronts, metrics: [["01", "Contexto entendido"], ["02", `${services.length} módulos selecionados`], ["03", "Jornada acompanhada"], ["04", "Tecnologia youB"]] as [string, string][], numbers: [[String(services.length), "Módulos selecionados"], ["1", "Configuração integrada"], [String(fields.validityDays), "Dias de validade"]] as [string, string][], objectives: [fields.objective || "Executar a jornada de desenvolvimento definida com a organização.", ...base.objectives.slice(1)], plans: [{ ...base.plans[0], price: amount, items }], validity: `Validade de ${fields.validityDays} dias` };
}
