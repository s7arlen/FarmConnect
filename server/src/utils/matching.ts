export interface BulkRequest {
  id: string;
  productName: string;
  quantity: number;
  unit: string;
  maxPrice: number;
  requiredDate: Date;
  maxDistance?: number;
}

export interface FarmerCandidate {
  id: string;
  farmName: string;
  address: string;
  latitude?: number;
  longitude?: number;
  verified: boolean;
  rating: number;
}

export interface ProductCandidate {
  id: string;
  farmerId: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  unit: string;
  status: string;
}

export function computeMatchScore(
  request: BulkRequest,
  farmer: FarmerCandidate,
  products: ProductCandidate[]
) {
  // 1. Product compatibility (30%)
  let productScore = 0;
  const reqName = request.productName.toLowerCase();
  for (const p of products) {
    if (p.name.toLowerCase() === reqName) {
      productScore = 100;
      break;
    }
    if (p.name.toLowerCase().includes(reqName) || reqName.includes(p.name.toLowerCase())) {
      productScore = Math.max(productScore, 75);
    }
  }

  // 2. Quantity compatibility (25%)
  const totalAvailable = products
    .filter((p) => p.name.toLowerCase().includes(reqName) || reqName.includes(p.name.toLowerCase()))
    .reduce((sum, p) => sum + p.quantity, 0);

  const quantityRatio = request.quantity > 0 ? totalAvailable / request.quantity : 0;
  const quantityScore = Math.min(100, Math.round(quantityRatio * 100));

  // 3. Price compatibility (20%)
  let priceScore = 50;
  const matchingProds = products.filter((p) => p.name.toLowerCase().includes(reqName));
  if (matchingProds.length > 0) {
    const minPrice = Math.min(...matchingProds.map((p) => p.price));
    if (minPrice <= request.maxPrice) {
      priceScore = 100;
    } else {
      const overpct = (minPrice - request.maxPrice) / request.maxPrice;
      priceScore = Math.max(0, Math.round(100 - overpct * 150));
    }
  }

  // 4. Verification & Rating (15%)
  const ratingScore = Math.min(100, Math.round((farmer.rating / 5) * 80 + (farmer.verified ? 20 : 0)));

  // 5. Distance (10%) - default high score for local demonstration
  const distanceScore = 85;

  const totalScore = Math.round(
    productScore * 0.3 +
    quantityScore * 0.25 +
    priceScore * 0.2 +
    ratingScore * 0.15 +
    distanceScore * 0.1
  );

  return {
    farmerId: farmer.id,
    matchScore: totalScore,
    breakdown: {
      productCompatibility: productScore,
      quantityCompatibility: quantityScore,
      priceCompatibility: priceScore,
      farmerReputation: ratingScore,
      distance: distanceScore,
    },
  };
}
