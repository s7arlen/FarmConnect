"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, ShieldCheck, Clock, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguageStore } from "@/store/languageStore";

export default function CompactHeroBanner() {
  const { language } = useLanguageStore();

  const heroHeadlines = {
    en: {
      tag: "Direct Farm-to-Community Market",
      line1: "Fresh from",
      line2: "local farms.",
      highlight: "Directly to your family.",
      subtitle: "Discover pure, chemical-tested produce harvested this morning from verified local farmers. 0% middlemen markup.",
      exploreBtn: "Explore Fresh Produce",
      sellBtn: "Sell as a Farmer",
    },
    kn: {
      tag: "ನೇರ ರೈತ ಮಾರುಕಟ್ಟೆ",
      line1: "ನೇರವಾಗಿ",
      line2: "ಸ್ಥಳೀಯ ಹೊಲಗಳಿಂದ.",
      highlight: "ನಿಮ್ಮ ಮನೆ ಬಾಗಿಲಿಗೆ ತಾಜಾ ಆಹಾರ.",
      subtitle: "ಇಂದೇ ಕೊಯ್ಲು ಮಾಡಿದ ನೈಸರ್ಗಿಕ ತರಕಾರಿ ಮತ್ತು ಹಣ್ಣುಗಳನ್ನು ಮಧ್ಯವರ್ತಿಗಳಿಲ್ಲದೆ ನೇರವಾಗಿ ಖರೀದಿಸಿ.",
      exploreBtn: "ಉತ್ಪನ್ನಗಳನ್ನು ಅನ್ವೇಷಿಸಿ",
      sellBtn: "ರೈತರಾಗಿ ಮಾರಾಟ ಮಾಡಿ",
    },
    hi: {
      tag: "सीधे खेत से आपके घर तक",
      line1: "सीधे",
      line2: "स्थानीय खेतों से.",
      highlight: "आपके परिवार तक ताज़ा उपज।",
      subtitle: "आज सुबह तोड़ी गई ताज़ी सब्ज़ियाँ और फल सीधे किसानों से खरीदें, बिना किसी बिचौलिये के।",
      exploreBtn: "उत्पाद खोजें",
      sellBtn: "किसान बनें",
    },
  };

  const currentText = heroHeadlines[language] || heroHeadlines.en;

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-xl bg-brand-dark border border-emerald-900/30">
      {/* Background Photography */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1400&q=80"
          alt="Lush green Karnataka farmland at sunrise"
          fill
          priority
          className="object-cover scale-105"
        />
        {/* Layered Gradient Overlays for High Contrast & Modern Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/95 via-emerald-950/80 to-emerald-900/40" />
        <div className="absolute inset-0 bg-radial-at-tl from-emerald-500/20 via-transparent to-transparent" />
      </div>

      {/* Main Content Layout */}
      <div className="relative z-10 p-6 sm:p-9 md:p-12 lg:p-14 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
        <motion.div
          key={language}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="max-w-xl"
        >
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs font-semibold mb-3.5 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{currentText.tag}</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight mb-3">
            {currentText.line1} <br className="hidden sm:inline" />
            {currentText.line2} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-yellow-200 to-green-100">
              {currentText.highlight}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm md:text-base text-white/90 leading-relaxed mb-6 max-w-lg font-medium">
            {currentText.subtitle}
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
            <Link
              href="/buyer/explore"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black text-xs sm:text-sm transition-all shadow-lg shadow-emerald-950/40 group hover:scale-[1.02]"
            >
              <span>{currentText.exploreBtn}</span>
              <ArrowRight className="w-4 h-4 text-emerald-950 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/register?role=FARMER"
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-xs sm:text-sm backdrop-blur-md transition-all hover:scale-[1.02]"
            >
              {currentText.sellBtn}
            </Link>
          </div>

          {/* Value Micro-Props */}
          <div className="flex items-center flex-wrap gap-4 text-xs text-white/80 border-t border-white/15 pt-4">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Harvested within 24h</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% Direct Payout</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Free COD & UPI</span>
            </div>
          </div>
        </motion.div>

        {/* Floating Live Harvest Card (Desktop) */}
        <div className="hidden lg:flex flex-col gap-3 p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-2xl max-w-xs flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-400/20 border border-emerald-400/30 flex items-center justify-center text-2xl shadow-inner">
              👨‍🌾
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="font-bold text-sm text-white">Joseph&apos;s Farm</p>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-xs text-emerald-200/90">Bantwal Cluster • 2 km</p>
            </div>
          </div>

          <div className="bg-black/25 rounded-xl p-3 space-y-1.5 text-xs border border-white/10">
            <div className="flex justify-between text-white font-medium">
              <span>Today&apos;s Harvest:</span>
              <span className="font-bold text-amber-300">Vine Tomatoes (₹35/kg)</span>
            </div>
            <div className="flex justify-between text-white/70 text-[11px]">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-emerald-400" />
                Harvest Time:
              </span>
              <span>6:30 AM Today</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-white/85 pt-1 border-t border-white/15">
            <span className="flex items-center gap-1 font-semibold text-amber-300">
              ⭐ 4.9 (320+ reviews)
            </span>
            <span className="text-emerald-300 font-bold">Verified Farmer</span>
          </div>
        </div>
      </div>
    </div>
  );
}
