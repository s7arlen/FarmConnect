"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ClipboardList, Package, Calendar, ArrowRight, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import EmptyState from "@/components/shared/EmptyState";
import { formatCurrency, formatDate, getOrderStatusLabel, getOrderStatusColor } from "@/lib/utils";
import type { OrderStatus } from "@/types/order";

const DEMO_BULK_ORDERS = [
  {
    id: "bulk-ord-1",
    farmerName: "Joseph's Farm",
    farmerAddress: "Bantwal, Karnataka",
    productName: "Fresh Tomatoes (Grade A)",
    quantity: 200,
    unit: "kg",
    totalAmount: 8000,
    status: "PREPARING" as OrderStatus,
    preferredDate: "2026-11-28",
    createdAt: new Date("2026-11-18"),
  },
  {
    id: "bulk-ord-2",
    farmerName: "Maria's Organic Farm",
    farmerAddress: "Moodbidri, Karnataka",
    productName: "Red Onions",
    quantity: 150,
    unit: "kg",
    totalAmount: 5250,
    status: "COMPLETED" as OrderStatus,
    preferredDate: "2026-11-15",
    createdAt: new Date("2026-11-10"),
  },
];

export default function BulkOrdersPage() {
  const [orders] = useState(DEMO_BULK_ORDERS);

  return (
    <div className="p-4 md:p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-brand-text mb-1">Bulk Orders</h1>
          <p className="text-brand-muted text-sm">
            Track wholesale shipments and fulfillment status
          </p>
        </div>
        <Link href="/bulk-buyer/requirements/create">
          <Button size="sm" className="gap-2">
            New Requirement
          </Button>
        </Link>
      </div>

      {orders.length === 0 ? (
        <EmptyState
          icon={<ClipboardList className="w-8 h-8" />}
          title="No bulk orders yet"
          description="Orders placed through bulk requirements appear here."
          action={{ label: "Create Requirement", href: "/bulk-buyer/requirements/create" }}
        />
      ) : (
        <div className="space-y-4">
          {orders.map((ord) => (
            <Card key={ord.id} className="hover:border-brand-green/50 transition-colors shadow-sm">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-brand-text text-base">{ord.productName}</h3>
                      <Badge className={getOrderStatusColor(ord.status)}>
                        {getOrderStatusLabel(ord.status)}
                      </Badge>
                    </div>

                    <p className="text-sm font-medium text-brand-text/80">
                      Supplied by: <span className="text-brand-green">{ord.farmerName}</span> ({ord.farmerAddress})
                    </p>

                    <div className="flex items-center gap-4 text-xs text-brand-muted pt-1 flex-wrap">
                      <span className="flex items-center gap-1 font-semibold text-brand-text">
                        <Package className="w-3.5 h-3.5 text-brand-green" />
                        {ord.quantity} {ord.unit}
                      </span>
                      <span>Total: {formatCurrency(ord.totalAmount)}</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        Target: {formatDate(new Date(ord.preferredDate))}
                      </span>
                      <span className="flex items-center gap-1">
                        <Truck className="w-3.5 h-3.5" />
                        Local Delivery
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Link href={`/buyer/orders/${ord.id}`}>
                      <Button variant="outline" size="sm" className="gap-1.5">
                        View Details
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
