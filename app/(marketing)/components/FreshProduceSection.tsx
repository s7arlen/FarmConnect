"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/products/ProductCard";
import { DEMO_PRODUCTS } from "@/data/demo";

export default function FreshProduceSection() {
  const featured = DEMO_PRODUCTS.slice(0, 4);

  return (
    <section className="section bg-white">
      <div className="container-page">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-brand-green text-sm font-semibold uppercase tracking-wide mb-2">
              Available Now
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-brand-text leading-tight">
              Fresh Today
            </h2>
            <p className="text-brand-muted mt-3 max-w-md">
              Fresh produce available from local farmers in your area.
            </p>
          </motion.div>

          <Link href="/buyer/explore" className="hidden md:block">
            <Button variant="outline" className="gap-2">
              View All
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featured.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-8 md:hidden text-center">
          <Link href="/buyer/explore">
            <Button variant="outline" className="gap-2">
              View All Produce
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
