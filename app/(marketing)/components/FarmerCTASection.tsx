"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Users, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const BENEFITS = [
  {
    icon: Users,
    title: "Direct Buyers",
    description: "Reach consumers and businesses without middlemen",
  },
  {
    icon: TrendingUp,
    title: "Better Prices",
    description: "Set your own price and keep more of what you earn",
  },
  {
    icon: ShieldCheck,
    title: "Trusted Platform",
    description: "Verified farmer badge builds buyer confidence",
  },
];

export default function FarmerCTASection() {
  return (
    <section className="section bg-brand-dark text-white overflow-hidden relative">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <Image
          src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1800&q=40"
          alt=""
          fill
          className="object-cover"
          aria-hidden="true"
        />
      </div>

      <div className="container-page relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-brand-light/60 text-sm font-semibold uppercase tracking-wide mb-3">
              For Farmers
            </p>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-5">
              Your farm.
              <br />
              Your customers.
              <br />
              <span className="text-brand-light">Your price.</span>
            </h2>
            <p className="text-white/60 text-lg leading-relaxed mb-8 max-w-md">
              FarmConnect helps local farmers reach individual buyers and bulk
              buyers directly — without the hassle of traditional markets.
            </p>
            <Link href="/register?role=FARMER">
              <Button
                size="xl"
                className="gap-2 bg-brand-green hover:bg-green-600 font-semibold"
              >
                Start Selling
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>

          {/* Right — Benefits */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {BENEFITS.map((benefit, i) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={benefit.title}
                  className="flex items-start gap-4 bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
                >
                  <div className="w-10 h-10 rounded-lg bg-brand-green/20 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-brand-light" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{benefit.title}</h3>
                    <p className="text-white/50 text-sm">{benefit.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
