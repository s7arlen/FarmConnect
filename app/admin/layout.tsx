"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  ShoppingBag,
  ClipboardList,
  ShieldCheck,
  AlertCircle,
  Settings,
  LogOut,
  X,
  Leaf,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import MobileBottomNav, { type MobileNavItem } from "@/components/app/MobileBottomNav";
import MobileHeader from "@/components/app/MobileHeader";

const SIDEBAR_LINKS = [
  { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/farmer-verification", label: "Farmer Verification", icon: ShieldCheck },
  { href: "/admin/users", label: "All Users", icon: Users },
  { href: "/admin/farmers", label: "Farmers Directory", icon: UserCheck },
  { href: "/admin/buyers", label: "Buyers Directory", icon: Users },
  { href: "/admin/products", label: "Produce Moderation", icon: ShoppingBag },
  { href: "/admin/orders", label: "All Orders", icon: ClipboardList },
  { href: "/admin/reports", label: "Reports & Disputes", icon: AlertCircle },
  { href: "/admin/settings", label: "System Settings", icon: Settings },
];

const MOBILE_NAV: MobileNavItem[] = [
  { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/farmer-verification", label: "Verify", icon: ShieldCheck },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/products", label: "Products", icon: ShoppingBag },
  { href: "/admin/orders", label: "Orders", icon: ClipboardList },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    logout();
    toast.success("Signed out");
    router.push("/");
  }

  // Derive contextual header title
  const activeLink = SIDEBAR_LINKS.find((l) =>
    pathname === l.href || pathname.startsWith(l.href + "/")
  );
  const headerTitle = activeLink?.label || "Admin Console";

  return (
    <div className="min-h-screen flex bg-brand-cream">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-brand-border flex-shrink-0">
        <div className="p-5 border-b border-brand-border">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-dark rounded-lg flex items-center justify-center shadow-sm">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-base text-brand-text">FarmConnect</span>
          </Link>
          <div className="flex items-center gap-1.5 mt-1.5">
            <Shield className="w-3.5 h-3.5 text-brand-error" />
            <span className="text-xs text-brand-error font-bold uppercase tracking-wider">
              Admin Console
            </span>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {SIDEBAR_LINKS.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  active
                    ? "bg-brand-dark text-white font-semibold"
                    : "text-brand-muted hover:bg-brand-light/60 hover:text-brand-text"
                )}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-brand-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-brand-muted hover:bg-red-50 hover:text-brand-error w-full transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white flex flex-col shadow-2xl animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between p-5 border-b border-brand-border">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-brand-dark rounded-lg flex items-center justify-center">
                  <Leaf className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="font-bold text-brand-text">Admin Menu</span>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="p-1 rounded-lg hover:bg-brand-light">
                <X className="w-5 h-5 text-brand-muted" />
              </button>
            </div>
            <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
              {SIDEBAR_LINKS.map((link) => {
                const Icon = link.icon;
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium",
                      active ? "bg-brand-dark text-white font-semibold" : "text-brand-muted hover:bg-brand-light/60"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
            <div className="p-3 border-t border-brand-border">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-brand-muted hover:bg-red-50 hover:text-brand-error w-full"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <MobileHeader
          title={headerTitle}
          onMenuClick={() => setSidebarOpen(true)}
          rightAction={
            <span className="px-2 py-0.5 rounded bg-brand-error/10 text-brand-error text-[10px] font-bold uppercase tracking-wider">
              Admin
            </span>
          }
        />

        <main className="flex-1 overflow-auto bg-brand-cream">{children}</main>
      </div>

      {/* App-Like Mobile Bottom Navigation Bar */}
      <MobileBottomNav items={MOBILE_NAV} />
    </div>
  );
}
