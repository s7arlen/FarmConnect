"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import FarmerCard from "@/components/farmers/FarmerCard";
import { DEMO_FARMERS, DEMO_PRODUCTS } from "@/data/demo";

export default function FarmersSection() {
  const featured = DEMO_FARMERS.slice(0, 3);

  function getFarmerProducts(farmerId: string): string[] {
    return DEMO_PRODUCTS.filter((p) => p.farmerId === farmerId)
      .map((p) => p.name)
      .slice(0, 4);
  }

  return (
    <section className="section bg-white">
      <div className="container-page">
        <div className="flex items-end justify-between mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-brand-green text-sm font-semibold uppercase tracking-wide mb-2">
              Local Farms
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-brand-text">
              Meet the Farmers
            </h2>
            <p className="text-brand-muted mt-3 max-w-md">
              Verified local farmers who grow your food with care.
            </p>
          </motion.div>

          <Link href="/buyer/farmers" className="hidden md:block">
            <Button variant="outline" className="gap-2">
              All Farmers
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((farmer, i) => (
            <FarmerCard
              key={farmer.id}
              farmer={farmer}
              products={getFarmerProducts(farmer.id)}
              index={i}
            />
          ))}
        </div>

        <div className="mt-8 md:hidden text-center">
          <Link href="/buyer/farmers">
            <Button variant="outline" className="gap-2">
              View All Farmers
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
