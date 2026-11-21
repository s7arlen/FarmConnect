export type OrderStatus =
  | "REQUESTED"
  | "ACCEPTED"
  | "PREPARING"
  | "READY"
  | "COMPLETED"
  | "REJECTED"
  | "CANCELLED";

export type FulfillmentMethod = "PICKUP" | "LOCAL_DELIVERY";

export type PaymentMethod = "COD" | "UPI";
export type PaymentStatus = "PENDING" | "PAID" | "FAILED";

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  // Joined
  productName?: string;
  productImage?: string;
}

export interface Order {
  id: string;
  buyerId: string;
  farmerId: string;
  totalAmount: number;
  fulfillmentMethod: FulfillmentMethod;
  preferredDate?: Date;
  status: OrderStatus;
  paymentMethod?: PaymentMethod;
  paymentStatus?: PaymentStatus;
  paymentReference?: string;
  paidAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  // Joined
  buyerName?: string;
  buyerEmail?: string;
  farmerName?: string;
  farmName?: string;
  items?: OrderItem[];
}

export interface OrderStatusHistory {
  status: OrderStatus;
  timestamp: Date;
  note?: string;
}
