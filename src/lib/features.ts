/**
 * Feature flags for Spesti.
 * Env-based flags using NEXT_PUBLIC_ prefix so they're available client-side.
 * Values are inlined at build time by Next.js — changes require rebuild.
 */

/**
 * Returns true when Pro features (PDF export, etc.) are enabled.
 * Set NEXT_PUBLIC_ENABLE_PRO=true in .env.local or Vercel to activate.
 */
export function isProEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_PRO === "true";
}
