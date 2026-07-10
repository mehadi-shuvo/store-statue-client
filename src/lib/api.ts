export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(
  /\/$/,
  "",
);

type ApiMessagePayload = {
  message?: unknown;
  error?: unknown;
  data?: unknown;
  details?: unknown;
};

export function apiUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured.");
  }

  return `${API_BASE_URL}${normalizedPath}`;
}

function normalizeMessage(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) {
    return value;
  }

  if (Array.isArray(value)) {
    const message = value
      .map((item) => normalizeMessage(item))
      .filter(Boolean)
      .join(", ");

    return message || null;
  }

  if (value && typeof value === "object") {
    const payload = value as ApiMessagePayload;
    const messages = [
      normalizeMessage(payload.message),
      normalizeMessage(payload.error),
      normalizeMessage(payload.details),
      normalizeMessage(payload.data),
    ].filter((message): message is string => Boolean(message));

    return Array.from(new Set(messages)).join(", ") || null;
  }

  return null;
}

export function getApiErrorMessage(payload: unknown, fallback: string) {
  return normalizeMessage(payload) ?? fallback;
}

export async function readApiJson(response: Response) {
  try {
    return (await response.json()) as unknown;
  } catch {
    return null;
  }
}

export async function fetchApiJson<TPayload = unknown>(
  input: RequestInfo | URL,
  init: RequestInit | undefined,
  fallbackErrorMessage: string,
) {
  const response = await fetch(input, {
    credentials: "include",
    ...init,
  });
  const payload = await readApiJson(response);

  if (!response.ok) {
    throw new Error(getApiErrorMessage(payload, fallbackErrorMessage));
  }

  return payload as TPayload;
}
