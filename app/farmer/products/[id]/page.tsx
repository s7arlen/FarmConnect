"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Trash2 } from "lucide-react";
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
import ImageUploader from "@/components/ui/ImageUploader";
import { productSchema, type ProductInput } from "@/lib/validations";
import { DEMO_PRODUCTS } from "@/data/demo";
import { PRODUCT_CATEGORIES } from "@/data/categories";
import { toast } from "sonner";

const UNITS = ["kg", "g", "piece", "dozen", "bundle", "litre", "packet"] as const;

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const initialProduct = DEMO_PRODUCTS.find((p) => p.id === productId);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } =
    useForm<ProductInput>({
      resolver: zodResolver(productSchema),
      defaultValues: {
        name: initialProduct?.name || "",
        category: initialProduct?.category || "vegetables",
        description: initialProduct?.description || "",
        price: initialProduct?.price || 1,
        quantity: initialProduct?.quantity || 1,
        unit: initialProduct?.unit || "kg",
        image: initialProduct?.image || "",
        status: initialProduct?.status || "AVAILABLE",
      },
    });

  const unit = watch("unit");
  const status = watch("status");
  const category = watch("category");

  useEffect(() => {
    // Fetch live product from API
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${productId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.product) {
            reset({
              name: data.product.name,
              category: data.product.category,
              description: data.product.description || "",
              price: parseFloat(data.product.price),
              quantity: data.product.quantity,
              unit: data.product.unit,
              image: data.product.image || "",
              status: data.product.status,
            });
          }
        }
      } catch {
        // use initial product fallback
      }
    }
    fetchProduct();
  }, [productId, reset]);

  async function onSubmit(data: ProductInput) {
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast.success("Product updated successfully!");
        router.push("/farmer/products");
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to update product");
      }
    } catch {
      toast.success("Product updated! (Demo mode)");
      router.push("/farmer/products");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this product?")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Product deleted successfully");
        router.push("/farmer/products");
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to delete product");
      }
    } catch {
      toast.success("Product deleted (Demo mode)");
      router.push("/farmer/products");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto pb-28 pb-safe">
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/farmer/products"
          className="inline-flex items-center gap-1.5 text-sm text-brand-muted hover:text-brand-green"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Link>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleDelete}
          disabled={deleting}
          className="text-red-500 border-red-200 hover:bg-red-50 gap-1.5"
        >
          <Trash2 className="w-4 h-4" />
          {deleting ? "Deleting..." : "Delete Product"}
        </Button>
      </div>

      <h1 className="text-2xl font-bold text-brand-text mb-6">Edit Product</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Cloudinary Image Upload */}
        <Card className="rounded-2xl border-brand-border shadow-2xs">
          <CardContent className="p-5">
            <ImageUploader
              label="Produce Image"
              value={watch("image")}
              onChange={(url) => setValue("image", url)}
              folder="farmconnect/products"
              aspectRatio="video"
            />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 space-y-4">
            <Input label="Product name *" error={errors.name?.message} {...register("name")} />
            <div>
              <label className="block text-sm font-medium text-brand-text mb-1.5">Category *</label>
              <Select value={category} onValueChange={(v) => setValue("category", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Textarea label="Description" rows={3} {...register("description")} />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input label="Price (₹) *" type="number" min="1" step="0.5" error={errors.price?.message} {...register("price", { valueAsNumber: true })} />
              <div>
                <label className="block text-sm font-medium text-brand-text mb-1.5">Unit *</label>
                <Select value={unit} onValueChange={(v) => setValue("unit", v as typeof unit)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {UNITS.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Quantity *" type="number" min="0" error={errors.quantity?.message} {...register("quantity", { valueAsNumber: true })} />
              <div>
                <label className="block text-sm font-medium text-brand-text mb-1.5">Status</label>
                <Select value={status} onValueChange={(v) => setValue("status", v as typeof status)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AVAILABLE">Available</SelectItem>
                    <SelectItem value="LIMITED">Limited</SelectItem>
                    <SelectItem value="UNAVAILABLE">Unavailable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? "Saving..." : "Save Changes"}
          </Button>
          <Link href="/farmer/products">
            <Button type="button" variant="outline">Cancel</Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
