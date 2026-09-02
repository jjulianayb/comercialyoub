import { describe, expect, it } from "vitest";
import {
  allowedLeadOrigins,
  isAllowedLeadOrigin,
  normalizeEmail,
  publicLeadSchema,
} from "@/lib/public-leads";

const validLead = {
  name: "Juliana Camargo",
  email: "Juliana@Empresa.com.br",
  company: "Empresa Exemplo",
  role: "Diretora de Pessoas",
  interest: "Plataforma" as const,
  message: "Quero entender a implantação.",
  commercialContactOptIn: true as const,
  newsletterOptIn: true,
  consentVersion: "2026-09-02",
  landingPath: "/plataforma",
  utmSource: "linkedin",
  utmMedium: "social",
  utmCampaign: "plataforma-youb",
  website: "",
};

describe("public lead contract", () => {
  it("accepts the strict public payload and normalizes the email", () => {
    const result = publicLeadSchema.parse(validLead);
    expect(result.email).toBe("Juliana@Empresa.com.br");
    expect(normalizeEmail(result.email)).toBe("juliana@empresa.com.br");
  });

  it("requires separate commercial contact consent", () => {
    const result = publicLeadSchema.safeParse({ ...validLead, commercialContactOptIn: false });
    expect(result.success).toBe(false);
  });

  it("allows newsletter consent to be false without removing contact consent", () => {
    const result = publicLeadSchema.parse({ ...validLead, newsletterOptIn: false });
    expect(result.commercialContactOptIn).toBe(true);
    expect(result.newsletterOptIn).toBe(false);
  });

  it("rejects browser-controlled CRM fields", () => {
    const result = publicLeadSchema.safeParse({ ...validLead, owner_id: "attacker", stage: "ganha", source: "CRM", estimated_value: 999999 });
    expect(result.success).toBe(false);
  });

  it("rejects invalid landing paths and unknown interests", () => {
    expect(publicLeadSchema.safeParse({ ...validLead, landingPath: "https://evil.example" }).success).toBe(false);
    expect(publicLeadSchema.safeParse({ ...validLead, interest: "Admin" }).success).toBe(false);
  });

  it("keeps CORS restricted to the configured origins", () => {
    const allowed = allowedLeadOrigins(undefined);
    expect(isAllowedLeadOrigin("https://rhyoub.com.br", allowed)).toBe(true);
    expect(isAllowedLeadOrigin("https://evil.example", allowed)).toBe(false);
    expect(isAllowedLeadOrigin(null, allowed)).toBe(false);
  });
});
