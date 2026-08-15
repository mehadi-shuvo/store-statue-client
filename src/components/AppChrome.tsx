"use client";

import Footer from "@/components/Footer";
import NavbarNew from "@/components/NavbarNew";
import { usePathname } from "next/navigation";

export default function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <NavbarNew />
      {children}
      <Footer />
    </>
  );
}
