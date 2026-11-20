export type VerificationStatus = "PENDING" | "VERIFIED" | "REJECTED" | "MORE_INFO_REQUESTED";

export interface Farmer {
  id: string;
  userId: string;
  farmName: string;
  description?: string;
  address: string;
  latitude?: number;
  longitude?: number;
  verified: boolean;
  rating: number;
  reviewCount: number;
  verificationStatus: VerificationStatus;
  coverImage?: string;
  profileImage?: string;
  farmingPractices?: string;
  establishedYear?: number;
  createdAt: Date;
  updatedAt: Date;
  // Joined fields
  ownerName?: string;
  ownerEmail?: string;
  ownerPhone?: string;
}

export interface FarmerWithDistance extends Farmer {
  distanceKm?: number;
}
