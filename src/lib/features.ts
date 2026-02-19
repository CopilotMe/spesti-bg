/**
 * Feature flags for Spesti.
 *
 * Pro status is stored in localStorage after a successful Revolut payment.
 * The /pro/success page writes the key; this helper reads it.
 *
 * Env-based override: set NEXT_PUBLIC_ENABLE_PRO=true to force Pro on
 * (useful for development / Vercel preview).
 */

const PRO_STORAGE_KEY = "spesti_pro";

/**
 * Returns true when Pro features (PDF export, etc.) are enabled.
 *
 * Checks (in order):
 * 1. NEXT_PUBLIC_ENABLE_PRO env variable (build-time override)
 * 2. localStorage "spesti_pro" key (set after Revolut payment)
 */
export function isProEnabled(): boolean {
  // Build-time override (dev / Vercel)
  if (process.env.NEXT_PUBLIC_ENABLE_PRO === "true") return true;

  // Client-side localStorage check
  if (typeof window !== "undefined") {
    try {
      return localStorage.getItem(PRO_STORAGE_KEY) === "true";
    } catch {
      return false;
    }
  }

  return false;
}

/** Activate Pro (called from /pro/success page) */
export function activatePro(): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(PRO_STORAGE_KEY, "true");
    } catch {
      // Storage full or blocked — silently fail
    }
  }
}

/** Check if Pro is active (same as isProEnabled but explicit name) */
export function isProActive(): boolean {
  return isProEnabled();
}

/** Revolut payment link for Pro activation */
export const PRO_PAYMENT_URL = "https://revolut.me/shteryxjnu";
export const PRO_PRICE = "0.99 €";
