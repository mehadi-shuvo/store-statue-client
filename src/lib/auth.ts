import { apiUrl, fetchApiJson, getApiErrorMessage } from "./api";

export interface AuthUser {
  id: string;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  role?: string;
  avatar?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

type UserResponsePayload = {
  data?: AuthUser | { user?: AuthUser };
  user?: AuthUser;
};

function extractUser(payload: unknown): AuthUser | null {
  const response = payload as UserResponsePayload;
  const user =
    response?.user ??
    (response?.data && "user" in response.data ? response.data.user : null) ??
    (response?.data && "id" in response.data ? response.data : null);

  return user && typeof user.id === "string" ? user : null;
}

export async function loginCustomer(payload: {
  email: string;
  password: string;
}) {
  const response = await fetchApiJson(
    apiUrl("/api/user/login"),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
    "Login failed",
  );

  const user = extractUser(response);
  if (!user) {
    throw new Error("Login succeeded but user data was missing.");
  }

  return user;
}

export async function registerCustomer(payload: {
  email: string;
  name: string;
  phone?: string;
  password: string;
}) {
  const response = await fetchApiJson(
    apiUrl("/api/user/register"),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
    "Signup failed",
  );

  const user = extractUser(response);
  if (!user) {
    throw new Error("Signup succeeded but user data was missing.");
  }

  return user;
}

export async function getCustomerProfile() {
  const response = await fetchApiJson(
    apiUrl("/api/user/profile"),
    undefined,
    "Could not load your profile.",
  );

  const user = extractUser(response);
  if (!user) {
    throw new Error("Profile data was missing.");
  }

  return user;
}

export async function updateCustomerProfile(payload: {
  name?: string;
  phone?: string | null;
}) {
  const response = await fetchApiJson(
    apiUrl("/api/user/profile"),
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
    "Could not update your profile.",
  );

  const user = extractUser(response);
  if (!user) {
    throw new Error("Updated profile data was missing.");
  }

  return user;
}

export async function deleteCustomerProfile(password: string) {
  await fetchApiJson(
    apiUrl("/api/user/profile"),
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    },
    "Could not delete your account.",
  );
}

export async function logoutCustomer() {
  await fetchApiJson(
    apiUrl("/api/user/logout"),
    {
      method: "POST",
    },
    "Logout failed",
  );
}

export function getAuthErrorMessage(payload: unknown, fallback: string) {
  return getApiErrorMessage(payload, fallback);
}
