"use client";

import React, { useState } from "react";
import { Inbox, Calendar, Package, Send, CheckCircle2, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import EmptyState from "@/components/shared/EmptyState";
import { formatCurrency, formatDate } from "@/lib/utils";
import { toast } from "sonner";

interface BulkRequest {
  id: string;
  productName: string;
  quantity: number;
  unit: string;
  maxPrice: number;
  requiredDate: Date;
  buyerName: string;
  matchScore: number;
  notes?: string;
  offerSubmitted?: boolean;
}

const INITIAL_REQUESTS: BulkRequest[] = [
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
  const [requests, setRequests] = useState<BulkRequest[]>(INITIAL_REQUESTS);
  const [selectedRequest, setSelectedRequest] = useState<BulkRequest | null>(null);
  const [offeredPrice, setOfferedPrice] = useState<string>("");
  const [offeredQty, setOfferedQty] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  function handleOpenModal(req: BulkRequest) {
    setSelectedRequest(req);
    setOfferedPrice(String(req.maxPrice));
    setOfferedQty(String(req.quantity));
    setMessage("");
  }

  function handleSubmitBid() {
    if (!selectedRequest) return;
    setSubmitting(true);

    setTimeout(() => {
      setRequests((prev) =>
        prev.map((r) =>
          r.id === selectedRequest.id ? { ...r, offerSubmitted: true } : r
        )
      );
      setSubmitting(false);
      setSelectedRequest(null);
      toast.success(
        `Bid offer of ₹${offeredPrice}/${selectedRequest.unit} sent to ${selectedRequest.buyerName}!`
      );
    }, 600);
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto pb-28 pb-safe">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-brand-dark mb-1">Bulk Procurement Demands</h1>
        <p className="text-brand-muted text-xs">
          Commercial requirements from hotels, restaurants, and grocery distributors matching your harvest.
        </p>
      </div>

      {requests.length === 0 ? (
        <EmptyState
          icon={<Inbox className="w-8 h-8" />}
          title="No bulk requests yet"
          description="When commercial buyers post bulk requirements matching your produce, they'll appear here."
        />
      ) : (
        <div className="space-y-4">
          {requests.map((req) => {
            const scoreColor =
              req.matchScore >= 80 ? "text-brand-green" : req.matchScore >= 60 ? "text-amber-600" : "text-brand-muted";

            return (
              <Card key={req.id} className="border-brand-border bg-white shadow-xs overflow-hidden">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-brand-dark">{req.productName}</h3>
                        {req.offerSubmitted && (
                          <Badge className="bg-brand-light text-brand-green border-brand-green/20 text-[10px] gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Offer Submitted
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-brand-muted mt-0.5">{req.buyerName}</p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className="flex items-center justify-end gap-1">
                        <TrendingUp className="w-4 h-4 text-brand-green" />
                        <span className={`text-xl font-extrabold ${scoreColor}`}>{req.matchScore}%</span>
                      </div>
                      <p className="text-[10px] text-brand-muted font-semibold uppercase tracking-wider">Match Score</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3 bg-brand-cream/50 p-2.5 rounded-xl border border-brand-border/60">
                    <div className="flex items-center gap-1.5 text-xs text-brand-dark font-medium">
                      <Package className="w-4 h-4 text-brand-green flex-shrink-0" />
                      <span>{req.quantity} {req.unit} needed</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-brand-dark font-medium">
                      <Calendar className="w-4 h-4 text-brand-green flex-shrink-0" />
                      <span>By {formatDate(req.requiredDate)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-3 text-xs">
                    <span className="text-brand-muted">Target ceiling price:</span>
                    <span className="font-extrabold text-brand-dark text-sm">
                      {formatCurrency(req.maxPrice)} / {req.unit}
                    </span>
                  </div>

                  {req.notes && (
                    <p className="text-xs text-brand-muted bg-brand-light/60 border border-brand-border/60 rounded-xl p-2.5 mb-4">
                      <span className="font-bold text-brand-dark">Buyer Note: </span>
                      {req.notes}
                    </p>
                  )}

                  <div className="flex gap-2">
                    {req.offerSubmitted ? (
                      <Button variant="outline" size="sm" className="w-full text-brand-green border-brand-green/40" disabled>
                        Bid Under Review by Buyer
                      </Button>
                    ) : (
                      <>
                        <Button
                          className="flex-1 bg-brand-green hover:bg-brand-dark text-white font-bold text-xs h-9 rounded-xl shadow-xs gap-1.5"
                          size="sm"
                          onClick={() => handleOpenModal(req)}
                        >
                          <Send className="w-3.5 h-3.5" />
                          Submit Farmer Bid
                        </Button>
                        <Button variant="outline" size="sm" className="border-brand-border hover:bg-brand-light text-xs h-9 rounded-xl">
                          Decline
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Bid Offer Dialog */}
      {selectedRequest && (
        <Dialog open={!!selectedRequest} onOpenChange={(open) => !open && setSelectedRequest(null)}>
          <DialogContent className="max-w-md bg-white rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-brand-dark">
                Submit Bid: {selectedRequest.productName}
              </DialogTitle>
              <DialogDescription className="text-xs text-brand-muted">
                Buyer: {selectedRequest.buyerName} • Target: {selectedRequest.quantity} {selectedRequest.unit} @ max ₹{selectedRequest.maxPrice}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div>
                <Label className="text-xs font-bold text-brand-dark">Available Quantity ({selectedRequest.unit})</Label>
                <Input
                  type="number"
                  value={offeredQty}
                  onChange={(e) => setOfferedQty(e.target.value)}
                  placeholder="Enter supply quantity"
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-xs font-bold text-brand-dark">Offered Price (₹ per {selectedRequest.unit})</Label>
                <Input
                  type="number"
                  value={offeredPrice}
                  onChange={(e) => setOfferedPrice(e.target.value)}
                  placeholder="Enter offer price"
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-xs font-bold text-brand-dark">Message / Delivery Notes</Label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g. Can harvest fresh and deliver within 2 days of confirmation..."
                  className="mt-1 text-xs"
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedRequest(null)}>
                Cancel
              </Button>
              <Button
                size="sm"
                className="bg-brand-green hover:bg-brand-dark text-white font-bold"
                onClick={handleSubmitBid}
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Send Bid Offer"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
