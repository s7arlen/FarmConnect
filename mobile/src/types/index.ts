export type UserRole = "FARMER" | "BUYER" | "BULK_BUYER" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
}

export interface FarmerProfile {
  id: string;
  userId: string;
  farmName: string;
  description?: string;
  address: string;
  village?: string;
  taluk?: string;
  district?: string;
  latitude?: number;
  longitude?: number;
  verified: boolean;
  rating: number;
  reviewCount: number;
  coverImage?: string;
  profileImage?: string;
  farmingPractices?: string;
  establishedYear?: number;
}

export type ProductUnit = "kg" | "g" | "piece" | "dozen" | "bundle" | "litre" | "packet" | "quintal" | "bag" | "crate";
export type ProductStatus = "AVAILABLE" | "LIMITED" | "UNAVAILABLE";

export interface Product {
  id: string;
  farmerId: string;
  name: string;
  category: string;
  description?: string;
  price: number;
  quantity: number;
  unit: ProductUnit;
  image?: string;
  harvestDate?: string;
  status: ProductStatus;
  farmName?: string;
  farmerAddress?: string;
  farmerVerified?: boolean;
  distanceKm?: number;
}

export type OrderStatus =
  | "REQUESTED"
  | "ACCEPTED"
  | "PREPARING"
  | "READY"
  | "COMPLETED"
  | "REJECTED"
  | "CANCELLED";

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productUnit: ProductUnit;
  productImage?: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Order {
  id: string;
  buyerId: string;
  farmerId: string;
  farmName?: string;
  farmerAddress?: string;
  buyerName?: string;
  status: OrderStatus;
  totalAmount: number;
  fulfillmentMethod: "PICKUP" | "LOCAL_DELIVERY";
  preferredDate?: string;
  notes?: string;
  createdAt: string;
  items: OrderItem[];
}

export interface BulkRequirement {
  id: string;
  buyerId: string;
  buyerName?: string;
  productName: string;
  quantity: number;
  unit: string;
  maxPrice: number;
  requiredDate: string;
  notes?: string;
  status: "OPEN" | "MATCHED" | "ORDERED" | "COMPLETED" | "CANCELLED";
  createdAt: string;
  matchScore?: number;
}
