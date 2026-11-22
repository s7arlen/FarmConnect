"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingCart, User, Leaf, Search, MapPin, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { useLanguageStore } from "@/store/languageStore";
import LanguageSwitcher from "@/components/shared/LanguageSwitcher";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const cartCount = useCartStore((s) => s.getTotalItems());
  const user = useAuthStore((s) => s.user);
  const { t } = useLanguageStore();

  const navLinks = [
    { href: "/buyer/explore", label: t("explore") },
    { href: "/farmers", label: t("farmers") },
    { href: "/how-it-works", label: t("howItWorks") },
    { href: "/about", label: t("about") },
  ];

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/buyer/explore?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/buyer/explore");
    }
  }

  return (
    <header className="sticky top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-brand-border shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Location */}
          <div className="flex items-center gap-3 xl:gap-4 flex-shrink-0">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 bg-brand-green rounded-xl flex items-center justify-center group-hover:bg-brand-dark transition-colors shadow-xs">
                <Leaf className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg text-brand-text tracking-tight leading-none">
                  FarmConnect
                </span>
                <span className="text-[10px] text-brand-green font-semibold tracking-wide uppercase mt-0.5">
                  Local Farm Market
                </span>
              </div>
            </Link>

            {/* Desktop Location Selector */}
            <Link
              href="/buyer/explore"
              className="hidden xl:flex items-center gap-1.5 px-2 py-1 text-slate-600 hover:text-brand-green text-xs font-medium transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-brand-green" />
              <span>Deliver to: <strong className="text-slate-900 font-semibold">Bantwal</strong></span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </Link>
          </div>

          {/* Center Search Bar (Desktop) */}
          <form onSubmit={handleSearch} className="hidden lg:flex items-center relative flex-1 max-w-md mx-2">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search farm fresh vegetables, fruits, grains..."
              className="w-full h-10 pl-10 pr-4 text-xs xl:text-sm bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-full focus:ring-2 focus:ring-brand-green/25 focus:border-brand-green transition-all outline-hidden text-slate-800 placeholder:text-slate-400"
            />
          </form>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 flex-shrink-0">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 rounded-lg text-sm font-medium text-brand-muted hover:text-brand-green hover:bg-brand-light transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            {/* Language Switcher */}
            <LanguageSwitcher
              variant="navbar"
              scrolled={true}
              isHeroPage={false}
            />

            {user ? (
              <>
                <Link href="/buyer/cart" className="relative p-2 rounded-lg hover:bg-brand-light transition-colors">
                  <ShoppingCart className="w-5 h-5 text-brand-text" />
                  {cartCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-brand-green text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <Link
                  href={
                    user.role === "FARMER"
                      ? "/farmer/dashboard"
                      : user.role === "ADMIN"
                      ? "/admin/dashboard"
                      : user.role === "BULK_BUYER"
                      ? "/bulk-buyer/dashboard"
                      : "/buyer/dashboard"
                  }
                >
                  <Button variant="outline" size="sm" className="gap-2">
                    <User className="w-4 h-4" />
                    {t("dashboard")}
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-brand-text hover:text-brand-green">
                    {t("login")}
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="bg-brand-green hover:bg-brand-dark text-white font-semibold">
                    {t("register")}
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu & Language Switcher Button */}
          <div className="flex lg:hidden items-center gap-2">
            <LanguageSwitcher
              variant="navbar"
              scrolled={true}
              isHeroPage={false}
            />

            <button
              className="p-2 rounded-lg text-brand-text hover:bg-brand-light"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? (
                <X className="w-5 h-5 text-brand-text" />
              ) : (
                <Menu className="w-5 h-5 text-brand-text" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-brand-border px-4 py-4 space-y-3"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-3 py-2 text-base font-medium text-brand-text hover:text-brand-green hover:bg-brand-light rounded-lg transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-2 border-t border-brand-border space-y-2">
              {user ? (
                <Link
                  href={
                    user.role === "FARMER"
                      ? "/farmer/dashboard"
                      : user.role === "ADMIN"
                      ? "/admin/dashboard"
                      : user.role === "BULK_BUYER"
                      ? "/bulk-buyer/dashboard"
                      : "/buyer/dashboard"
                  }
                  className="block"
                  onClick={() => setMenuOpen(false)}
                >
                  <Button className="w-full justify-center">{t("dashboard")}</Button>
                </Link>
              ) : (
                <>
                  <Link href="/login" className="block" onClick={() => setMenuOpen(false)}>
                    <Button variant="outline" className="w-full justify-center">
                      {t("login")}
                    </Button>
                  </Link>
                  <Link href="/register" className="block" onClick={() => setMenuOpen(false)}>
                    <Button className="w-full justify-center">{t("register")}</Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
