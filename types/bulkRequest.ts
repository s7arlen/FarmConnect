export type BulkRequestStatus = "OPEN" | "MATCHED" | "ORDERED" | "COMPLETED" | "CANCELLED";
export type BulkMatchStatus = "PENDING" | "ACCEPTED" | "REJECTED";

export interface BulkRequest {
  id: string;
  buyerId: string;
  productName: string;
  quantity: number;
  unit: string;
  maxPrice: number;
  requiredDate: Date;
  maxDistance?: number;
  notes?: string;
  status: BulkRequestStatus;
  createdAt: Date;
  updatedAt: Date;
  // Joined
  buyerName?: string;
  matchCount?: number;
}

export interface BulkMatch {
  id: string;
  requestId: string;
  farmerId: string;
  matchScore: number;
  status: BulkMatchStatus;
  createdAt: Date;
  // Joined
  farmName?: string;
  farmerName?: string;
  farmerRating?: number;
  farmerVerified?: boolean;
  farmerLocation?: string;
}

export interface MatchCriteria {
  productCompatibility: number; // 30%
  quantityCompatibility: number; // 25%
  distance: number; // 20%
  price: number; // 15%
  availability: number; // 10%
  total: number; // 0-100
}
