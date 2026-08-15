"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { AuthUser, getSessionProfile, logoutCustomer } from "@/lib/auth";
import { UNAUTHORIZED_EVENT } from "@/lib/api";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { sensitiveGiftCardKey } from "@/hooks/api/query-keys";

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (userData: AuthUser) => void;
  logout: () => Promise<void>;
  clearAuth: () => void;
  refreshProfile: () => Promise<AuthUser | null>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    getSessionProfile()
      .then((profile) => {
        if (active) {
          setUser(profile);
        }
      })
      .catch(() => {
        if (active) {
          setUser(null);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const login = useCallback((userData: AuthUser) => {
    setUser(userData);
  }, []);

  const clearAuth = useCallback(() => {
    setUser(null);
    queryClient.removeQueries({ queryKey: sensitiveGiftCardKey });
  }, [queryClient]);

  useEffect(() => {
    const handleUnauthorized = () => {
      clearAuth();
      const loginPath = pathname.startsWith("/admin") ? "/admin/login" : "/login";
      router.replace(`${loginPath}?reason=session-expired`);
    };
    window.addEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
  }, [clearAuth, pathname, router]);

  const refreshProfile = useCallback(async () => {
    try {
      const profile = await getSessionProfile();
      setUser(profile);
      return profile;
    } catch {
      setUser(null);
      return null;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutCustomer();
    } catch {
      // Treat logout errors as already signed out from the client's point of view.
    } finally {
      clearAuth();
    }
  }, [clearAuth]);

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, clearAuth, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
