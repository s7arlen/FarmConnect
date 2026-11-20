export interface Review {
  id: string;
  buyerId: string;
  farmerId: string;
  productId?: string;
  orderId: string;
  rating: number;
  comment?: string;
  createdAt: Date;
  // Joined
  buyerName?: string;
  buyerAvatar?: string;
}
