"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ClipboardList, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import EmptyState from "@/components/shared/EmptyState";
import { DEMO_ORDERS } from "@/data/demo";
import {
  formatCurrency,
  formatRelativeTime,
  getOrderStatusLabel,
  getOrderStatusColor,
} from "@/lib/utils";

const TABS = ["All", "Pending", "Active", "Completed"];

export default function FarmerOrdersPage() {
  const [activeTab, setActiveTab] = useState("All");
  const orders = DEMO_ORDERS.filter((o) => o.farmerId === "demo-farmer-1");

  const filtered = orders.filter((order) => {
    if (activeTab === "All") return true;
    if (activeTab === "Pending") return order.status === "REQUESTED";
    if (activeTab === "Active") return ["ACCEPTED", "PREPARING", "READY"].includes(order.status);
    if (activeTab === "Completed") return ["COMPLETED", "REJECTED", "CANCELLED"].includes(order.status);
    return true;
  });

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto pb-28 pb-safe">
      <h1 className="text-2xl font-bold text-brand-text mb-6">Orders</h1>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              activeTab === tab
                ? "bg-brand-green text-white border-brand-green"
                : "bg-white border-brand-border text-brand-muted hover:border-brand-green"
            }`}
          >
            {tab}
            {tab === "Pending" && orders.filter((o) => o.status === "REQUESTED").length > 0 && (
              <span className="ml-1.5 w-4 h-4 inline-flex items-center justify-center rounded-full bg-amber-500 text-white text-[9px] font-bold">
                {orders.filter((o) => o.status === "REQUESTED").length}
              </span>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<ClipboardList className="w-8 h-8" />}
          title="No orders here"
          description="Orders from buyers will appear here."
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => (
            <Link key={order.id} href={`/farmer/orders/${order.id}`}>
              <Card className="hover:border-brand-green/50 transition-colors">
                <CardContent className="p-4 flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="font-semibold text-brand-text">{order.buyerName}</p>
                      <Badge className={getOrderStatusColor(order.status)} variant="secondary">
                        {getOrderStatusLabel(order.status)}
                      </Badge>
                      <Badge variant="outline" className="text-xs text-brand-muted">
                        {order.paymentMethod === "UPI" ? "UPI" : "COD"}
                      </Badge>
                    </div>
                    <p className="text-xs text-brand-muted">
                      {order.items?.length || 0} item(s) · {formatRelativeTime(order.createdAt)}
                    </p>
                    {order.items && (
                      <p className="text-xs text-brand-muted mt-0.5">
                        {order.items.map((i) => i.productName).join(", ")}
                      </p>
                    )}
                  </div>
                  <div className="text-right flex items-center gap-2 flex-shrink-0">
                    <p className="font-bold text-brand-text">{formatCurrency(order.totalAmount)}</p>
                    <ArrowRight className="w-4 h-4 text-brand-muted" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
