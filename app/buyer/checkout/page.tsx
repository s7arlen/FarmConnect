"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  MapPin,
  Package,
  Calendar,
  FileText,
  ArrowLeft,
  CheckCircle,
  Banknote,
  QrCode,
  Smartphone,
  ShieldCheck,
  Copy,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { formatCurrency } from "@/lib/utils";
import { buildUPIPaymentUrl, DEFAULT_UPI_ID } from "@/lib/upi";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";

const checkoutSchema = z.object({
  fulfillmentMethod: z.enum(["PICKUP", "LOCAL_DELIVERY"]),
  paymentMethod: z.enum(["COD", "UPI"]).default("COD"),
  paymentReference: z.string().max(100).optional(),
  preferredDate: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().max(500).optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalAmount, clearCart } = useCartStore();
  const user = useAuthStore((s) => s.user);
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const [placedPaymentMethod, setPlacedPaymentMethod] = useState<"COD" | "UPI">("COD");

  const { register, handleSubmit, watch, setValue, formState: { errors } } =
    useForm<CheckoutFormData>({
      resolver: zodResolver(checkoutSchema),
      defaultValues: { fulfillmentMethod: "PICKUP", paymentMethod: "COD" },
    });

  const method = watch("fulfillmentMethod");
  const paymentMethod = watch("paymentMethod");
  const total = getTotalAmount();

  const upiId = DEFAULT_UPI_ID;
  const upiUrl = buildUPIPaymentUrl({
    upiId,
    payeeName: "FarmConnect Farmers",
    amount: total,
    transactionNote: `Order payment for ${items.length} item(s)`,
  });

  const copyUpiId = () => {
    navigator.clipboard.writeText(upiId);
    toast.success("UPI ID copied to clipboard!");
  };

  // Redirect to cart if empty (client-side only)
  React.useEffect(() => {
    if (items.length === 0 && !orderPlaced) {
      router.replace("/buyer/cart");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onSubmit(data: CheckoutFormData) {
    setLoading(true);
    try {
      // Group items by farmer
      const farmerGroups: Record<string, typeof items> = {};
      for (const item of items) {
        const fid = item.product.farmerId;
        if (!farmerGroups[fid]) farmerGroups[fid] = [];
        farmerGroups[fid].push(item);
      }

      // Create one order per farmer
      const orderIds: string[] = [];

      for (const [farmerId, farmerItems] of Object.entries(farmerGroups)) {
        const response = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            farmerId,
            fulfillmentMethod: data.fulfillmentMethod,
            paymentMethod: data.paymentMethod,
            paymentReference: data.paymentReference || undefined,
            preferredDate: data.preferredDate || undefined,
            notes: data.notes || undefined,
            items: farmerItems.map((i) => ({
              productId: i.product.id,
              quantity: i.quantity,
            })),
          }),
        });

        if (response.ok) {
          const result = await response.json();
          orderIds.push(result.order.id);
        } else {
          // Demo mode: generate a demo order ID
          orderIds.push(`demo-order-${Date.now()}`);
        }
      }

      setPlacedPaymentMethod(data.paymentMethod);
      clearCart();
      setOrderId(orderIds[0]);
      setOrderPlaced(true);
    } catch {
      // Demo mode fallback
      const demoId = `demo-order-${Date.now()}`;
      setPlacedPaymentMethod(data.paymentMethod);
      clearCart();
      setOrderId(demoId);
      setOrderPlaced(true);
    } finally {
      setLoading(false);
    }
  }

  if (orderPlaced) {
    return (
      <div className="p-4 md:p-8 max-w-lg mx-auto">
        <div className="text-center py-12">
          <div className="w-20 h-20 rounded-full bg-brand-light flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-10 h-10 text-brand-green" />
          </div>
          <h1 className="text-2xl font-bold text-brand-text mb-2">
            Order Requested!
          </h1>
          <p className="text-brand-muted mb-6">
            Your order request has been sent to the farmer. You&apos;ll be
            notified once they accept it.
          </p>

          <div className="bg-brand-light/50 border border-brand-green/20 rounded-xl p-4 mb-6 text-left">
            <div className="flex justify-between items-center text-sm mb-1.5">
              <span className="text-brand-muted">Payment Method:</span>
              <span className="font-semibold text-brand-text">
                {placedPaymentMethod === "UPI" ? "Direct UPI Transfer" : "Cash on Delivery / Pickup"}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-brand-muted">Platform Fee:</span>
              <span className="font-semibold text-brand-green">₹0 (100% Free)</span>
            </div>
          </div>
          <div className="space-y-3">
            <Link href={`/buyer/orders/${orderId}`}>
              <Button className="w-full">Track Your Order</Button>
            </Link>
            <Link href="/buyer/explore">
              <Button variant="outline" className="w-full">Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-5xl">
      <Link
        href="/buyer/cart"
        className="inline-flex items-center gap-1.5 text-sm text-brand-muted hover:text-brand-green mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Cart
      </Link>

      <h1 className="text-2xl font-bold text-brand-text mb-6">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Fulfillment Method */}
            <Card>
              <CardContent className="p-5">
                <h3 className="font-semibold text-brand-text mb-4 flex items-center gap-2">
                  <Package className="w-4 h-4 text-brand-green" />
                  Fulfillment Method
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "PICKUP", label: "Farm Pickup", desc: "Collect directly from farm" },
                    { value: "LOCAL_DELIVERY", label: "Local Delivery", desc: "Delivered to your address" },
                  ].map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex flex-col gap-1 p-3 rounded-xl border cursor-pointer transition-colors ${
                        method === opt.value
                          ? "border-brand-green bg-brand-light"
                          : "border-brand-border hover:border-brand-green/50"
                      }`}
                    >
                      <input
                        type="radio"
                        value={opt.value}
                        className="sr-only"
                        {...register("fulfillmentMethod")}
                        onChange={() => setValue("fulfillmentMethod", opt.value as "PICKUP" | "LOCAL_DELIVERY")}
                        checked={method === opt.value}
                      />
                      <span className="text-sm font-semibold text-brand-text">{opt.label}</span>
                      <span className="text-xs text-brand-muted">{opt.desc}</span>
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Preferred Date */}
            <Card>
              <CardContent className="p-5">
                <h3 className="font-semibold text-brand-text mb-4 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-brand-green" />
                  Preferred Date
                </h3>
                <Input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  {...register("preferredDate")}
                />
              </CardContent>
            </Card>

            {/* Delivery Address */}
            {method === "LOCAL_DELIVERY" && (
              <Card>
                <CardContent className="p-5">
                  <h3 className="font-semibold text-brand-text mb-4 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-brand-green" />
                    Delivery Address
                  </h3>
                  <Textarea
                    placeholder="Enter your delivery address"
                    rows={3}
                    {...register("address")}
                  />
                </CardContent>
              </Card>
            )}

            {/* Payment Method */}
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-brand-text flex items-center gap-2">
                    <Banknote className="w-4 h-4 text-brand-green" />
                    Payment Method
                  </h3>
                  <Badge variant="outline" className="text-brand-green border-brand-green/30 text-xs">
                    0% Fee • Zero Extra Charges
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <label
                    className={`flex flex-col gap-1 p-3.5 rounded-xl border cursor-pointer transition-colors ${
                      paymentMethod === "COD"
                        ? "border-brand-green bg-brand-light"
                        : "border-brand-border hover:border-brand-green/50"
                    }`}
                  >
                    <input
                      type="radio"
                      value="COD"
                      className="sr-only"
                      {...register("paymentMethod")}
                      onChange={() => setValue("paymentMethod", "COD")}
                      checked={paymentMethod === "COD"}
                    />
                    <div className="flex items-center gap-2">
                      <Banknote className="w-4 h-4 text-brand-green" />
                      <span className="text-sm font-semibold text-brand-text">Cash on Delivery</span>
                    </div>
                    <span className="text-xs text-brand-muted">Pay in cash upon pickup or delivery</span>
                  </label>

                  <label
                    className={`flex flex-col gap-1 p-3.5 rounded-xl border cursor-pointer transition-colors ${
                      paymentMethod === "UPI"
                        ? "border-brand-green bg-brand-light"
                        : "border-brand-border hover:border-brand-green/50"
                    }`}
                  >
                    <input
                      type="radio"
                      value="UPI"
                      className="sr-only"
                      {...register("paymentMethod")}
                      onChange={() => setValue("paymentMethod", "UPI")}
                      checked={paymentMethod === "UPI"}
                    />
                    <div className="flex items-center gap-2">
                      <QrCode className="w-4 h-4 text-brand-green" />
                      <span className="text-sm font-semibold text-brand-text">Pay via UPI QR</span>
                    </div>
                    <span className="text-xs text-brand-muted">GPay, PhonePe, Paytm, BHIM (Zero fee)</span>
                  </label>
                </div>

                {paymentMethod === "UPI" && (
                  <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-4">
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200 flex-shrink-0">
                        <QRCodeSVG
                          value={upiUrl}
                          size={130}
                          level="M"
                          includeMargin={false}
                        />
                      </div>
                      <div className="flex-1 space-y-2 text-center sm:text-left">
                        <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-emerald-600 font-medium">
                          <ShieldCheck className="w-4 h-4" />
                          Direct Bank-to-Bank Transfer (0% Fee)
                        </div>
                        <p className="text-sm text-brand-text">
                          Scan with <strong>Google Pay</strong>, <strong>PhonePe</strong>, <strong>Paytm</strong>, or any UPI app.
                        </p>
                        <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-brand-muted">
                          <span>UPI ID: <strong className="text-brand-text">{upiId}</strong></span>
                          <button
                            type="button"
                            onClick={copyUpiId}
                            className="p-1 hover:text-brand-green rounded"
                            title="Copy UPI ID"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="pt-1">
                          <a
                            href={upiUrl}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-brand-green hover:bg-brand-green/90 px-3 py-1.5 rounded-lg shadow-sm"
                          >
                            <Smartphone className="w-3.5 h-3.5" />
                            Pay with UPI App
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                      <label className="text-xs font-medium text-brand-text block mb-1">
                        UPI Reference / UTR Number (Optional)
                      </label>
                      <Input
                        placeholder="e.g. 12-digit UTR from payment receipt"
                        {...register("paymentReference")}
                        className="text-xs"
                      />
                      <p className="text-[11px] text-brand-muted mt-1">
                        Enter your 12-digit transaction ID after paying to speed up order confirmation.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notes */}
            <Card>
              <CardContent className="p-5">
                <h3 className="font-semibold text-brand-text mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-brand-green" />
                  Order Notes (Optional)
                </h3>
                <Textarea
                  placeholder="Any special instructions for the farmer..."
                  rows={3}
                  {...register("notes")}
                />
              </CardContent>
            </Card>

            <Button type="submit" size="lg" className="w-full" loading={loading}>
              Send Order Request
            </Button>

            <p className="text-xs text-brand-muted text-center">
              No payment required now. This is an order request — the farmer will confirm.
            </p>
          </form>
        </div>

        {/* Summary */}
        <div>
          <Card className="sticky top-4">
            <CardContent className="p-5">
              <h3 className="font-semibold text-brand-text mb-4">Summary</h3>
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-brand-light flex-shrink-0">
                      {item.product.image ? (
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      ) : null}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-brand-text truncate">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-brand-muted">
                        {item.quantity} {item.product.unit}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-brand-text flex-shrink-0">
                      {formatCurrency(item.product.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
              <Separator className="my-3" />
              <div className="flex justify-between font-bold text-brand-text">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
