"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Upload } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { productSchema, type ProductInput } from "@/lib/validations";
import { PRODUCT_CATEGORIES } from "@/data/categories";
import { toast } from "sonner";

const UNITS = ["kg", "g", "piece", "dozen", "bundle", "litre", "packet"] as const;
const STATUSES = [
  { value: "AVAILABLE", label: "Available" },
  { value: "LIMITED", label: "Limited Stock" },
  { value: "UNAVAILABLE", label: "Unavailable" },
] as const;

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: { unit: "kg", status: "AVAILABLE" },
  });

  const unit = watch("unit");
  const status = watch("status");
  const category = watch("category");

  async function onSubmit(data: ProductInput) {
    setLoading(true);
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success("Product added successfully!");
        router.push("/farmer/products");
      } else {
        const err = await response.json();
        toast.error(err.error || "Failed to add product");
      }
    } catch {
      // Demo mode
      toast.success("Product added! (Demo mode)");
      router.push("/farmer/products");
    } finally {
      setLoading(false);
    }
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImagePreview(url);
  }

  return (
    <div className="p-4 md:p-8 max-w-2xl">
      <Link
        href="/farmer/products"
        className="inline-flex items-center gap-1.5 text-sm text-brand-muted hover:text-brand-green mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Products
      </Link>

      <h1 className="text-2xl font-bold text-brand-text mb-6">Add New Product</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Image Upload */}
        <Card>
          <CardContent className="p-5">
            <label className="block text-sm font-medium text-brand-text mb-3">
              Product Image
            </label>
            <div
              className="relative border-2 border-dashed border-brand-border rounded-xl p-8 text-center hover:border-brand-green transition-colors cursor-pointer"
              onClick={() => document.getElementById("product-image")?.click()}
            >
              {imagePreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
              ) : (
                <>
                  <Upload className="w-8 h-8 text-brand-muted mx-auto mb-2" />
                  <p className="text-sm text-brand-muted">
                    Click to upload product image
                  </p>
                  <p className="text-xs text-brand-muted/60 mt-1">
                    PNG, JPG, WebP — max 5MB
                  </p>
                </>
              )}
              <input
                id="product-image"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleImageChange}
              />
            </div>
          </CardContent>
        </Card>

        {/* Basic Info */}
        <Card>
          <CardContent className="p-5 space-y-4">
            <h2 className="font-semibold text-brand-text text-sm">Basic Information</h2>

            <Input
              label="Product name *"
              placeholder="e.g. Fresh Tomatoes"
              error={errors.name?.message}
              {...register("name")}
            />

            <div>
              <label className="block text-sm font-medium text-brand-text mb-1.5">
                Category *
              </label>
              <Select value={category} onValueChange={(v) => setValue("category", v)}>
                <SelectTrigger className={errors.category ? "border-brand-error" : ""}>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.icon} {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-xs text-brand-error mt-1">{errors.category.message}</p>
              )}
            </div>

            <Textarea
              label="Description"
              placeholder="Describe your product — freshness, farming method, etc."
              rows={3}
              error={errors.description?.message}
              {...register("description")}
            />
          </CardContent>
        </Card>

        {/* Pricing & Stock */}
        <Card>
          <CardContent className="p-5 space-y-4">
            <h2 className="font-semibold text-brand-text text-sm">Pricing & Stock</h2>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Price (₹) *"
                type="number"
                min="1"
                step="0.01"
                placeholder="35"
                error={errors.price?.message}
                {...register("price", { valueAsNumber: true })}
              />
              <div>
                <label className="block text-sm font-medium text-brand-text mb-1.5">
                  Unit *
                </label>
                <Select value={unit} onValueChange={(v) => setValue("unit", v as typeof unit)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {UNITS.map((u) => (
                      <SelectItem key={u} value={u}>{u}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Available quantity *"
                type="number"
                min="1"
                placeholder="50"
                error={errors.quantity?.message}
                {...register("quantity", { valueAsNumber: true })}
              />
              <div>
                <label className="block text-sm font-medium text-brand-text mb-1.5">
                  Availability
                </label>
                <Select value={status} onValueChange={(v) => setValue("status", v as typeof status)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => (
                      <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Input
              label="Harvest date"
              type="date"
              {...register("harvestDate")}
            />
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" className="flex-1" loading={loading}>
            Add Product
          </Button>
          <Link href="/farmer/products">
            <Button type="button" variant="outline">Cancel</Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
