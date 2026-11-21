"use client";

import React, { useState } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle, Circle, MapPin, Calendar, Package, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { DEMO_ORDERS } from "@/data/demo";
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  getOrderStatusLabel,
  getOrderStatusColor,
} from "@/lib/utils";
import type { OrderStatus } from "@/types/order";
import { toast } from "sonner";

const ORDER_TIMELINE: { status: OrderStatus; label: string; description: string }[] = [
  { status: "REQUESTED", label: "Order Requested", description: "Your order request has been sent" },
  { status: "ACCEPTED", label: "Farmer Accepted", description: "The farmer has accepted your order" },
  { status: "PREPARING", label: "Preparing", description: "The farmer is preparing your produce" },
  { status: "READY", label: "Ready", description: "Your order is ready for pickup/delivery" },
  { status: "COMPLETED", label: "Completed", description: "Order successfully completed" },
];

const STATUS_ORDER: OrderStatus[] = ["REQUESTED", "ACCEPTED", "PREPARING", "READY", "COMPLETED"];

export default function OrderDetailPage() {
  const params = useParams();
  const order = DEMO_ORDERS.find((o) => o.id === params.id);

  if (!order) notFound();

  const [reviewOpen, setReviewOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const currentIdx = STATUS_ORDER.indexOf(order.status as OrderStatus);
  const isRejected = order.status === "REJECTED";
  const isCancelled = order.status === "CANCELLED";

  async function handleSubmitReview(e: React.FormEvent) {
    e.preventDefault();
    if (!order) return;
    setSubmittingReview(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          farmerId: order.farmerId,
          rating,
          comment,
        }),
      });

      if (res.ok) {
        toast.success("Thank you! Your review has been published.");
        setReviewSubmitted(true);
        setReviewOpen(false);
      } else {
        throw new Error();
      }
    } catch {
      toast.success("Review submitted! (Demo mode)");
      setReviewSubmitted(true);
      setReviewOpen(false);
    } finally {
      setSubmittingReview(false);
    }
  }

  return (
    <div className="p-4 md:p-8 max-w-3xl">
      <Link
        href="/buyer/orders"
        className="inline-flex items-center gap-1.5 text-sm text-brand-muted hover:text-brand-green mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        My Orders
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-brand-text">Order Details</h1>
          <p className="text-sm text-brand-muted">#{order.id.slice(0, 12).toUpperCase()}</p>
        </div>
        <Badge className={getOrderStatusColor(order.status)} variant="secondary">
          {getOrderStatusLabel(order.status)}
        </Badge>
      </div>

      {/* Timeline */}
      {!isRejected && !isCancelled && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="font-semibold text-brand-text mb-5">Order Status</h2>
            <div className="space-y-0">
              {ORDER_TIMELINE.map((step, i) => {
                const isDone = i <= currentIdx;
                const isCurrent = i === currentIdx;

                return (
                  <div key={step.status} className="flex items-start gap-4">
                    {/* Indicator */}
                    <div className="flex flex-col items-center">
                      <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isDone
                            ? "bg-brand-green text-white"
                            : "bg-brand-light text-brand-muted"
                        }`}
                      >
                        {isDone ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <Circle className="w-4 h-4" />
                        )}
                      </motion.div>
                      {i < ORDER_TIMELINE.length - 1 && (
                        <div
                          className={`w-0.5 h-8 ${
                            i < currentIdx ? "bg-brand-green" : "bg-brand-border"
                          }`}
                        />
                      )}
                    </div>
                    {/* Text */}
                    <div className="pb-6">
                      <p
                        className={`text-sm font-semibold ${
                          isDone ? "text-brand-text" : "text-brand-muted"
                        }`}
                      >
                        {step.label}
                        {isCurrent && (
                          <span className="ml-2 text-xs font-normal text-brand-green">
                            ← Current
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-brand-muted mt-0.5">
                        {step.description}
                      </p>
                      {isDone && (
                        <p className="text-xs text-brand-muted/60 mt-0.5">
                          {formatDateTime(order.updatedAt)}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {(isRejected || isCancelled) && (
        <Card className="mb-6 border-brand-error/20">
          <CardContent className="p-5 text-center">
            <p className="font-semibold text-brand-error">
              {isRejected ? "Order Rejected" : "Order Cancelled"}
            </p>
            <p className="text-sm text-brand-muted mt-1">
              {isRejected
                ? "The farmer was unable to fulfill this order."
                : "This order has been cancelled."}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Order Info */}
      <Card className="mb-5">
        <CardContent className="p-5 space-y-3">
          <h2 className="font-semibold text-brand-text mb-2">Order Info</h2>
          <div className="flex items-center gap-2 text-sm text-brand-muted">
            <MapPin className="w-4 h-4 text-brand-green" />
            <span>
              {order.fulfillmentMethod === "PICKUP" ? "Farm Pickup" : "Local Delivery"}
            </span>
          </div>
          {order.preferredDate && (
            <div className="flex items-center gap-2 text-sm text-brand-muted">
              <Calendar className="w-4 h-4 text-brand-green" />
              <span>Preferred: {formatDate(order.preferredDate)}</span>
            </div>
          )}
          {order.notes && (
            <div className="flex items-start gap-2 text-sm text-brand-muted">
              <Package className="w-4 h-4 text-brand-green mt-0.5" />
              <span>{order.notes}</span>
            </div>
          )}
          <Separator />
          <div className="flex items-center justify-between text-sm">
            <span className="text-brand-muted">Farm</span>
            <Link href={`/buyer/farmers/${order.farmerId}`} className="font-semibold text-brand-green hover:underline">
              {order.farmName}
            </Link>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-brand-muted">Placed</span>
            <span className="text-brand-text">{formatDateTime(order.createdAt)}</span>
          </div>
          <Separator />
          <div className="flex items-center justify-between text-sm">
            <span className="text-brand-muted">Payment Method</span>
            <span className="font-medium text-brand-text">
              {order.paymentMethod === "UPI" ? "Direct UPI Transfer" : "Cash on Delivery / Pickup"}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-brand-muted">Payment Status</span>
            <Badge variant="outline" className={order.paymentStatus === "PAID" ? "text-emerald-600 border-emerald-300 bg-emerald-50" : "text-amber-600 border-amber-300 bg-amber-50"}>
              {order.paymentStatus === "PAID" ? "Paid" : "Payment Pending"}
            </Badge>
          </div>
          {order.paymentReference && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-brand-muted">UPI Ref / UTR</span>
              <span className="font-mono text-xs text-brand-text">{order.paymentReference}</span>
            </div>
          )}
          <div className="flex items-center justify-between text-xs text-brand-muted">
            <span>Processing Fee</span>
            <span className="font-semibold text-brand-green">₹0 (Zero commission)</span>
          </div>
        </CardContent>
      </Card>

      {/* Items */}
      <Card className="mb-5">
        <CardContent className="p-5">
          <h2 className="font-semibold text-brand-text mb-4">Items</h2>
          <div className="space-y-4">
            {order.items?.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-brand-light flex-shrink-0">
                  {item.productImage ? (
                    <Image
                      src={item.productImage}
                      alt={item.productName || ""}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl">🌱</div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-brand-text text-sm">{item.productName}</p>
                  <p className="text-xs text-brand-muted">
                    {item.quantity} × {formatCurrency(item.unitPrice)}
                  </p>
                </div>
                <p className="font-semibold text-brand-text">
                  {formatCurrency(item.subtotal)}
                </p>
              </div>
            ))}
          </div>
          <Separator className="my-4" />
          <div className="flex justify-between font-bold text-brand-text">
            <span>Total</span>
            <span>{formatCurrency(order.totalAmount)}</span>
          </div>
        </CardContent>
      </Card>

      {/* CTA for completed orders */}
      {order.status === "COMPLETED" && (
        <Card className="bg-brand-light border-brand-green/20">
          <CardContent className="p-5 text-center">
            {reviewSubmitted ? (
              <div className="flex flex-col items-center">
                <CheckCircle className="w-8 h-8 text-brand-green mb-1.5" />
                <p className="font-semibold text-brand-text">Review Submitted</p>
                <p className="text-xs text-brand-muted">Thank you for supporting our local farmers!</p>
              </div>
            ) : (
              <>
                <p className="font-semibold text-brand-text mb-1">How was your order?</p>
                <p className="text-sm text-brand-muted mb-3">Share your experience with {order.farmName}</p>
                <Button size="sm" onClick={() => setReviewOpen(true)}>
                  Write a Review
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Write Review Dialog */}
      <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Review {order.farmName}</DialogTitle>
            <DialogDescription>
              Help other buyers know about product freshness, packaging, and fulfillment.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitReview} className="space-y-4 pt-2">
            <div>
              <label className="block text-sm font-medium text-brand-text mb-2">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 text-2xl transition-transform hover:scale-110 focus:outline-none"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <Textarea
              label="Your Comments"
              placeholder="Tell others about the produce quality, timely pickup, or taste..."
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setReviewOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={submittingReview}>
                {submittingReview ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
