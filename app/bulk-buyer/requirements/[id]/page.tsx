"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import StarRating from "@/components/shared/StarRating";
import { DEMO_FARMERS, DEMO_PRODUCTS } from "@/data/demo";
import { computeMatchScore } from "@/lib/matching";
import type { BulkRequest } from "@/types/bulkRequest";

export default function RequirementDetailPage() {
  const params = useParams();

  const mockReq: BulkRequest = {
    id: params.id as string,
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
    const result = computeMatchScore(mockReq, farmer as Parameters<typeof computeMatchScore>[1], products);
    return { farmer, result };
  }).sort((a, b) => b.result.matchScore - a.result.matchScore);

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      <Link href="/bulk-buyer/requirements" className="inline-flex items-center gap-1.5 text-sm text-brand-muted hover:text-brand-green mb-6">
        <ArrowLeft className="w-4 h-4" />Back
      </Link>
      <h1 className="text-2xl font-bold text-brand-text mb-2">{mockReq.productName}</h1>
      <p className="text-brand-muted text-sm mb-6">{mockReq.quantity} {mockReq.unit} · Max ₹{mockReq.maxPrice}/{mockReq.unit}</p>

      <h2 className="font-semibold text-brand-text mb-4">Matching Farmers ({matches.length})</h2>
      <div className="space-y-3">
        {matches.map(({ farmer, result }) => {
          const color = result.matchScore >= 80 ? "text-brand-green" : result.matchScore >= 60 ? "text-amber-600" : "text-brand-muted";
          return (
            <Card key={farmer.id} className="hover:border-brand-green/50 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-brand-text">{farmer.farmName}</p>
                      {farmer.verified && <Badge variant="verified"><CheckCircle className="w-3 h-3" />Verified</Badge>}
                    </div>
                    <StarRating rating={Number(farmer.rating)} showValue reviewCount={farmer.reviewCount} />
                    <p className="text-xs text-brand-muted flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" />{farmer.address.split(",")[0]}
                    </p>
                    <div className="mt-2 space-y-0.5">
                      {result.explanation.slice(0, 2).map((exp, i) => (
                        <p key={i} className="text-xs text-brand-muted flex items-start gap-1">
                          <span className="text-brand-green flex-shrink-0">✓</span>{exp}
                        </p>
                      ))}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={`text-3xl font-black ${color}`}>{result.matchScore}%</p>
                    <p className="text-xs text-brand-muted">Match Score</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" className="flex-1">Contact Farmer</Button>
                  <Link href={`/buyer/farmers/${farmer.id}`}>
                    <Button size="sm" variant="outline">View Farm</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
