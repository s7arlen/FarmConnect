"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ClipboardList, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import EmptyState from "@/components/shared/EmptyState";
import { DEMO_ORDERS } from "@/data/demo";
import {
  formatCurrency,
  formatRelativeTime,
  getOrderStatusLabel,
  getOrderStatusColor,
} from "@/lib/utils";

const STATUS_TABS = ["All", "Active", "Completed", "Cancelled"];

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [orders, setOrders] = useState<any[]>(DEMO_ORDERS);

  React.useEffect(() => {
    let localOrders: any[] = [];
    try {
      const recent = localStorage.getItem("recent_orders");
      if (recent) localOrders = JSON.parse(recent);
    } catch {}

    fetch("/api/orders")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const remote = data?.orders || [];
        const map = new Map<string, any>();
        [...localOrders, ...remote, ...DEMO_ORDERS].forEach((o) => {
          if (o?.id && !map.has(o.id)) map.set(o.id, o);
        });
        setOrders(Array.from(map.values()));
      })
      .catch(() => {
        if (localOrders.length > 0) {
          const map = new Map<string, any>();
          [...localOrders, ...DEMO_ORDERS].forEach((o) => {
            if (o?.id && !map.has(o.id)) map.set(o.id, o);
          });
          setOrders(Array.from(map.values()));
        }
      });
  }, []);

  const filtered = orders.filter((order) => {
    if (activeTab === "All") return true;
    if (activeTab === "Active")
      return ["REQUESTED", "ACCEPTED", "PREPARING", "READY"].includes(order.status);
    if (activeTab === "Completed") return order.status === "COMPLETED";
    if (activeTab === "Cancelled")
      return order.status === "CANCELLED" || order.status === "REJECTED";
    return true;
  });

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-brand-text mb-6">My Orders</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {STATUS_TABS.map((tab) => (
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
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<ClipboardList className="w-8 h-8" />}
          title="No orders yet"
          description="Your orders will appear here once you place them."
          action={{ label: "Explore Produce", href: "/buyer/explore" }}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => (
            <Link key={order.id} href={`/buyer/orders/${order.id}`}>
              <Card className="hover:border-brand-green/50 transition-colors cursor-pointer">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <p className="font-semibold text-brand-text">{order.farmName}</p>
                        <Badge className={getOrderStatusColor(order.status)} variant="secondary">
                          {getOrderStatusLabel(order.status)}
                        </Badge>
                        <Badge variant="outline" className="text-xs text-brand-muted">
                          {order.paymentMethod === "UPI" ? "UPI (0% fee)" : "Cash on Delivery"}
                        </Badge>
                      </div>
                      <p className="text-sm text-brand-muted">
                        {order.items?.length || 0} item(s) ·{" "}
                        {formatRelativeTime(order.createdAt)}
                      </p>
                      {order.items && (
                        <p className="text-xs text-brand-muted mt-1">
                          {order.items.map((i: any) => i.productName).join(", ")}
                        </p>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0 flex items-center gap-2">
                      <p className="font-bold text-brand-text">
                        {formatCurrency(order.totalAmount)}
                      </p>
                      <ArrowRight className="w-4 h-4 text-brand-muted" />
                    </div>
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
