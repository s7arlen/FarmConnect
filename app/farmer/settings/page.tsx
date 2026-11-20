"use client";

import React, { useState } from "react";
import { Settings, Bell, Clock, Truck, Save, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function FarmerSettingsPage() {
  const [minOrder, setMinOrder] = useState("100");
  const [pickupHours, setPickupHours] = useState("8:00 AM - 6:00 PM");
  const [deliveryRadius, setDeliveryRadius] = useState("15");
  const [newOrderAlert, setNewOrderAlert] = useState(true);
  const [bulkRequestAlert, setBulkRequestAlert] = useState(true);
  const [saving, setSaving] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    toast.success("Farmer preferences saved!");
    setSaving(false);
  }

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto pb-28 pb-safe">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand-text mb-1">Store & Operations Settings</h1>
        <p className="text-brand-muted text-sm">
          Configure fulfillment rules, operating hours, and dispatch alerts
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Fulfillment Preferences */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="font-semibold text-brand-text flex items-center gap-2">
              <Truck className="w-4 h-4 text-brand-green" />
              Fulfillment Rules
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Minimum Order Value (₹)"
                type="number"
                value={minOrder}
                onChange={(e) => setMinOrder(e.target.value)}
              />
              <Input
                label="Max Delivery Distance (km)"
                type="number"
                value={deliveryRadius}
                onChange={(e) => setDeliveryRadius(e.target.value)}
              />
            </div>

            <Input
              label="Standard Farm Pickup Hours"
              value={pickupHours}
              onChange={(e) => setPickupHours(e.target.value)}
              placeholder="e.g. 7:00 AM - 5:00 PM"
            />
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="font-semibold text-brand-text flex items-center gap-2">
              <Bell className="w-4 h-4 text-brand-green" />
              Alerts & Notifications
            </h2>

            <div className="flex items-center justify-between py-2 border-b border-brand-border">
              <div>
                <p className="font-medium text-sm text-brand-text">Instant New Order Alerts</p>
                <p className="text-xs text-brand-muted">
                  Get notified the moment a buyer places a fresh harvest request.
                </p>
              </div>
              <input
                type="checkbox"
                checked={newOrderAlert}
                onChange={(e) => setNewOrderAlert(e.target.checked)}
                className="w-4 h-4 accent-brand-green rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-sm text-brand-text">Bulk Procurement Matches</p>
                <p className="text-xs text-brand-muted">
                  Alert me when a restaurant or institution requirements match my produce catalog.
                </p>
              </div>
              <input
                type="checkbox"
                checked={bulkRequestAlert}
                onChange={(e) => setBulkRequestAlert(e.target.checked)}
                className="w-4 h-4 accent-brand-green rounded cursor-pointer"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving} className="gap-2">
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </form>
    </div>
  );
}
