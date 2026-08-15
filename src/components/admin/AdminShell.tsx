"use client";

import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { getAdminProfile, type AdminProfile } from "@/lib/admin";
import {
  Bell, ChevronDown, ChevronRight, CircleGauge, ClipboardList, CreditCard,
  FileClock, Gift, KeyRound, LayoutGrid, LogOut, Menu, Moon, PackageSearch,
  PanelLeftClose, PanelLeftOpen, Search, Shapes, ShieldCheck, Sun,
  TicketCheck, Truck, UserCog, Users, Warehouse, X, Zap,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { LoadingState } from "./AdminUi";

type NavItem = { href: string; label: string; icon: typeof CircleGauge; superOnly?: boolean };
const sections: Array<{ label: string; items: NavItem[] }> = [
  { label: "Workspace", items: [{ href: "/admin", label: "Overview", icon: CircleGauge }] },
  { label: "Catalog", items: [
    { href: "/admin/products", label: "All products", icon: LayoutGrid },
    { href: "/admin/gift-cards", label: "Gift cards", icon: Gift },
    { href: "/admin/products?type=GAME_TOP_UP", label: "Game top-ups", icon: Zap },
    { href: "/admin/products?type=SUBSCRIPTION", label: "Subscriptions", icon: TicketCheck },
    { href: "/admin/categories", label: "Categories", icon: Shapes },
    { href: "/admin/gift-card-inventory", label: "Gift-card inventory", icon: Warehouse },
    { href: "/admin/inventory", label: "All inventory", icon: Warehouse },
  ]},
  { label: "Commerce", items: [
    { href: "/admin/gift-card-orders", label: "Gift-card orders", icon: Gift },
    { href: "/admin/orders", label: "Orders", icon: ClipboardList },
    { href: "/admin/delivery", label: "Delivery queue", icon: Truck },
    { href: "/admin/payments", label: "Payments", icon: CreditCard },
  ]},
  { label: "People", items: [
    { href: "/admin/users", label: "Customers", icon: Users },
    { href: "/admin/admins", label: "Admin accounts", icon: ShieldCheck, superOnly: true },
  ]},
  { label: "Monitoring", items: [
    { href: "/admin/audit-logs", label: "Audit logs", icon: FileClock },
    { href: "/admin/logs", label: "Application logs", icon: PackageSearch },
  ]},
  { label: "Settings", items: [
    { href: "/admin/profile", label: "Profile", icon: UserCog },
    { href: "/admin/security", label: "Security", icon: KeyRound },
  ]},
];

export default function AdminShell({ children, superAdminOnly = false, allowedRoles }: { children: ReactNode; superAdminOnly?: boolean; allowedRoles?: Array<"ADMIN" | "SUPER_ADMIN"> }) {
  const router = useRouter();
  const pathname = usePathname();
  const toast = useToast();
  const { login, logout } = useAuth();
  const [admin, setAdmin] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [dark, setDark] = useState(false);
  const allowedRoleKey = allowedRoles?.join("|") ?? "";

  useEffect(() => {
    let active = true;
    getAdminProfile().then((profile) => {
      if (!active) return;
      const roleAllowed = !allowedRoleKey || allowedRoleKey.split("|").includes(profile.role);
      if ((superAdminOnly && profile.role !== "SUPER_ADMIN") || !roleAllowed) {
        router.replace("/admin/unauthorized");
        return;
      }
      setAdmin(profile); login(profile);
    }).catch(() => { if (active) router.replace("/admin/login"); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [allowedRoleKey, login, router, superAdminOnly]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); setPaletteOpen(true); }
      if (event.key === "Escape") { setPaletteOpen(false); setMobileOpen(false); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const available = useMemo(() => sections.flatMap(section => section.items).filter(item => (!item.superOnly || admin?.role === "SUPER_ADMIN") && item.label.toLowerCase().includes(query.toLowerCase())), [admin?.role, query]);
  const crumbs = pathname.split("/").filter(Boolean).slice(1);
  const handleLogout = async () => { await logout(); toast.success("Signed out"); router.replace("/admin/login"); router.refresh(); };

  if (loading) return <main className="admin-canvas min-h-screen p-5"><LoadingState label="Securing your workspace…" /></main>;
  if (!admin) return null;

  const Sidebar = () => <div className="flex h-full flex-col">
    <div className="flex h-20 items-center gap-3 border-b border-white/10 px-5">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-500 font-black text-white shadow-lg shadow-blue-500/30">O</div>
      {!collapsed && <div><p className="text-lg font-bold tracking-tight text-white">Ontor</p><p className="text-[11px] font-medium text-slate-400">Commerce operations</p></div>}
      <button className="ml-auto rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Close navigation"><X className="h-5 w-5" /></button>
    </div>
    <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Admin navigation">
      {sections.map(section => <div key={section.label} className="mb-5">
        {!collapsed && <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[.18em] text-slate-500">{section.label}</p>}
        <div className="space-y-1">{section.items.filter(item => !item.superOnly || admin.role === "SUPER_ADMIN").map(item => {
          const cleanHref = item.href.split("?")[0];
          const active = pathname === cleanHref || (cleanHref !== "/admin" && pathname.startsWith(`${cleanHref}/`));
          const Icon = item.icon;
          return <Link title={collapsed ? item.label : undefined} onClick={() => setMobileOpen(false)} key={item.href} href={item.href} className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${active ? "bg-blue-500 text-white shadow-md shadow-blue-950/30" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}><Icon className="h-[18px] w-[18px] shrink-0" />{!collapsed && <span>{item.label}</span>}{!collapsed && active && <ChevronRight className="ml-auto h-4 w-4" />}</Link>;
        })}</div>
      </div>)}
    </nav>
    <div className="border-t border-white/10 p-3">
      <div className={`flex items-center gap-3 rounded-xl bg-white/5 p-3 ${collapsed ? "justify-center" : ""}`}>
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 text-xs font-bold text-white">{(admin.name || admin.email || "AD").slice(0, 2).toUpperCase()}</div>
        {!collapsed && <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-white">{admin.name || "Admin"}</p><p className="truncate text-[11px] text-slate-400">{admin.role.replace("_", " ")}</p></div>}
        {!collapsed && <button onClick={handleLogout} className="rounded-lg p-2 text-slate-400 hover:bg-rose-500/10 hover:text-rose-300" aria-label="Sign out"><LogOut className="h-4 w-4" /></button>}
      </div>
    </div>
  </div>;

  return <main className={`admin-canvas min-h-screen ${dark ? "admin-dark" : ""}`}>
    <aside className={`fixed inset-y-0 left-0 z-50 hidden bg-[#101522] transition-[width] duration-200 lg:block ${collapsed ? "w-[76px]" : "w-[248px]"}`}><Sidebar /></aside>
    {mobileOpen && <><button aria-label="Close navigation overlay" className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden" onClick={() => setMobileOpen(false)} /><aside className="fixed inset-y-0 left-0 z-50 w-[280px] bg-[#101522] lg:hidden"><Sidebar /></aside></>}
    <div className={`min-h-screen transition-[padding] duration-200 ${collapsed ? "lg:pl-[76px]" : "lg:pl-[248px]"}`}>
      <header className="sticky top-0 z-30 flex h-20 items-center gap-3 border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-xl sm:px-7">
        <button onClick={() => setMobileOpen(true)} className="rounded-xl border border-slate-200 p-2.5 text-slate-600 lg:hidden" aria-label="Open navigation"><Menu className="h-5 w-5" /></button>
        <button onClick={() => setCollapsed(value => !value)} className="hidden rounded-xl p-2.5 text-slate-500 hover:bg-slate-100 lg:block" aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}>{collapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}</button>
        <button onClick={() => setPaletteOpen(true)} className="flex min-w-0 max-w-md flex-1 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-left text-sm text-slate-400 hover:border-slate-300"><Search className="h-4 w-4" /><span className="truncate">Search or jump to…</span><kbd className="ml-auto hidden rounded border bg-white px-1.5 py-0.5 text-[10px] text-slate-500 sm:block">⌘ K</kbd></button>
        <div className="ml-auto flex items-center gap-1">
          <button onClick={() => setDark(value => !value)} className="rounded-xl p-2.5 text-slate-500 hover:bg-slate-100" aria-label="Toggle color theme">{dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}</button>
          <button className="relative rounded-xl p-2.5 text-slate-500 hover:bg-slate-100" aria-label="Notifications"><Bell className="h-5 w-5" /><span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-500 ring-2 ring-white" /></button>
          <Link href="/admin/profile" className="ml-1 hidden items-center gap-2 rounded-xl p-1.5 hover:bg-slate-100 sm:flex"><div className="grid h-8 w-8 place-items-center rounded-full bg-slate-900 text-[11px] font-bold text-white">{(admin.name || "AD").slice(0,2).toUpperCase()}</div><ChevronDown className="h-4 w-4 text-slate-400" /></Link>
        </div>
      </header>
      <div className="px-4 py-6 sm:px-7 lg:px-9 lg:py-8">
        <div className="mb-5 flex items-center gap-2 text-xs font-medium text-slate-400"><Link href="/admin" className="hover:text-blue-600">Ontor</Link>{crumbs.map(crumb => <span key={crumb} className="flex items-center gap-2"><ChevronRight className="h-3 w-3" /><span className="capitalize text-slate-600">{crumb.replaceAll("-", " ")}</span></span>)}</div>
        {children}
      </div>
    </div>
    {paletteOpen && <div className="fixed inset-0 z-[100] flex items-start justify-center bg-slate-950/55 px-4 pt-[12vh] backdrop-blur-sm" onMouseDown={() => setPaletteOpen(false)}><div className="w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl" onMouseDown={event => event.stopPropagation()}><div className="flex items-center gap-3 border-b px-4"><Search className="h-5 w-5 text-slate-400" /><input autoFocus value={query} onChange={event => setQuery(event.target.value)} placeholder="Go to a page…" className="h-14 flex-1 bg-transparent text-sm outline-none" /><button onClick={() => setPaletteOpen(false)} className="text-xs text-slate-400">ESC</button></div><div className="max-h-80 overflow-y-auto p-2">{available.map(item => { const Icon = item.icon; return <Link key={item.href} href={item.href} onClick={() => setPaletteOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700"><Icon className="h-4 w-4" />{item.label}</Link>; })}{available.length === 0 && <p className="p-6 text-center text-sm text-slate-400">No destination found</p>}</div></div></div>}
  </main>;
}
