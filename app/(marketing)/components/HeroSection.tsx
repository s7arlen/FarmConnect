"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-brand-dark">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1800&q=80"
          alt="Local farm landscape"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/90 via-brand-dark/70 to-brand-dark/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] mb-6">
              Fresh from local farms.
              <br />
              <span className="text-brand-light">Directly to your community.</span>
            </h1>

            <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-8 max-w-xl">
              Discover fresh produce from farmers near you, connect directly,
              and buy with confidence.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link href="/buyer/explore">
                <Button size="xl" className="gap-2 bg-white text-brand-green hover:bg-brand-light font-semibold">
                  Explore Produce
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/register?role=FARMER">
                <Button
                  size="xl"
                  variant="outline"
                  className="gap-2 border-white/30 text-white bg-transparent hover:bg-white/10 hover:text-white"
                >
                  Sell Your Produce
                </Button>
              </Link>
            </div>

            {/* Trust stats */}
            <div className="flex flex-wrap gap-8 mt-12">
              {[
                { value: "200+", label: "Local Farmers" },
                { value: "50+", label: "Product Varieties" },
                { value: "5,000+", label: "Happy Buyers" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-white/50">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-10" />
    </section>
  );
}
