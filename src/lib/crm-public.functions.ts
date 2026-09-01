import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/**
 * Metadados públicos de uma proposta (acesso do cliente pelo link).
 * Retorna SOMENTE o necessário para a página pública: nunca valores internos,
 * responsáveis, notas, follow-ups ou histórico.
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
      .select("sent_at, valid_until, version, status")
      .eq("public_token", data.token)
      .maybeSingle();

    if (error || !row) {
      return { found: false as const };
    }

    const now = Date.now();
    const validUntil = row.valid_until ? new Date(row.valid_until).getTime() : null;
    const expired =
      row.status === "expirada" ||
      row.status === "recusada" ||
      (validUntil !== null && validUntil < now) ||
      !row.sent_at;

    return {
      found: true as const,
      sentAt: row.sent_at,
      validUntil: row.valid_until,
      version: row.version,
      expired,
    };
  });
