export interface AuthUser {
  id: string;
  name?: string;
  email?: string;
  avatar?: string;
}

type AuthPayload = {
  token?: string;
  accessToken?: string;
  user?: AuthUser;
  data?: {
    token?: string;
    accessToken?: string;
    user?: AuthUser;
    data?: AuthUser;
  };
  message?: string;
};

export interface AuthSession {
  user: AuthUser | null;
  token: string | null;
}

export function extractAuthSession(payload: unknown): AuthSession {
  const response = payload as AuthPayload;

  const token =
    response?.token ??
    response?.accessToken ??
    response?.data?.token ??
    response?.data?.accessToken ??
    null;

  const user =
    response?.user ??
    response?.data?.user ??
    response?.data?.data ??
    null;

  if (user && typeof user.id === "string") {
    return {
      user,
      token: token && typeof token === "string" ? token : null,
    };
  }

  return {
    user: null,
    token: token && typeof token === "string" ? token : null,
  };
}

export function getAuthErrorMessage(payload: unknown, fallback: string) {
  if (payload && typeof payload === "object" && "message" in payload) {
    const message = (payload as { message?: unknown }).message;
    if (typeof message === "string" && message.trim()) {
      return message;
    }
  }

  return fallback;
}
