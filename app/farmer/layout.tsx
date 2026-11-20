"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Plus,
  ClipboardList,
  BarChart3,
  Home as HomeIcon,
  Settings,
  LogOut,
  Menu,
  X,
  Leaf,
  User,
  Inbox,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { toast } from "sonner";

const SIDEBAR_LINKS = [
  { href: "/farmer/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/farmer/products", label: "Products", icon: Package },
  { href: "/farmer/products/add", label: "Add Product", icon: Plus },
  { href: "/farmer/orders", label: "Orders", icon: ClipboardList },
  { href: "/farmer/bulk-requests", label: "Bulk Requests", icon: Inbox },
  { href: "/farmer/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/farmer/farm", label: "Farm Profile", icon: HomeIcon },
  { href: "/farmer/settings", label: "Settings", icon: Settings },
];

const MOBILE_NAV = [
  { href: "/farmer/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/farmer/products", label: "Products", icon: Package },
  { href: "/farmer/products/add", label: "Add", icon: Plus },
  { href: "/farmer/orders", label: "Orders", icon: ClipboardList },
  { href: "/farmer/farm", label: "Profile", icon: User },
];

export default function FarmerLayout({ children }: { children: React.ReactNode }) {
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

  return (
    <div className="min-h-screen flex bg-brand-cream">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-brand-border flex-shrink-0">
        <div className="p-5 border-b border-brand-border">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-green rounded-lg flex items-center justify-center">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-base text-brand-text">FarmConnect</span>
          </Link>
          <p className="text-xs text-brand-muted mt-1 font-medium">Farmer Portal</p>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          {SIDEBAR_LINKS.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href || (link.href !== "/farmer/products/add" && pathname.startsWith(link.href + "/"));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  active
                    ? "bg-brand-light text-brand-green"
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
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-brand-text truncate">{user.name}</p>
                <p className="text-xs text-brand-muted">Farmer</p>
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

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white flex flex-col shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-brand-border">
              <span className="font-bold text-brand-text">Farmer Portal</span>
              <button onClick={() => setSidebarOpen(false)}>
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
                      active ? "bg-brand-light text-brand-green" : "text-brand-muted hover:bg-brand-light/60"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
            <div className="p-3 border-t border-brand-border">
              <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-brand-muted hover:bg-red-50 hover:text-brand-error w-full">
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-brand-border sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="p-1.5 rounded-lg hover:bg-brand-light">
            <Menu className="w-5 h-5 text-brand-text" />
          </button>
          <span className="font-bold text-brand-text">Farmer Portal</span>
          <div className="w-8" />
        </header>

        <main className="flex-1 overflow-auto pb-20 lg:pb-0">{children}</main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-brand-border">
        <div className="flex items-center">
          {MOBILE_NAV.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex-1 flex flex-col items-center gap-0.5 py-3 text-[10px] font-medium",
                  active ? "text-brand-green" : "text-brand-muted"
                )}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
