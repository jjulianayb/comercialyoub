import { createServerFn } from "@tanstack/react-start";
import {
 getRequestHeader,
 getRequestIP,
 useSession,
} from "@tanstack/react-start/server";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import {
 PROPOSAL_PASSWORD,
 SESSION_CONFIG,
 type ProposalSession,
} from "./proposal-access.server";

type ProposalRow = {
 sent_at: string | null;
 valid_until: string | null;
 status: string;
};

function proposalTokenFromReferer() {
 const referer = getRequestHeader("referer");
 if (!referer) return null;
 try {
 const token = new URL(referer).searchParams.get("p");
 return token && /^[A-Za-z0-9_-]{8,64}$/.test(token) ? token : null;
 } catch {
 return null;
 }
}

function isExpired(row: ProposalRow) {
 return (
 row.status === "expirada" ||
 row.status === "recusada" ||
 !row.sent_at ||
 (row.valid_until !== null && new Date(row.valid_until).getTime() <= Date.now())
 );
}

async function findProposal(token: string): Promise<ProposalRow | null> {
 const { data, error } = await supabaseAdmin
 .from("proposals")
 .select("sent_at, valid_until, status")
 .eq("public_token", token)
 .maybeSingle();
 return error || !data ? null : (data as ProposalRow);
}

async function logAttempt(success: boolean) {
 try {
 const ip = getRequestIP({ xForwardedFor: true }) ?? null;
 const ua = getRequestHeader("user-agent") ?? null;
 const ref = getRequestHeader("referer") ?? null;
 await supabaseAdmin.from("proposal_access_log").insert({
 success,
 ip,
 user_agent: ua,
 referer: ref,
 });
 } catch (e) {
 console.error("[proposal] log insert failed", e);
 }
}

export const checkProposalAccess = createServerFn({ method: "GET" }).handler(
 async () => {
 const session = await useSession<ProposalSession>(SESSION_CONFIG);
 const token = proposalTokenFromReferer();

 if (!token) {
 return { unlocked: session.data.unlocked === true, expired: false };
 }

 const proposal = await findProposal(token);
 if (!proposal) {
 await session.clear();
 return { unlocked: false, expired: false, found: false };
 }

 if (isExpired(proposal)) {
 await session.clear();
 return {
 unlocked: false,
 expired: true,
 found: true,
 sentAt: proposal.sent_at,
 validUntil: proposal.valid_until,
 };
 }

 return {
 unlocked:
 session.data.unlocked === true && session.data.proposalToken === token,
 expired: false,
 found: true,
 sentAt: proposal.sent_at,
 validUntil: proposal.valid_until,
 };
 },
);

export const unlockProposal = createServerFn({ method: "POST" })
 .inputValidator((input) =>
 z.object({ password: z.string().min(1).max(128) }).parse(input),
 )
 .handler(async ({ data }) => {
 await new Promise((r) => setTimeout(r, 350));

 const token = proposalTokenFromReferer();
 const proposal = token ? await findProposal(token) : null;
 if (token && (!proposal || isExpired(proposal))) {
 await logAttempt(false);
 return { ok: false as const, reason: "expired" as const };
 }

 const ok =
 PROPOSAL_PASSWORD.length > 0 &&
 data.password.trim().toLowerCase() === PROPOSAL_PASSWORD;
 await logAttempt(ok);

 if (!ok) {
 return { ok: false as const, reason: "invalid_password" as const };
 }

 const session = await useSession<ProposalSession>(SESSION_CONFIG);
 await session.update({
 unlocked: true,
 unlockedAt: Date.now(),
 proposalToken: token ?? undefined,
 });
 return { ok: true as const };
 });

export const lockProposal = createServerFn({ method: "POST" }).handler(
 async () => {
 const session = await useSession<ProposalSession>(SESSION_CONFIG);
 await session.clear();
 return { ok: true as const };
 },
);
