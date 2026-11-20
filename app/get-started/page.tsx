"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function WelcomePage() {
  const router = useRouter();

  function handleGuestExplore() {
    // Set cookie to remember guest exploration
    document.cookie = "farmconnect_visited=1; path=/; max-age=31536000; SameSite=Lax";
    router.push("/?guest=1");
  }

  return (
    <div className="min-h-screen bg-[#E5ECE0] flex items-center justify-center p-0 sm:p-4 lg:p-6 overflow-x-hidden">
      {/* Centered Device Frame on Desktop, Full Bleed on Mobile */}
      <div className="relative w-full max-w-[472px] aspect-[472/1024] max-h-screen sm:max-h-[92vh] sm:rounded-[36px] shadow-2xl overflow-hidden bg-[#F2F6EC] select-none">
        
        {/* The Exact Pixel-Perfect Design Asset from Reference */}
        <Image
          src="/welcome/welcome-clean-statusbar.jpg"
          alt="FarmConnect — Fresh food. Local roots. Connect with nearby farmers."
          fill
          priority
          sizes="(max-width: 640px) 100vw, 472px"
          className="object-cover object-center pointer-events-none"
        />

        {/* =========================================================================
            INTERACTIVE ACCESSIBLE HOTSPOTS (Mapped to exact visual button coordinates)
        ========================================================================= */}

        {/* 1. FarmConnect Logo Home Hotspot */}
        <Link
          href="/"
          aria-label="FarmConnect Home"
          className="absolute top-[5.2%] left-[4.5%] w-[42%] h-[5.2%] z-20 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#53832F] cursor-pointer"
        />

        {/* 2. Log in Navigation Hotspot */}
        <Link
          href="/login"
          aria-label="Already have an account? Log in"
          className="absolute top-[5.2%] right-[4%] w-[42%] h-[5.2%] z-20 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#53832F] hover:bg-black/5 active:bg-black/10 transition-colors cursor-pointer"
        />

        {/* 3. Primary "Get Started →" Button Hotspot */}
        <Link
          href="/get-started/roles"
          aria-label="Get Started"
          className="absolute top-[74.6%] left-[4.8%] w-[90.4%] h-[6.8%] z-20 rounded-2xl focus:outline-hidden focus:ring-4 focus:ring-white/80 active:scale-[0.985] transition-transform cursor-pointer"
        />

        {/* 4. Secondary "Explore as a guest" Link Hotspot */}
        <button
          type="button"
          onClick={handleGuestExplore}
          aria-label="Explore as a guest"
          className="absolute top-[83.2%] left-[26%] w-[48%] h-[4.2%] z-20 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#53832F] hover:bg-black/5 active:bg-black/10 transition-colors cursor-pointer"
        />

      </div>
    </div>
  );
}
