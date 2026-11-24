import type { Metadata } from "next";
import HowItWorksSection from "@/app/(marketing)/components/HowItWorksSection";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "How It Works — FarmConnect",
  description: "Learn how FarmConnect connects local farmers with buyers for fresh, direct produce.",
};

export default function HowItWorksPage() {
  return (
    <div className="w-full">
      <HowItWorksSection />
      <section className="section bg-white">
        <div className="container-page max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-brand-text mb-4">Ready to start?</h2>
          <p className="text-brand-muted mb-8">Join FarmConnect and access fresh local produce today.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/register?role=BUYER"><Button size="lg">I want to buy</Button></Link>
            <Link href="/register?role=FARMER"><Button size="lg" variant="outline">I want to sell</Button></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
