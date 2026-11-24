"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Plus,
  TrendingUp,
  ClipboardList,
  User,
  LogOut,
  X,
  Leaf,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { toast } from "sonner";
import MobileBottomNav, { type MobileNavItem } from "@/components/app/MobileBottomNav";
import MobileHeader from "@/components/app/MobileHeader";

const SIDEBAR_LINKS = [
  { href: "/bulk-buyer/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/bulk-buyer/requirements", label: "Requirements", icon: FileText },
  { href: "/bulk-buyer/requirements/create", label: "New Requirement", icon: Plus },
  { href: "/bulk-buyer/matches", label: "Find Farmers & Matches", icon: TrendingUp },
  { href: "/bulk-buyer/orders", label: "Bulk Orders", icon: ClipboardList },
  { href: "/bulk-buyer/profile", label: "Company Profile", icon: User },
];

const MOBILE_NAV: MobileNavItem[] = [
  { href: "/bulk-buyer/dashboard", label: "Home", icon: LayoutDashboard, exact: true },
  { href: "/bulk-buyer/matches", label: "Find Farmers", icon: Users },
  { href: "/bulk-buyer/requirements", label: "Requirements", icon: FileText },
  { href: "/bulk-buyer/orders", label: "Orders", icon: ClipboardList },
  { href: "/bulk-buyer/profile", label: "Profile", icon: User },
];

export default function BulkBuyerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    logout();
    toast.success("Signed out");
    router.push("/");
  }

  // Derive header title
  const activeLink = SIDEBAR_LINKS.find((l) =>
    pathname === l.href || (l.href !== "/bulk-buyer/requirements/create" && pathname.startsWith(l.href + "/"))
  );
  const headerTitle = activeLink?.label || "Bulk Procurement";

  return (
    <div className="flex h-screen h-[100dvh] bg-brand-cream overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-brand-border flex-shrink-0 h-full">
        <div className="p-5 border-b border-brand-border">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-green rounded-lg flex items-center justify-center shadow-sm">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-base text-brand-text">FarmConnect</span>
          </Link>
          <p className="text-xs text-brand-muted font-medium mt-1">Bulk Buyer Portal</p>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {SIDEBAR_LINKS.map((link) => {
            const Icon = link.icon;
            const active =
              pathname === link.href ||
              (link.href !== "/bulk-buyer/requirements/create" && pathname.startsWith(link.href + "/"));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  active
                    ? "bg-brand-light text-brand-green font-semibold"
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
          {user && (
            <div className="flex items-center gap-3 px-3 py-2 mb-1">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-brand-light text-brand-green font-semibold">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-brand-text truncate">{user.name}</p>
                <p className="text-xs text-brand-muted">Commercial Buyer</p>
              </div>
            </div>
          )}
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
                <div className="w-7 h-7 bg-brand-green rounded-lg flex items-center justify-center">
                  <Leaf className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="font-bold text-brand-text">Bulk Buyer Menu</span>
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
                      active ? "bg-brand-light text-brand-green font-semibold" : "text-brand-muted hover:bg-brand-light/60"
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
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative">
        <MobileHeader
          title={headerTitle}
          onMenuClick={() => setSidebarOpen(true)}
          rightAction={
            <Link
              href="/bulk-buyer/requirements/create"
              className="p-1.5 rounded-lg bg-brand-light text-brand-green font-semibold text-xs flex items-center gap-1 hover:bg-brand-light/80 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Post</span>
            </Link>
          }
        />

        <main className="flex-1 overflow-y-auto bg-brand-cream pb-24 lg:pb-8">{children}</main>
      </div>

      {/* App-Like Mobile Bottom Navigation Bar */}
      <MobileBottomNav items={MOBILE_NAV} />
    </div>
  );
}
