"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, MapPin, Calendar, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StarRating from "@/components/shared/StarRating";
import { farmProfileSchema, type FarmProfileInput } from "@/lib/validations";
import { DEMO_FARMERS } from "@/data/demo";
import { getInitials } from "@/lib/utils";
import { toast } from "sonner";

export default function FarmProfilePage() {
  const farmer = DEMO_FARMERS[0]; // In production: fetched from session
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } =
    useForm<FarmProfileInput>({
      resolver: zodResolver(farmProfileSchema),
      defaultValues: {
        farmName: farmer.farmName,
        description: farmer.description,
        address: farmer.address,
        farmingPractices: farmer.farmingPractices,
        establishedYear: farmer.establishedYear,
      },
    });

  async function onSubmit(data: FarmProfileInput) {
    setLoading(true);
    try {
      const res = await fetch("/api/farmers/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        toast.success("Farm profile updated successfully!");
        setEditing(false);
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to update profile");
      }
    } catch {
      toast.success("Farm profile updated! (Demo mode)");
      setEditing(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 md:p-8 max-w-3xl">
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-brand-text">Farm Profile</h1>
        <Button
          variant={editing ? "outline" : "default"}
          size="sm"
          onClick={() => setEditing(!editing)}
          className="gap-2"
        >
          <Edit3 className="w-3.5 h-3.5" />
          {editing ? "Cancel" : "Edit Profile"}
        </Button>
      </div>

      {/* Cover + Profile */}
      <div className="relative rounded-2xl overflow-hidden mb-6">
        <div className="h-40 relative">
          {farmer.coverImage ? (
            <Image src={farmer.coverImage} alt="Cover" fill className="object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-brand-green/30 to-brand-light" />
          )}
        </div>
        <div className="px-5 pb-4 bg-white border-x border-b border-brand-border rounded-b-2xl">
          <div className="flex items-end gap-4 -mt-8 mb-4">
            <div className="w-16 h-16 rounded-xl border-2 border-white shadow overflow-hidden bg-brand-light flex-shrink-0">
              {farmer.profileImage ? (
                <Image src={farmer.profileImage} alt={farmer.farmName} width={64} height={64} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-brand-green font-bold text-xl">
                  {getInitials(farmer.farmName)}
                </div>
              )}
            </div>
            <div className="pb-1">
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-brand-text">{farmer.farmName}</h2>
                {farmer.verified && (
                  <Badge variant="verified"><CheckCircle className="w-3 h-3" /> Verified</Badge>
                )}
              </div>
              <StarRating rating={Number(farmer.rating)} showValue reviewCount={farmer.reviewCount} />
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-brand-muted">
            <MapPin className="w-4 h-4 text-brand-green" />
            {farmer.address}
          </div>
          {farmer.establishedYear && (
            <div className="flex items-center gap-2 text-sm text-brand-muted mt-1">
              <Calendar className="w-4 h-4 text-brand-green" />
              Established {farmer.establishedYear}
            </div>
          )}
        </div>
      </div>

      {/* Edit Form / View */}
      {editing ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Card>
            <CardContent className="p-5 space-y-4">
              <Input label="Farm name *" error={errors.farmName?.message} {...register("farmName")} />
              <Textarea label="About the farm" rows={4} placeholder="Describe your farm..." {...register("description")} />
              <Input label="Address *" error={errors.address?.message} {...register("address")} />
              <Textarea label="Farming practices" rows={3} placeholder="How do you farm?" {...register("farmingPractices")} />
              <Input label="Established year" type="number" min="1900" max={new Date().getFullYear()} {...register("establishedYear", { valueAsNumber: true })} />
            </CardContent>
          </Card>
          <Button type="submit" loading={loading} className="w-full">Save Changes</Button>
        </form>
      ) : (
        <div className="space-y-5">
          {farmer.description && (
            <Card><CardContent className="p-5">
              <h3 className="font-semibold text-brand-text mb-2">About</h3>
              <p className="text-brand-muted text-sm leading-relaxed">{farmer.description}</p>
            </CardContent></Card>
          )}
          {farmer.farmingPractices && (
            <Card><CardContent className="p-5">
              <h3 className="font-semibold text-brand-text mb-2">Farming Practices</h3>
              <p className="text-brand-muted text-sm leading-relaxed">{farmer.farmingPractices}</p>
            </CardContent></Card>
          )}
        </div>
      )}
    </div>
  );
}
