"use client";

import React, { useState } from "react";
import { AlertCircle, CheckCircle, Clock, Search, ShieldAlert, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

interface Report {
  id: string;
  type: "QUALITY_ISSUE" | "DELIVERY_DELAY" | "INCORRECT_QUANTITY" | "OTHER";
  submittedBy: string;
  targetFarm: string;
  orderId: string;
  details: string;
  status: "OPEN" | "UNDER_REVIEW" | "RESOLVED";
  createdAt: Date;
}

const INITIAL_REPORTS: Report[] = [
  {
    id: "rep-101",
    type: "QUALITY_ISSUE",
    submittedBy: "Demo Buyer",
    targetFarm: "Lakshmi Farms",
    orderId: "ord_201",
    details: "Several mangoes received were bruised and overripe during transit.",
    status: "OPEN",
    createdAt: new Date("2026-11-19"),
  },
  {
    id: "rep-102",
    type: "DELIVERY_DELAY",
    submittedBy: "Grand Hotel",
    targetFarm: "Joseph's Farm",
    orderId: "ord_105",
    details: "Pickup scheduled for 9 AM was ready only at 2 PM, impacting kitchen preparation.",
    status: "UNDER_REVIEW",
    createdAt: new Date("2026-11-17"),
  },
  {
    id: "rep-103",
    type: "INCORRECT_QUANTITY",
    submittedBy: "Spice Garden",
    targetFarm: "Antony's Agro Farm",
    orderId: "ord_98",
    details: "Invoiced for 50 kg potatoes, delivery consignment weighed 44 kg.",
    status: "RESOLVED",
    createdAt: new Date("2026-11-12"),
  },
];

export default function AdminReportsPage() {
  const [reports, setReports] = useState(INITIAL_REPORTS);
  const [filter, setFilter] = useState<"ALL" | "OPEN" | "RESOLVED">("ALL");

  function handleResolve(id: string) {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "RESOLVED" } : r))
    );
    toast.success("Dispute marked as resolved");
  }

  const filtered = reports.filter(
    (r) => filter === "ALL" || (filter === "OPEN" ? r.status !== "RESOLVED" : r.status === "RESOLVED")
  );

  return (
    <div className="p-4 md:p-8 max-w-6xl">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-text mb-1">Disputes & Incident Reports</h1>
          <p className="text-brand-muted text-sm">
            Monitor complaints, fulfillment issues, and quality disputes
          </p>
        </div>

        <div className="flex gap-2">
          {(["ALL", "OPEN", "RESOLVED"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                filter === tab
                  ? "bg-brand-green text-white border-brand-green"
                  : "bg-white border-brand-border text-brand-muted hover:border-brand-green"
              }`}
            >
              {tab === "ALL" ? "All Reports" : tab === "OPEN" ? "Pending Resolution" : "Resolved"}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map((rep) => (
          <Card key={rep.id} className="hover:border-brand-green/50 transition-colors shadow-sm">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <Badge variant={rep.status === "RESOLVED" ? "verified" : "error"}>
                      {rep.status}
                    </Badge>
                    <span className="text-xs font-bold text-brand-muted uppercase tracking-wider">
                      {rep.type.replace("_", " ")}
                    </span>
                    <span className="text-xs text-brand-muted">
                      Report #{rep.id} · {formatDate(rep.createdAt)}
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-brand-text">
                    Buyer: <span className="font-normal text-brand-muted">{rep.submittedBy}</span> · Against Farm: <span className="text-brand-green">{rep.targetFarm}</span>
                  </p>

                  <p className="text-sm text-brand-text bg-gray-50 p-3 rounded-lg border border-gray-100">
                    &ldquo;{rep.details}&rdquo;
                  </p>

                  <p className="text-xs text-brand-muted">
                    Referenced Order: #{rep.orderId}
                  </p>
                </div>

                {rep.status !== "RESOLVED" && (
                  <Button
                    size="sm"
                    onClick={() => handleResolve(rep.id)}
                    className="gap-1.5 bg-brand-green hover:bg-green-600 flex-shrink-0"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Mark Resolved
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
