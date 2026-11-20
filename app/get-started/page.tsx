"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

export default function WelcomePage() {
  const router = useRouter();

  function handleGuestExplore() {
    // Set cookie to remember guest exploration
    document.cookie =
      "farmconnect_visited=1; path=/; max-age=31536000; SameSite=Lax";
    router.push("/?guest=1");
  }

  return (
    <div className="min-h-screen bg-[#112413] flex items-center justify-center p-0 lg:p-6 overflow-x-hidden selection:bg-[#53832F] selection:text-white">
      {/* =========================================================================
          DESKTOP AMBIENT DECORATIVE GREEN BACKDROP (Only visible on lg+ screens)
      ========================================================================= */}
      <div className="fixed inset-0 pointer-events-none hidden lg:block overflow-hidden">
        {/* Ambient radial glow */}
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-[#3B7026]/20 rounded-full blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-[#4D8B38]/20 rounded-full blur-[140px]" />
        
        {/* Subtle agricultural background branding */}
        <div className="absolute top-12 left-12 text-white/20 select-none">
          <div className="flex items-center gap-3">
            <svg
              viewBox="0 0 24 24"
              className="w-8 h-8 text-[#53832F]/50"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
            </svg>
            <span className="text-xl font-bold tracking-tight text-white/40">FarmConnect</span>
          </div>
          <p className="mt-2 text-xs text-white/30 max-w-xs">
            Direct farm-to-table agricultural marketplace empowering local growers.
          </p>
        </div>

        <div className="absolute bottom-12 right-12 text-right text-white/30 text-xs hidden xl:block select-none">
          <p className="font-semibold text-white/50">200+ Local Organic Farms</p>
          <p className="text-white/30">Connecting Communities with Fresh Produce</p>
        </div>
      </div>

      {/* =========================================================================
          MAIN CONTAINER:
          Mobile: Full screen (100vw, 100dvh)
          Desktop: Elegant centered mobile frame with rounded corners and shadow
      ========================================================================= */}
      <main className="relative w-full max-w-[440px] min-h-screen sm:min-h-[100dvh] lg:min-h-[820px] lg:max-h-[90vh] bg-[#F4F7EE] sm:rounded-none lg:rounded-[38px] shadow-[0_25px_60px_rgba(0,0,0,0.45)] lg:border lg:border-[#2C4D2E]/40 overflow-hidden flex flex-col justify-between">
        
        {/* =======================================================================
            TOP HERO SECTION: Real High-Res Agricultural Photography
        ======================================================================= */}
        <section className="relative w-full h-[56dvh] min-h-[380px] max-h-[500px] lg:h-[450px] overflow-hidden flex flex-col justify-between select-none">
          
          {/* Real Next.js Responsive Image */}
          <Image
            src="/images/lush-crops-sunrise.jpg"
            alt="Lush green crop rows with golden sunrise in farm field"
            fill
            priority
            sizes="(max-width: 640px) 100vw, 440px"
            className="object-cover object-bottom"
          />

          {/* Photographic lighting overlays for readability */}
          {/* Top subtle vignette for header bar */}
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/45 via-black/20 to-transparent pointer-events-none" />
          
          {/* Bottom vignette for bold headlines */}
          <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/60 via-black/25 to-transparent pointer-events-none" />

          {/* =====================================================================
              TOP HEADER BAR: Logo & Login Action
          ===================================================================== */}
          <header className="relative z-20 flex items-center justify-between px-5 pt-4 sm:pt-6">
            
            {/* Brand Logo: Green leaf badge + FarmConnect */}
            <Link
              href="/"
              className="flex items-center gap-2 group focus:outline-hidden focus:ring-2 focus:ring-[#53832F] rounded-lg"
              aria-label="FarmConnect Home"
            >
              <div className="w-8 h-8 rounded-xl bg-[#4D8337] flex items-center justify-center shadow-md border border-white/20 group-hover:scale-105 transition-transform">
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
              <span className="text-white font-extrabold text-lg tracking-tight drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]">
                FarmConnect
              </span>
            </Link>

            {/* Right: "Already have an account? Log in →" */}
            <div className="text-right">
              <span className="block text-[11px] text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] font-medium">
                Already have an account?
              </span>
              <Link
                href="/login"
                className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#D6F0C7] hover:text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] transition-colors group"
              >
                <span>Log in</span>
                <span className="group-hover:translate-x-0.5 transition-transform">→</span>
              </Link>
            </div>
          </header>

          {/* =====================================================================
              HERO TYPOGRAPHY: Headline & Subtitle
          ===================================================================== */}
          <div className="relative z-20 px-6 pb-8">
            <h1 className="text-[34px] sm:text-[38px] leading-[1.08] font-black text-white tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]">
              Fresh food.
              <br />
              <span className="text-[#D6F0C7]">Local roots.</span>
            </h1>
            <p className="mt-2.5 text-xs sm:text-[13px] text-white/95 max-w-[280px] font-medium leading-snug drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
              Connect with nearby farmers and bring fresh produce straight to your table.
            </p>
          </div>

          {/* =====================================================================
              ORGANIC WAVE DIVIDER: Seamless transition to bottom cream container
          ===================================================================== */}
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

        {/* =======================================================================
            BOTTOM INTERACTIVE CONTAINER: Soft Cream (#F4F7EE)
        ======================================================================= */}
        <section className="relative z-20 bg-[#F4F7EE] flex-1 flex flex-col justify-between px-6 pt-1 pb-6">
          
          {/* =====================================================================
              1. THREE FEATURE HIGHLIGHTS (With Dividers)
          ===================================================================== */}
          <div className="grid grid-cols-3 divide-x divide-[#D6E2CD] py-3 sm:py-4">
            
            {/* Feature 1: Discover local produce */}
            <div className="flex flex-col items-center text-center px-1">
              {/* Sprout Icon */}
              <div className="mb-2 text-[#4D8337]">
                <svg
                  viewBox="0 0 24 24"
                  className="w-7 h-7"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M6 19h12a1 1 0 0 1 0 2H6a1 1 0 0 1 0-2z" />
                  <path d="M11 12.5V19h2v-6.5c0-.1 0-.2 0-.3 2.7-.4 5.5-2.2 6.5-6.2.2-.9-.7-1.7-1.6-1.4-3.6 1.1-5.4 3.5-5.9 5.8-.5-2.3-2.3-4.7-5.9-5.8-.9-.3-1.8.5-1.6 1.4 1 4 3.8 5.8 6.5 6.2v.3z" />
                </svg>
              </div>
              <span className="text-[13px] font-bold text-[#1E351A] leading-tight block">
                Discover
              </span>
              <span className="text-[11px] text-[#4A6443] font-medium leading-tight block mt-0.5">
                local produce
              </span>
            </div>

            {/* Feature 2: Buy directly from farmers */}
            <div className="flex flex-col items-center text-center px-1">
              {/* Farmer with brim hat Icon */}
              <div className="mb-2 text-[#4D8337]">
                <svg
                  viewBox="0 0 24 24"
                  className="w-7 h-7"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M3 10c0-.6.4-1 1-1h16a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1z" />
                  <path d="M7 9l1-4.2C8.2 3.8 9.1 3 10.1 3h3.8c1 0 1.9.8 2.1 1.8L17 9H7z" />
                  <circle cx="12" cy="13.5" r="2.8" />
                  <path d="M6.5 21c0-2.8 2.5-4.5 5.5-4.5s5.5 1.7 5.5 4.5H6.5z" />
                </svg>
              </div>
              <span className="text-[13px] font-bold text-[#1E351A] leading-tight block">
                Buy directly
              </span>
              <span className="text-[11px] text-[#4A6443] font-medium leading-tight block mt-0.5">
                from farmers
              </span>
            </div>

            {/* Feature 3: Support your community */}
            <div className="flex flex-col items-center text-center px-1">
              {/* 3 People Community Icon */}
              <div className="mb-2 text-[#4D8337]">
                <svg
                  viewBox="0 0 24 24"
                  className="w-7 h-7"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="7" r="2.5" />
                  <path d="M8.5 17c0-2.2 1.6-3.8 3.5-3.8s3.5 1.6 3.5 3.8H8.5z" />
                  <circle cx="6.5" cy="9.5" r="2" />
                  <path d="M4 18c0-1.8 1.2-3 2.7-3 .6 0 1.2.2 1.6.6-.5.7-.8 1.6-.8 2.4H4z" />
                  <circle cx="17.5" cy="9.5" r="2" />
                  <path d="M16.5 18c0-.8-.3-1.7-.8-2.4.4-.4 1-.6 1.6-.6 1.5 0 2.7 1.2 2.7 3h-3.5z" />
                </svg>
              </div>
              <span className="text-[13px] font-bold text-[#1E351A] leading-tight block">
                Support your
              </span>
              <span className="text-[11px] text-[#4A6443] font-medium leading-tight block mt-0.5">
                community
              </span>
            </div>
          </div>

          {/* =====================================================================
              2. PRIMARY & SECONDARY ACTIONS
          ===================================================================== */}
          <div className="flex flex-col items-center space-y-3.5 pt-2 sm:pt-4 w-full">
            
            {/* Primary Action Button: "Get Started →" (Plush, prominent height matching design) */}
            <Link
              href="/get-started/roles"
              className="w-full h-14 min-h-[56px] shrink-0 bg-[#53832F] hover:bg-[#467226] active:bg-[#3D6321] active:scale-[0.985] text-white font-bold text-lg rounded-2xl shadow-md hover:shadow-lg flex items-center justify-center gap-2.5 transition-all group"
            >
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* Secondary Action Link: "Explore as a guest" */}
            <button
              type="button"
              onClick={handleGuestExplore}
              className="py-1 text-sm font-semibold text-[#48752B] hover:text-[#28552B] underline decoration-[#53832F]/60 decoration-2 underline-offset-4 hover:decoration-[#28552B] transition-colors cursor-pointer"
            >
              Explore as a guest
            </button>
          </div>

          {/* =====================================================================
              3. DECORATIVE SOFT BOTTOM WAVES & TWIN LEAF
          ===================================================================== */}
          <div className="relative mt-2 h-9 w-full overflow-hidden pointer-events-none">
            {/* Bottom pastel curves */}
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

            {/* Twin leaves accent in bottom right */}
            <div className="absolute right-3 bottom-1">
              <svg
                viewBox="0 0 36 36"
                className="w-8 h-8 text-[#9FC491]"
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

            {/* Bottom Home Indicator Bar (App feel) */}
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-black/20 rounded-full" />
          </div>

        </section>

      </main>
    </div>
  );
}
