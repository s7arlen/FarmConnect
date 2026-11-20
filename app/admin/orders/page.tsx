"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DEMO_ORDERS } from "@/data/demo";
import { formatCurrency, formatRelativeTime, getOrderStatusLabel, getOrderStatusColor } from "@/lib/utils";

export default function AdminOrdersPage() {
  return (
    <div className="p-4 md:p-8 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand-text mb-1">Orders</h1>
        <p className="text-brand-muted text-sm">All platform orders</p>
      </div>
      <div className="space-y-2">
        {DEMO_ORDERS.map((order) => (
          <Card key={order.id}>
            <CardContent className="p-4 flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-brand-text text-sm">{order.farmName}</p>
                  <span className="text-xs text-brand-muted">→ {order.buyerName}</span>
                  <Badge className={getOrderStatusColor(order.status)} variant="secondary">
                    {getOrderStatusLabel(order.status)}
                  </Badge>
                </div>
                <p className="text-xs text-brand-muted mt-0.5">{formatRelativeTime(order.createdAt)}</p>
              </div>
              <p className="font-bold text-brand-text text-sm flex-shrink-0">{formatCurrency(order.totalAmount)}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
