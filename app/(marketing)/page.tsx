import type { Metadata } from "next";
import LocationSelector from "@/components/home/LocationSelector";
import HomeSearchBar from "@/components/home/HomeSearchBar";
import CompactHeroBanner from "@/components/home/CompactHeroBanner";
import TrustStatsCard from "@/components/home/TrustStatsCard";
import DesktopRealisticHero from "@/components/home/DesktopRealisticHero";
import PopularCategories from "@/components/home/PopularCategories";
import FreshTodayHomeSection from "@/components/home/FreshTodayHomeSection";
import NearbyFarmersSection from "@/components/home/NearbyFarmersSection";
import PopularProductsSection from "@/components/home/PopularProductsSection";
import SellOnFarmConnectCard from "@/components/home/SellOnFarmConnectCard";
import HowItWorksSection from "./components/HowItWorksSection";

export const metadata: Metadata = {
  title: "FarmConnect — Fresh from local farms. Directly to your community.",
  description:
    "Discover fresh produce from verified local farmers near you. Connect directly, and buy with confidence.",
};

export default function HomePage() {
  return (
    <div className="w-full">
      {/* Main Container: Mobile App-Width on small screens, Full Grid on Desktop */}
      <div className="max-w-lg lg:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-6 lg:py-8 space-y-4 sm:space-y-6 lg:space-y-10">
        {/* MOBILE VIEW ONLY (< 1024px) */}
        <div className="lg:hidden space-y-3.5 sm:space-y-4">
          <LocationSelector />
          <HomeSearchBar />
          <CompactHeroBanner />
          <TrustStatsCard />
        </div>

        {/* DESKTOP VIEW ONLY (>= 1024px): Realistic, Non-AI Hero & Live Produce Spotlight */}
        <div className="hidden lg:block">
          <DesktopRealisticHero />
        </div>

        {/* 5. Category Shortcuts (Popular Categories) */}
        <section aria-label="Popular Categories" className="w-full pt-1">
          <PopularCategories />
        </section>

        {/* 6. Marketplace: Fresh Today */}
        <section aria-label="Fresh Today" className="w-full pt-1">
          <FreshTodayHomeSection />
        </section>

        {/* 7. Nearby Farmers */}
        <section aria-label="Nearby Farmers" className="w-full pt-1">
          <NearbyFarmersSection />
        </section>

        {/* 8. Popular Products */}
        <section aria-label="Popular Products" className="w-full pt-1">
          <PopularProductsSection />
        </section>

        {/* 9. Sell on FarmConnect Promotional Card */}
        <section aria-label="For Farmers" className="w-full pt-1">
          <SellOnFarmConnectCard />
        </section>

        {/* 10. How It Works (Comprehensive view for desktop buyers) */}
        <div className="hidden lg:block pt-4 border-t border-brand-border">
          <HowItWorksSection />
        </div>
      </div>
    </div>
  );
}
