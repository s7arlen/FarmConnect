"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Package,
  ClipboardList,
  CheckCircle,
  Plus,
  ArrowRight,
  Layers,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import FarmHeroCard from "@/components/farmer/FarmHeroCard";
import { useAuthStore } from "@/store/authStore";
import { DEMO_PRODUCTS, DEMO_ORDERS, DEMO_FARMERS } from "@/data/demo";
import {
  formatCurrency,
  getOrderStatusLabel,
  getOrderStatusColor,
  formatRelativeTime,
} from "@/lib/utils";

export default function FarmerDashboardPage() {
  const user = useAuthStore((s) => s.user);
  const farmerId = user?.farmerId || "demo-farmer-1";

  const farmerInfo = DEMO_FARMERS.find((f) => f.id === farmerId) || {
    ...DEMO_FARMERS[0],
    ownerName: user?.name || DEMO_FARMERS[0].ownerName,
  };

  const products = DEMO_PRODUCTS.filter((p) => p.farmerId === farmerId);
  const orders = DEMO_ORDERS.filter((o) => o.farmerId === farmerId);
  const pendingOrders = orders.filter((o) => o.status === "REQUESTED" || o.status === "PREPARING");
  const completedOrders = orders.filter((o) => o.status === "COMPLETED");
  const totalSales = completedOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalStockUnits = products.reduce((sum, p) => sum + p.quantity, 0);

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      {/* GoParm-Inspired Farm Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <FarmHeroCard
          farmerName={user?.name || farmerInfo.ownerName || "Joseph D'Souza"}
          farmName={farmerInfo.farmName}
          location={farmerInfo.address || "Bantwal, Dakshina Kannada"}
          verified={farmerInfo.verified}
          avatarUrl={farmerInfo.profileImage}
          coverImageUrl={farmerInfo.coverImage}
          activeProductsCount={products.length}
          totalStockUnits={totalStockUnits}
          pendingOrdersCount={pendingOrders.length}
          completedOrdersCount={completedOrders.length}
          totalRevenue={totalSales}
        />
      </motion.div>

      {/* Main Dashboard Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders Section */}
        <section className="bg-white rounded-2xl border border-brand-border p-4 shadow-2xs">
          <div className="flex items-center justify-between mb-3.5">
            <div>
              <h2 className="text-base font-extrabold text-brand-dark">Active & Recent Orders</h2>
              <p className="text-xs text-brand-muted">Incoming buyer purchase requests</p>
            </div>
            <Link href="/farmer/orders">
              <Button variant="ghost" size="sm" className="gap-1 text-brand-green font-semibold text-xs h-8">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="py-8 text-center text-brand-muted text-xs bg-brand-cream/40 rounded-xl">
              No orders received yet.
            </div>
          ) : (
            <div className="space-y-2.5">
              {orders.slice(0, 4).map((order) => (
                <Link key={order.id} href={`/farmer/orders/${order.id}`}>
                  <div className="p-3 rounded-xl border border-brand-border/70 hover:border-brand-green/40 hover:bg-brand-cream/30 transition-all flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-brand-dark truncate">{order.buyerName}</p>
                      <p className="text-xs text-brand-muted mt-0.5">
                        {order.items?.length || 0} items • {formatRelativeTime(order.createdAt)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0 text-right">
                      <div>
                        <p className="font-extrabold text-sm text-brand-dark">
                          {formatCurrency(order.totalAmount)}
                        </p>
                        <Badge className={`${getOrderStatusColor(order.status)} text-[10px] py-0 px-2`} variant="secondary">
                          {getOrderStatusLabel(order.status)}
                        </Badge>
                      </div>
                      <ChevronRight className="w-4 h-4 text-brand-muted" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Live Produce & Quick Stock Section */}
        <section className="bg-white rounded-2xl border border-brand-border p-4 shadow-2xs">
          <div className="flex items-center justify-between mb-3.5">
            <div>
              <h2 className="text-base font-extrabold text-brand-dark">Farm Harvest Stock</h2>
              <p className="text-xs text-brand-muted">Quick inventory overview</p>
            </div>
            <Link href="/farmer/stock">
              <Button variant="ghost" size="sm" className="gap-1 text-brand-green font-semibold text-xs h-8">
                Manage Stock <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          {products.length === 0 ? (
            <div className="py-8 text-center text-brand-muted text-xs bg-brand-cream/40 rounded-xl">
              No produce listed.{" "}
              <Link href="/farmer/products/add" className="text-brand-green font-bold underline ml-1">
                Add your first crop
              </Link>
            </div>
          ) : (
            <div className="space-y-2.5">
              {products.slice(0, 4).map((product) => {
                const isOut = product.quantity === 0;
                const isLow = product.quantity > 0 && product.quantity < 30;

                return (
                  <div
                    key={product.id}
                    className="p-3 rounded-xl border border-brand-border/70 flex items-center justify-between gap-3 bg-white"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-brand-cream border border-brand-border overflow-hidden flex-shrink-0 flex items-center justify-center">
                        {product.image ? (
                          <Image src={product.image} alt={product.name} width={40} height={40} className="w-full h-full object-cover" />
                        ) : (
                          <Package className="w-5 h-5 text-brand-muted" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-sm text-brand-dark truncate">{product.name}</p>
                        <p className="text-xs text-brand-muted mt-0.5">
                          {formatCurrency(product.price)}/{product.unit} • {product.category}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0 text-right">
                      <div>
                        <span className="font-bold text-sm text-brand-dark tabular-nums">{product.quantity}</span>
                        <span className="text-[10px] text-brand-muted ml-0.5">{product.unit}</span>
                      </div>
                      <Badge
                        variant="secondary"
                        className={
                          isOut
                            ? "bg-red-50 text-brand-error text-[10px]"
                            : isLow
                            ? "bg-amber-50 text-amber-700 text-[10px]"
                            : "bg-brand-light text-brand-green text-[10px]"
                        }
                      >
                        {isOut ? "Out" : isLow ? "Low" : "Ready"}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
