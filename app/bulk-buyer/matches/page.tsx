"use client";

import React, { useState } from "react";
import Link from "next/link";
import { TrendingUp, CheckCircle, MapPin, Phone, Mail, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StarRating from "@/components/shared/StarRating";
import EmptyState from "@/components/shared/EmptyState";
import { DEMO_FARMERS, DEMO_PRODUCTS } from "@/data/demo";
import { computeMatchScore } from "@/lib/matching";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import type { BulkRequest } from "@/types/bulkRequest";

export default function BulkMatchesPage() {
  const [activeTab, setActiveTab] = useState<"all" | "high">("all");

  const sampleReq: BulkRequest = {
    id: "r1",
    buyerId: "demo-bulk-1",
    productName: "Fresh Tomatoes",
    quantity: 200,
    unit: "kg",
    maxPrice: 40,
    requiredDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    status: "OPEN",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const matches = DEMO_FARMERS.map((farmer) => {
    const products = DEMO_PRODUCTS.filter((p) => p.farmerId === farmer.id);
    const result = computeMatchScore(sampleReq, farmer as Parameters<typeof computeMatchScore>[1], products);
    return { farmer, result };
  })
    .filter((m) => activeTab === "all" || m.result.matchScore >= 70)
    .sort((a, b) => b.result.matchScore - a.result.matchScore);

  function handleOrderRequest(farmerName: string) {
    toast.success(`Procurement request sent to ${farmerName}!`);
  }

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-text mb-1">Farmer Matches</h1>
          <p className="text-brand-muted text-sm">
            Top ranked farms compatible with your active bulk requirements
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant={activeTab === "all" ? "default" : "outline"}
            onClick={() => setActiveTab("all")}
          >
            All Matches ({DEMO_FARMERS.length})
          </Button>
          <Button
            size="sm"
            variant={activeTab === "high" ? "default" : "outline"}
            onClick={() => setActiveTab("high")}
          >
            High Compatibility (&ge;70%)
          </Button>
        </div>
      </div>

      {matches.length === 0 ? (
        <EmptyState
          icon={<TrendingUp className="w-8 h-8" />}
          title="No matches found"
          description="Adjust your requirement criteria to broaden matching."
          action={{ label: "Create Requirement", href: "/bulk-buyer/requirements/create" }}
        />
      ) : (
        <div className="space-y-4">
          {matches.map(({ farmer, result }) => {
            const score = result.matchScore;
            const scoreColor =
              score >= 80 ? "text-green-600 bg-green-50 border-green-200" :
              score >= 60 ? "text-amber-600 bg-amber-50 border-amber-200" :
              "text-gray-600 bg-gray-50 border-gray-200";

            return (
              <Card key={farmer.id} className="hover:border-brand-green/50 transition-all shadow-sm">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <h3 className="font-bold text-brand-text text-lg">{farmer.farmName}</h3>
                        {farmer.verified && (
                          <Badge variant="verified" className="gap-1">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Verified Farm
                          </Badge>
                        )}
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${scoreColor}`}>
                          {score}% Match Score
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-brand-muted mb-3 flex-wrap">
                        <StarRating rating={Number(farmer.rating)} showValue reviewCount={farmer.reviewCount} />
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-brand-muted" />
                          {farmer.address}
                        </span>
                      </div>

                      <p className="text-sm text-brand-muted mb-4 line-clamp-2">
                        {farmer.description}
                      </p>

                      {/* Criteria breakdown */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-brand-light/60 p-3 rounded-lg text-xs">
                        <div>
                          <span className="text-brand-muted block">Product Fit:</span>
                          <span className="font-semibold text-brand-text">
                            {result.breakdown.productCompatibility}%
                          </span>
                        </div>
                        <div>
                          <span className="text-brand-muted block">Quantity Fit:</span>
                          <span className="font-semibold text-brand-text">
                            {result.breakdown.quantityCompatibility}%
                          </span>
                        </div>
                        <div>
                          <span className="text-brand-muted block">Distance:</span>
                          <span className="font-semibold text-brand-text">
                            {result.breakdown.distance}%
                          </span>
                        </div>
                        <div>
                          <span className="text-brand-muted block">Price Fit:</span>
                          <span className="font-semibold text-brand-text">
                            {result.breakdown.price}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 w-full sm:w-auto flex-shrink-0">
                      <Button
                        size="sm"
                        onClick={() => handleOrderRequest(farmer.farmName)}
                        className="gap-2"
                      >
                        Request Order
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                      <Link href={`/buyer/farmers/${farmer.id}`}>
                        <Button size="sm" variant="outline" className="w-full">
                          View Farm Profile
                        </Button>
                      </Link>
                    </div>
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
