"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, FileText, Plus, TrendingUp, ClipboardList,
  User, LogOut, Menu, X, Leaf,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";

const LINKS = [
  { href: "/bulk-buyer/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/bulk-buyer/requirements", label: "Requirements", icon: FileText },
  { href: "/bulk-buyer/requirements/create", label: "New Requirement", icon: Plus },
  { href: "/bulk-buyer/matches", label: "Matches", icon: TrendingUp },
  { href: "/bulk-buyer/orders", label: "Orders", icon: ClipboardList },
  { href: "/bulk-buyer/profile", label: "Profile", icon: User },
];

export default function BulkBuyerLayout({ children }: { children: React.ReactNode }) {
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

  const NavLinks = () => (
    <nav className="flex-1 p-3 space-y-0.5">
      {LINKS.map((link) => {
        const Icon = link.icon;
        const active = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setSidebarOpen(false)}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              active ? "bg-brand-light text-brand-green" : "text-brand-muted hover:bg-brand-light/60 hover:text-brand-text"
            )}
          >
            <Icon className="w-4 h-4" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen flex bg-brand-cream">
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-brand-border flex-shrink-0">
        <div className="p-5 border-b border-brand-border">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-green rounded-lg flex items-center justify-center">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-base text-brand-text">FarmConnect</span>
          </Link>
          <p className="text-xs text-brand-muted font-medium mt-1">Bulk Buyer</p>
        </div>
        <NavLinks />
        <div className="p-3 border-t border-brand-border">
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-brand-muted hover:bg-red-50 hover:text-brand-error w-full">
            <LogOut className="w-4 h-4" />Logout
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white flex flex-col shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-brand-border">
              <span className="font-bold">Bulk Buyer</span>
              <button onClick={() => setSidebarOpen(false)}><X className="w-5 h-5 text-brand-muted" /></button>
            </div>
            <NavLinks />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-brand-border sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="p-1.5 rounded-lg hover:bg-brand-light">
            <Menu className="w-5 h-5 text-brand-text" />
          </button>
          <span className="font-bold text-brand-text">Bulk Buyer</span>
          <div className="w-8" />
        </header>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
