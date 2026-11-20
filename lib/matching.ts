/**
 * FarmConnect Bulk Buyer — Farmer Matching Algorithm
 *
 * Deterministic scoring based on transparent criteria.
 * Score range: 0–100
 *
 * Weights:
 *   Product compatibility:  30%
 *   Quantity compatibility:  25%
 *   Distance:                20%
 *   Price:                   15%
 *   Availability:            10%
 */

import type { BulkRequest } from "@/types/bulkRequest";
import type { Farmer } from "@/types/farmer";
import type { Product } from "@/types/product";

export interface MatchResult {
  farmerId: string;
  matchScore: number;
  breakdown: {
    productCompatibility: number;
    quantityCompatibility: number;
    distance: number;
    price: number;
    availability: number;
  };
  explanation: string[];
}

const WEIGHTS = {
  productCompatibility: 0.3,
  quantityCompatibility: 0.25,
  distance: 0.2,
  price: 0.15,
  availability: 0.1,
};

function scoreProductCompatibility(
  request: BulkRequest,
  farmerProducts: Product[]
): number {
  const requestWords = request.productName.toLowerCase().split(/\s+/);
  let best = 0;

  for (const product of farmerProducts) {
    const productWords = product.name.toLowerCase().split(/\s+/);
    const productCategory = product.category.toLowerCase();

    // Exact name match
    if (product.name.toLowerCase() === request.productName.toLowerCase()) {
      return 100;
    }

    // Partial name match
    const overlap = requestWords.filter(
      (w) => productWords.includes(w) || productCategory.includes(w)
    ).length;

    const score = (overlap / Math.max(requestWords.length, 1)) * 85;
    best = Math.max(best, score);
  }

  return Math.round(best);
}

function scoreQuantityCompatibility(
  requestedQty: number,
  farmerProducts: Product[]
): number {
  const maxAvailable = Math.max(...farmerProducts.map((p) => p.quantity), 0);
  if (maxAvailable === 0) return 0;

  if (maxAvailable >= requestedQty) return 100;

  // Partial: can fulfill 80–99%
  const ratio = maxAvailable / requestedQty;
  if (ratio >= 0.8) return Math.round(ratio * 90);
  if (ratio >= 0.5) return Math.round(ratio * 70);

  return Math.round(ratio * 40);
}

function scoreDistance(
  distanceKm: number | undefined,
  maxDistanceKm: number | undefined
): number {
  if (!distanceKm) return 50; // Unknown distance — neutral score
  const limit = maxDistanceKm || 50;
  if (distanceKm <= limit * 0.3) return 100;
  if (distanceKm <= limit * 0.5) return 85;
  if (distanceKm <= limit * 0.75) return 70;
  if (distanceKm <= limit) return 50;
  return 10; // Beyond max distance
}

function scorePrice(
  maxPrice: number,
  farmerProducts: Product[]
): number {
  const relevantPrices = farmerProducts.map((p) => Number(p.price));
  if (relevantPrices.length === 0) return 50;

  const lowestPrice = Math.min(...relevantPrices);
  if (lowestPrice <= maxPrice) {
    const savings = ((maxPrice - lowestPrice) / maxPrice) * 100;
    return Math.min(100, Math.round(70 + savings * 0.3));
  }

  // Price exceeds max — heavily penalised
  const excess = ((lowestPrice - maxPrice) / maxPrice) * 100;
  return Math.max(0, Math.round(50 - excess));
}

function scoreAvailability(farmerProducts: Product[]): number {
  if (farmerProducts.length === 0) return 0;
  const available = farmerProducts.filter(
    (p) => p.status === "AVAILABLE" || p.status === "LIMITED"
  );
  return Math.round((available.length / farmerProducts.length) * 100);
}

export function computeMatchScore(
  request: BulkRequest,
  farmer: Farmer,
  farmerProducts: Product[]
): MatchResult {
  const productScore = scoreProductCompatibility(request, farmerProducts);
  const quantityScore = scoreQuantityCompatibility(
    request.quantity,
    farmerProducts
  );
  const distanceScore = scoreDistance(
    (farmer as import("@/types/farmer").FarmerWithDistance).distanceKm ?? undefined,
    request.maxDistance ?? undefined
  );
  const priceScore = scorePrice(Number(request.maxPrice), farmerProducts);
  const availabilityScore = scoreAvailability(farmerProducts);

  const total = Math.round(
    productScore * WEIGHTS.productCompatibility +
      quantityScore * WEIGHTS.quantityCompatibility +
      distanceScore * WEIGHTS.distance +
      priceScore * WEIGHTS.price +
      availabilityScore * WEIGHTS.availability
  );

  const explanation: string[] = [];

  if (productScore >= 90)
    explanation.push("Exact product match found in inventory");
  else if (productScore >= 60)
    explanation.push("Similar products available in inventory");
  else explanation.push("Partial product match — may require confirmation");

  if (quantityScore >= 100)
    explanation.push(`Can fulfill full quantity of ${request.quantity} ${request.unit}`);
  else if (quantityScore >= 70)
    explanation.push("Can fulfill most of the requested quantity");
  else explanation.push("Partial quantity available");

  if (distanceScore >= 85) explanation.push("Very close to your location");
  else if (distanceScore >= 50) explanation.push("Within acceptable distance");

  if (priceScore >= 85)
    explanation.push("Pricing is well within your maximum budget");
  else if (priceScore >= 60) explanation.push("Pricing is within budget");
  else explanation.push("Pricing may exceed your budget — negotiate directly");

  return {
    farmerId: farmer.id,
    matchScore: total,
    breakdown: {
      productCompatibility: productScore,
      quantityCompatibility: quantityScore,
      distance: distanceScore,
      price: priceScore,
      availability: availabilityScore,
    },
    explanation,
  };
}

export function rankFarmerMatches(
  request: BulkRequest,
  farmers: Farmer[],
  farmerProductsMap: Map<string, Product[]>
): MatchResult[] {
  const results = farmers.map((farmer) => {
    const products = farmerProductsMap.get(farmer.id) || [];
    return computeMatchScore(request, farmer, products);
  });

  return results.sort((a, b) => b.matchScore - a.matchScore);
}
