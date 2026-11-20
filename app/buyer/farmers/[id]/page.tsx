"use client";

import React from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, CheckCircle, ArrowLeft, Calendar, Leaf } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import StarRating from "@/components/shared/StarRating";
import ProductCard from "@/components/products/ProductCard";
import { DEMO_FARMERS, DEMO_PRODUCTS, DEMO_REVIEWS } from "@/data/demo";
import { getInitials, formatDate } from "@/lib/utils";

export default function FarmerProfilePage() {
  const params = useParams();
  const farmer = DEMO_FARMERS.find((f) => f.id === params.id);

  if (!farmer) notFound();

  const products = DEMO_PRODUCTS.filter((p) => p.farmerId === farmer.id);
  const reviews = DEMO_REVIEWS.filter((r) => r.farmerId === farmer.id);

  return (
    <div className="max-w-5xl">
      {/* Cover */}
      <div className="relative h-52 md:h-72 bg-brand-light overflow-hidden">
        {farmer.coverImage ? (
          <Image
            src={farmer.coverImage}
            alt={`${farmer.farmName} cover`}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-brand-green/30 to-brand-light" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        <Link
          href="/buyer/farmers"
          className="absolute top-4 left-4 flex items-center gap-1.5 text-white text-sm bg-black/30 backdrop-blur-sm rounded-lg px-3 py-1.5 hover:bg-black/50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Farmers
        </Link>
      </div>

      <div className="p-4 md:p-8">
        {/* Profile Row */}
        <div className="flex items-end gap-4 -mt-16 md:-mt-20 mb-6 relative z-10">
          <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl border-4 border-white shadow-lg overflow-hidden bg-brand-light flex-shrink-0">
            {farmer.profileImage ? (
              <Image
                src={farmer.profileImage}
                alt={farmer.farmName}
                width={112}
                height={112}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-brand-green font-bold text-2xl">
                {getInitials(farmer.farmName)}
              </div>
            )}
          </div>

          <div className="pb-2">
            {farmer.verified && (
              <Badge variant="verified" className="mb-2">
                <CheckCircle className="w-3 h-3" />
                Verified Farmer
              </Badge>
            )}
            <h1 className="text-2xl font-bold text-brand-text">{farmer.farmName}</h1>
            {farmer.ownerName && (
              <p className="text-brand-muted text-sm">{farmer.ownerName}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            {farmer.description && (
              <div>
                <h2 className="text-lg font-semibold text-brand-text mb-3">
                  About the Farm
                </h2>
                <p className="text-brand-muted leading-relaxed">
                  {farmer.description}
                </p>
              </div>
            )}

            {/* Farming Practices */}
            {farmer.farmingPractices && (
              <div>
                <h2 className="text-lg font-semibold text-brand-text mb-3 flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-brand-green" />
                  Farming Practices
                </h2>
                <p className="text-brand-muted leading-relaxed">
                  {farmer.farmingPractices}
                </p>
              </div>
            )}

            {/* Products */}
            <div>
              <h2 className="text-lg font-semibold text-brand-text mb-4">
                Available Produce ({products.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {products.map((product, i) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    showFarmer={false}
                    index={i}
                  />
                ))}
              </div>
            </div>

            {/* Reviews */}
            {reviews.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-brand-text mb-4">
                  Reviews ({reviews.length})
                </h2>
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-full bg-brand-light flex items-center justify-center text-brand-green font-semibold text-sm flex-shrink-0">
                            {getInitials(review.buyerName || "U")}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-0.5">
                              <p className="font-semibold text-brand-text text-sm">
                                {review.buyerName}
                              </p>
                              <StarRating rating={review.rating} size="sm" />
                            </div>
                            {review.comment && (
                              <p className="text-sm text-brand-muted">
                                {review.comment}
                              </p>
                            )}
                            <p className="text-xs text-brand-muted/60 mt-1">
                              {formatDate(review.createdAt)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-5 space-y-4">
                <StarRating
                  rating={Number(farmer.rating)}
                  size="lg"
                  showValue
                  reviewCount={farmer.reviewCount}
                />
                <div className="flex items-start gap-2 text-sm text-brand-muted">
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-brand-green" />
                  <span>{farmer.address}</span>
                </div>
                {farmer.establishedYear && (
                  <div className="flex items-center gap-2 text-sm text-brand-muted">
                    <Calendar className="w-4 h-4 text-brand-green" />
                    <span>Est. {farmer.establishedYear}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <h3 className="font-semibold text-brand-text text-sm mb-3">
                  Produce Categories
                </h3>
                <div className="flex flex-wrap gap-2">
                  {Array.from(new Set(products.map((p) => p.category))).map((cat) => (
                    <span
                      key={cat}
                      className="text-xs bg-brand-light text-brand-green px-2.5 py-1 rounded-full capitalize"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
