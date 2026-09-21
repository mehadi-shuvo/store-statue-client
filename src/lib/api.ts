import type { ApiFailure, ApiFieldError, ApiSuccess } from "@/types/api";

const configuredApiUrl =
  process.env.NEXT_PUBLIC_API_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export const UNAUTHORIZED_EVENT = "ontor:api-unauthorized";

function normalizeApiBaseUrl(value: string): string {
  const trimmed = value.trim().replace(/\/+$/, "");
  if (!trimmed) return "";

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    throw new Error(
      "NEXT_PUBLIC_API_URL must be an absolute http(s) URL, for example http://localhost:5000/api/v1.",
    );
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("NEXT_PUBLIC_API_URL must use http or https.");
  }

  const pathname = url.pathname.replace(/\/+$/, "");
  if (pathname.endsWith("/api/v1")) {
    url.pathname = pathname;
  } else if (pathname.endsWith("/api")) {
    url.pathname = `${pathname}/v1`;
  } else {
    url.pathname = `${pathname}/api/v1`.replace(/\/+/g, "/");
  }

  url.search = "";
  url.hash = "";
  return url.toString().replace(/\/$/, "");
}

export const API_BASE_URL = normalizeApiBaseUrl(configuredApiUrl);

export function apiUrl(path: string): string {
  if (!API_BASE_URL) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is not configured. Set it to the backend /api/v1 URL.",
    );
  }

  let normalizedPath = path.trim();
  if (/^https?:\/\//i.test(normalizedPath)) {
    throw new Error("API request paths must be relative to NEXT_PUBLIC_API_URL.");
  }

  normalizedPath = `/${normalizedPath.replace(/^\/+/, "")}`;
  normalizedPath = normalizedPath.replace(/^\/api\/v1(?=\/|$)/, "");
  normalizedPath = normalizedPath.replace(/^\/api(?=\/|$)/, "");
  return `${API_BASE_URL}${normalizedPath || ""}`;
}

export class ApiError extends Error {
  readonly status: number;
  readonly statusCode: number;
  readonly details: ApiFieldError[];
  readonly retryAfterSeconds: number | null;
  readonly code: string | null;
  readonly payload: unknown;

  constructor(options: {
    message: string;
    status: number;
    details?: ApiFieldError[];
    retryAfterSeconds?: number | null;
    code?: string | null;
    payload?: unknown;
    cause?: unknown;
  }) {
    super(options.message, { cause: options.cause });
    this.name = "ApiError";
    this.status = options.status;
    this.statusCode = options.status;
    this.details = options.details ?? [];
    this.retryAfterSeconds = options.retryAfterSeconds ?? null;
    this.code = options.code ?? null;
    this.payload = options.payload;
  }

  get isUnauthorized() { return this.status === 401; }
  get isForbidden() { return this.status === 403; }
  get isRateLimited() { return this.status === 429; }
  get isRetryable() { return this.status === 408 || this.status === 429 || this.status >= 500; }
}

type MessagePayload = {
  message?: unknown;
  error?: unknown;
  data?: unknown;
  details?: unknown;
};

function normalizeMessage(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) return value;
  if (Array.isArray(value)) {
    const message = value.map(normalizeMessage).filter(Boolean).join(", ");
    return message || null;
  }
  if (value && typeof value === "object") {
    const payload = value as MessagePayload;
    const messages = [
      normalizeMessage(payload.message),
      normalizeMessage(payload.error),
      normalizeMessage(payload.details),
    ].filter((message): message is string => Boolean(message));
    return [...new Set(messages)].join(", ") || null;
  }
  return null;
}

function fieldErrors(payload: unknown): ApiFieldError[] {
  const details = (payload as Partial<ApiFailure> | null)?.details;
  if (!Array.isArray(details)) return [];
  return details.filter(
    (item): item is ApiFieldError =>
      Boolean(item) && typeof item.field === "string" && typeof item.message === "string",
  );
}

export function getApiErrorMessage(payload: unknown, fallback: string): string {
  if (payload instanceof Error && payload.message) return payload.message;
  return normalizeMessage(payload) ?? fallback;
}

export async function readApiJson(response: Response): Promise<unknown> {
  if (response.status === 204) return null;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    const text = await response.text();
    return text || null;
  }
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export interface ApiRequestOptions
  extends Omit<RequestInit, "body" | "credentials" | "headers"> {
  body?: BodyInit | object | null;
  headers?: HeadersInit;
  bearerToken?: string;
  handleUnauthorized?: boolean;
}

function notifyUnauthorized(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(UNAUTHORIZED_EVENT));
  }
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<ApiSuccess<T>> {
  const {
    body,
    bearerToken,
    handleUnauthorized = true,
    headers: providedHeaders,
    ...requestInit
  } = options;
  const headers = new Headers(providedHeaders);
  headers.set("Accept", "application/json");
  if (bearerToken) headers.set("Authorization", `Bearer ${bearerToken}`);

  let requestBody: BodyInit | null | undefined = body as BodyInit | null | undefined;
  const isNativeBody =
    body == null ||
    typeof body === "string" ||
    body instanceof FormData ||
    body instanceof URLSearchParams ||
    body instanceof Blob ||
    body instanceof ArrayBuffer;

  if (!isNativeBody) {
    headers.set("Content-Type", "application/json");
    requestBody = JSON.stringify(body);
  } else if (body instanceof FormData) {
    headers.delete("Content-Type");
  }

  let response: Response;
  try {
    response = await fetch(apiUrl(path), {
      ...requestInit,
      body: requestBody,
      credentials: "include",
      headers,
    });
  } catch (cause) {
    throw new ApiError({
      status: 0,
      message: "Unable to reach the API. Check your connection and try again.",
      cause,
    });
  }

  const payload = await readApiJson(response);
  if (!response.ok) {
    if (response.status === 401 && handleUnauthorized) notifyUnauthorized();
    const retryAfter = response.headers.get("retry-after");
    const parsedRetryAfter = retryAfter ? Number(retryAfter) : Number.NaN;
    throw new ApiError({
      status: response.status,
      message: getApiErrorMessage(payload, `Request failed with status ${response.status}.`),
      details: fieldErrors(payload),
      retryAfterSeconds: Number.isFinite(parsedRetryAfter) ? parsedRetryAfter : null,
      code:
        payload && typeof payload === "object" && typeof (payload as { code?: unknown }).code === "string"
          ? (payload as { code: string }).code
          : null,
      payload,
    });
  }

  return payload as ApiSuccess<T>;
}

export async function apiData<T>(
  path: string,
  options?: ApiRequestOptions,
): Promise<T> {
  const response = await apiRequest<T>(path, options);
  return response.data;
}

// Compatibility helper retained for existing pages while they migrate to apiRequest/apiData.
export async function fetchApiJson<TPayload = unknown>(
  input: RequestInfo | URL,
  init: RequestInit | undefined,
  fallbackErrorMessage: string,
): Promise<TPayload> {
  let response: Response;
  try {
    response = await fetch(input, { credentials: "include", ...init });
  } catch (cause) {
    throw new ApiError({ status: 0, message: fallbackErrorMessage, cause });
  }
  const payload = await readApiJson(response);
  if (!response.ok) {
    if (response.status === 401) notifyUnauthorized();
    throw new ApiError({
      status: response.status,
      message: getApiErrorMessage(payload, fallbackErrorMessage),
      details: fieldErrors(payload),
      payload,
    });
  }
  return payload as TPayload;
}

export function queryString(
  values?: object,
): string {
  const params = new URLSearchParams();
  Object.entries(values ?? {}).forEach(([key, value]: [string, unknown]) => {
    if (value !== undefined && value !== null && value !== "") {
      if (["string", "number", "boolean"].includes(typeof value)) {
        params.set(key, String(value));
      }
    }
  });
  const serialized = params.toString();
  return serialized ? `?${serialized}` : "";
}
