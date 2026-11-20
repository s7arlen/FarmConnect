"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  fallbackBackHref?: string;
  onMenuClick?: () => void;
  rightAction?: React.ReactNode;
  className?: string;
}

export default function MobileHeader({
  title,
  subtitle,
  showBack = false,
  fallbackBackHref,
  onMenuClick,
  rightAction,
  className,
}: MobileHeaderProps) {
  const router = useRouter();

  function handleBack() {
    if (fallbackBackHref) {
      router.push(fallbackBackHref);
    } else {
      router.back();
    }
  }

  return (
    <header
      className={cn(
        "lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 h-14 bg-white/95 backdrop-blur-md border-b border-brand-border transition-all",
        className
      )}
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      <div className="flex items-center gap-2 min-w-0">
        {showBack ? (
          <button
            onClick={handleBack}
            className="p-1.5 -ml-1.5 rounded-full hover:bg-brand-light text-brand-dark transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
          </button>
        ) : onMenuClick ? (
          <button
            onClick={onMenuClick}
            className="p-1.5 -ml-1.5 rounded-lg hover:bg-brand-light text-brand-text transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        ) : null}

        <div className="min-w-0">
          <h1 className="text-base font-bold text-brand-dark tracking-tight truncate leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[11px] font-medium text-brand-muted truncate leading-tight">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {rightAction && (
        <div className="flex items-center gap-2 flex-shrink-0">
          {rightAction}
        </div>
      )}
    </header>
  );
}
