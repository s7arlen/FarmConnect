"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Leaf, ArrowRight, Users, Sprout } from "lucide-react";
import { motion } from "framer-motion";

export default function WelcomePage() {
  const router = useRouter();

  function handleGuestExplore() {
    // Set cookie to remember guest exploration
    document.cookie = "farmconnect_visited=1; path=/; max-age=31536000; SameSite=Lax";
    router.push("/?guest=1");
  }

  return (
    <div className="min-h-screen bg-brand-cream/80 flex items-center justify-center p-0 sm:p-4 lg:p-6">
      {/* Centered Device-Width Container for Desktop, Full-Screen on Mobile */}
      <div className="w-full sm:max-w-md bg-white sm:rounded-3xl shadow-xl overflow-hidden flex flex-col min-h-screen sm:min-h-[844px] relative border border-brand-border/40">
        
        {/* Top Header */}
        <div className="relative z-20 px-5 pt-4 pb-2 flex items-center justify-between bg-white/90 backdrop-blur-xs">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-green rounded-xl flex items-center justify-center shadow-xs">
              <Leaf className="w-4 h-4 text-white stroke-[2.2]" />
            </div>
            <span className="font-bold text-lg tracking-tight text-brand-dark">FarmConnect</span>
          </div>

          {/* Login Link */}
          <div className="text-right">
            <span className="text-[11px] text-brand-muted block sm:inline mr-1">Already have an account?</span>
            <Link
              href="/login"
              className="inline-flex items-center gap-0.5 text-xs font-bold text-brand-green hover:text-brand-dark transition-colors"
            >
              <span>Log in</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Hero Agricultural Image Section with Headline */}
        <div className="relative flex-1 min-h-[340px] sm:min-h-[380px] flex flex-col justify-end p-5 overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1400&q=80"
              alt="Lush green Karnataka crop fields at sunrise"
              fill
              priority
              className="object-cover"
            />
            {/* Natural Sunlight & Dark Vignette Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10" />
          </div>

          {/* Hero Typography */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative z-10 mb-4"
          >
            <h1 className="text-4xl sm:text-5xl font-black text-white leading-[1.08] tracking-tight drop-shadow-sm mb-2.5">
              Fresh food. <br />
              <span className="text-brand-light">Local roots.</span>
            </h1>

            <p className="text-xs sm:text-sm text-white/90 leading-relaxed max-w-xs drop-shadow-xs font-medium">
              Connect with nearby farmers and bring fresh produce straight to your table.
            </p>
          </motion.div>
        </div>

        {/* Organic Wave Divider Transition */}
        <div className="relative w-full overflow-hidden leading-none z-10 -mt-6">
          <svg
            viewBox="0 0 500 45"
            preserveAspectRatio="none"
            className="w-full h-8 sm:h-10 text-white fill-current"
          >
            <path d="M0,0 C150,45 350,-20 500,25 L500,45 L0,45 Z" />
          </svg>
        </div>

        {/* Bottom Section: 3 Feature Highlights & Actions */}
        <div className="relative z-10 bg-white px-5 pt-2 pb-8 flex flex-col justify-between space-y-6">
          
          {/* Three Feature Highlights */}
          <div className="grid grid-cols-3 divide-x divide-brand-border/60 pt-2">
            {/* Feature 1 */}
            <div className="flex flex-col items-center text-center px-1">
              <div className="w-10 h-10 rounded-full bg-brand-light flex items-center justify-center text-brand-green mb-2">
                <Sprout className="w-5 h-5 stroke-[2]" />
              </div>
              <span className="text-xs font-bold text-brand-dark leading-snug">Discover</span>
              <span className="text-[11px] text-brand-muted leading-tight mt-0.5">local produce</span>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center text-center px-1">
              <div className="w-10 h-10 rounded-full bg-brand-light flex items-center justify-center text-brand-green mb-2">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5 text-brand-green"
                >
                  {/* Farmer with wide hat */}
                  <path d="M2 9a10 10 0 0 1 20 0" />
                  <path d="M5 9c0 4 2.5 7 7 7s7-3 7-7" />
                  <path d="M4 9h16" />
                  <circle cx="12" cy="14" r="3" />
                  <path d="M7 21a5 5 0 0 1 10 0" />
                </svg>
              </div>
              <span className="text-xs font-bold text-brand-dark leading-snug">Buy directly</span>
              <span className="text-[11px] text-brand-muted leading-tight mt-0.5">from farmers</span>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center text-center px-1">
              <div className="w-10 h-10 rounded-full bg-brand-light flex items-center justify-center text-brand-green mb-2">
                <Users className="w-5 h-5 stroke-[2]" />
              </div>
              <span className="text-xs font-bold text-brand-dark leading-snug">Support your</span>
              <span className="text-[11px] text-brand-muted leading-tight mt-0.5">community</span>
            </div>
          </div>

          {/* Action Buttons Area */}
          <div className="space-y-3 pt-2">
            {/* Get Started Button */}
            <Link
              href="/get-started/roles"
              className="w-full h-13 rounded-2xl bg-brand-green hover:bg-brand-dark text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-[0.99]"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </Link>

            {/* Explore as a guest link */}
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={handleGuestExplore}
                className="text-xs sm:text-sm font-semibold text-brand-green hover:text-brand-dark underline underline-offset-4 transition-colors"
              >
                Explore as a guest
              </button>
            </div>
          </div>

          {/* Bottom Organic Wave & Subtle Leaf Decoration */}
          <div className="relative pt-4 overflow-hidden pointer-events-none">
            <div className="absolute right-2 -bottom-2 text-brand-light/70 opacity-60">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.5 2 2 6.5 2 12c0 3 1.5 5.5 3.5 7.5L12 22l6.5-2.5C20.5 17.5 22 15 22 12c0-5.5-4.5-10-10-10zm0 18c-4.4 0-8-3.6-8-8 0-2.2.9-4.2 2.3-5.7l5.7 5.7 5.7-5.7C19.1 7.8 20 9.8 20 12c0 4.4-3.6 8-8 8z" />
              </svg>
            </div>
            {/* Subtle bottom green arc decoration */}
            <div className="h-2 w-full rounded-full bg-gradient-to-r from-brand-light/30 via-brand-light to-brand-light/30" />
          </div>

        </div>
      </div>
    </div>
  );
}
