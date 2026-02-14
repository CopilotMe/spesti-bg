const REF_PARAM = "ref";
const REF_VALUE = "spesti";

export function refUrl(url: string): string {
  if (!url) return url;
  try {
    const u = new URL(url);
    u.searchParams.set(REF_PARAM, REF_VALUE);
    return u.toString();
  } catch {
    return url;
  }
}
