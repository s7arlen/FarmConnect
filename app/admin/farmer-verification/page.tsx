"use client";

import React, { useState } from "react";
import Image from "next/image";
import { CheckCircle, XCircle, MessageSquare, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StarRating from "@/components/shared/StarRating";
import { DEMO_FARMERS } from "@/data/demo";
import { formatDate, getInitials } from "@/lib/utils";
import { toast } from "sonner";

type VerifStatus = "PENDING" | "VERIFIED" | "REJECTED" | "MORE_INFO_REQUESTED";

export default function FarmerVerificationPage() {
  const [farmers, setFarmers] = useState(
    DEMO_FARMERS.map((f) => ({ ...f, verificationStatus: "PENDING" as VerifStatus }))
  );

  async function updateStatus(id: string, status: VerifStatus) {
    const isVerified = status === "VERIFIED";

    // Optimistic update
    setFarmers((prev) =>
      prev.map((f) =>
        f.id === id
          ? { ...f, verificationStatus: status, verified: isVerified }
          : f
      )
    );

    const labels: Record<VerifStatus, string> = {
      VERIFIED: "Farmer verified!",
      REJECTED: "Application rejected",
      MORE_INFO_REQUESTED: "More info requested",
      PENDING: "Reset to pending",
    };

    try {
      await fetch(`/api/admin/farmers/${id}/verify`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verified: isVerified }),
      });
      toast.success(labels[status]);
    } catch {
      toast.success(`${labels[status]} (Demo mode)`);
    }
  }

  const pending = farmers.filter((f) => f.verificationStatus === "PENDING");
  const verified = farmers.filter((f) => f.verificationStatus === "VERIFIED");
  const rejected = farmers.filter((f) => f.verificationStatus === "REJECTED");

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand-text mb-1">Farmer Verification</h1>
        <p className="text-brand-muted text-sm">Review and approve farmer applications</p>
      </div>

      {/* Summary Tabs */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {[
          { label: "Pending", count: pending.length, color: "bg-amber-100 text-amber-700" },
          { label: "Verified", count: verified.length, color: "bg-brand-light text-brand-green" },
          { label: "Rejected", count: rejected.length, color: "bg-red-100 text-brand-error" },
        ].map((tab) => (
          <div key={tab.label} className={`px-4 py-2 rounded-lg text-sm font-semibold ${tab.color}`}>
            {tab.label}: {tab.count}
          </div>
        ))}
      </div>

      {/* Applications */}
      <div className="space-y-4">
        {farmers.map((farmer) => (
          <Card key={farmer.id} className={farmer.verificationStatus === "VERIFIED" ? "border-brand-green/30" : ""}>
            <CardContent className="p-5">
              <div className="flex items-start gap-4 flex-wrap md:flex-nowrap">
                {/* Avatar */}
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-brand-light flex-shrink-0">
                  {farmer.profileImage ? (
                    <Image src={farmer.profileImage} alt={farmer.farmName} width={56} height={56} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-brand-green font-bold text-xl">
                      {getInitials(farmer.farmName)}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-semibold text-brand-text">{farmer.farmName}</h3>
                    <Badge
                      variant={
                        farmer.verificationStatus === "VERIFIED" ? "verified" :
                        farmer.verificationStatus === "REJECTED" ? "error" :
                        farmer.verificationStatus === "MORE_INFO_REQUESTED" ? "warning" :
                        "secondary"
                      }
                    >
                      {farmer.verificationStatus.replace("_", " ")}
                    </Badge>
                  </div>
                  <p className="text-sm text-brand-muted">{farmer.ownerName}</p>

                  <div className="flex items-center gap-4 mt-2 flex-wrap text-xs text-brand-muted">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {farmer.address}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Est. {farmer.establishedYear}
                    </span>
                  </div>

                  {farmer.description && (
                    <p className="text-xs text-brand-muted mt-2 line-clamp-2">{farmer.description}</p>
                  )}
                </div>

                {/* Actions */}
                {farmer.verificationStatus === "PENDING" && (
                  <div className="flex flex-col gap-2 flex-shrink-0 w-full md:w-auto">
                    <Button
                      size="sm"
                      className="gap-1.5 w-full md:w-auto"
                      onClick={() => updateStatus(farmer.id, "VERIFIED")}
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5 w-full md:w-auto"
                      onClick={() => updateStatus(farmer.id, "MORE_INFO_REQUESTED")}
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Request Info
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="gap-1.5 w-full md:w-auto"
                      onClick={() => updateStatus(farmer.id, "REJECTED")}
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Reject
                    </Button>
                  </div>
                )}

                {farmer.verificationStatus === "VERIFIED" && (
                  <div className="flex items-center gap-2 text-brand-green flex-shrink-0">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm font-semibold">Verified</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
