import { getApiErrorMessage } from "@/lib/api";

// Compatibility name for payment UI code. All requests use the central fetch client.
export function getHttpErrorMessage(error: unknown, fallback: string) {
  return getApiErrorMessage(error, fallback);
}
