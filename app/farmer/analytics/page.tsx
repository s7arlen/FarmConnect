"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Package, ShoppingBag, IndianRupee, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

const TIME_FILTERS = ["7 Days", "30 Days", "3 Months", "1 Year"];

// Demo analytics data
const SALES_DATA_7D = [
  { day: "Mon", sales: 1200, orders: 3 },
  { day: "Tue", sales: 800, orders: 2 },
  { day: "Wed", sales: 2100, orders: 5 },
  { day: "Thu", sales: 1500, orders: 4 },
  { day: "Fri", sales: 3200, orders: 8 },
  { day: "Sat", sales: 2800, orders: 7 },
  { day: "Sun", sales: 1900, orders: 5 },
];

const SALES_DATA_30D = Array.from({ length: 30 }, (_, i) => ({
  day: `${i + 1}`,
  sales: Math.floor(Math.random() * 3000) + 500,
  orders: Math.floor(Math.random() * 8) + 1,
}));

const TOP_PRODUCTS = [
  { name: "Fresh Tomatoes", sold: 142, revenue: 4970 },
  { name: "Red Onions", sold: 98, revenue: 2744 },
  { name: "Spinach", sold: 63, revenue: 2835 },
  { name: "French Beans", sold: 45, revenue: 2700 },
];

export default function FarmerAnalyticsPage() {
  const [activeFilter, setActiveFilter] = useState("7 Days");
  const chartData = activeFilter === "7 Days" ? SALES_DATA_7D : SALES_DATA_30D.slice(0, 30);

  const totalSales = chartData.reduce((sum, d) => sum + d.sales, 0);
  const totalOrders = chartData.reduce((sum, d) => sum + d.orders, 0);
  const avgOrder = totalOrders > 0 ? totalSales / totalOrders : 0;

  const stats = [
    {
      label: "Total Sales",
      value: formatCurrency(totalSales),
      icon: IndianRupee,
      change: "+12%",
      positive: true,
      color: "text-brand-green bg-brand-light",
    },
    {
      label: "Orders",
      value: totalOrders,
      icon: ShoppingBag,
      change: "+8%",
      positive: true,
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: "Avg. Order Value",
      value: formatCurrency(avgOrder),
      icon: TrendingUp,
      change: "+4%",
      positive: true,
      color: "text-purple-600 bg-purple-50",
    },
    {
      label: "Products Active",
      value: 6,
      icon: Package,
      change: "0%",
      positive: true,
      color: "text-amber-600 bg-amber-50",
    },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl">
      <div className="flex items-start justify-between mb-8 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-brand-text mb-1">Analytics</h1>
          <p className="text-brand-muted text-sm">Track your farm performance</p>
        </div>
        <div className="flex gap-2">
          {TIME_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                activeFilter === f
                  ? "bg-brand-green text-white border-brand-green"
                  : "bg-white border-brand-border text-brand-muted hover:border-brand-green"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${stat.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className={`text-xs font-semibold ${stat.positive ? "text-brand-green" : "text-brand-error"}`}>
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-xl font-bold text-brand-text">{stat.value}</p>
                  <p className="text-xs text-brand-muted mt-0.5">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Sales Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Sales Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2F6B3F" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#2F6B3F" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E1E6DF" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#6B756E" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#6B756E" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v}`} />
                <Tooltip
                  formatter={(value: number) => [formatCurrency(value), "Sales"]}
                  contentStyle={{ borderRadius: "8px", border: "1px solid #E1E6DF", fontSize: "12px" }}
                />
                <Area type="monotone" dataKey="sales" stroke="#2F6B3F" strokeWidth={2} fill="url(#salesGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Orders Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Orders per Day</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={chartData.slice(0, 7)} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E1E6DF" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#6B756E" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#6B756E" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #E1E6DF", fontSize: "12px" }} />
                <Bar dataKey="orders" fill="#2F6B3F" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Products */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-brand-green" />
            Top Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {TOP_PRODUCTS.map((product, i) => {
              const maxRevenue = TOP_PRODUCTS[0].revenue;
              const pct = (product.revenue / maxRevenue) * 100;
              return (
                <div key={product.name} className="flex items-center gap-4">
                  <span className="text-xs font-bold text-brand-muted w-4">{i + 1}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-brand-text">{product.name}</p>
                      <div className="text-right">
                        <span className="text-sm font-bold text-brand-text">{formatCurrency(product.revenue)}</span>
                        <span className="text-xs text-brand-muted ml-2">{product.sold} {product.name.includes("kg") ? "kg" : "units"} sold</span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-brand-light rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-brand-green rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.6, delay: i * 0.1 }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
