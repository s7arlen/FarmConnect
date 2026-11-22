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
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 xl:p-8">
        <div className="grid grid-cols-12 gap-8 items-center">
          {/* Left Column: Direct Store Value Proposition (7 cols) */}
          <div className="col-span-7 space-y-5 pr-2 xl:pr-6">
            {/* Main Editorial Headline */}
            <h1 className="text-4xl xl:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Fresh farm produce, delivered to your doorstep.
            </h1>

            {/* Subtitle */}
            <p className="text-base text-slate-600 leading-relaxed max-w-xl">
              Order fresh vegetables, fruits, and daily cooking staples harvested
              directly by verified family farms in Bantwal and surrounding coastal Karnataka villages.
            </p>

            {/* Call to Actions */}
            <div className="flex items-center gap-3 pt-1">
              <Link href="/buyer/explore">
                <Button size="lg" className="h-11 px-6 text-sm font-semibold bg-brand-green hover:bg-brand-dark text-white rounded-lg shadow-xs gap-2">
                  <span>Shop Fresh Produce</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/farmers">
                <Button variant="outline" size="lg" className="h-11 px-5 text-sm font-medium text-slate-700 hover:text-brand-green border-slate-300 rounded-lg hover:bg-slate-50">
                  View Local Farmers
                </Button>
              </Link>
            </div>

            {/* Realistic Guarantees Strip */}
            <div className="flex items-center gap-6 pt-4 border-t border-slate-100 text-xs text-slate-600 font-medium">
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-brand-green flex-shrink-0" />
                <span>Harvested fresh daily</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-brand-green flex-shrink-0" />
                <span>Fair prices for farmers</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-brand-green flex-shrink-0" />
                <span>Free Cash on Delivery & UPI</span>
              </div>
            </div>

            {/* Popular Items Text Links */}
            <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
              <span className="font-semibold text-slate-700">Popular:</span>
              <div className="flex items-center gap-2 text-slate-600">
                <Link href="/buyer/explore?search=Tomatoes" className="hover:text-brand-green hover:underline">
                  Tomatoes (₹35/kg)
                </Link>
                <span>•</span>
                <Link href="/buyer/explore?search=Palak" className="hover:text-brand-green hover:underline">
                  Palak (₹25/bunch)
                </Link>
                <span>•</span>
                <Link href="/buyer/explore?search=Carrots" className="hover:text-brand-green hover:underline">
                  Carrots (₹45/kg)
                </Link>
                <span>•</span>
                <Link href="/buyer/explore?search=Rice" className="hover:text-brand-green hover:underline">
                  Sona Masoori
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Real Harvest Spotlight (5 cols) */}
          <div className="col-span-5">
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-5">
              {/* Card Header: Real Farm Info */}
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden relative border border-slate-200 flex-shrink-0 bg-white">
                    <Image
                      src={featuredFarmer.profileImage || "https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=400&q=80"}
                      alt={featuredFarmer.farmName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900 text-sm leading-tight">
                      {featuredFarmer.farmName}
                    </h2>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>Bantwal • 2.4 km away</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-semibold text-slate-700 bg-white px-2 py-1 rounded border border-slate-200">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>4.8 (47 reviews)</span>
                </div>
              </div>

              {/* Subheading */}
              <div className="flex items-center justify-between py-2 text-xs text-slate-500 border-b border-slate-100 mb-2.5">
                <span className="font-semibold text-slate-700">Available Today</span>
                <span>Harvested at 6:30 AM</span>
              </div>

              {/* Produce Items Showcase */}
              <div className="space-y-2">
                {featuredProducts.map((product) => {
                  const isAdded = !!addedIds[product.id];
                  return (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200 hover:border-slate-300 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-md overflow-hidden relative bg-slate-100 flex-shrink-0">
                          {product.image && (
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate">
                            {product.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {formatCurrency(product.price)} / {product.unit}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAddToCart(product)}
                        className={`h-8 px-3 rounded text-xs font-semibold flex items-center gap-1 transition-colors flex-shrink-0 ${
                          isAdded
                            ? "bg-brand-green text-white"
                            : "bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200"
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
              <div className="mt-3 pt-2.5 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1 text-slate-600">
                  <Truck className="w-3.5 h-3.5 text-brand-green" />
                  Same-day delivery: Order before 1:00 PM
                </span>
                <Link
                  href={`/buyer/farmers/${featuredFarmer.id}`}
                  className="font-semibold text-brand-green hover:underline"
                >
                  View Farm →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
