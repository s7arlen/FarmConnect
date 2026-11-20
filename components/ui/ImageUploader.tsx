"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, Loader2, Sparkles, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  aspectRatio?: "square" | "video" | "banner";
  className?: string;
}

export default function ImageUploader({
  value,
  onChange,
  folder = "farmconnect/products",
  label = "Upload Image",
  aspectRatio = "video",
  className,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const aspectClasses = {
    square: "aspect-square max-w-[200px]",
    video: "aspect-[16/10] w-full",
    banner: "aspect-[21/9] w-full",
  }[aspectRatio];

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (JPEG, PNG, WebP)");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image file must be under 10MB");
      return;
    }

    setUploading(true);
    const toastId = toast.loading("Uploading to Cloudinary...");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to upload image");
      }

      onChange(data.url);
      toast.success("Image uploaded successfully!", { id: toastId });
    } catch (err: any) {
      console.error("Upload error:", err);
      toast.error(err?.message || "Upload failed", { id: toastId });
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <span className="block text-xs font-semibold text-brand-dark uppercase tracking-wider">
          {label}
        </span>
      )}

      {value ? (
        <div className={cn("relative rounded-2xl overflow-hidden border border-brand-border bg-brand-light/30 shadow-xs group", aspectClasses)}>
          <Image
            src={value}
            alt="Uploaded preview"
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-102"
            sizes="(max-width: 640px) 100vw, 50vw"
          />

          <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => inputRef.current?.click()}
              className="h-8 px-3 rounded-lg text-xs font-semibold bg-white/95 hover:bg-white text-brand-dark shadow-xs"
            >
              Change Photo
            </Button>
            <Button
              type="button"
              size="sm"
              variant="destructive"
              onClick={() => onChange("")}
              className="h-8 w-8 p-0 rounded-lg shadow-xs"
              aria-label="Remove photo"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Cloudinary CDN Indicator Badge */}
          {value.includes("cloudinary.com") && (
            <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              Cloudinary CDN
            </div>
          )}
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          onClick={() => !uploading && inputRef.current?.click()}
          className={cn(
            "relative border-2 border-dashed rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 select-none",
            dragActive
              ? "border-brand-green bg-brand-light/40 scale-[0.99]"
              : "border-brand-border/80 bg-brand-cream/30 hover:border-brand-green/60 hover:bg-brand-cream/60",
            uploading && "pointer-events-none opacity-70",
            aspectClasses
          )}
        >
          {uploading ? (
            <div className="flex flex-col items-center justify-center space-y-2">
              <Loader2 className="w-7 h-7 text-brand-green animate-spin" />
              <p className="text-xs font-semibold text-brand-dark">Uploading to Cloudinary...</p>
              <p className="text-[10px] text-brand-muted">Optimizing & generating responsive CDN URLs</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="w-11 h-11 rounded-2xl bg-white border border-brand-border/60 shadow-2xs flex items-center justify-center text-brand-green">
                <Upload className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <p className="text-xs font-bold text-brand-dark">
                  Tap to upload crop image
                </p>
                <p className="text-[11px] text-brand-muted mt-0.5">
                  JPEG, PNG, WebP up to 10MB
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="hidden"
        onChange={handleChange}
        disabled={uploading}
      />
    </div>
  );
}
