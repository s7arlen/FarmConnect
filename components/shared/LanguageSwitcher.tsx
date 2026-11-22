"use client";

import React, { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown, Check } from "lucide-react";
import { useLanguageStore } from "@/store/languageStore";
import { type Language } from "@/lib/i18n/translations";
import { cn } from "@/lib/utils";

interface LanguageOption {
  code: Language;
  label: string;
  nativeLabel: string;
}

const LANGUAGES: LanguageOption[] = [
  { code: "en", label: "English", nativeLabel: "English" },
  { code: "kn", label: "Kannada", nativeLabel: "ಕನ್ನಡ" },
  { code: "hi", label: "Hindi", nativeLabel: "हिंदी" },
];

interface LanguageSwitcherProps {
  variant?: "pill" | "navbar" | "dropdown";
  className?: string;
  scrolled?: boolean;
  isHeroPage?: boolean;
}

export default function LanguageSwitcher({
  variant = "pill",
  className,
  scrolled = true,
  isHeroPage = false,
}: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguageStore();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentLang = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  const isLightText = isHeroPage && !scrolled;

  return (
    <div className={cn("relative inline-block text-left", className)} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border flex-shrink-0 whitespace-nowrap",
          variant === "navbar" && isLightText
            ? "bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm"
            : "bg-white hover:bg-brand-light text-brand-dark border-brand-border shadow-2xs hover:border-brand-green/30"
        )}
        aria-label="Select language"
        aria-expanded={isOpen}
      >
        <Globe className={cn("w-3.5 h-3.5 flex-shrink-0", variant === "navbar" && isLightText ? "text-white" : "text-brand-green")} />
        <span className="tracking-tight">{currentLang.nativeLabel}</span>
        <ChevronDown className="w-3 h-3 opacity-70 flex-shrink-0" />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-44 rounded-2xl bg-white border border-brand-border shadow-lg py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
          style={{ transformOrigin: "top right" }}
        >
          <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-muted border-b border-brand-border/60 mb-1">
            Language / ಭಾಷೆ / भाषा
          </div>
          {LANGUAGES.map((lang) => {
            const isSelected = lang.code === language;
            return (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors",
                  isSelected
                    ? "bg-brand-light text-brand-green font-bold"
                    : "text-brand-text hover:bg-zinc-50 font-medium"
                )}
              >
                <div className="flex flex-col">
                  <span className="text-xs">{lang.nativeLabel}</span>
                  <span className="text-[10px] text-brand-muted">{lang.label}</span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-brand-green" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
