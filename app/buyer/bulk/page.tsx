"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Boxes, Plus, TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { bulkRequestSchema, type BulkRequestInput } from "@/lib/validations";
import { DEMO_FARMERS, DEMO_PRODUCTS } from "@/data/demo";
import { computeMatchScore } from "@/lib/matching";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import type { BulkRequest } from "@/types/bulkRequest";

interface MatchResult {
  farmerId: string;
  matchScore: number;
  breakdown: Record<string, number>;
  explanation: string[];
}

export default function BulkBuyingPage() {
  const [matches, setMatches] = useState<MatchResult[] | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors } } =
    useForm<BulkRequestInput>({
      resolver: zodResolver(bulkRequestSchema),
      defaultValues: { unit: "kg" },
    });

  const unit = watch("unit");

  async function onSubmit(data: BulkRequestInput) {
    setLoading(true);
    try {
      const res = await fetch("/api/bulk-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const result = await res.json();
        if (result.matches) {
          setMatches(result.matches);
        }
        toast.success("Requirement posted and matching farmers found!");
      } else {
        throw new Error();
      }
    } catch {
      // Demo fallback calculation
      const mockRequest: BulkRequest = {
        id: "temp",
        buyerId: "demo-buyer",
        productName: data.productName,
        quantity: data.quantity,
        unit: data.unit,
        maxPrice: data.maxPrice,
        requiredDate: new Date(data.requiredDate),
        maxDistance: data.maxDistance,
        notes: data.notes,
        status: "OPEN",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const results: MatchResult[] = DEMO_FARMERS.map((farmer) => {
        const products = DEMO_PRODUCTS.filter((p) => p.farmerId === farmer.id);
        return computeMatchScore(mockRequest, farmer as Parameters<typeof computeMatchScore>[1], products);
      }).sort((a, b) => b.matchScore - a.matchScore);

      setMatches(results);
      toast.success("Found matching farmers!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand-text mb-1">Bulk Buying</h1>
        <p className="text-brand-muted text-sm">
          Post your requirement and find farmers who can fulfil it.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div>
          <Card>
            <CardContent className="p-6">
              <h2 className="font-semibold text-brand-text mb-5 flex items-center gap-2">
                <Plus className="w-4 h-4 text-brand-green" />
                New Requirement
              </h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  label="Product name"
                  placeholder="e.g. Tomatoes, Onions, Rice"
                  error={errors.productName?.message}
                  {...register("productName")}
                />

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Quantity"
                    type="number"
                    min="1"
                    placeholder="100"
                    error={errors.quantity?.message}
                    {...register("quantity", { valueAsNumber: true })}
                  />
                  <div>
                    <label className="block text-sm font-medium text-brand-text mb-1.5">Unit</label>
                    <Select value={unit} onValueChange={(v) => setValue("unit", v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {["kg", "g", "dozen", "piece", "bundle", "litre"].map((u) => (
                          <SelectItem key={u} value={u}>{u}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Input
                  label="Maximum price per unit (₹)"
                  type="number"
                  min="1"
                  placeholder="50"
                  error={errors.maxPrice?.message}
                  {...register("maxPrice", { valueAsNumber: true })}
                />

                <Input
                  label="Required by date"
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  error={errors.requiredDate?.message}
                  {...register("requiredDate")}
                />

                <Input
                  label="Max distance (km, optional)"
                  type="number"
                  min="1"
                  placeholder="50"
                  {...register("maxDistance", { valueAsNumber: true })}
                />

                <Textarea
                  label="Additional notes"
                  placeholder="Quality requirements, packaging, etc."
                  rows={3}
                  {...register("notes")}
                />

                <Button type="submit" className="w-full gap-2" loading={loading}>
                  <TrendingUp className="w-4 h-4" />
                  Find Matching Farmers
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div>
          {matches === null ? (
            <div className="flex flex-col items-center justify-center h-full py-16 text-center">
              <Boxes className="w-12 h-12 text-brand-border mb-4" />
              <p className="font-semibold text-brand-text mb-1">
                No matches yet
              </p>
              <p className="text-sm text-brand-muted">
                Fill in your requirement to find matching farmers.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <h2 className="font-semibold text-brand-text">
                {matches.length} Farmer{matches.length !== 1 ? "s" : ""} Found
              </h2>
              {matches.map((match) => {
                const farmer = DEMO_FARMERS.find((f) => f.id === match.farmerId);
                if (!farmer) return null;

                const scoreColor =
                  match.matchScore >= 80
                    ? "text-brand-green"
                    : match.matchScore >= 60
                    ? "text-amber-600"
                    : "text-brand-muted";

                return (
                  <Card key={match.farmerId} className="hover:border-brand-green/50 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-brand-text text-sm">{farmer.farmName}</p>
                            {farmer.verified && (
                              <Badge variant="verified" className="text-[10px]">Verified</Badge>
                            )}
                          </div>
                          <p className="text-xs text-brand-muted mb-2">{farmer.address}</p>
                          <div className="space-y-0.5">
                            {match.explanation.slice(0, 2).map((exp, i) => (
                              <p key={i} className="text-xs text-brand-muted flex items-center gap-1">
                                <span className="text-brand-green">✓</span> {exp}
                              </p>
                            ))}
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className={`text-2xl font-black ${scoreColor}`}>
                            {match.matchScore}%
                          </p>
                          <p className="text-xs text-brand-muted">Match</p>
                        </div>
                      </div>
                      <Link href={`/buyer/farmers/${farmer.id}`}>
                        <Button variant="outline" size="sm" className="w-full mt-3 gap-1">
                          View Farm <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
