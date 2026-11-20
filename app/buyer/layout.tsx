"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Search,
  Users,
  ShoppingCart,
  ClipboardList,
  Heart,
  Boxes,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  User,
  Leaf,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { toast } from "sonner";

const SIDEBAR_LINKS = [
  { href: "/buyer/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/buyer/explore", label: "Explore", icon: Search },
  { href: "/buyer/farmers", label: "Farmers", icon: Users },
  { href: "/buyer/orders", label: "Orders", icon: ClipboardList },
  { href: "/buyer/wishlist", label: "Wishlist", icon: Heart },
  { href: "/buyer/bulk", label: "Bulk Buying", icon: Boxes },
  { href: "/buyer/profile", label: "Profile", icon: User },
  { href: "/buyer/settings", label: "Settings", icon: Settings },
];

const MOBILE_NAV = [
  { href: "/buyer/dashboard", label: "Home", icon: Home },
  { href: "/buyer/explore", label: "Explore", icon: Search },
  { href: "/buyer/farmers", label: "Farmers", icon: Users },
  { href: "/buyer/orders", label: "Orders", icon: ClipboardList },
  { href: "/buyer/profile", label: "Profile", icon: User },
];

export default function BuyerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const cartCount = useCartStore((s) => s.getTotalItems());
  const [sidebarOpen, setSidebarOpen] = useState(false);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    logout();
    toast.success("Signed out successfully");
    router.push("/");
  }

  return (
    <div className="min-h-screen flex bg-brand-cream">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-brand-border flex-shrink-0">
        {/* Logo */}
        <div className="p-5 border-b border-brand-border">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-green rounded-lg flex items-center justify-center">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-base text-brand-text">FarmConnect</span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5">
          {SIDEBAR_LINKS.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group",
                  active
                    ? "bg-brand-light text-brand-green"
                    : "text-brand-muted hover:bg-brand-light/60 hover:text-brand-text"
                )}
              >
                <Icon className={cn("w-4 h-4 flex-shrink-0", active ? "text-brand-green" : "")} />
                {link.label}
                {link.href === "/buyer/cart" && cartCount > 0 && (
                  <span className="ml-auto min-w-[20px] h-5 bg-brand-green text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                    {cartCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User + Logout */}
        <div className="p-3 border-t border-brand-border">
          {user && (
            <div className="flex items-center gap-3 px-3 py-2 mb-1">
              <Avatar className="w-8 h-8">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-brand-text truncate">{user.name}</p>
                <p className="text-xs text-brand-muted capitalize">{user.role.replace("_", " ").toLowerCase()}</p>
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
              <Link href="/" className="flex items-center gap-2">
                <div className="w-7 h-7 bg-brand-green rounded-lg flex items-center justify-center">
                  <Leaf className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="font-bold text-base">FarmConnect</span>
              </Link>
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
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
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
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-brand-border sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="p-1.5 rounded-lg hover:bg-brand-light">
            <Menu className="w-5 h-5 text-brand-text" />
          </button>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-brand-green rounded-lg flex items-center justify-center">
              <Leaf className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-base">FarmConnect</span>
          </Link>
          <Link href="/buyer/cart" className="relative p-1.5 rounded-lg hover:bg-brand-light">
            <ShoppingCart className="w-5 h-5 text-brand-text" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-brand-green text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5">
                {cartCount}
              </span>
            )}
          </Link>
        </header>

        {/* Page */}
        <main className="flex-1 overflow-auto pb-20 lg:pb-0">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-brand-border">
        <div className="flex items-center">
          {MOBILE_NAV.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex-1 flex flex-col items-center gap-0.5 py-3 text-[10px] font-medium transition-colors",
                  active ? "text-brand-green" : "text-brand-muted"
                )}
              >
                <Icon className={cn("w-5 h-5", active ? "text-brand-green" : "text-brand-muted")} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
