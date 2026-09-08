import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader, getRequestIP, useSession } from "@tanstack/react-start/server";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { SESSION_CONFIG, type ProposalSession } from "./proposal-access.server";

type ProposalRow = { id: string; sent_at: string | null; valid_until: string | null; status: string; access_password_hash: string | null };

function proposalTokenFromReferer() {
  const referer = getRequestHeader("referer");
  if (!referer) return null;
  try { const token = new URL(referer).searchParams.get("p"); return token && /^[A-Za-z0-9_-]{8,64}$/.test(token) ? token : null; } catch { return null; }
}
function isExpired(row: Pick<ProposalRow, "sent_at" | "valid_until" | "status">) {
  return row.status === "expirada" || row.status === "recusada" || !row.sent_at || (row.valid_until !== null && new Date(row.valid_until).getTime() <= Date.now());
}
async function findProposal(token: string): Promise<ProposalRow | null> {
  const { data, error } = await supabaseAdmin.from("proposals").select("id, sent_at, valid_until, status, access_password_hash").eq("public_token", token).maybeSingle();
  return error || !data ? null : data as ProposalRow;
}
function decodeBase64(value: string) { const binary = atob(value); return Uint8Array.from(binary, (char) => char.charCodeAt(0)); }
async function verifyProposalPassword(password: string, encoded: string) {
  try {
    const [algorithm, saltText, iterationsText, hashText] = encoded.split("$"); const iterations = Number(iterationsText);
    if (algorithm !== "pbkdf2" || !saltText || !hashText || !Number.isInteger(iterations) || iterations < 100000 || iterations > 1000000) return false;
    const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
    const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt: decodeBase64(saltText), iterations, hash: "SHA-256" }, key, 256);
    const actual = new Uint8Array(bits); const expected = decodeBase64(hashText); if (actual.length !== expected.length) return false;
    let difference = 0; for (let i = 0; i < actual.length; i += 1) difference |= actual[i] ^ expected[i]; return difference === 0;
  } catch { return false; }
}
async function logAttempt(success: boolean, proposalId: string | null) {
  try { await supabaseAdmin.from("proposal_access_log").insert({ proposal_id: proposalId, success, ip: getRequestIP({ xForwardedFor: true }) ?? null, user_agent: getRequestHeader("user-agent") ?? null, referer: getRequestHeader("referer") ?? null }); } catch (error) { console.error("[proposal] access log failed", error); }
}
export async function recordProposalInteraction(proposalId: string, eventType: string, payload: Record<string, unknown>, actor: "client" | "team" | "system" = "client") {
  await supabaseAdmin.from("proposal_interactions").insert({ proposal_id: proposalId, event_type: eventType, actor, payload });
}

export const checkProposalAccess = createServerFn({ method: "GET" }).inputValidator((input) => z.object({ token: z.string().min(8).max(64).optional() }).optional().parse(input)).handler(async ({ data }) => {
  const session = await useSession<ProposalSession>(SESSION_CONFIG); const token = data?.token ?? proposalTokenFromReferer();
  if (!token) return { unlocked: false, expired: false };
  const proposal = await findProposal(token); if (!proposal) { await session.clear(); return { unlocked: false, expired: false, found: false }; }
  if (isExpired(proposal)) { await session.clear(); return { unlocked: false, expired: true, found: true, sentAt: proposal.sent_at, validUntil: proposal.valid_until }; }
  return { unlocked: session.data.unlocked === true && session.data.proposalToken === token, expired: false, found: true, sentAt: proposal.sent_at, validUntil: proposal.valid_until };
});

export const getProposalContent = createServerFn({ method: "GET" }).inputValidator((input) => z.object({ token: z.string().min(8).max(64) }).parse(input)).handler(async ({ data }) => {
  const session = await useSession<ProposalSession>(SESSION_CONFIG);
  if (session.data.unlocked !== true || session.data.proposalToken !== data.token) return { authorized: false as const };
  const proposal = await findProposal(data.token); if (!proposal || isExpired(proposal)) { await session.clear(); return { authorized: false as const }; }
  const { data: row, error } = await supabaseAdmin.from("proposals").select("public_content").eq("id", proposal.id).single();
  if (error) return { authorized: false as const };
  await recordProposalInteraction(proposal.id, "view", {});
  return { authorized: true as const, publicContent: row.public_content ?? null };
});

export const unlockProposal = createServerFn({ method: "POST" }).inputValidator((input) => z.object({ password: z.string().min(1).max(128), token: z.string().min(8).max(64).optional() }).parse(input)).handler(async ({ data }) => {
  await new Promise((resolve) => setTimeout(resolve, 350)); const token = data.token ?? proposalTokenFromReferer(); const proposal = token ? await findProposal(token) : null;
  if (!proposal || isExpired(proposal)) { await logAttempt(false, proposal?.id ?? null); return { ok: false as const, reason: "expired" as const }; }
  const ok = Boolean(proposal.access_password_hash) && await verifyProposalPassword(data.password, proposal.access_password_hash!); await logAttempt(ok, proposal.id);
  if (!ok) return { ok: false as const, reason: "invalid_password" as const };
  const session = await useSession<ProposalSession>(SESSION_CONFIG); await session.update({ unlocked: true, unlockedAt: Date.now(), proposalToken: token }); return { ok: true as const };
});

export const lockProposal = createServerFn({ method: "POST" }).handler(async () => { const session = await useSession<ProposalSession>(SESSION_CONFIG); await session.clear(); return { ok: true as const }; });
