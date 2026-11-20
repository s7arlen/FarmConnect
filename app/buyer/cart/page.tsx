"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import EmptyState from "@/components/shared/EmptyState";
import { useCartStore } from "@/store/cartStore";
import { formatCurrency } from "@/lib/utils";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalAmount, getItemsByFarmer } =
    useCartStore();

  const farmerGroups = getItemsByFarmer();
  const total = getTotalAmount();
  const DELIVERY_FEE = 0;

  if (items.length === 0) {
    return (
      <div className="p-4 md:p-8">
        <h1 className="text-2xl font-bold text-brand-text mb-8">Your Cart</h1>
        <EmptyState
          icon={<ShoppingCart className="w-8 h-8" />}
          title="Your cart is empty"
          description="Browse local produce and add items to your cart."
          action={{ label: "Explore Produce", href: "/buyer/explore" }}
        />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-bold text-brand-text mb-6">
        Your Cart ({items.length} item{items.length !== 1 ? "s" : ""})
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-5">
          {Object.entries(farmerGroups).map(([farmerId, farmerItems]) => {
            const farmName =
              farmerItems[0]?.product.farmName || "Farm";

            return (
              <Card key={farmerId}>
                <CardContent className="p-5">
                  <h3 className="font-semibold text-brand-text mb-4 text-sm border-b border-brand-border pb-3">
                    {farmName}
                  </h3>
                  <div className="space-y-4">
                    <AnimatePresence>
                      {farmerItems.map((item) => (
                        <motion.div
                          key={item.product.id}
                          initial={{ opacity: 1 }}
                          exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                          transition={{ duration: 0.2 }}
                          className="flex items-center gap-4"
                        >
                          {/* Image */}
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-brand-light flex-shrink-0">
                            {item.product.image ? (
                              <Image
                                src={item.product.image}
                                alt={item.product.name}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-2xl">
                                🌱
                              </div>
                            )}
                          </div>

                          {/* Details */}
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-brand-text text-sm truncate">
                              {item.product.name}
                            </p>
                            <p className="text-xs text-brand-muted">
                              {formatCurrency(item.product.price)} / {item.product.unit}
                            </p>

                            {/* Qty Controls */}
                            <div className="flex items-center gap-2 mt-2">
                              <button
                                onClick={() =>
                                  updateQuantity(item.product.id, item.quantity - 1)
                                }
                                className="w-7 h-7 rounded-lg border border-brand-border flex items-center justify-center hover:bg-brand-light"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-sm font-semibold w-8 text-center text-brand-text">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(item.product.id, item.quantity + 1)
                                }
                                disabled={item.quantity >= item.product.quantity}
                                className="w-7 h-7 rounded-lg border border-brand-border flex items-center justify-center hover:bg-brand-light disabled:opacity-40"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                              <span className="text-xs text-brand-muted ml-1">
                                {item.product.unit}
                              </span>
                            </div>
                          </div>

                          {/* Price & Remove */}
                          <div className="text-right flex-shrink-0">
                            <p className="font-bold text-brand-text">
                              {formatCurrency(item.product.price * item.quantity)}
                            </p>
                            <button
                              onClick={() => removeItem(item.product.id)}
                              className="mt-1 text-brand-muted hover:text-brand-error transition-colors"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-4">
            <CardContent className="p-5">
              <h3 className="font-semibold text-brand-text mb-4">
                Order Summary
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-brand-muted">
                  <span>Subtotal</span>
                  <span className="font-medium text-brand-text">
                    {formatCurrency(total)}
                  </span>
                </div>
                <div className="flex justify-between text-brand-muted">
                  <span>Delivery</span>
                  <span className="text-brand-green font-medium">
                    {DELIVERY_FEE === 0 ? "Pickup / To be agreed" : formatCurrency(DELIVERY_FEE)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-brand-text text-base">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>

              <Link href="/buyer/checkout" className="block mt-5">
                <Button className="w-full gap-2" size="lg">
                  Continue to Checkout
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>

              <Link href="/buyer/explore" className="block mt-3">
                <Button variant="ghost" className="w-full text-sm text-brand-muted">
                  Continue Shopping
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
