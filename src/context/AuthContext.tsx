"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { AuthUser } from "@/lib/auth";

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (userData: AuthUser, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userInfo = Cookies.get("userInfo");
    const storedToken = Cookies.get("token") || null;

    if (userInfo) {
      try {
        setUser(JSON.parse(userInfo));
      } catch {
        setUser(null);
      }
    }

    setToken(storedToken);
    setLoading(false);
  }, []);

  const login = (userData: AuthUser, token: string) => {
    Cookies.set("token", token, { sameSite: "lax" });
    Cookies.set("userInfo", JSON.stringify(userData));

    setUser(userData);
    setToken(token);
  };

  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("userInfo");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
