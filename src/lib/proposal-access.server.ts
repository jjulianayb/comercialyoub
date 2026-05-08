// Server-only helpers for the proposal access gate.
// This file is server-only (`.server.ts`) and never reaches the client bundle.

export const PROPOSAL_PASSWORD = "gruposa123";

export const SESSION_CONFIG = {
  password:
    "youb-grupo-sa-2026-proposta-confidencial-secret-32chars-min!!",
  name: "youb_proposta_session",
  maxAge: 60 * 60 * 24 * 7, // 7 days
  cookie: {
    httpOnly: true,
    secure: true,
    sameSite: "lax" as const,
    path: "/",
  },
};

export type ProposalSession = {
  unlocked?: boolean;
  unlockedAt?: number;
};
