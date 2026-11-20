import type { Metadata } from "next";
import HeroSection from "./components/HeroSection";
import FreshProduceSection from "./components/FreshProduceSection";
import FarmersSection from "./components/FarmersSection";
import HowItWorksSection from "./components/HowItWorksSection";
import FarmerCTASection from "./components/FarmerCTASection";

export const metadata: Metadata = {
  title: "FarmConnect — Fresh from local farms. Directly to your community.",
  description:
    "Discover fresh produce from verified local farmers near you. Connect directly. Buy with confidence.",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FreshProduceSection />
      <HowItWorksSection />
      <FarmersSection />
      <FarmerCTASection />
    </>
  );
}
