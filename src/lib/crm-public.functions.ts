import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { SESSION_CONFIG, type ProposalSession } from "./proposal-access.server";
import { recordProposalInteraction } from "./proposal-access.functions";

export const getProposalMeta = createServerFn({ method: "GET" }).inputValidator((input) => z.object({ token: z.string().min(8).max(64) }).parse(input)).handler(async ({ data }) => {
  const { data: row, error } = await supabaseAdmin.from("proposals").select("sent_at, valid_until, version, status").eq("public_token", data.token).maybeSingle();
  if (error || !row) return { found: false as const };
  const validUntil = row.valid_until ? new Date(row.valid_until).getTime() : null;
  return { found: true as const, sentAt: row.sent_at, validUntil: row.valid_until, version: row.version, expired: row.status === "expirada" || row.status === "recusada" || (validUntil !== null && validUntil <= Date.now()) || !row.sent_at };
});

export const submitProposalResponse = createServerFn({ method: "POST" }).inputValidator((input) => z.object({ token: z.string().min(8).max(64), selectedPlan: z.string().max(120).optional().nullable(), comment: z.string().max(4000).optional().nullable() }).parse(input)).handler(async ({ data }) => {
  const session = await useSession<ProposalSession>(SESSION_CONFIG);
  if (session.data.unlocked !== true || session.data.proposalToken !== data.token) return { ok: false as const, reason: "unauthorized" as const };
  const { data: proposal, error: proposalError } = await supabaseAdmin.from("proposals").select("id, sent_at, valid_until, status").eq("public_token", data.token).maybeSingle();
  if (proposalError || !proposal) return { ok: false as const, reason: "not_found" as const };
  const validUntil = proposal.valid_until ? new Date(proposal.valid_until).getTime() : null;
  if (proposal.status === "expirada" || proposal.status === "recusada" || !proposal.sent_at || (validUntil !== null && validUntil <= Date.now())) return { ok: false as const, reason: "expired" as const };
  const selectedPlan = data.selectedPlan?.trim() || null; const comment = data.comment?.trim() || null;
  const { error } = await supabaseAdmin.from("proposal_responses").upsert({ proposal_id: proposal.id, selected_plan: selectedPlan, comment }, { onConflict: "proposal_id" });
  if (error) return { ok: false as const, reason: "save_failed" as const };
  if (selectedPlan) await recordProposalInteraction(proposal.id, "plan_selected", { selectedPlan });
  if (comment) await recordProposalInteraction(proposal.id, "comment", { comment });
  return { ok: true as const };
});

export const registerProposalInteraction = createServerFn({ method: "POST" }).inputValidator((input) => z.object({ token: z.string().min(8).max(64), eventType: z.enum(["configuration_changed", "download_pdf", "advance_intent"]), payload: z.record(z.string(), z.unknown()).optional() }).parse(input)).handler(async ({ data }) => {
  const session = await useSession<ProposalSession>(SESSION_CONFIG);
  if (session.data.unlocked !== true || session.data.proposalToken !== data.token) return { ok: false as const, reason: "unauthorized" as const };
  const { data: proposal } = await supabaseAdmin.from("proposals").select("id, sent_at, valid_until, status").eq("public_token", data.token).maybeSingle();
  if (!proposal) return { ok: false as const, reason: "not_found" as const };
  const validUntil = proposal.valid_until ? new Date(proposal.valid_until).getTime() : null;
  if (proposal.status === "expirada" || proposal.status === "recusada" || !proposal.sent_at || (validUntil !== null && validUntil <= Date.now())) return { ok: false as const, reason: "expired" as const };
  await recordProposalInteraction(proposal.id, data.eventType, data.payload ?? {});
  return { ok: true as const };
});
