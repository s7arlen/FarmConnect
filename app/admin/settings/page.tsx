"use client";

import React, { useState } from "react";
import { Settings, Shield, Sliders, Database, Save, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const [platformFee, setPlatformFee] = useState("2.5");
  const [maxRadius, setMaxRadius] = useState("50");
  const [autoVerifyMinRating, setAutoVerifyMinRating] = useState("4.5");
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    toast.success("Platform settings updated successfully!");
    setSaving(false);
  }

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand-text mb-1">Platform Settings</h1>
        <p className="text-brand-muted text-sm">
          System-wide marketplace parameters and operational flags
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="font-semibold text-brand-text flex items-center gap-2">
              <Sliders className="w-4 h-4 text-brand-green" />
              Marketplace Economics
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Platform Transaction Fee (%)"
                type="number"
                step="0.1"
                value={platformFee}
                onChange={(e) => setPlatformFee(e.target.value)}
              />
              <Input
                label="Maximum Discovery Radius (km)"
                type="number"
                value={maxRadius}
                onChange={(e) => setMaxRadius(e.target.value)}
              />
            </div>

            <Input
              label="Minimum Farmer Rating for Auto-Verification"
              type="number"
              step="0.1"
              value={autoVerifyMinRating}
              onChange={(e) => setAutoVerifyMinRating(e.target.value)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="font-semibold text-brand-text flex items-center gap-2">
              <Shield className="w-4 h-4 text-brand-green" />
              Platform Maintenance & Safety
            </h2>

            <div className="flex items-center justify-between py-2 border-b border-brand-border">
              <div>
                <p className="font-medium text-sm text-brand-text">Platform Maintenance Mode</p>
                <p className="text-xs text-brand-muted">
                  Temporarily disable new order placements and checkouts across the app.
                </p>
              </div>
              <input
                type="checkbox"
                checked={maintenanceMode}
                onChange={(e) => setMaintenanceMode(e.target.checked)}
                className="w-4 h-4 accent-brand-green rounded cursor-pointer"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={saving} className="gap-2">
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Platform Configuration"}
          </Button>
        </div>
      </form>
    </div>
  );
}
