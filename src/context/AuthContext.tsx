"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

interface User {
  id: string;
  name?: string;
  email?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userInfo = Cookies.get("userInfo");

    if (userInfo) {
      try {
        setUser(JSON.parse(userInfo));
      } catch {
        setUser(null);
      }
    }

    setLoading(false);
  }, []);

  const login = (userData: User, token: string) => {
    Cookies.set("token", token);
    Cookies.set("userInfo", JSON.stringify(userData));

    setUser(userData);
  };

  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("userInfo");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
