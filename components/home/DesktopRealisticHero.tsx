"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  MapPin,
  Clock,
  ShieldCheck,
  Plus,
  Check,
  Star,
  Sparkles,
  Banknote,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 xl:p-8 overflow-hidden">
        <div className="grid grid-cols-12 gap-8 items-center">
          {/* Left Column: Authentic Value Proposition (7 cols) */}
          <div className="col-span-7 space-y-6 pr-2 xl:pr-6">
            {/* Direct Farm-Gate Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Direct Farm-Gate Market • Zero Middlemen Markup</span>
            </div>

            {/* Main Editorial Headline */}
            <h1 className="text-4xl xl:text-5xl font-black text-slate-900 tracking-tight leading-[1.14]">
              Fresh morning harvest,{" "}
              <span className="text-brand-green">delivered directly</span> from local farms.
            </h1>

            {/* Subtitle */}
            <p className="text-base text-slate-600 leading-relaxed max-w-xl">
              Buy chemical-tested vegetables, seasonal fruits, and native staples
              harvested within 24 hours from verified smallholder farms in your district.
              Farmers receive fair prices; you get crisp, farm-fresh produce.
            </p>

            {/* Call to Actions */}
            <div className="flex items-center gap-3 pt-1">
              <Link href="/buyer/explore">
                <Button size="lg" className="h-12 px-7 text-sm font-bold bg-brand-green hover:bg-brand-dark text-white rounded-xl shadow-sm gap-2">
                  <span>Shop Today&apos;s Harvest</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/farmers">
                <Button variant="outline" size="lg" className="h-12 px-6 text-sm font-semibold text-slate-700 hover:text-brand-green border-slate-200 rounded-xl hover:bg-slate-50">
                  Meet Our Farmers
                </Button>
              </Link>
            </div>

            {/* Trust Highlights */}
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-brand-green flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 leading-none">Picked in 24h</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Peak freshness</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-brand-green flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 leading-none">100% Direct Payout</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Direct to farmer</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-brand-green flex items-center justify-center flex-shrink-0">
                  <Banknote className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 leading-none">Free COD & UPI</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">0% gateway fee</p>
                </div>
              </div>
            </div>

            {/* Trending Harvest Pills */}
            <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
              <span className="font-semibold text-slate-700 flex-shrink-0">Popular:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { name: "Vine Tomatoes", price: "₹35/kg" },
                  { name: "Palak", price: "₹25/bunch" },
                  { name: "Organic Carrots", price: "₹45/kg" },
                  { name: "Sona Masoori", price: "₹65/kg" },
                ].map((item) => (
                  <Link
                    key={item.name}
                    href={`/buyer/explore?search=${encodeURIComponent(item.name)}`}
                    className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 transition-colors"
                  >
                    {item.name} <span className="font-semibold text-slate-800">{item.price}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Real Harvest Spotlight (5 cols) */}
          <div className="col-span-5">
            <div className="bg-slate-50/90 rounded-2xl border border-slate-200/90 p-5 shadow-xs">
              {/* Card Header: Real Verified Farm */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-200/70">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden relative border border-slate-200 flex-shrink-0 bg-white">
                    <Image
                      src={featuredFarmer.profileImage || "https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=400&q=80"}
                      alt={featuredFarmer.farmName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-bold text-slate-900 text-sm xl:text-base leading-none">
                        {featuredFarmer.farmName}
                      </h2>
                      <Badge variant="outline" className="text-[10px] text-emerald-700 bg-emerald-50 border-emerald-200 py-0 h-4">
                        Verified
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>Bantwal, Dakshina Kannada • 2.4 km away</span>
                    </p>
                  </div>
                </div>

                <div className="text-right flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                  <span>4.8</span>
                </div>
              </div>

              {/* Harvest Time Notice */}
              <div className="flex items-center justify-between text-xs py-2.5 px-3 my-3 rounded-lg bg-emerald-50/80 border border-emerald-100 text-emerald-900">
                <span className="font-medium">Today&apos;s Morning Harvest</span>
                <span className="text-[11px] font-bold text-emerald-700">Picked 6:30 AM Today</span>
              </div>

              {/* Produce Items Showcase */}
              <div className="space-y-2.5">
                {featuredProducts.map((product) => {
                  const isAdded = !!addedIds[product.id];
                  return (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200/70 hover:border-slate-300 transition-all shadow-2xs group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-11 h-11 rounded-lg overflow-hidden relative bg-slate-100 flex-shrink-0">
                          {product.image && (
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate">
                            {product.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {formatCurrency(product.price)} / {product.unit} •{" "}
                            <span className="text-emerald-700 font-medium">In Stock</span>
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAddToCart(product)}
                        className={`h-8 px-3 rounded-lg text-xs font-bold flex items-center gap-1 transition-all flex-shrink-0 ${
                          isAdded
                            ? "bg-emerald-600 text-white"
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

              {/* Delivery Promise Footer */}
              <div className="mt-3.5 pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1 text-slate-700 font-medium">
                  <Truck className="w-3.5 h-3.5 text-brand-green" />
                  Same-day delivery: Order before 1:00 PM
                </span>
                <Link
                  href={`/buyer/farmers/${featuredFarmer.id}`}
                  className="font-bold text-brand-green hover:underline"
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
