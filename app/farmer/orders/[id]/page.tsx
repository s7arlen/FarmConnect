"use client";

import React, { useState } from "react";
import { useParams, notFound, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CheckCircle, XCircle, Package, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DEMO_ORDERS } from "@/data/demo";
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  getOrderStatusLabel,
  getOrderStatusColor,
  getNextOrderStatuses,
} from "@/lib/utils";
import { toast } from "sonner";
import type { Order, OrderStatus } from "@/types/order";

const ACTION_LABELS: Record<string, string> = {
  ACCEPTED: "Accept Order",
  REJECTED: "Reject Order",
  PREPARING: "Mark Preparing",
  READY: "Mark Ready",
  COMPLETED: "Mark Completed",
  CANCELLED: "Cancel",
};

const ACTION_VARIANTS: Record<string, "default" | "destructive" | "outline" | "warning"> = {
  ACCEPTED: "default",
  REJECTED: "destructive",
  PREPARING: "default",
  READY: "default",
  COMPLETED: "default",
  CANCELLED: "destructive",
};

export default function FarmerOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = typeof params?.id === "string" ? params.id : "";
  const [order, setOrder] = useState<Order | null>(() => {
    return (DEMO_ORDERS.find((o) => o.id === orderId) as Order) || null;
  });
  const [loading, setLoading] = useState<string | null>(null);

  React.useEffect(() => {
    if (!orderId) return;
    const staticDemo = DEMO_ORDERS.find((o) => o.id === orderId);
    if (staticDemo) {
      setOrder(staticDemo);
      return;
    }

    try {
      const cached = localStorage.getItem(`order_${orderId}`);
      if (cached) {
        setOrder(JSON.parse(cached));
        return;
      }
    } catch {}

    fetch(`/api/orders/${orderId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.order) setOrder(data.order);
        else if (orderId.startsWith("demo-order-") || orderId.startsWith("order_")) {
          setOrder({
            id: orderId,
            buyerId: "demo-buyer-1",
            farmerId: "demo-farmer-1",
            totalAmount: 350,
            fulfillmentMethod: "PICKUP",
            status: "REQUESTED",
            paymentMethod: "COD",
            paymentStatus: "PENDING",
            createdAt: new Date(),
            updatedAt: new Date(),
            buyerName: "Demo Buyer",
            items: [],
          });
        }
      });
  }, [orderId]);

  if (!order) {
    return (
      <div className="p-8 max-w-md mx-auto text-center space-y-4">
        <h2 className="text-xl font-bold text-brand-text">Order Not Found</h2>
        <p className="text-sm text-brand-muted">
          We couldn&apos;t find this order in your farmer dashboard.
        </p>
        <Link href="/farmer/orders">
          <Button>Back to Orders</Button>
        </Link>
      </div>
    );
  }

  const nextStatuses = getNextOrderStatuses(order.status);

  async function markPaymentReceived() {
    setLoading("PAYMENT");
    try {
      const response = await fetch(`/api/orders/${order!.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus: "PAID" }),
      });

      if (response.ok) {
        setOrder((prev) => (prev ? { ...prev, paymentStatus: "PAID" } : prev));
        toast.success("Payment marked as received!");
      } else {
        const err = await response.json().catch(() => ({}));
        toast.error(err.error || "Failed to mark payment");
      }
    } catch {
      toast.error("Network error while updating payment");
    } finally {
      setLoading(null);
    }
  }

  async function updateStatus(newStatus: string) {
    setLoading(newStatus);
    try {
      const response = await fetch(`/api/orders/${order!.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setOrder((prev) => prev ? { ...prev, status: newStatus as OrderStatus } : prev);
        toast.success(`Order ${getOrderStatusLabel(newStatus).toLowerCase()}`);

        if (newStatus === "COMPLETED") {
          setTimeout(() => router.push("/farmer/orders"), 1200);
        }
      } else {
        const err = await response.json().catch(() => ({}));
        toast.error(err.error || "Failed to update order status");
      }
    } catch {
      toast.error("Network error while updating status");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      <Link
        href="/farmer/orders"
        className="inline-flex items-center gap-1.5 text-sm text-brand-muted hover:text-brand-green mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Orders
      </Link>

      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-brand-text">Order Details</h1>
          <p className="text-sm text-brand-muted">#{order.id.slice(0, 12).toUpperCase()}</p>
        </div>
        <Badge className={getOrderStatusColor(order.status)} variant="secondary">
          {getOrderStatusLabel(order.status)}
        </Badge>
      </div>

      {/* Buyer Info */}
      <Card className="mb-4">
        <CardContent className="p-5 space-y-2">
          <h2 className="font-semibold text-brand-text text-sm mb-3">Buyer Details</h2>
          <div className="flex items-center justify-between text-sm">
            <span className="text-brand-muted">Name</span>
            <span className="font-medium text-brand-text">{order.buyerName}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-brand-muted">Fulfillment</span>
            <span className="font-medium text-brand-text">
              {order.fulfillmentMethod === "PICKUP" ? "Farm Pickup" : "Local Delivery"}
            </span>
          </div>
          {order.preferredDate && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-brand-muted">Preferred Date</span>
              <span className="font-medium text-brand-text">
                {formatDate(order.preferredDate)}
              </span>
            </div>
          )}
          {order.notes && (
            <div className="text-sm">
              <span className="text-brand-muted block mb-0.5">Notes</span>
              <span className="text-brand-text">{order.notes}</span>
            </div>
          )}
          <Separator />
          <div className="flex items-center justify-between text-xs text-brand-muted">
            <span>Placed</span>
            <span>{formatDateTime(order.createdAt)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Payment Information */}
      <Card className="mb-4">
        <CardContent className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-brand-text text-sm">Payment Details</h2>
            <Badge
              variant="outline"
              className={
                order.paymentStatus === "PAID"
                  ? "text-emerald-600 border-emerald-300 bg-emerald-50"
                  : "text-amber-600 border-amber-300 bg-amber-50"
              }
            >
              {order.paymentStatus === "PAID" ? "Paid" : "Payment Pending"}
            </Badge>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-brand-muted">Method</span>
            <span className="font-medium text-brand-text">
              {order.paymentMethod === "UPI" ? "Direct UPI Transfer" : "Cash on Delivery / Pickup"}
            </span>
          </div>

          {order.paymentReference && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-brand-muted">UPI Ref / UTR</span>
              <span className="font-mono text-xs text-brand-text font-semibold">
                {order.paymentReference}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-brand-muted">
            <span>Platform Fee</span>
            <span className="font-semibold text-brand-green">₹0 (Free / No deductions)</span>
          </div>

          {order.paymentStatus !== "PAID" && (
            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={markPaymentReceived}
                loading={loading === "PAYMENT"}
                className="w-full text-brand-green border-brand-green/30 hover:bg-brand-light"
              >
                <CheckCircle className="w-4 h-4 mr-1.5" />
                Mark Payment Received
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Items */}
      <Card className="mb-4">
        <CardContent className="p-5">
          <h2 className="font-semibold text-brand-text text-sm mb-4">Items Ordered</h2>
          <div className="space-y-3">
            {order.items?.map((item: any) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-brand-light flex-shrink-0">
                  {item.productImage ? (
                    <Image
                      src={item.productImage}
                      alt={item.productName || ""}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-emerald-50 text-emerald-600">
                      <Leaf className="w-4 h-4 stroke-[1.8]" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-brand-text text-sm">{item.productName}</p>
                  <p className="text-xs text-brand-muted">
                    {item.quantity} × {formatCurrency(item.unitPrice)}
                  </p>
                </div>
                <p className="font-semibold text-brand-text text-sm">
                  {formatCurrency(item.subtotal)}
                </p>
              </div>
            ))}
          </div>
          <Separator className="my-3" />
          <div className="flex justify-between font-bold text-brand-text">
            <span>Total</span>
            <span>{formatCurrency(order.totalAmount)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      {nextStatuses.length > 0 && (
        <Card>
          <CardContent className="p-5">
            <h2 className="font-semibold text-brand-text text-sm mb-3">Actions</h2>
            <div className="flex flex-col gap-2">
              {nextStatuses.map((status) => (
                <Button
                  key={status}
                  variant={ACTION_VARIANTS[status] || "outline"}
                  onClick={() => updateStatus(status)}
                  loading={loading === status}
                  className="gap-2"
                >
                  {status === "ACCEPTED" && <CheckCircle className="w-4 h-4" />}
                  {status === "REJECTED" && <XCircle className="w-4 h-4" />}
                  {["PREPARING", "READY", "COMPLETED"].includes(status) && (
                    <Package className="w-4 h-4" />
                  )}
                  {ACTION_LABELS[status] || status}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
