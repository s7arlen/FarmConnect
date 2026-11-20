export type ProductStatus = "AVAILABLE" | "LIMITED" | "UNAVAILABLE";
export type ProductUnit = "kg" | "g" | "piece" | "dozen" | "bundle" | "litre" | "packet";

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
  harvestDate?: Date;
  status: ProductStatus;
  createdAt: Date;
  updatedAt: Date;
  // Joined fields
  farmerName?: string;
  farmName?: string;
  farmerVerified?: boolean;
  distanceKm?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
