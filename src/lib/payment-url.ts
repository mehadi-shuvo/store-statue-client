export function validatePaymentUrl(value: unknown): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error("The server did not return a payment URL.");
  }
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error("The server returned an invalid payment URL.");
  }
  const localDevelopmentUrl = process.env.NODE_ENV !== "production"
    && url.protocol === "http:"
    && ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
  if ((url.protocol !== "https:" && !localDevelopmentUrl) || url.username || url.password) {
    throw new Error("The server returned an insecure payment URL.");
  }
  return url.toString();
}
