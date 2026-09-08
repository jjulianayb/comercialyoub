import { z } from "zod";

export const PUBLIC_LEAD_INTERESTS = [
  "Plataforma",
  "Consultoria",
  "Liderança",
  "Sucessão",
  "Educação corporativa",
] as const;

export const publicLeadSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  company: z.string().trim().min(2).max(160),
  role: z.string().trim().min(2).max(120),
  interest: z.enum(PUBLIC_LEAD_INTERESTS),
  message: z.string().trim().max(500).optional().default(""),
  commercialContactOptIn: z.literal(true),
  newsletterOptIn: z.boolean().default(false),
  consentVersion: z.string().trim().min(1).max(40),
  landingPath: z.string().trim().regex(/^\/[a-z0-9\-\/_]*$/i).max(200).default("/"),
  utmSource: z.string().trim().max(150).default(""),
  utmMedium: z.string().trim().max(150).default(""),
  utmCampaign: z.string().trim().max(150).default(""),
  website: z.string().max(200).default(""),
}).strict();

export type PublicLeadInput = z.infer<typeof publicLeadSchema>;

export const normalizeEmail = (value: string) => value.trim().toLowerCase();

export const hashInput = async (value: string) => {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
};

export const allowedLeadOrigins = (configured: string | undefined) => {
  const defaults = [
    "https://rhyoub.com.br",
    "https://www.rhyoub.com.br",
    "https://itsyoub.netlify.app",
  ];
  return new Set(
    (configured ?? defaults.join(","))
      .split(",")
      .map((origin) => origin.trim().replace(/\/$/, ""))
      .filter(Boolean),
  );
};

export const isAllowedLeadOrigin = (origin: string | null, allowed: Set<string>) =>
  Boolean(origin && allowed.has(origin.replace(/\/$/, "")));

export const publicLeadCorsHeaders = (origin: string) => ({
  "Access-Control-Allow-Origin": origin,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "600",
  "Vary": "Origin",
});
