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
    return { unlocked: session.data.unlocked === true };
  },
);

export const unlockProposal = createServerFn({ method: "POST" })
  .inputValidator((input) =>
    z.object({ password: z.string().min(1).max(128) }).parse(input),
  )
  .handler(async ({ data }) => {
    // Tiny delay to slow down brute force
    await new Promise((r) => setTimeout(r, 350));

    const ok = data.password.trim().toLowerCase() === PROPOSAL_PASSWORD;
    await logAttempt(ok);

    if (!ok) {
      return { ok: false as const };
    }

    const session = await useSession<ProposalSession>(SESSION_CONFIG);
    await session.update({ unlocked: true, unlockedAt: Date.now() });
    return { ok: true as const };
  });

export const lockProposal = createServerFn({ method: "POST" }).handler(
  async () => {
    const session = await useSession<ProposalSession>(SESSION_CONFIG);
    await session.clear();
    return { ok: true as const };
  },
);
