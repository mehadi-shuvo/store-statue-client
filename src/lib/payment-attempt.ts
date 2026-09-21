export type RememberedPaymentAttempt = { orderId: string; paymentId: string; paymentExpiresAt?: string; userId: string };
const KEY = "gameexpress.pending-payments.v1";

export function rememberPaymentAttempt(attempt: RememberedPaymentAttempt) {
  if (typeof window === "undefined") return;
  const current = readAll().filter(item => item.orderId !== attempt.orderId || item.userId !== attempt.userId);
  window.localStorage.setItem(KEY, JSON.stringify([...current, attempt].slice(-10)));
}
export function getPaymentAttempt(orderId: string, userId?: string): RememberedPaymentAttempt | null {
  return readAll().find(item => item.orderId === orderId && (!userId || item.userId === userId)) ?? null;
}
function readAll(): RememberedPaymentAttempt[] {
  if (typeof window === "undefined") return [];
  try { const value = JSON.parse(window.localStorage.getItem(KEY) ?? "[]"); return Array.isArray(value) ? value.filter(item => item && typeof item.orderId === "string" && typeof item.userId === "string") : []; } catch { return []; }
}
