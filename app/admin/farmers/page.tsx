"use client";
import React from "react";
import Link from "next/link";
import { CheckCircle, XCircle, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import StarRating from "@/components/shared/StarRating";
import { DEMO_FARMERS } from "@/data/demo";
import { getInitials } from "@/lib/utils";

export default function AdminFarmersPage() {
  return (
    <div className="p-4 md:p-8 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand-text mb-1">Farmers</h1>
        <p className="text-brand-muted text-sm">{DEMO_FARMERS.length} registered farms</p>
      </div>
      <div className="space-y-3">
        {DEMO_FARMERS.map((farmer) => (
          <Card key={farmer.id}>
            <CardContent className="p-4 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-light flex items-center justify-center text-brand-green font-bold text-lg flex-shrink-0">
                {getInitials(farmer.farmName)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-brand-text">{farmer.farmName}</p>
                  {farmer.verified
                    ? <Badge variant="verified"><CheckCircle className="w-3 h-3" />Verified</Badge>
                    : <Badge variant="warning">Unverified</Badge>
                  }
                </div>
                <p className="text-sm text-brand-muted">{farmer.ownerName}</p>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  <StarRating rating={Number(farmer.rating)} showValue reviewCount={farmer.reviewCount} />
                  <span className="text-xs text-brand-muted flex items-center gap-1">
                    <MapPin className="w-3 h-3" />{farmer.address.split(",")[0]}
                  </span>
                </div>
              </div>
              <Link href={`/admin/farmer-verification`} className="flex-shrink-0">
                <Button size="sm" variant="outline">Manage</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
