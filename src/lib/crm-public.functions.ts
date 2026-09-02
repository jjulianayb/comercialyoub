import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/**
 * Public proposal metadata only. Never return hashes, internal notes,
 * owner data or CRM records to the browser.
 */
export const getProposalMeta = createServerFn({ method: "GET" })
  .inputValidator((input) =>
    z.object({ token: z.string().min(8).max(64) }).parse(input),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );
    const { data: row, error } = await supabaseAdmin
      .from("proposals")
      .select("sent_at, valid_until, version, status, public_content")
      .eq("public_token", data.token)
      .maybeSingle();
    if (error || !row) return { found: false as const };

    const now = Date.now();
    const validUntil = row.valid_until ? new Date(row.valid_until).getTime() : null;
    const expired =
      row.status === "expirada" ||
      row.status === "recusada" ||
      (validUntil !== null && validUntil <= now) ||
      !row.sent_at;
    return {
      found: true as const,
      sentAt: row.sent_at,
      validUntil: row.valid_until,
      version: row.version,
      expired,
      publicContent: row.public_content ?? null,
    };
  });

export const submitProposalResponse = createServerFn({ method: "POST" })
  .inputValidator((input) =>
    z.object({
      token: z.string().min(8).max(64),
      selectedPlan: z.string().max(120).optional().nullable(),
      comment: z.string().max(4000).optional().nullable(),
    }).parse(input),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );
    const { data: proposal, error: proposalError } = await supabaseAdmin
      .from("proposals")
      .select("id, sent_at, valid_until, status")
      .eq("public_token", data.token)
      .maybeSingle();
    if (proposalError || !proposal) return { ok: false as const };
    const validUntil = proposal.valid_until ? new Date(proposal.valid_until).getTime() : null;
    if (
      proposal.status === "expirada" ||
      proposal.status === "recusada" ||
      !proposal.sent_at ||
      (validUntil !== null && validUntil <= Date.now())
    ) return { ok: false as const };

    const { error } = await supabaseAdmin.from("proposal_responses").upsert(
      {
        proposal_id: proposal.id,
        selected_plan: data.selectedPlan?.trim() || null,
        comment: data.comment?.trim() || null,
      },
      { onConflict: "proposal_id" },
    );
    return { ok: !error } as const;
  });
