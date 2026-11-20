"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MobileNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: number | string;
  exact?: boolean;
}

interface MobileBottomNavProps {
  items: MobileNavItem[];
}

export default function MobileBottomNav({ items }: MobileBottomNavProps) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Mobile Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-brand-border shadow-lg transition-all"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="flex items-center justify-around h-16 max-w-md mx-auto px-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? pathname === item.href
            : pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href + "/"));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex-1 flex flex-col items-center justify-center py-1 px-1 transition-all duration-200 select-none group",
                isActive ? "text-brand-green" : "text-brand-muted hover:text-brand-text"
              )}
            >
              {/* Active Pill Indicator */}
              <div
                className={cn(
                  "relative flex items-center justify-center w-12 h-8 rounded-full transition-all duration-200",
                  isActive ? "bg-brand-light font-semibold" : "group-hover:bg-brand-cream"
                )}
              >
                <Icon
                  className={cn(
                    "w-5 h-5 transition-transform duration-200",
                    isActive ? "scale-110 stroke-[2.2]" : "stroke-[1.8]"
                  )}
                />
                {/* Badge (e.g. cart items count) */}
                {item.badge !== undefined && item.badge !== 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-brand-green text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white animate-in zoom-in-75">
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span
                className={cn(
                  "text-[10px] mt-0.5 tracking-tight transition-colors truncate max-w-full",
                  isActive ? "font-bold text-brand-dark" : "font-medium text-brand-muted"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
