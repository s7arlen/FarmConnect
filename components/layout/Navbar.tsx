"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingCart, User, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/explore", label: "Explore" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/farmers", label: "Farmers" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const cartCount = useCartStore((s) => s.getTotalItems());
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isHeroPage = pathname === "/";

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
        scrolled || !isHeroPage
          ? "bg-white/95 backdrop-blur-md border-b border-brand-border shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-brand-green rounded-lg flex items-center justify-center group-hover:bg-brand-dark transition-colors">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <span
              className={cn(
                "font-bold text-lg transition-colors",
                scrolled || !isHeroPage
                  ? "text-brand-text"
                  : "text-white"
              )}
            >
              FarmConnect
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  scrolled || !isHeroPage
                    ? "text-brand-muted hover:text-brand-green hover:bg-brand-light"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <Link href="/buyer/cart" className="relative p-2 rounded-lg hover:bg-brand-light transition-colors">
                  <ShoppingCart className={cn("w-5 h-5", scrolled || !isHeroPage ? "text-brand-text" : "text-white")} />
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
                    Dashboard
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      scrolled || !isHeroPage
                        ? ""
                        : "text-white hover:bg-white/10 hover:text-white"
                    )}
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Join FarmConnect</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg"
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

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white border-b border-brand-border px-4 pb-4"
          >
            <nav className="flex flex-col gap-1 pt-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2.5 rounded-lg text-sm font-medium text-brand-text hover:bg-brand-light hover:text-brand-green"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-brand-border">
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
                  onClick={() => setMenuOpen(false)}
                >
                  <Button variant="outline" className="w-full">
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMenuOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Login
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setMenuOpen(false)}>
                    <Button className="w-full">Join FarmConnect</Button>
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
