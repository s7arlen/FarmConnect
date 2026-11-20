"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Users, UserCheck, ShoppingBag, ClipboardList,
  ShieldCheck, AlertCircle, Settings, LogOut, Menu, X, Leaf,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";

const SIDEBAR_LINKS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "All Users", icon: Users },
  { href: "/admin/farmers", label: "Farmers", icon: UserCheck },
  { href: "/admin/buyers", label: "Buyers", icon: Users },
  { href: "/admin/products", label: "Products", icon: ShoppingBag },
  { href: "/admin/orders", label: "Orders", icon: ClipboardList },
  { href: "/admin/farmer-verification", label: "Verification", icon: ShieldCheck },
  { href: "/admin/reports", label: "Reports", icon: AlertCircle },
  { href: "/admin/settings", label: "Settings", icon: Settings },
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

  const SidebarContent = () => (
    <>
      <div className="p-5 border-b border-brand-border">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-dark rounded-lg flex items-center justify-center">
            <Leaf className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-base text-brand-text">FarmConnect</span>
        </Link>
        <p className="text-xs text-brand-error font-semibold mt-1">Admin Panel</p>
      </div>
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {SIDEBAR_LINKS.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href || pathname.startsWith(link.href + "/");
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                active ? "bg-brand-dark/10 text-brand-dark" : "text-brand-muted hover:bg-gray-100 hover:text-brand-text"
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
    </>
  );

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-brand-border flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white flex flex-col shadow-xl">
            <div className="flex justify-end p-3 border-b border-brand-border">
              <button onClick={() => setSidebarOpen(false)}>
                <X className="w-5 h-5 text-brand-muted" />
              </button>
            </div>
            <SidebarContent />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-brand-border sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="p-1.5 rounded-lg hover:bg-gray-100">
            <Menu className="w-5 h-5 text-brand-text" />
          </button>
          <span className="font-bold text-brand-text">Admin Panel</span>
          <div className="w-8" />
        </header>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
