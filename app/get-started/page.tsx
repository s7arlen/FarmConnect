"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Leaf, ArrowRight } from "lucide-react";

export default function WelcomePage() {
  const router = useRouter();

  function handleGuestExplore() {
    // Set cookie to remember guest exploration
    document.cookie = "farmconnect_visited=1; path=/; max-age=31536000; SameSite=Lax";
    router.push("/?guest=1");
  }

  return (
    <div className="min-h-screen bg-[#EAEFE5] sm:py-6 flex items-center justify-center p-0">
      {/* Mobile-Proportion Screen Container (Full screen on mobile, device card on desktop) */}
      <div className="w-full sm:max-w-[420px] bg-[#F2F6EC] sm:rounded-[36px] shadow-2xl overflow-hidden flex flex-col min-h-screen sm:min-h-[860px] relative border border-black/5">
        
        {/* Top Floating App Bar (Floating transparently over the farm photograph) */}
        <div className="absolute top-0 left-0 right-0 z-20 px-5 pt-8 sm:pt-6 pb-2 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-[#53832F] rounded-xl flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <Leaf className="w-4.5 h-4.5 text-white stroke-[2.2]" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-[#1A261A] drop-shadow-[0_1px_3px_rgba(255,255,255,0.8)]">
              FarmConnect
            </span>
          </Link>

          {/* Login Link */}
          <div className="text-right">
            <span className="text-[11px] font-medium text-[#203020] block drop-shadow-[0_1px_2px_rgba(255,255,255,0.7)]">
              Already have an account?
            </span>
            <Link
              href="/login"
              className="inline-flex items-center gap-0.5 text-xs font-bold text-[#53832F] hover:text-[#3B621E] transition-colors drop-shadow-[0_1px_2px_rgba(255,255,255,0.6)]"
            >
              <span>Log in</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </Link>
          </div>
        </div>

        {/* Hero Section: Full bleed crop photograph + Headline */}
        <div className="relative h-[56vh] min-h-[400px] max-h-[520px] w-full flex flex-col justify-end p-6 overflow-hidden">
          {/* Background Image: Farm crop rows under sunrise */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/farm-sunrise-clean.jpg"
              alt="Lush green Karnataka crop fields at sunrise"
              fill
              priority
              className="object-cover object-right-top sm:object-center"
            />
            {/* Natural Vignette Overlay: Light sky at top, readable dark gradient at base */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/25 via-transparent to-black/65" />
          </div>

          {/* Headline Typography on Image */}
          <div className="relative z-10 mb-2">
            <h1 className="text-4xl sm:text-[44px] font-black text-white leading-[1.08] tracking-tight drop-shadow-md">
              Fresh food. <br />
              <span className="text-[#D6F0C7]">Local roots.</span>
            </h1>

            <p className="text-[13px] sm:text-sm text-white/95 font-medium leading-relaxed max-w-[285px] mt-2.5 drop-shadow-sm">
              Connect with nearby farmers and bring fresh produce straight to your table.
            </p>
          </div>
        </div>

        {/* Smooth Organic Wave Divider */}
        <div className="relative w-full overflow-hidden leading-none z-10 -mt-6">
          <svg
            viewBox="0 0 500 48"
            preserveAspectRatio="none"
            className="w-full h-8 sm:h-9 text-[#F2F6EC] fill-current"
          >
            <path d="M0,22 C140,48 340,0 500,26 L500,48 L0,48 Z" />
          </svg>
        </div>

        {/* Lower Card Section (Off-white / Pale Mint) */}
        <div className="relative z-10 bg-[#F2F6EC] px-6 pt-1 pb-6 flex-1 flex flex-col justify-between">
          
          {/* Three Feature Highlights (No circular background, direct green glyphs) */}
          <div className="grid grid-cols-3 divide-x divide-[#DCE5D5] py-2">
            
            {/* Feature 1: Discover local produce */}
            <div className="flex flex-col items-center text-center px-1">
              <div className="mb-2 text-[#53832F]">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L12 22l7.03-4.39C20.26 16.07 21 14.12 21 12c0-4.97-4.03-9-9-9zm-1 14.5v-3.79c-1.83-.44-3.24-1.93-3.56-3.83 2.15.17 3.91 1.63 4.47 3.63.56-2 2.32-3.46 4.47-3.63-.32 1.9-1.73 3.39-3.56 3.83v3.79c-1.07.13-1.07.13-1.82 0z" />
                </svg>
              </div>
              <span className="text-xs font-extrabold text-[#202A20] leading-tight">Discover</span>
              <span className="text-[11px] font-normal text-[#202A20] leading-tight mt-0.5">local produce</span>
            </div>

            {/* Feature 2: Buy directly from farmers */}
            <div className="flex flex-col items-center text-center px-1">
              <div className="mb-2 text-[#53832F]">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  {/* Farmer with wide hat & shoulders */}
                  <path d="M12 2a4 4 0 0 0-4 4v1H6a2 2 0 0 0-2 2 8 8 0 0 0 16 0 2 2 0 0 0-2-2h-2V6a4 4 0 0 0-4-4zm-8 8c1-1 3.5-1.5 8-1.5s7 .5 8 1.5c0 0-3.5 1.5-8 1.5s-8-1.5-8-1.5zm8 4c2.21 0 4 1.79 4 4v2H8v-2c0-2.21 1.79-4 4-4z" />
                </svg>
              </div>
              <span className="text-xs font-extrabold text-[#202A20] leading-tight">Buy directly</span>
              <span className="text-[11px] font-normal text-[#202A20] leading-tight mt-0.5">from farmers</span>
            </div>

            {/* Feature 3: Support your community */}
            <div className="flex flex-col items-center text-center px-1">
              <div className="mb-2 text-[#53832F]">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  {/* Three community people */}
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                </svg>
              </div>
              <span className="text-xs font-extrabold text-[#202A20] leading-tight">Support your</span>
              <span className="text-[11px] font-normal text-[#202A20] leading-tight mt-0.5">community</span>
            </div>
          </div>

          {/* Action Area */}
          <div className="space-y-3.5 pt-2">
            {/* Get Started Button */}
            <Link
              href="/get-started/roles"
              className="w-full h-13 rounded-2xl bg-[#53832F] hover:bg-[#436E23] text-white font-bold text-base flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99]"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </Link>

            {/* Explore as a guest */}
            <div className="text-center pt-0.5">
              <button
                type="button"
                onClick={handleGuestExplore}
                className="text-xs sm:text-sm font-bold text-[#53832F] hover:text-[#3B621E] underline underline-offset-4 decoration-[#53832F]/60 transition-colors py-0.5"
              >
                Explore as a guest
              </button>
            </div>
          </div>

          {/* Bottom Layered Pastel Waves & Delicate Leaf Accent */}
          <div className="relative pt-3 -mx-6 -mb-6 mt-1 pointer-events-none">
            {/* Twin leaf illustration in bottom-right */}
            <div className="absolute right-4 bottom-7 text-[#9DCB79] z-10">
              <svg width="42" height="42" viewBox="0 0 36 36" fill="none">
                <path d="M12 28C10 22 13 14 20 10C21 16 19 23 12 28Z" fill="#9DCB79" />
                <path d="M20 28C22 23 20 17 28 15C27 21 24 26 20 28Z" fill="#88B860" opacity="0.85" />
              </svg>
            </div>

            {/* Undulating pastel green bottom decoration */}
            <svg viewBox="0 0 500 70" preserveAspectRatio="none" className="w-full h-12">
              <path d="M0,35 C160,15 320,55 500,25 L500,70 L0,70 Z" fill="#E4F0D6" />
              <path d="M0,48 C180,32 340,60 500,42 L500,70 L0,70 Z" fill="#D5E8C0" />
            </svg>

            {/* Smartphone Home Indicator Bar */}
            <div className="bg-[#D5E8C0] pb-2 pt-0.5 flex justify-center">
              <div className="w-32 h-1 rounded-full bg-black/80" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
