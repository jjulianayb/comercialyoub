// Server-only helpers for the proposal access gate.
// This file is server-only (.server.ts) and never reaches the client bundle.

// Configure PROPOSAL_PASSWORD in the deployment environment. Never commit it.
export const PROPOSAL_PASSWORD = (process.env.PROPOSAL_PASSWORD ?? "")
 .trim()
 .toLowerCase();

export const SESSION_CONFIG = {
 password: process.env.PROPOSAL_SESSION_SECRET ?? "",
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
 proposalToken?: string;
};
