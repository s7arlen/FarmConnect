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
import ImageUploader from "@/components/ui/ImageUploader";
import StarRating from "@/components/shared/StarRating";
import { farmProfileSchema, type FarmProfileInput } from "@/lib/validations";
import { DEMO_FARMERS } from "@/data/demo";
import { getInitials } from "@/lib/utils";
import { toast } from "sonner";

export default function FarmProfilePage() {
  const farmer = DEMO_FARMERS[0]; // In production: fetched from session
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [coverError, setCoverError] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors } } =
    useForm<FarmProfileInput>({
      resolver: zodResolver(farmProfileSchema),
      defaultValues: {
        farmName: farmer.farmName,
        description: farmer.description,
        address: farmer.address,
        farmingPractices: farmer.farmingPractices,
        coverImage: farmer.coverImage || "",
        profileImage: farmer.profileImage || "",
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
    <div className="p-4 md:p-8 max-w-3xl mx-auto pb-28 pb-safe">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-dark tracking-tight">Farm Profile</h1>
          <p className="text-xs text-brand-muted mt-0.5">Manage your public farm storefront & practices</p>
        </div>
        <Button
          variant={editing ? "outline" : "default"}
          size="sm"
          onClick={() => setEditing(!editing)}
          className="gap-2 rounded-xl h-9 text-xs font-semibold shadow-xs"
        >
          <Edit3 className="w-3.5 h-3.5" />
          {editing ? "Cancel" : "Edit Profile"}
        </Button>
      </div>

      {/* Cover + Profile Floating Card */}
      <div className="relative rounded-2xl overflow-hidden mb-6 bg-white border border-brand-border shadow-2xs">
        {/* Cover Photo */}
        <div className="h-44 sm:h-52 relative w-full bg-brand-dark overflow-hidden">
          {farmer.coverImage && !coverError ? (
            <Image
              src={farmer.coverImage}
              alt={farmer.farmName}
              fill
              priority
              className="object-cover"
              onError={() => setCoverError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-brand-green/30 to-brand-light" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Profile Details floating over the cover bottom */}
        <div className="relative z-10 px-4 sm:px-6 pb-5 pt-0 bg-white">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 -mt-10 sm:-mt-12 mb-3.5">
            <div className="flex items-end gap-3.5">
              <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl ring-4 ring-white shadow-md overflow-hidden bg-white flex-shrink-0 relative z-20">
                {farmer.profileImage && !avatarError ? (
                  <Image
                    src={farmer.profileImage}
                    alt={farmer.farmName}
                    width={88}
                    height={88}
                    className="w-full h-full object-cover"
                    onError={() => setAvatarError(true)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-brand-light text-brand-green font-bold text-2xl">
                    {getInitials(farmer.farmName)}
                  </div>
                )}
              </div>

              <div className="pb-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg sm:text-xl font-extrabold text-brand-dark leading-tight">
                    {farmer.farmName}
                  </h2>
                  {farmer.verified && (
                    <Badge variant="verified" className="gap-1 px-2 py-0.5 text-[11px] font-bold">
                      <CheckCircle className="w-3 h-3 text-brand-green" /> Verified
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <StarRating rating={Number(farmer.rating)} showValue reviewCount={farmer.reviewCount} size="sm" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-3 border-t border-brand-border/60 text-xs text-brand-muted">
            <div className="flex items-center gap-2 min-w-0">
              <MapPin className="w-3.5 h-3.5 text-brand-green flex-shrink-0" />
              <span className="truncate">{farmer.address}</span>
            </div>
            {farmer.establishedYear && (
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-brand-green flex-shrink-0" />
                <span>Established in {farmer.establishedYear}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Form / Details Section */}
      {editing ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Card className="rounded-2xl border-brand-border shadow-2xs">
            <CardContent className="p-5 sm:p-6 space-y-4">
              <Input label="Farm name *" error={errors.farmName?.message} {...register("farmName")} />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ImageUploader
                  label="Farm Cover Banner"
                  value={watch("coverImage")}
                  onChange={(url) => setValue("coverImage", url)}
                  folder="farmconnect/farms"
                  aspectRatio="video"
                />
                <ImageUploader
                  label="Farmer Profile Avatar"
                  value={watch("profileImage")}
                  onChange={(url) => setValue("profileImage", url)}
                  folder="farmconnect/avatars"
                  aspectRatio="square"
                />
              </div>

              <Textarea label="About the farm" rows={4} placeholder="Describe your farm..." {...register("description")} />
              <Input label="Address *" error={errors.address?.message} {...register("address")} />
              <Textarea label="Farming practices" rows={3} placeholder="How do you farm?" {...register("farmingPractices")} />
              <Input label="Established year" type="number" min="1900" max={new Date().getFullYear()} {...register("establishedYear", { valueAsNumber: true })} />
            </CardContent>
          </Card>
          <Button type="submit" loading={loading} className="w-full h-11 rounded-xl bg-brand-green hover:bg-brand-dark text-white font-semibold">
            Save Changes
          </Button>
        </form>
      ) : (
        <div className="space-y-4">
          {farmer.description && (
            <Card className="rounded-2xl border-brand-border shadow-2xs bg-white">
              <CardContent className="p-5">
                <h3 className="font-bold text-sm text-brand-dark mb-2">About</h3>
                <p className="text-brand-muted text-xs sm:text-sm leading-relaxed">{farmer.description}</p>
              </CardContent>
            </Card>
          )}
          {farmer.farmingPractices && (
            <Card className="rounded-2xl border-brand-border shadow-2xs bg-white">
              <CardContent className="p-5">
                <h3 className="font-bold text-sm text-brand-dark mb-2">Farming Practices</h3>
                <p className="text-brand-muted text-xs sm:text-sm leading-relaxed">{farmer.farmingPractices}</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
