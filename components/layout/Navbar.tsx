"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingCart, User, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { useLanguageStore } from "@/store/languageStore";
import LanguageSwitcher from "@/components/shared/LanguageSwitcher";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const cartCount = useCartStore((s) => s.getTotalItems());
  const user = useAuthStore((s) => s.user);
  const { t } = useLanguageStore();

  const navLinks = [
    { href: "/buyer/explore", label: t("explore") },
    { href: "/farmers", label: t("farmers") },
    { href: "/how-it-works", label: t("howItWorks") },
    { href: "/about", label: t("about") },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isHeroPage = pathname === "/";

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-brand-border/80 shadow-xs transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-brand-green rounded-xl flex items-center justify-center group-hover:bg-brand-dark transition-all shadow-sm">
              <Leaf className="w-4 h-4 text-white stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg text-brand-dark tracking-tight leading-none">
                FarmConnect
              </span>
              <span className="text-[10px] text-brand-green font-semibold tracking-wide uppercase mt-0.5">
                Local Farm Market
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3.5 py-2 rounded-xl text-sm font-semibold text-brand-text hover:text-brand-green hover:bg-brand-light/70 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Switcher */}
            <LanguageSwitcher
              variant="navbar"
              scrolled={true}
              isHeroPage={false}
            />

            {user ? (
              <>
                <Link href="/buyer/cart" className="relative p-2 rounded-xl hover:bg-brand-light transition-colors">
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
                  <Button variant="outline" size="sm" className="gap-2 border-brand-green/30 text-brand-green hover:bg-brand-light">
                    <User className="w-4 h-4" />
                    {t("dashboard")}
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-brand-text font-semibold hover:text-brand-green hover:bg-brand-light/60"
                  >
                    {t("login")}
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="bg-brand-green hover:bg-brand-dark text-white font-bold px-4 shadow-sm">
                    {t("register")}
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu & Language Switcher Button */}
          <div className="flex md:hidden items-center gap-2">
            <LanguageSwitcher
              variant="navbar"
              scrolled={scrolled}
              isHeroPage={isHeroPage}
            />

            <button
              className="p-2 rounded-lg"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? (
                <X className={cn("w-5 h-5", scrolled || !isHeroPage ? "text-brand-text" : "text-white")} />
              ) : (
                <Menu className={cn("w-5 h-5", scrolled || !isHeroPage ? "text-brand-text" : "text-white")} />
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
