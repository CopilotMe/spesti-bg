/**
 * Feature flags for Spesti.
 *
 * Pro status is stored in localStorage as an HMAC-signed token
 * issued by the /api/pro/activate endpoint after a valid activation code.
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
 * 2. localStorage signed token or legacy "true" value
 */
export function isProEnabled(): boolean {
  // Build-time override (dev / Vercel preview)
  if (process.env.NEXT_PUBLIC_ENABLE_PRO === "true") return true;

  // Client-side localStorage check
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(PRO_STORAGE_KEY);
      if (!stored) return false;

      // Legacy support: plain "true" still works during transition
      if (stored === "true") return true;

      // New format: base64-encoded JSON { t: number, s: string }
      const parsed = JSON.parse(atob(stored));
      return typeof parsed.t === "number" && typeof parsed.s === "string";
    } catch {
      return false;
    }
  }

  return false;
}

/** Activate Pro by storing a signed token (or legacy "true") */
export function activatePro(token?: string): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(PRO_STORAGE_KEY, token || "true");
    } catch {
      // Storage full or blocked — silently fail
    }
  }
}

/**
 * Activate Pro with an activation code.
 * Calls the server API to validate the code and stores the signed token.
 */
export async function activateProWithCode(
  code: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch("/api/pro/activate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });

    if (!res.ok) {
      const data = await res.json();
      return {
        success: false,
        error: data.error || "Невалиден код",
      };
    }

    const { token } = await res.json();
    activatePro(token);
    return { success: true };
  } catch {
    return { success: false, error: "Грешка в мрежата. Опитай отново." };
  }
}

/** Check if Pro is active (same as isProEnabled but explicit name) */
export function isProActive(): boolean {
  return isProEnabled();
}

/** Revolut payment link for Pro activation */
export const PRO_PAYMENT_URL = "https://revolut.me/shteryxjnu";
export const PRO_PRICE = "0.99 \u20ac";
