"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles, Sprout, Users, ShieldCheck } from "lucide-react";

export default function WelcomePage() {
  const router = useRouter();

  function handleGuestExplore() {
    // Set cookie to remember guest exploration
    document.cookie =
      "farmconnect_visited=1; path=/; max-age=31536000; SameSite=Lax";
    router.push("/?guest=1");
  }

  return (
    <div className="min-h-screen w-full bg-[#F4F7EE] lg:bg-[#0D1D0F] relative overflow-x-hidden selection:bg-[#53832F] selection:text-white flex flex-col justify-between">
      
      {/* =========================================================================
          DESKTOP BACKGROUND PHOTOGRAPHY (Vibrant Lush Green Crops at Sunrise)
      ========================================================================= */}
      <div className="fixed inset-0 z-0 pointer-events-none hidden lg:block">
        <Image
          src="/images/lush-crops-sunrise.jpg"
          alt="Lush green organic farmland crops bathed in morning golden sunrise"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center lg:object-[center_35%]"
        />
        {/* Atmospheric Desktop Gradient: Rich forest green on left -> golden sunrise on right */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1E0D]/95 via-[#0B1E0D]/80 to-[#0B1E0D]/30" />
      </div>

      {/* =========================================================================
          1. DESKTOP FULL-PAGE EXPERIENCE (Screen width >= 1024px)
      ========================================================================= */}
      <div className="hidden lg:flex relative z-10 w-full min-h-screen flex-col justify-between">
        
        {/* Full-Width Desktop Header */}
        <header className="w-full max-w-7xl mx-auto px-8 pt-8 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 group focus:outline-hidden focus:ring-2 focus:ring-[#53832F] rounded-xl"
            aria-label="FarmConnect Home"
          >
            <div className="w-11 h-11 rounded-2xl bg-[#53832F] flex items-center justify-center shadow-lg border border-white/20 group-hover:scale-105 transition-transform">
              <svg
                viewBox="0 0 24 24"
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
              </svg>
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-white drop-shadow-md block leading-tight">
                FarmConnect
              </span>
              <span className="text-xs text-[#C6E5B3] font-medium tracking-wide block">
                Direct Farm-to-Table Marketplace
              </span>
            </div>
          </Link>

          {/* Right Header: Login CTA */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-white/80 font-medium">
              Already have an account?
            </span>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm backdrop-blur-md transition-all shadow-xs group"
            >
              <span>Log in</span>
              <ArrowRight className="w-4 h-4 text-[#D6F0C7] group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </header>

        {/* Desktop Main Stage: Split Widescreen Showcase */}
        <main className="w-full max-w-7xl mx-auto px-8 py-12 flex-1 flex items-center justify-between gap-16">
          
          {/* Left Column: Bold Headline & Actions */}
          <div className="max-w-2xl text-white">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#53832F]/30 border border-[#7CB85C]/40 text-[#D6F0C7] text-xs font-semibold uppercase tracking-wider mb-6 backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Direct Local Agriculture</span>
            </div>

            <h1 className="text-5xl xl:text-6xl font-black leading-[1.08] tracking-tight drop-shadow-lg mb-6">
              Fresh from <br />
              local farms. <br />
              <span className="text-[#D6F0C7]">Directly to your community.</span>
            </h1>

            <p className="text-lg xl:text-xl text-white/90 leading-relaxed font-normal max-w-xl mb-10 drop-shadow-md">
              Discover vine-ripened produce from certified farmers near you, connect directly without middlemen, and buy with confidence.
            </p>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 mb-12">
              <Link
                href="/get-started/roles"
                className="h-14 px-8 rounded-2xl bg-gradient-to-r from-[#53832F] to-[#406E23] hover:from-[#487428] hover:to-[#38621E] active:scale-[0.985] text-white font-bold text-lg shadow-xl hover:shadow-2xl flex items-center gap-3 transition-all group"
              >
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5 stroke-[2.5] group-hover:translate-x-1.5 transition-transform" />
              </Link>

              <button
                type="button"
                onClick={handleGuestExplore}
                className="h-14 px-7 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/25 text-white font-semibold text-base backdrop-blur-md transition-all shadow-md cursor-pointer"
              >
                Explore as a guest
              </button>
            </div>

            {/* Platform Stats Row */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/15 max-w-lg">
              <div>
                <p className="text-2xl font-extrabold text-[#D6F0C7]">200+</p>
                <p className="text-xs text-white/70 font-medium mt-0.5">Local Farmers</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-[#D6F0C7]">50+</p>
                <p className="text-xs text-white/70 font-medium mt-0.5">Product Varieties</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-[#D6F0C7]">5,000+</p>
                <p className="text-xs text-white/70 font-medium mt-0.5">Happy Buyers</p>
              </div>
            </div>
          </div>

          {/* Right Column: 3 Frosted Feature Pillar Cards */}
          <div className="w-full max-w-md bg-[#0F2612]/75 backdrop-blur-xl rounded-3xl border border-white/15 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <h3 className="text-lg font-bold text-white tracking-tight mb-1">
              Why Choose FarmConnect?
            </h3>
            <p className="text-xs text-white/70 mb-6">
              A transparent, fair food ecosystem for growers and families.
            </p>

            <div className="space-y-4">
              {/* Pillar 1 */}
              <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-[#53832F] flex items-center justify-center shrink-0 shadow-sm text-white">
                  <Sprout className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#E2F4D5]">Discover local produce</h4>
                  <p className="text-xs text-white/80 leading-relaxed mt-0.5">
                    Search farm-fresh seasonal harvests harvested today by growers near you.
                  </p>
                </div>
              </div>

              {/* Pillar 2 */}
              <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-[#53832F] flex items-center justify-center shrink-0 shadow-sm text-white">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#E2F4D5]">Buy directly from farmers</h4>
                  <p className="text-xs text-white/80 leading-relaxed mt-0.5">
                    100% transparent pricing. Farmers earn fair compensation without broker cuts.
                  </p>
                </div>
              </div>

              {/* Pillar 3 */}
              <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-[#53832F] flex items-center justify-center shrink-0 shadow-sm text-white">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#E2F4D5]">Support your community</h4>
                  <p className="text-xs text-white/80 leading-relaxed mt-0.5">
                    Keep resources local and build sustainable, resilient regional food supplies.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick role selection link */}
            <div className="mt-6 pt-5 border-t border-white/10 text-center">
              <Link
                href="/get-started/roles"
                className="text-xs font-semibold text-[#D6F0C7] hover:underline underline-offset-4"
              >
                Join as Buyer, Farmer, or Bulk Buyer &rarr;
              </Link>
            </div>
          </div>

        </main>

        {/* Desktop Footer Bar */}
        <footer className="w-full max-w-7xl mx-auto px-8 pb-6 flex items-center justify-between text-xs text-white/50">
          <span>&copy; {new Date().getFullYear()} FarmConnect. All rights reserved.</span>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
            <Link href="/how-it-works" className="hover:text-white transition-colors">How It Works</Link>
            <Link href="/login" className="hover:text-white transition-colors">Log In</Link>
          </div>
        </footer>

      </div>

      {/* =========================================================================
          2. MOBILE APP-STYLE FULL-SCREEN EXPERIENCE (Screen width < 1024px)
          Seamless 100vw, no letterbox sidebars, vibrant lush green crops
      ========================================================================= */}
      <div className="lg:hidden relative z-10 w-full min-h-[100dvh] flex flex-col justify-between bg-[#F4F7EE] overflow-x-hidden">
        
        {/* Top Photographic Hero Container (55dvh) */}
        <section className="relative w-full h-[54dvh] min-h-[380px] max-h-[500px] overflow-hidden flex flex-col justify-between select-none">
          
          {/* Mobile Image Layer: Lush Vibrant Green Crops at Sunrise */}
          <Image
            src="/images/lush-crops-sunrise.jpg"
            alt="Lush green organic farmland crops bathed in morning golden sunrise"
            fill
            priority
            sizes="100vw"
            className="object-cover object-bottom"
          />

          {/* Photographic Lighting Overlays */}
          {/* Top bright morning sky gradient so dark green brand & login text are crisp */}
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/90 via-white/45 to-transparent pointer-events-none" />
          {/* Bottom vignette for readable white typography */}
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/75 via-black/35 to-transparent pointer-events-none" />

          {/* Mobile Header Bar */}
          <header className="relative z-20 flex items-center justify-between px-5 pt-4 sm:pt-6">
            <Link
              href="/"
              className="flex items-center gap-2 group focus:outline-hidden focus:ring-2 focus:ring-[#53832F] rounded-lg"
              aria-label="FarmConnect Home"
            >
              <div className="w-8 h-8 rounded-xl bg-[#4D8337] flex items-center justify-center shadow-xs border border-white/40 group-hover:scale-105 transition-transform">
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                  <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                </svg>
              </div>
              <span className="text-[#1C3617] font-extrabold text-lg tracking-tight">
                FarmConnect
              </span>
            </Link>

            {/* Right: "Already have an account? Log in →" */}
            <div className="text-right flex flex-col items-end">
              <span className="block text-[11px] text-[#3D5A36] font-medium leading-tight">
                Already have an account?
              </span>
              <Link
                href="/login"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#4D8337] hover:text-[#28552B] transition-colors group mt-0.5"
              >
                <span>Log in</span>
                <span className="group-hover:translate-x-0.5 transition-transform">→</span>
              </Link>
            </div>
          </header>

          {/* Mobile Hero Headline */}
          <div className="relative z-20 px-6 pb-8">
            <h1 className="text-[34px] sm:text-[38px] leading-[1.08] font-black text-white tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]">
              Fresh food.
              <br />
              <span className="text-[#D6F0C7]">Local roots.</span>
            </h1>
            <p className="mt-2.5 text-xs sm:text-[13px] text-white/95 max-w-[290px] font-medium leading-snug drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
              Connect with nearby farmers and bring fresh produce straight to your table.
            </p>
          </div>

          {/* Organic Wave Divider Transition */}
          <div className="absolute -bottom-1 left-0 right-0 w-full overflow-hidden leading-none z-10 pointer-events-none">
            <svg
              viewBox="0 0 500 70"
              preserveAspectRatio="none"
              className="relative block w-full h-11 sm:h-12 text-[#F4F7EE]"
              fill="currentColor"
            >
              <path d="M0,26 C90,4 190,52 300,32 C390,16 450,40 500,22 L500,70 L0,70 Z" />
            </svg>
          </div>
        </section>

        {/* Bottom Interactive Container: Soft Cream (#F4F7EE) */}
        <section className="relative z-20 bg-[#F4F7EE] flex-1 flex flex-col justify-between px-5 sm:px-6 pt-2 pb-6 max-w-lg mx-auto w-full">
          
          {/* 3 Modern Feature Cards (Pill Tiles) */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3 py-2 sm:py-3">
            
            {/* Feature 1 */}
            <div className="flex flex-col items-center text-center p-2.5 sm:p-3 rounded-2xl bg-white/80 border border-[#D5E5CD] shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-[#EAF5E1] text-[#4D8337] flex items-center justify-center mb-1.5 shadow-2xs">
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                  <path d="M6 19h12a1 1 0 0 1 0 2H6a1 1 0 0 1 0-2z" />
                  <path d="M11 12.5V19h2v-6.5c0-.1 0-.2 0-.3 2.7-.4 5.5-2.2 6.5-6.2.2-.9-.7-1.7-1.6-1.4-3.6 1.1-5.4 3.5-5.9 5.8-.5-2.3-2.3-4.7-5.9-5.8-.9-.3-1.8.5-1.6 1.4 1 4 3.8 5.8 6.5 6.2v.3z" />
                </svg>
              </div>
              <span className="text-xs font-bold text-[#1E351A] leading-tight block">
                Discover
              </span>
              <span className="text-[10px] text-[#4A6443] font-medium leading-tight block mt-0.5">
                local produce
              </span>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center text-center p-2.5 sm:p-3 rounded-2xl bg-white/80 border border-[#D5E5CD] shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-[#EAF5E1] text-[#4D8337] flex items-center justify-center mb-1.5 shadow-2xs">
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                  <path d="M3 10c0-.6.4-1 1-1h16a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1z" />
                  <path d="M7 9l1-4.2C8.2 3.8 9.1 3 10.1 3h3.8c1 0 1.9.8 2.1 1.8L17 9H7z" />
                  <circle cx="12" cy="13.5" r="2.8" />
                  <path d="M6.5 21c0-2.8 2.5-4.5 5.5-4.5s5.5 1.7 5.5 4.5H6.5z" />
                </svg>
              </div>
              <span className="text-xs font-bold text-[#1E351A] leading-tight block">
                Buy directly
              </span>
              <span className="text-[10px] text-[#4A6443] font-medium leading-tight block mt-0.5">
                from farmers
              </span>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center text-center p-2.5 sm:p-3 rounded-2xl bg-white/80 border border-[#D5E5CD] shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-[#EAF5E1] text-[#4D8337] flex items-center justify-center mb-1.5 shadow-2xs">
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                  <circle cx="12" cy="7" r="2.5" />
                  <path d="M8.5 17c0-2.2 1.6-3.8 3.5-3.8s3.5 1.6 3.5 3.8H8.5z" />
                  <circle cx="6.5" cy="9.5" r="2" />
                  <path d="M4 18c0-1.8 1.2-3 2.7-3 .6 0 1.2.2 1.6.6-.5.7-.8 1.6-.8 2.4H4z" />
                  <circle cx="17.5" cy="9.5" r="2" />
                  <path d="M16.5 18c0-.8-.3-1.7-.8-2.4.4-.4 1-.6 1.6-.6 1.5 0 2.7 1.2 2.7 3h-3.5z" />
                </svg>
              </div>
              <span className="text-xs font-bold text-[#1E351A] leading-tight block">
                Support your
              </span>
              <span className="text-[10px] text-[#4A6443] font-medium leading-tight block mt-0.5">
                community
              </span>
            </div>
          </div>

          {/* Primary & Secondary Actions */}
          <div className="flex flex-col items-center space-y-3 pt-2 sm:pt-3 w-full">
            <Link
              href="/get-started/roles"
              className="w-full h-14 min-h-[56px] shrink-0 bg-gradient-to-r from-[#53832F] to-[#406E23] hover:from-[#487428] hover:to-[#38621E] active:scale-[0.985] text-white font-bold text-lg rounded-2xl shadow-md flex items-center justify-center gap-2.5 transition-all group"
            >
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
            </Link>

            <button
              type="button"
              onClick={handleGuestExplore}
              className="py-1 text-sm font-semibold text-[#48752B] hover:text-[#28552B] underline decoration-[#53832F]/60 decoration-2 underline-offset-4 hover:decoration-[#28552B] transition-colors cursor-pointer"
            >
              Explore as a guest
            </button>
          </div>

          {/* Bottom Decorative Waves & Leaf */}
          <div className="relative mt-2 h-8 w-full overflow-hidden pointer-events-none">
            <svg
              viewBox="0 0 400 40"
              preserveAspectRatio="none"
              className="absolute inset-0 w-full h-full opacity-60"
            >
              <path
                d="M-20,30 Q100,10 220,25 T420,15 L420,40 L-20,40 Z"
                fill="#E2ECDB"
              />
              <path
                d="M-20,35 Q120,18 260,30 T420,22 L420,40 L-20,40 Z"
                fill="#D5E5CD"
              />
            </svg>

            <div className="absolute right-3 bottom-0.5">
              <svg
                viewBox="0 0 36 36"
                className="w-7 h-7 text-[#9FC491]"
                fill="currentColor"
              >
                <path d="M14 26c0-6 4.8-10.5 12-12-.4 7.5-4.8 12-12 12z" />
                <path d="M19 26c0-4.5 3.5-7.5 9-9-.3 5.5-3.5 9-9 9z" opacity="0.8" />
                <path
                  d="M13 27c3.5-.8 8-4.5 11.5-11.5"
                  stroke="#85B075"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </div>

            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-28 h-1 bg-black/20 rounded-full" />
          </div>

        </section>

      </div>

    </div>
  );
}
