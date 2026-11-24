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
  X,
  Home,
  User,
  Leaf,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { toast } from "sonner";
import MobileBottomNav, { type MobileNavItem } from "@/components/app/MobileBottomNav";
import MobileHeader from "@/components/app/MobileHeader";
import LanguageSwitcher from "@/components/shared/LanguageSwitcher";

const SIDEBAR_LINKS = [
  { href: "/buyer/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/buyer/explore", label: "Explore Produce", icon: Search },
  { href: "/buyer/farmers", label: "Nearby Farmers", icon: Users },
  { href: "/buyer/orders", label: "My Orders", icon: ClipboardList },
  { href: "/buyer/wishlist", label: "Wishlist", icon: Heart },
  { href: "/buyer/bulk", label: "Bulk Buying", icon: Boxes },
  { href: "/buyer/profile", label: "Profile", icon: User },
  { href: "/buyer/settings", label: "Settings", icon: Settings },
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

  const mobileNavItems: MobileNavItem[] = [
    { href: user ? "/buyer/dashboard" : "/", label: "Home", icon: Home, exact: true },
    { href: "/buyer/explore", label: "Explore", icon: Search },
    { href: "/buyer/cart", label: "Cart", icon: ShoppingCart, badge: cartCount },
    { href: user ? "/buyer/orders" : "/login", label: "Orders", icon: ClipboardList },
    {
      href: user
        ? user.role === "FARMER"
          ? "/farmer/dashboard"
          : user.role === "ADMIN"
          ? "/admin/dashboard"
          : user.role === "BULK_BUYER"
          ? "/bulk-buyer/dashboard"
          : "/buyer/profile"
        : "/login",
      label: "Profile",
      icon: User,
    },
  ];

  // Derive title from pathname
  const currentLink = SIDEBAR_LINKS.find(
    (l) => pathname === l.href || (l.href !== "/buyer/dashboard" && pathname.startsWith(l.href + "/"))
  );
  const headerTitle = currentLink ? currentLink.label : "FarmConnect";

  return (
    <div className="flex h-screen h-[100dvh] bg-brand-cream overflow-hidden">
      {/* Desktop Sidebar (>= 1024px) */}
      <aside className="w-72 bg-white border-r border-brand-border flex-col flex-shrink-0 hidden lg:flex">
        <div className="p-4 border-b border-brand-border flex items-center justify-between gap-2.5">
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 min-w-0">
            <div className="w-8 h-8 bg-brand-green rounded-lg flex items-center justify-center flex-shrink-0">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0">
              <span className="font-bold text-base text-brand-text block leading-none">FarmConnect</span>
              <span className="text-[10px] text-brand-green font-semibold tracking-wide uppercase whitespace-nowrap block mt-0.5">Direct Marketplace</span>
            </div>
          </Link>
          <LanguageSwitcher variant="pill" className="flex-shrink-0" />
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {SIDEBAR_LINKS.map((link) => {
            const Icon = link.icon;
            const active =
              pathname === link.href ||
              (link.href !== "/buyer/dashboard" && pathname.startsWith(link.href + "/"));
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

        {/* Cart Quick Access in Sidebar */}
        <div className="px-3 py-2">
          <Link
            href="/buyer/cart"
            className="flex items-center justify-between px-3 py-2 rounded-lg bg-brand-light text-brand-green text-sm font-semibold hover:bg-brand-light/80 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              My Cart
            </span>
            <span className="px-2 py-0.5 rounded-full bg-brand-green text-white text-xs font-bold">
              {cartCount}
            </span>
          </Link>
        </div>

        <div className="p-3 border-t border-brand-border">
          {user ? (
            <>
              <div className="flex items-center gap-3 px-3 py-2 mb-1">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-brand-light text-brand-green font-semibold">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-brand-text truncate">{user.name}</p>
                  <p className="text-xs text-brand-muted capitalize">{user.role.toLowerCase().replace("_", " ")}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-brand-muted hover:bg-red-50 hover:text-brand-error w-full transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium bg-brand-green text-white hover:bg-brand-dark w-full transition-colors"
            >
              <User className="w-4 h-4" />
              Sign In
            </Link>
          )}
        </div>
      </aside>

      {/* Mobile Drawer Overlay (< 1024px) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white flex flex-col shadow-2xl animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between p-5 border-b border-brand-border">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-brand-green rounded-lg flex items-center justify-center">
                  <Leaf className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-brand-text">Buyer Menu</span>
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
              {user ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-brand-muted hover:bg-red-50 hover:text-brand-error w-full"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium bg-brand-green text-white hover:bg-brand-dark w-full"
                >
                  <User className="w-4 h-4" />
                  Sign In
                </Link>
              )}
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
            <div className="flex items-center gap-2">
              <LanguageSwitcher variant="pill" />
              <Link
                href="/buyer/cart"
                className="relative p-2 rounded-full hover:bg-brand-light text-brand-dark transition-colors"
                aria-label="View shopping cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute 0 top-0.5 right-0.5 min-w-[17px] h-[17px] bg-brand-green text-white text-[10px] font-bold rounded-full flex items-center justify-center px-0.5 ring-2 ring-white">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          }
        />

        <main className="flex-1 overflow-y-auto bg-brand-cream pb-24 lg:pb-8">{children}</main>
      </div>

      {/* App-Like Mobile Bottom Navigation Bar */}
      <MobileBottomNav items={mobileNavItems} />
    </div>
  );
}
