import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import {
  allowedLeadOrigins,
  hashInput,
  isAllowedLeadOrigin,
  normalizeEmail,
  publicLeadCorsHeaders,
  publicLeadSchema,
} from "@/lib/public-leads";

const MAX_BODY_BYTES = 16 * 1024;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS_PER_IP = 5;
const MAX_REQUESTS_PER_EMAIL = 3;
const inMemoryRateLimit = new Map<string, number[]>();

type LeadRpcClient = {
  rpc: (name: string, args: Record<string, unknown>) => Promise<{
    data: unknown;
    error: { message: string; code?: string } | null;
  }>;
};

const response = (body: Record<string, unknown>, status: number, origin?: string | null) => {
  const headers = new Headers({ "Content-Type": "application/json", "Cache-Control": "no-store" });
  if (origin) Object.entries(publicLeadCorsHeaders(origin)).forEach(([key, value]) => headers.set(key, value));
  return new Response(JSON.stringify(body), { status, headers });
};

const genericError = (status = 400, origin?: string | null) =>
  response(
    {
      ok: false,
      code: status === 429 ? "RATE_LIMITED" : "INVALID_INPUT",
      message: status === 429 ? "Tente novamente mais tarde." : "Confira os campos obrigatórios.",
    },
    status,
    origin,
  );

const clientIp = (request: Request) =>
  request.headers.get("cf-connecting-ip") ??
  request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
  "unknown";

const withinRateLimit = (key: string, max: number) => {
  const now = Date.now();
  const recent = (inMemoryRateLimit.get(key) ?? []).filter((time) => now - time < RATE_LIMIT_WINDOW_MS);
  if (recent.length >= max) return false;
  recent.push(now);
  inMemoryRateLimit.set(key, recent);
  return true;
};

export const Route = createFileRoute("/api/public/leads")({
  server: {
    handlers: {
      OPTIONS: async ({ request }) => {
        const origin = request.headers.get("Origin");
        if (!isAllowedLeadOrigin(origin, allowedLeadOrigins(process.env.PUBLIC_LEAD_ALLOWED_ORIGINS))) {
          return new Response(null, { status: 403 });
        }
        return new Response(null, { status: 204, headers: publicLeadCorsHeaders(origin!) });
      },
      POST: async ({ request }) => {
        const origin = request.headers.get("Origin");
        if (!isAllowedLeadOrigin(origin, allowedLeadOrigins(process.env.PUBLIC_LEAD_ALLOWED_ORIGINS))) {
          return genericError(403);
        }

        const contentLength = Number(request.headers.get("Content-Length") ?? 0);
        if (contentLength > MAX_BODY_BYTES) return genericError(413, origin);
        const rawBody = await request.arrayBuffer();
        if (rawBody.byteLength > MAX_BODY_BYTES) return genericError(413, origin);

        let body: unknown;
        try {
          body = JSON.parse(new TextDecoder().decode(rawBody));
        } catch {
          return genericError(400, origin);
        }

        const parsed = publicLeadSchema.safeParse(body);
        if (!parsed.success) return genericError(400, origin);
        if (parsed.data.website.trim()) return response({ ok: true, message: "Recebemos seu pedido." }, 202, origin);

        const email = normalizeEmail(parsed.data.email);
        const ip = clientIp(request);
        const salt = process.env.CRM_PUBLIC_LEAD_HASH_SALT;
        const ownerId = process.env.CRM_PUBLIC_LEAD_OWNER_ID;
        if (!salt || !ownerId) {
          console.error("[public-leads] required server configuration is missing");
          return response({ ok: false, message: "Não foi possível concluir agora." }, 500, origin);
        }

        const ipHash = await hashInput(`${salt}:ip:${ip}`);
        const emailHash = await hashInput(`${salt}:email:${email}`);
        const requestBucket = Math.floor(Date.now() / 60000);
        const requestHash = await hashInput(`${salt}:request:${ipHash}:${emailHash}:${requestBucket}`);
        if (!withinRateLimit(`ip:${ipHash}`, MAX_REQUESTS_PER_IP) || !withinRateLimit(`email:${emailHash}`, MAX_REQUESTS_PER_EMAIL)) {
          return genericError(429, origin);
        }

        const admin = supabaseAdmin as unknown as LeadRpcClient;
        const { error } = await admin.rpc("create_public_lead", {
          p_payload: { ...parsed.data, email, source: "Site" },
          p_owner_id: ownerId,
          p_ip_hash: ipHash,
          p_email_hash: emailHash,
          p_request_hash: requestHash,
          p_origin: origin,
        });

        if (error) {
          if (error.message.includes("RATE_LIMITED")) return genericError(429, origin);
          console.error("[public-leads] persistence failed", { code: error.code ?? "unknown" });
          return response({ ok: false, message: "Não foi possível concluir agora." }, 500, origin);
        }

        return response({ ok: true, message: "Recebemos seu pedido. Nossa equipe entrará em contato." }, 201, origin);
      },
    },
  },
});
