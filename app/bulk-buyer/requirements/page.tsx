"use client";
import Link from "next/link";
import { Plus, FileText, Calendar, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import EmptyState from "@/components/shared/EmptyState";
import { formatCurrency, formatDate } from "@/lib/utils";

const DEMO_REQUIREMENTS = [
  { id: "r1", productName: "Fresh Tomatoes", quantity: 200, unit: "kg", maxPrice: 40, requiredDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), status: "OPEN", matchCount: 3 },
  { id: "r2", productName: "Onions", quantity: 100, unit: "kg", maxPrice: 30, requiredDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), status: "MATCHED", matchCount: 5 },
];

export default function RequirementsPage() {
  return (
    <div className="p-4 md:p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-brand-text">My Requirements</h1>
        <Link href="/bulk-buyer/requirements/create">
          <Button className="gap-2"><Plus className="w-4 h-4" />New Requirement</Button>
        </Link>
      </div>

      {DEMO_REQUIREMENTS.length === 0 ? (
        <EmptyState icon={<FileText className="w-8 h-8" />} title="No requirements yet" description="Create your first bulk requirement to find matching farmers." action={{ label: "Create Requirement", href: "/bulk-buyer/requirements/create" }} />
      ) : (
        <div className="space-y-4">
          {DEMO_REQUIREMENTS.map((req) => (
            <Card key={req.id} className="hover:border-brand-green/50 transition-colors">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="font-semibold text-brand-text">{req.productName}</h3>
                    <div className="flex items-center gap-3 mt-1 text-xs text-brand-muted flex-wrap">
                      <span className="flex items-center gap-1"><Package className="w-3.5 h-3.5" />{req.quantity} {req.unit}</span>
                      <span>Max: {formatCurrency(req.maxPrice)}/{req.unit}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />By {formatDate(req.requiredDate)}</span>
                    </div>
                  </div>
                  <Badge variant={req.status === "MATCHED" ? "verified" : "default"}>
                    {req.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-brand-muted">{req.matchCount} farmer{req.matchCount !== 1 ? "s" : ""} matched</p>
                  <Link href={`/bulk-buyer/requirements/${req.id}`}>
                    <Button size="sm" variant="outline">View Matches</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
