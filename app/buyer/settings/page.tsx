"use client";

import React, { useState } from "react";
import { Settings, User, Bell, Shield, Save } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";

export default function BuyerSettingsPage() {
  const user = useAuthStore((s) => s.user);
  const [name, setName] = useState(user?.name || "Demo Buyer");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [address, setAddress] = useState("Flat 402, Green Valley Apartments, Panaji, Goa");

  const [orderAlerts, setOrderAlerts] = useState(true);
  const [promoAlerts, setPromoAlerts] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    toast.success("Settings saved successfully!");
    setSaving(false);
  }

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand-text mb-1">Account Settings</h1>
        <p className="text-brand-muted text-sm">
          Manage your personal details and notification preferences
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Personal Details */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="font-semibold text-brand-text flex items-center gap-2">
              <User className="w-4 h-4 text-brand-green" />
              Personal Profile
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                label="Email Address"
                value={user?.email || "buyer@demo.com"}
                disabled
              />
            </div>

            <Input
              label="Contact Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <Textarea
              label="Default Delivery Address"
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="font-semibold text-brand-text flex items-center gap-2">
              <Bell className="w-4 h-4 text-brand-green" />
              Notifications
            </h2>

            <div className="flex items-center justify-between py-2 border-b border-brand-border">
              <div>
                <p className="font-medium text-sm text-brand-text">Order Status Updates</p>
                <p className="text-xs text-brand-muted">
                  Get notified when your order is accepted, preparing, or out for delivery.
                </p>
              </div>
              <input
                type="checkbox"
                checked={orderAlerts}
                onChange={(e) => setOrderAlerts(e.target.checked)}
                className="w-4 h-4 accent-brand-green rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-sm text-brand-text">Fresh Harvest Alerts</p>
                <p className="text-xs text-brand-muted">
                  Receive recommendations when farmers near you list newly harvested crops.
                </p>
              </div>
              <input
                type="checkbox"
                checked={promoAlerts}
                onChange={(e) => setPromoAlerts(e.target.checked)}
                className="w-4 h-4 accent-brand-green rounded cursor-pointer"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving} className="gap-2">
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Preferences"}
          </Button>
        </div>
      </form>
    </div>
  );
}
