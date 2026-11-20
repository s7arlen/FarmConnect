"use client";

import React from "react";
import { Inbox, Calendar, Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/shared/EmptyState";
import { formatCurrency, formatDate } from "@/lib/utils";

// Demo bulk requests that match this farmer
const DEMO_BULK_REQUESTS = [
  {
    id: "br-1",
    productName: "Fresh Tomatoes",
    quantity: 200,
    unit: "kg",
    maxPrice: 40,
    requiredDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    buyerName: "Grand Hotel Mangalore",
    matchScore: 92,
    notes: "Require firm, grade-A tomatoes for restaurant use.",
  },
  {
    id: "br-2",
    productName: "Onions",
    quantity: 100,
    unit: "kg",
    maxPrice: 30,
    requiredDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    buyerName: "City Grocery Store",
    matchScore: 78,
    notes: "Red onions preferred.",
  },
];

export default function BulkRequestsPage() {
  return (
    <div className="p-4 md:p-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand-text mb-1">Bulk Requests</h1>
        <p className="text-brand-muted text-sm">
          Bulk requirements from restaurants, hotels, and institutions that match your inventory.
        </p>
      </div>

      {DEMO_BULK_REQUESTS.length === 0 ? (
        <EmptyState
          icon={<Inbox className="w-8 h-8" />}
          title="No bulk requests yet"
          description="When buyers post bulk requirements matching your produce, they'll appear here."
        />
      ) : (
        <div className="space-y-4">
          {DEMO_BULK_REQUESTS.map((req) => {
            const scoreColor =
              req.matchScore >= 80 ? "text-brand-green" : req.matchScore >= 60 ? "text-amber-600" : "text-brand-muted";

            return (
              <Card key={req.id} className="hover:border-brand-green/50 transition-colors">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h3 className="font-semibold text-brand-text">{req.productName}</h3>
                      <p className="text-sm text-brand-muted">{req.buyerName}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className={`text-2xl font-black ${scoreColor}`}>{req.matchScore}%</p>
                      <p className="text-xs text-brand-muted">Match</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="flex items-center gap-1.5 text-sm text-brand-muted">
                      <Package className="w-3.5 h-3.5 text-brand-green" />
                      {req.quantity} {req.unit} needed
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-brand-muted">
                      <Calendar className="w-3.5 h-3.5 text-brand-green" />
                      By {formatDate(req.requiredDate)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-brand-muted">Max price:</span>
                    <span className="font-semibold text-brand-green">{formatCurrency(req.maxPrice)}/{req.unit}</span>
                  </div>

                  {req.notes && (
                    <p className="text-xs text-brand-muted bg-brand-light rounded-lg p-3 mb-4">
                      {req.notes}
                    </p>
                  )}

                  <div className="flex gap-2">
                    <Button className="flex-1" size="sm">Express Interest</Button>
                    <Button variant="outline" size="sm">Decline</Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
