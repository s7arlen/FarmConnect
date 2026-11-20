"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MapPin, Package, Calendar, FileText, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";

const checkoutSchema = z.object({
  fulfillmentMethod: z.enum(["PICKUP", "LOCAL_DELIVERY"]),
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

  const { register, handleSubmit, watch, setValue, formState: { errors } } =
    useForm<CheckoutFormData>({
      resolver: zodResolver(checkoutSchema),
      defaultValues: { fulfillmentMethod: "PICKUP" },
    });

  const method = watch("fulfillmentMethod");
  const total = getTotalAmount();

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
        const farmerTotal = farmerItems.reduce(
          (sum, i) => sum + i.product.price * i.quantity,
          0
        );

        const response = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            farmerId,
            fulfillmentMethod: data.fulfillmentMethod,
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

      clearCart();
      setOrderId(orderIds[0]);
      setOrderPlaced(true);
    } catch {
      // Demo mode fallback
      const demoId = `demo-order-${Date.now()}`;
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
          <p className="text-brand-muted mb-8">
            Your order request has been sent to the farmer. You&apos;ll be
            notified once they accept it.
          </p>
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
