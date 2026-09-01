import type { Tables } from "@/integrations/supabase/types";

export type Stage =
  | "lead_novo"
  | "qualificado"
  | "reuniao"
  | "proposta_elaboracao"
  | "proposta_enviada"
  | "follow_up"
  | "negociacao"
  | "ganha"
  | "perdida";

export const STAGES: { value: Stage; label: string }[] = [
  { value: "lead_novo", label: "Lead novo" },
  { value: "qualificado", label: "Qualificado" },
  { value: "reuniao", label: "Reunião" },
  { value: "proposta_elaboracao", label: "Proposta em elaboração" },
  { value: "proposta_enviada", label: "Proposta enviada" },
  { value: "follow_up", label: "Follow-up" },
  { value: "negociacao", label: "Negociação" },
  { value: "ganha", label: "Ganha" },
  { value: "perdida", label: "Perdida" },
];

export const stageLabel = (s: string) =>
  STAGES.find((x) => x.value === s)?.label ?? s;

export const PROPOSAL_STATUS: { value: string; label: string }[] = [
  { value: "rascunho", label: "Rascunho" },
  { value: "enviada", label: "Enviada" },
  { value: "expirada", label: "Expirada" },
  { value: "aceita", label: "Aceita" },
  { value: "recusada", label: "Recusada" },
];

export const CHANNELS: { value: string; label: string }[] = [
  { value: "whatsapp", label: "WhatsApp" },
  { value: "email", label: "E-mail" },
  { value: "telefone", label: "Telefone" },
  { value: "reuniao", label: "Reunião" },
  { value: "outro", label: "Outro" },
];

export const SOURCES = [
  "Indicação",
  "LinkedIn",
  "Site",
  "Evento",
  "Prospecção ativa",
  "Cliente atual",
  "Outro",
];

/** Validade padrão da proposta para o cliente: 30 dias após o envio. */
export const PROPOSAL_VALID_DAYS = 30;

export type Company = Tables<"companies">;
export type Contact = Tables<"contacts">;
export type Opportunity = Tables<"opportunities">;
export type Proposal = Tables<"proposals">;
export type Followup = Tables<"followups">;
export type Profile = Tables<"profiles">;

export const brl = (v: number | string | null | undefined) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(Number(v ?? 0));

export const dateBR = (v: string | null | undefined) =>
  v ? new Date(v).toLocaleDateString("pt-BR") : "—";

export const dateTimeBR = (v: string | null | undefined) =>
  v
    ? new Date(v).toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

export const addDays = (base: Date, days: number) => {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
};

export const daysUntil = (v: string | null | undefined) => {
  if (!v) return null;
  const ms = new Date(v).getTime() - Date.now();
  return Math.ceil(ms / 86400000);
};

export const publicProposalUrl = (token: string) =>
  typeof window === "undefined"
    ? `/?p=${token}`
    : `${window.location.origin}/?p=${token}`;
