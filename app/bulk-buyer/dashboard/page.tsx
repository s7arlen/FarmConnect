"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FileText, TrendingUp, ClipboardList, Plus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/store/authStore";

export default function BulkBuyerDashboardPage() {
  const user = useAuthStore((s) => s.user);
  const name = user?.name || "there";

  const stats = [
    { label: "Active Requirements", value: "2", icon: FileText, color: "text-blue-600 bg-blue-50", href: "/bulk-buyer/requirements" },
    { label: "Farmer Matches", value: "8", icon: TrendingUp, color: "text-brand-green bg-brand-light", href: "/bulk-buyer/matches" },
    { label: "Active Orders", value: "1", icon: ClipboardList, color: "text-amber-600 bg-amber-50", href: "/bulk-buyer/orders" },
  ];

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto pb-safe">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold text-brand-text">Welcome, {name.split(" ")[0]}</h1>
        <p className="text-brand-muted mt-1">Manage bulk procurement from local farms.</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              <Link href={stat.href}>
                <Card className="hover:border-brand-green/50 transition-colors cursor-pointer">
                  <CardContent className="p-5 flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-brand-text">{stat.value}</p>
                      <p className="text-xs text-brand-muted">{stat.label}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* CTA */}
      <Card className="bg-brand-dark text-white border-0">
        <CardContent className="p-6 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-lg font-bold mb-1">Need fresh produce in bulk?</h2>
            <p className="text-white/60 text-sm">Post a requirement and let our matching system find the best farmers.</p>
          </div>
          <Link href="/bulk-buyer/requirements/create">
            <Button className="gap-2 bg-brand-green hover:bg-green-600">
              <Plus className="w-4 h-4" />
              New Requirement
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
