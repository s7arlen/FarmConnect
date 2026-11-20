"use client";

import React from "react";
import { motion } from "framer-motion";
import { Search, Users, ShoppingBag } from "lucide-react";

const STEPS = [
  {
    number: "01",
    icon: Search,
    title: "Discover",
    description:
      "Browse fresh produce from nearby farms. Search by category, price, distance, or availability — all in one place.",
    color: "bg-brand-light text-brand-green",
  },
  {
    number: "02",
    icon: Users,
    title: "Connect",
    description:
      "View verified farm profiles, read reviews from real buyers, and know exactly who grows your food.",
    color: "bg-amber-50 text-amber-600",
  },
  {
    number: "03",
    icon: ShoppingBag,
    title: "Order",
    description:
      "Add to cart and send an order request directly to the farmer. Track your order from acceptance to pickup.",
    color: "bg-blue-50 text-blue-600",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="section bg-brand-cream">
      <div className="container-page">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-brand-green text-sm font-semibold uppercase tracking-wide mb-2">
            Simple Process
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-brand-text">
            How It Works
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                className="relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                {/* Connector */}
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-px border-t-2 border-dashed border-brand-border" />
                )}

                <div className="relative z-10">
                  {/* Number */}
                  <div className="text-7xl font-black text-brand-border/60 absolute -top-4 -left-2 select-none">
                    {step.number}
                  </div>

                  <div className={`relative w-16 h-16 rounded-2xl ${step.color} flex items-center justify-center mb-6`}>
                    <Icon className="w-7 h-7" />
                  </div>

                  <h3 className="text-xl font-bold text-brand-text mb-3">
                    {step.title}
                  </h3>
                  <p className="text-brand-muted leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
