"use client";

import React from "react";
import { Users, ShoppingBag, Handshake } from "lucide-react";
import { useLanguageStore } from "@/store/languageStore";

export default function TrustStatsCard() {
  const { language, t } = useLanguageStore();

  const statLabels = {
    en: {
      farmers: "Local Farmers",
      varieties: "Produce Varieties",
      buyers: "Happy Buyers",
    },
    kn: {
      farmers: "ಸ್ಥಳೀಯ ರೈತರು",
      varieties: "ಬೆಳೆ ತಳಿಗಳು",
      buyers: "ತೃಪ್ತ ಗ್ರಾಹಕರು",
    },
    hi: {
      farmers: "स्थानीय किसान",
      varieties: "फसल किस्में",
      buyers: "संतुष्ट खरीदार",
    },
  };

  const currentLabels = statLabels[language] || statLabels.en;

  const stats = [
    {
      icon: Users,
      value: "200+",
      label: currentLabels.farmers,
    },
    {
      icon: ShoppingBag,
      value: "50+",
      label: currentLabels.varieties,
    },
    {
      icon: Handshake,
      value: "5,000+",
      label: currentLabels.buyers,
    },
  ];

  return (
    <div className="bg-brand-light/60 border border-brand-border/80 rounded-2xl p-4 shadow-2xs">
      <div className="grid grid-cols-3 divide-x divide-brand-border/60">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="flex flex-col items-center text-center px-1 first:pl-0 last:pr-0">
              <div className="w-8 h-8 rounded-full bg-brand-green/15 text-brand-green flex items-center justify-center mb-1.5">
                <Icon className="w-4 h-4 stroke-[2.2]" />
              </div>
              <span className="text-sm sm:text-base font-extrabold text-brand-dark tracking-tight leading-none mb-1">
                {stat.value}
              </span>
              <span className="text-[10px] sm:text-xs text-brand-muted font-medium leading-tight">
                {stat.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
