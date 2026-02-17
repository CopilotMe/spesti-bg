const REF_PARAM = "ref";
const REF_VALUE = "spesti";

/**
 * Append referral & UTM tracking params to a provider URL.
 * When an affiliate deal is signed, replace the provider URL in data files
 * with the affiliate tracking link — this function adds attribution on top.
 */
export function refUrl(url: string, campaign?: string): string {
  if (!url) return url;
  try {
    const u = new URL(url);
    u.searchParams.set(REF_PARAM, REF_VALUE);
    u.searchParams.set("utm_source", "spesti");
    u.searchParams.set("utm_medium", "calculator");
    if (campaign) {
      u.searchParams.set("utm_campaign", campaign);
    }
    return u.toString();
  } catch {
    return url;
  }
}
