const FALLBACK_RETURN_PATH = "/";

/**
 * Accepts only paths that resolve inside this application. The explicit checks
 * also reject protocol-relative URLs and browser-normalized backslash variants.
 */
export function getSafeReturnPath(
  candidate: string | null | undefined,
  fallback = FALLBACK_RETURN_PATH,
): string {
  if (!candidate) return fallback;

  const value = candidate.trim();
  if (
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("\\") ||
    /[\u0000-\u001F\u007F]/.test(value)
  ) {
    return fallback;
  }

  try {
    const base = new URL("https://return-path.invalid");
    const resolved = new URL(value, base);
    if (resolved.origin !== base.origin) return fallback;
    return `${resolved.pathname}${resolved.search}${resolved.hash}`;
  } catch {
    return fallback;
  }
}

export function withReturnTo(path: string, returnTo: string): string {
  const safeReturnTo = getSafeReturnPath(returnTo);
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}returnTo=${encodeURIComponent(safeReturnTo)}`;
}
