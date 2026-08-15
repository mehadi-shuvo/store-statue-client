"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ApiLoading } from "@/components/ApiState";
import type { UserRole } from "@/types/api";
import { ShieldX } from "lucide-react";

export function RouteGuard({ children, roles }: { children: ReactNode; roles?: UserRole[] }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      const login = pathname.startsWith("/admin") ? "/admin/login" : "/login";
      router.replace(`${login}?next=${encodeURIComponent(pathname)}`);
    }
  }, [loading, pathname, router, user]);

  if (loading || !user) return <ApiLoading label="Restoring your session…" />;
  if (roles && !roles.includes(user.role)) {
    return <div className="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-center text-rose-950"><ShieldX className="mx-auto h-10 w-10" /><h1 className="mt-3 text-xl font-black">Permission denied</h1><p className="mt-2 text-sm">Your account role cannot access this page.</p></div>;
  }
  return <>{children}</>;
}
