import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z
      .string()
      .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian phone number")
      .optional()
      .or(z.literal("")),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
    role: z.enum(["BUYER", "FARMER", "BULK_BUYER"], {
      required_error: "Please select a role",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().min(3, "Please enter your email or phone number"),
  password: z.string().min(1, "Password is required"),
});

export const productSchema = z.object({
  name: z.string().min(2, "Product name is required").max(100),
  category: z.string().min(1, "Category is required"),
  description: z.string().max(500).optional(),
  price: z
    .number({ invalid_type_error: "Price must be a number" })
    .positive("Price must be greater than 0")
    .max(100000, "Price seems too high"),
  quantity: z
    .number({ invalid_type_error: "Quantity must be a number" })
    .int("Quantity must be a whole number")
    .positive("Quantity must be greater than 0"),
  unit: z.enum(["kg", "g", "piece", "dozen", "bundle", "litre", "packet"]),
  image: z.string().optional().or(z.literal("")),
  harvestDate: z.string().optional(),
  status: z.enum(["AVAILABLE", "LIMITED", "UNAVAILABLE"]).default("AVAILABLE"),
});

export const orderSchema = z.object({
  farmerId: z.string().min(1),
  fulfillmentMethod: z.enum(["PICKUP", "LOCAL_DELIVERY"]).default("PICKUP"),
  paymentMethod: z.enum(["COD", "UPI"]).default("COD"),
  paymentReference: z.string().max(100).optional(),
  preferredDate: z.string().optional(),
  notes: z.string().max(500).optional(),
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().positive("Quantity must be at least 1"),
      })
    )
    .min(1, "Order must have at least one item"),
});

export const reviewSchema = z.object({
  orderId: z.string().min(1),
  farmerId: z.string().min(1),
  productId: z.string().optional(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(500).optional(),
});

export const bulkRequestSchema = z.object({
  productName: z.string().min(2, "Product name is required"),
  quantity: z
    .number({ invalid_type_error: "Quantity must be a number" })
    .int()
    .positive("Quantity must be greater than 0"),
  unit: z.string().min(1, "Unit is required"),
  maxPrice: z
    .number({ invalid_type_error: "Max price must be a number" })
    .positive("Price must be greater than 0"),
  requiredDate: z.string().min(1, "Required date is needed"),
  maxDistance: z.number().positive().optional(),
  notes: z.string().max(500).optional(),
});

export const farmProfileSchema = z.object({
  farmName: z.string().min(2, "Farm name is required").max(100),
  description: z.string().max(1000).optional(),
  address: z.string().min(5, "Address is required"),
  farmingPractices: z.string().max(500).optional(),
  coverImage: z.string().optional().or(z.literal("")),
  profileImage: z.string().optional().or(z.literal("")),
  establishedYear: z
    .number()
    .int()
    .min(1900)
    .max(new Date().getFullYear())
    .optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type OrderInput = z.infer<typeof orderSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type BulkRequestInput = z.infer<typeof bulkRequestSchema>;
export type FarmProfileInput = z.infer<typeof farmProfileSchema>;
