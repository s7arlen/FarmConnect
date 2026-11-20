"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Package,
  ClipboardList,
  CheckCircle,
  TrendingUp,
  Plus,
  ArrowRight,
  IndianRupee,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/authStore";
import { DEMO_PRODUCTS, DEMO_ORDERS } from "@/data/demo";
import {
  formatCurrency,
  getOrderStatusLabel,
  getOrderStatusColor,
  formatRelativeTime,
} from "@/lib/utils";

export default function FarmerDashboardPage() {
  const user = useAuthStore((s) => s.user);
  const name = user?.name?.split(" ")[0] || "Farmer";

  const farmerId = "demo-farmer-1"; // In production: from session.farmerId
  const products = DEMO_PRODUCTS.filter((p) => p.farmerId === farmerId);
  const orders = DEMO_ORDERS.filter((o) => o.farmerId === farmerId);
  const pendingOrders = orders.filter((o) => o.status === "REQUESTED");
  const completedOrders = orders.filter((o) => o.status === "COMPLETED");
  const totalSales = completedOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  const stats = [
    {
      label: "Products",
      value: products.length,
      icon: Package,
      color: "text-blue-600 bg-blue-50",
      href: "/farmer/products",
    },
    {
      label: "Pending Orders",
      value: pendingOrders.length,
      icon: ClipboardList,
      color: "text-amber-600 bg-amber-50",
      href: "/farmer/orders",
    },
    {
      label: "Completed",
      value: completedOrders.length,
      icon: CheckCircle,
      color: "text-brand-green bg-brand-light",
      href: "/farmer/orders",
    },
    {
      label: "Total Sales",
      value: formatCurrency(totalSales),
      icon: IndianRupee,
      color: "text-purple-600 bg-purple-50",
      href: "/farmer/analytics",
    },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between mb-8 flex-wrap gap-3"
      >
        <div>
          <p className="text-brand-muted text-sm">Good day,</p>
          <h1 className="text-3xl font-bold text-brand-text">{name} 🌾</h1>
        </div>
        <Link href="/farmer/products/add">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Produce
          </Button>
        </Link>
      </motion.div>

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
              <Link href={stat.href}>
                <Card className="hover:border-brand-green/50 transition-colors cursor-pointer">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${stat.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-brand-text leading-tight">{stat.value}</p>
                      <p className="text-xs text-brand-muted">{stat.label}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-brand-text">Recent Orders</h2>
            <Link href="/farmer/orders">
              <Button variant="ghost" size="sm" className="gap-1 text-brand-green">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
          {orders.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-brand-muted text-sm">
                No orders yet
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 5).map((order) => (
                <Link key={order.id} href={`/farmer/orders/${order.id}`}>
                  <Card className="hover:border-brand-green/50 transition-colors">
                    <CardContent className="p-4 flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-brand-text text-sm">{order.buyerName}</p>
                        <p className="text-xs text-brand-muted">
                          {order.items?.length || 0} item(s) · {formatRelativeTime(order.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge className={getOrderStatusColor(order.status)} variant="secondary">
                          {getOrderStatusLabel(order.status)}
                        </Badge>
                        <p className="font-bold text-brand-text text-sm">
                          {formatCurrency(order.totalAmount)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Products */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-brand-text">Your Produce</h2>
            <Link href="/farmer/products">
              <Button variant="ghost" size="sm" className="gap-1 text-brand-green">
                Manage <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
          {products.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-brand-muted text-sm mb-3">No products listed yet.</p>
                <Link href="/farmer/products/add">
                  <Button size="sm" className="gap-2">
                    <Plus className="w-3.5 h-3.5" />
                    Add First Product
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {products.map((product) => (
                <Card key={product.id}>
                  <CardContent className="p-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-brand-light flex items-center justify-center text-lg flex-shrink-0">
                      🌱
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-brand-text text-sm truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-brand-muted">
                        {product.quantity} {product.unit} · {formatCurrency(product.price)}/{product.unit}
                      </p>
                    </div>
                    <Badge
                      variant={
                        product.status === "AVAILABLE"
                          ? "default"
                          : product.status === "LIMITED"
                          ? "limited"
                          : "unavailable"
                      }
                    >
                      {product.status}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
