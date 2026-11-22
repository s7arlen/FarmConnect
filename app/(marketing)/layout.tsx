"use client";

import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HomeMobileHeader from "@/components/home/HomeMobileHeader";
import MobileBottomNav, { type MobileNavItem } from "@/components/app/MobileBottomNav";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { Home, Search, ShoppingCart, ClipboardList, User } from "lucide-react";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useAuthStore((s) => s.user);
  const cartCount = useCartStore((s) => s.getTotalItems());

  const mobileNavItems: MobileNavItem[] = [
    { href: "/", label: "Home", icon: Home, exact: true },
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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#F2F7ED] via-[#F8FAF4] to-[#EFF5EA]">
      {/* Mobile App Header (< 1024px) */}
      <div className="lg:hidden">
        <HomeMobileHeader />
      </div>

      {/* Desktop Top Navbar (>= 1024px) */}
      <div className="hidden lg:block">
        <Navbar />
      </div>

      <main className="flex-1 pb-24 lg:pb-0">{children}</main>

      {/* Desktop-Only Footer (Hidden on mobile for pure app experience) */}
      <div className="hidden lg:block">
        <Footer />
      </div>

      {/* Mobile App-Like Fixed Bottom Navigation Bar (< 1024px) */}
      <MobileBottomNav items={mobileNavItems} />
    </div>
  );
}
