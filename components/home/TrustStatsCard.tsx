"use client";

import React from "react";
import { Users, ShoppingBag, ShieldCheck, HeartHandshake } from "lucide-react";
import { useLanguageStore } from "@/store/languageStore";

export default function TrustStatsCard() {
  const { language } = useLanguageStore();

  const statLabels = {
    en: {
      farmers: "Local Farmers",
      farmersSub: "Directly verified",
      varieties: "Produce Varieties",
      varietiesSub: "Seasonal & organic",
      fees: "Middleman Fees",
      feesSub: "100% direct payouts",
      buyers: "Happy Households",
      buyersSub: "Eating fresh daily",
    },
    kn: {
      farmers: "ಸ್ಥಳೀಯ ರೈತರು",
      farmersSub: "ಪರಿಶೀಲಿಸಿದ ಬೆಳೆಗಾರರು",
      varieties: "ಬೆಳೆ ತಳಿಗಳು",
      varietiesSub: "ನೈಸರ್ಗಿಕ ಉತ್ಪನ್ನಗಳು",
      fees: "ಮಧ್ಯವರ್ತಿ ಶುಲ್ಕ",
      feesSub: "ಶೂನ್ಯ ಕಮಿಷನ್",
      buyers: "ತೃಪ್ತ ಗ್ರಾಹಕರು",
      buyersSub: "ಪ್ರತಿದಿನ ತಾಜಾ ಆಹಾರ",
    },
    hi: {
      farmers: "स्थानीय किसान",
      farmersSub: "सत्यापित किसान",
      varieties: "फसल किस्में",
      varietiesSub: "ताज़ी और जैविक",
      fees: "बिचौलिया शुल्क",
      feesSub: "100% सीधा भुगतान",
      buyers: "संतुष्ट परिवार",
      buyersSub: "रोज़ाना ताज़ा खाना",
    },
  };

  const currentLabels = statLabels[language] || statLabels.en;

  const stats = [
    {
      icon: Users,
      value: "200+",
      label: currentLabels.farmers,
      sub: currentLabels.farmersSub,
      accent: "text-emerald-700 bg-emerald-100/80 border-emerald-200",
    },
    {
      icon: ShoppingBag,
      value: "50+",
      label: currentLabels.varieties,
      sub: currentLabels.varietiesSub,
      accent: "text-amber-700 bg-amber-100/80 border-amber-200",
    },
    {
      icon: ShieldCheck,
      value: "₹0",
      label: currentLabels.fees,
      sub: currentLabels.feesSub,
      accent: "text-teal-700 bg-teal-100/80 border-teal-200",
    },
    {
      icon: HeartHandshake,
      value: "5,000+",
      label: currentLabels.buyers,
      sub: currentLabels.buyersSub,
      accent: "text-green-700 bg-green-100/80 border-green-200",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-white/95 border border-brand-border/80 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all duration-200 group"
          >
            <div
              className={`w-11 h-11 rounded-2xl border flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 ${stat.accent}`}
            >
              <Icon className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div className="min-w-0">
              <span className="block text-lg sm:text-xl font-black text-brand-dark tracking-tight leading-none">
                {stat.value}
              </span>
              <p className="text-xs font-bold text-brand-text truncate leading-tight mt-0.5">
                {stat.label}
              </p>
              <p className="text-[10px] text-brand-muted truncate leading-tight">
                {stat.sub}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
