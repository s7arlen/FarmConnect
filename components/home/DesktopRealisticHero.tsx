"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  MapPin,
  Plus,
  Check,
  Star,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DEMO_PRODUCTS, DEMO_FARMERS } from "@/data/demo";
import { useCartStore } from "@/store/cartStore";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

export default function DesktopRealisticHero() {
  const addItem = useCartStore((s) => s.addItem);
  const [addedIds, setAddedIds] = React.useState<Record<string, boolean>>({});

  // Featured farmer and products for realistic live harvest spotlight
  const featuredFarmer = DEMO_FARMERS[0]; // Joseph's Farm
  const featuredProducts = DEMO_PRODUCTS.slice(0, 3); // Tomatoes, Palak, etc.

  const handleAddToCart = (product: (typeof DEMO_PRODUCTS)[0]) => {
    addItem(product, 1);
    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    toast.success(`Added ${product.name} to your basket!`, {
      description: `${formatCurrency(product.price)} per ${product.unit} from ${featuredFarmer.farmName}`,
    });

    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1800);
  };

  return (
    <section aria-label="Fresh Harvest Marketplace Hero" className="w-full">
      <div className="relative rounded-2xl border border-emerald-950/20 shadow-md p-6 xl:p-8 overflow-hidden bg-brand-dark">
        {/* Authentic Farm Photography Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&q=80"
            alt="Lush green organic farm harvest at morning light"
            fill
            priority
            className="object-cover object-center"
          />
          {/* Natural Forest-to-Sunlit Farm Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/95 via-brand-dark/85 to-brand-dark/40" />
        </div>

        <div className="relative z-10 grid grid-cols-12 gap-8 items-center">
          {/* Left Column: Direct Store Value Proposition (7 cols) */}
          <div className="col-span-7 space-y-5 pr-2 xl:pr-6">
            {/* Main Editorial Headline */}
            <h1 className="text-4xl xl:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
              Fresh farm produce, delivered to your doorstep.
            </h1>

            {/* Subtitle */}
            <p className="text-base text-emerald-50/90 leading-relaxed max-w-xl">
              Order fresh vegetables, fruits, and daily cooking staples harvested
              directly by verified family farms in Bantwal and surrounding coastal Karnataka villages.
            </p>

            {/* Call to Actions */}
            <div className="flex items-center gap-3 pt-1">
              <Link href="/buyer/explore">
                <Button size="lg" className="h-11 px-6 text-sm font-semibold bg-brand-green hover:bg-emerald-600 text-white rounded-lg shadow-sm gap-2">
                  <span>Shop Fresh Produce</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/farmers">
                <Button variant="outline" size="lg" className="h-11 px-5 text-sm font-medium text-white hover:text-white border-white/30 rounded-lg hover:bg-white/10 bg-white/5">
                  View Local Farmers
                </Button>
              </Link>
            </div>

            {/* Realistic Guarantees Strip */}
            <div className="flex items-center gap-6 pt-4 border-t border-white/15 text-xs text-white/90 font-medium">
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Harvested fresh daily</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Fair prices for farmers</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Free Cash on Delivery & UPI</span>
              </div>
            </div>

            {/* Popular Items Text Links */}
            <div className="flex items-center gap-2 text-xs text-white/70 pt-1">
              <span className="font-semibold text-white">Popular:</span>
              <div className="flex items-center gap-2 text-white/80">
                <Link href="/buyer/explore?search=Tomatoes" className="hover:text-emerald-300 hover:underline">
                  Tomatoes (₹35/kg)
                </Link>
                <span>•</span>
                <Link href="/buyer/explore?search=Palak" className="hover:text-emerald-300 hover:underline">
                  Palak (₹25/bunch)
                </Link>
                <span>•</span>
                <Link href="/buyer/explore?search=Carrots" className="hover:text-emerald-300 hover:underline">
                  Carrots (₹45/kg)
                </Link>
                <span>•</span>
                <Link href="/buyer/explore?search=Rice" className="hover:text-emerald-300 hover:underline">
                  Sona Masoori
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Real Harvest Spotlight (5 cols) */}
          <div className="col-span-5">
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xl p-5">
              {/* Farmer Profile Header */}
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden relative border-2 border-slate-200 shadow-xs flex-shrink-0 bg-slate-100">
                    <Image
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80"
                      alt={featuredFarmer.farmName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900 text-base leading-tight">
                      {featuredFarmer.farmName}
                    </h2>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>Bantwal, Dakshina Kannada • 2.4 km away</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-semibold text-slate-700 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200/80">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  <span>4.8</span>
                  <span className="text-slate-400 text-[11px]">(47 reviews)</span>
                </div>
              </div>

              {/* Subheading: Fresh Harvest Available Today */}
              <div className="flex items-center justify-between py-2 text-xs text-slate-500 border-b border-slate-100 mb-1">
                <span className="font-semibold text-slate-800">Fresh Harvest Available Today</span>
                <span>Harvested at dawn</span>
              </div>

              {/* Produce Items Showcase (Clean list layout with dividers) */}
              <div className="divide-y divide-slate-100">
                {featuredProducts.map((product) => {
                  const isAdded = !!addedIds[product.id];
                  return (
                    <div
                      key={product.id}
                      className="flex items-center justify-between py-2.5 px-0.5 first:pt-1.5 last:pb-1 group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-lg overflow-hidden relative bg-slate-50 border border-slate-200/60 shadow-2xs flex-shrink-0">
                          {product.image && (
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate">
                            {product.name}
                          </p>
                          <p className="text-xs text-slate-600 font-medium mt-0.5">
                            <span className="font-bold text-slate-900">{formatCurrency(product.price)}</span> / {product.unit}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAddToCart(product)}
                        className={`h-8 px-3 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all flex-shrink-0 ${
                          isAdded
                            ? "bg-brand-green text-white"
                            : "bg-emerald-50 hover:bg-brand-green text-emerald-800 hover:text-white border border-emerald-200/80 shadow-2xs"
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Delivery Footer */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <Truck className="w-3.5 h-3.5 text-brand-green" />
                  Same-day delivery: Order before 1:00 PM
                </span>
                <Link
                  href={`/buyer/farmers/${featuredFarmer.id}`}
                  className="font-semibold text-brand-green hover:underline"
                >
                  View Farm Store →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
