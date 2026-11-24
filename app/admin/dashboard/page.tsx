"use client";

import React from "react";
import { motion } from "framer-motion";
import { Users, UserCheck, Package, ShoppingBag, TrendingUp, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar,
} from "recharts";
import { DEMO_FARMERS, DEMO_PRODUCTS, DEMO_ORDERS } from "@/data/demo";
import { formatCurrency, getOrderStatusLabel, getOrderStatusColor, formatRelativeTime } from "@/lib/utils";

const GROWTH_DATA = Array.from({ length: 12 }, (_, i) => ({
  month: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i],
  users: Math.floor(20 + i * 18 + Math.random() * 25),
  orders: Math.floor(5 + i * 8 + Math.random() * 15),
  farmers: Math.floor(2 + i * 2 + Math.random() * 3),
}));

export default function AdminDashboardPage() {
  const stats = [
    { label: "Total Users", value: "247", icon: Users, change: "+23 this month", color: "text-blue-600 bg-blue-50" },
    { label: "Verified Farmers", value: String(DEMO_FARMERS.filter(f => f.verified).length), icon: UserCheck, change: `${DEMO_FARMERS.length} total`, color: "text-brand-green bg-brand-light" },
    { label: "Active Products", value: String(DEMO_PRODUCTS.filter(p => p.status === "AVAILABLE").length), icon: Package, change: `${DEMO_PRODUCTS.length} total`, color: "text-purple-600 bg-purple-50" },
    { label: "Total Orders", value: String(DEMO_ORDERS.length), icon: ShoppingBag, change: "+12 this week", color: "text-amber-600 bg-amber-50" },
    { label: "Platform GMV", value: formatCurrency(128450), icon: TrendingUp, change: "+18% MoM", color: "text-emerald-600 bg-emerald-50" },
    { label: "Pending Verification", value: "4", icon: AlertCircle, change: "Needs review", color: "text-red-600 bg-red-50" },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-brand-text">Admin Dashboard</h1>
        <p className="text-brand-muted text-sm mt-1">Platform overview and management</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${stat.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-brand-text">{stat.value}</p>
                  <p className="text-sm font-medium text-brand-text mt-0.5">{stat.label}</p>
                  <p className="text-xs text-brand-muted mt-0.5">{stat.change}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">User Growth</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={GROWTH_DATA}>
                <defs>
                  <linearGradient id="usersGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#163A24" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#163A24" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E1E6DF" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#6B756E" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#6B756E" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #E1E6DF", fontSize: "12px" }} />
                <Area type="monotone" dataKey="users" stroke="#163A24" strokeWidth={2} fill="url(#usersGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Monthly Orders</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={GROWTH_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E1E6DF" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#6B756E" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#6B756E" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #E1E6DF", fontSize: "12px" }} />
                <Bar dataKey="orders" fill="#2F6B3F" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-base">Recent Orders</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {DEMO_ORDERS.map((order) => (
              <div key={order.id} className="flex items-center justify-between py-2 border-b border-brand-border/50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-brand-text">{order.farmName}</p>
                  <p className="text-xs text-brand-muted">{formatRelativeTime(order.createdAt)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={getOrderStatusColor(order.status)} variant="secondary">
                    {getOrderStatusLabel(order.status)}
                  </Badge>
                  <span className="font-semibold text-brand-text text-sm">{formatCurrency(order.totalAmount)}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
