"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  Heart,
  MapPin,
  ArrowRight,
  Search,
  Boxes,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ProductCard from "@/components/products/ProductCard";
import FarmerCard from "@/components/farmers/FarmerCard";
import { useAuthStore } from "@/store/authStore";
import { DEMO_PRODUCTS, DEMO_FARMERS, DEMO_ORDERS } from "@/data/demo";
import { formatCurrency, getOrderStatusLabel, getOrderStatusColor, formatRelativeTime } from "@/lib/utils";

export default function BuyerDashboardPage() {
  const user = useAuthStore((s) => s.user);
  const name = user?.name?.split(" ")[0] || "there";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const stats = [
    { label: "Orders", value: "3", icon: ShoppingBag, color: "text-blue-600 bg-blue-50" },
    { label: "Saved", value: "12", icon: Heart, color: "text-rose-600 bg-rose-50" },
    { label: "Farmers", value: "4", icon: MapPin, color: "text-amber-600 bg-amber-50" },
    { label: "Saved ₹", value: "₹480", icon: TrendingUp, color: "text-brand-green bg-brand-light" },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl">
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <p className="text-brand-muted text-sm">{greeting},</p>
        <h1 className="text-3xl font-bold text-brand-text">{name} 👋</h1>
        <p className="text-brand-muted text-sm mt-1 flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5" />
          Mangalore, Karnataka
        </p>
      </motion.div>

      {/* Search */}
      <Link href="/buyer/explore" className="block mb-8">
        <div className="flex items-center gap-3 bg-white border border-brand-border rounded-xl px-4 py-3 hover:border-brand-green transition-colors">
          <Search className="w-4 h-4 text-brand-muted" />
          <span className="text-brand-muted text-sm">Search vegetables, fruits, grains...</span>
        </div>
      </Link>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${stat.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-brand-text">{stat.value}</p>
                    <p className="text-xs text-brand-muted">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Fresh Today */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-brand-text">Fresh Today</h2>
          <Link href="/buyer/explore">
            <Button variant="ghost" size="sm" className="gap-1 text-brand-green">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {DEMO_PRODUCTS.slice(0, 4).map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </section>

      {/* Nearby Farmers */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-brand-text">Nearby Farmers</h2>
          <Link href="/buyer/farmers">
            <Button variant="ghost" size="sm" className="gap-1 text-brand-green">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DEMO_FARMERS.slice(0, 3).map((farmer, i) => (
            <FarmerCard key={farmer.id} farmer={farmer} index={i} />
          ))}
        </div>
      </section>

      {/* Recent Orders */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-brand-text">Recent Orders</h2>
          <Link href="/buyer/orders">
            <Button variant="ghost" size="sm" className="gap-1 text-brand-green">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
        <div className="space-y-3">
          {DEMO_ORDERS.map((order) => (
            <Link key={order.id} href={`/buyer/orders/${order.id}`}>
              <Card className="hover:border-brand-green/50 transition-colors">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-brand-text text-sm truncate">
                        {order.farmName}
                      </p>
                      <Badge className={getOrderStatusColor(order.status)} variant="secondary">
                        {getOrderStatusLabel(order.status)}
                      </Badge>
                    </div>
                    <p className="text-xs text-brand-muted">
                      {order.items?.length || 0} item(s) · {formatRelativeTime(order.createdAt)}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-brand-text">{formatCurrency(order.totalAmount)}</p>
                    <ChevronRightIcon />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Bulk Buying CTA */}
      <section>
        <Card className="bg-brand-dark text-white border-0 overflow-hidden relative">
          <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-brand-green to-transparent" />
          <CardContent className="p-6 relative z-10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Boxes className="w-8 h-8 text-brand-light mb-3" />
                <h3 className="text-lg font-bold mb-1">Need large quantities?</h3>
                <p className="text-white/60 text-sm max-w-sm">
                  Post your bulk requirement and find matching farmers automatically.
                  Perfect for restaurants, hotels, and institutions.
                </p>
              </div>
              <Link href="/buyer/bulk" className="flex-shrink-0">
                <Button variant="secondary" size="sm" className="gap-1">
                  Get Started <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function ChevronRightIcon() {
  return <ArrowRight className="w-4 h-4 text-brand-muted mt-0.5" />;
}
