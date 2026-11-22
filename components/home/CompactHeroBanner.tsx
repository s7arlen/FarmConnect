"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguageStore } from "@/store/languageStore";

export default function CompactHeroBanner() {
  const { language, t } = useLanguageStore();

  const heroHeadlines = {
    en: {
      line1: "Fresh from",
      line2: "local farms.",
      highlight: "Directly to your community.",
      subtitle: "Discover fresh produce from farmers near you, connect directly, and buy with confidence.",
      exploreBtn: "Explore Produce",
      sellBtn: "Sell on FarmConnect",
    },
    kn: {
      line1: "ನೇರವಾಗಿ",
      line2: "ಸ್ಥಳೀಯ ಹೊಲಗಳಿಂದ.",
      highlight: "ನಿಮ್ಮ ಸಮುದಾಯಕ್ಕೆ ತಾಜಾ ಆಹಾರ.",
      subtitle: "ನಿಮ್ಮ ಸಮೀಪದ ರೈತರಿಂದ ತಾಜಾ ಕೃಷಿ ಉತ್ಪನ್ನಗಳನ್ನು ಅನ್ವೇಷಿಸಿ, ಮಧ್ಯವರ್ತಿಗಳಿಲ್ಲದೆ ನೇರವಾಗಿ ಖರೀದಿಸಿ.",
      exploreBtn: "ಉತ್ಪನ್ನಗಳನ್ನು ಅನ್ವೇಷಿಸಿ",
      sellBtn: "ರೈತರಾಗಿ ಮಾರಾಟ ಮಾಡಿ",
    },
    hi: {
      line1: "सीधे",
      line2: "स्थानीय खेतों से.",
      highlight: "आपके समुदाय तक ताज़ा उपज।",
      subtitle: "अपने नज़दीकी किसानों से ताज़ा उत्पाद खोजें, सीधे जुड़ें और बिना बिचौलियों के ख़रीदें।",
      exploreBtn: "उत्पाद खोजें",
      sellBtn: "किसान के रूप में बेचें",
    },
  };

  const currentText = heroHeadlines[language] || heroHeadlines.en;

  return (
    <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-md bg-brand-dark">
      {/* Background Photography */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1400&q=80"
          alt="Lush green Karnataka farmland at sunrise"
          fill
          priority
          className="object-cover"
        />
        {/* FarmConnect Natural Dark Green Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/95 via-brand-dark/75 to-brand-dark/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 p-5 sm:p-8 md:p-12 max-w-xl">
        <motion.div
          key={language}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          {/* Main Headline */}
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-white leading-tight tracking-tight mb-2 sm:mb-3">
            {currentText.line1} <br className="hidden sm:inline" />
            {currentText.line2} <br />
            <span className="text-brand-light">{currentText.highlight}</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm md:text-base text-white/85 leading-relaxed mb-5 max-w-md">
            {currentText.subtitle}
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <Link
              href="/buyer/explore"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-brand-dark font-bold text-xs sm:text-sm hover:bg-brand-light transition-all shadow-md group"
            >
              <span>{currentText.exploreBtn}</span>
              <ArrowRight className="w-4 h-4 text-brand-green group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              href="/register?role=FARMER"
              className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 text-white font-semibold text-xs sm:text-sm transition-colors"
            >
              {currentText.sellBtn}
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
