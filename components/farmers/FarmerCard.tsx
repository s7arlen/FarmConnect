"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import StarRating from "@/components/shared/StarRating";
import { getInitials } from "@/lib/utils";
import type { Farmer } from "@/types/farmer";

interface FarmerCardProps {
  farmer: Farmer;
  products?: string[];
  index?: number;
}

export default function FarmerCard({ farmer, products, index = 0 }: FarmerCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="group bg-white rounded-xl border border-brand-border overflow-hidden hover:shadow-md transition-shadow duration-200"
    >
      {/* Cover Image */}
      <div className="relative h-32 bg-brand-light overflow-hidden">
        {farmer.coverImage ? (
          <Image
            src={farmer.coverImage}
            alt={`${farmer.farmName} farm`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-brand-green/20 to-brand-light" />
        )}
      </div>

      {/* Profile */}
      <div className="px-4 pb-4">
        {/* Avatar */}
        <div className="flex items-end justify-between -mt-8 mb-3">
          <div className="w-14 h-14 rounded-xl border-2 border-white shadow-sm overflow-hidden bg-brand-light flex-shrink-0">
            {farmer.profileImage ? (
              <Image
                src={farmer.profileImage}
                alt={farmer.ownerName || farmer.farmName}
                width={56}
                height={56}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-brand-green font-bold text-lg">
                {getInitials(farmer.farmName)}
              </div>
            )}
          </div>

          {farmer.verified && (
            <Badge variant="verified" className="text-[10px]">
              <CheckCircle className="w-3 h-3" />
              Verified
            </Badge>
          )}
        </div>

        <h3 className="font-semibold text-brand-text text-base leading-tight">
          {farmer.farmName}
        </h3>
        {farmer.ownerName && (
          <p className="text-sm text-brand-muted">{farmer.ownerName}</p>
        )}

        <div className="flex items-center gap-3 mt-2">
          <StarRating
            rating={Number(farmer.rating)}
            showValue
            reviewCount={farmer.reviewCount}
          />
        </div>

        <div className="flex items-center gap-1 mt-1 text-xs text-brand-muted">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{farmer.address}</span>
          {(farmer as { distanceKm?: number }).distanceKm !== undefined && (
            <span className="ml-auto flex-shrink-0">
              {(farmer as { distanceKm?: number }).distanceKm} km
            </span>
          )}
        </div>

        {products && products.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {products.slice(0, 3).map((p) => (
              <span
                key={p}
                className="text-[10px] bg-brand-light text-brand-green px-2 py-0.5 rounded-full"
              >
                {p}
              </span>
            ))}
            {products.length > 3 && (
              <span className="text-[10px] text-brand-muted">
                +{products.length - 3} more
              </span>
            )}
          </div>
        )}

        <Link href={`/buyer/farmers/${farmer.id}`} className="block mt-3">
          <Button variant="outline" size="sm" className="w-full">
            View Farm
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
