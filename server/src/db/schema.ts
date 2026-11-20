import {
  pgTable,
  text,
  timestamp,
  boolean,
  numeric,
  integer,
  pgEnum,
  index,
  date,
  doublePrecision,
  varchar,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

// Enums
export const userRoleEnum = pgEnum("user_role", [
  "FARMER",
  "BUYER",
  "BULK_BUYER",
  "ADMIN",
]);

export const userStatusEnum = pgEnum("user_status", [
  "ACTIVE",
  "SUSPENDED",
  "PENDING",
]);

export const productStatusEnum = pgEnum("product_status", [
  "AVAILABLE",
  "LIMITED",
  "UNAVAILABLE",
]);

export const productUnitEnum = pgEnum("product_unit", [
  "kg",
  "g",
  "piece",
  "dozen",
  "bundle",
  "litre",
  "packet",
  "quintal",
  "bag",
]);

export const orderStatusEnum = pgEnum("order_status", [
  "REQUESTED",
  "ACCEPTED",
  "PREPARING",
  "READY",
  "COMPLETED",
  "REJECTED",
  "CANCELLED",
]);

export const fulfillmentMethodEnum = pgEnum("fulfillment_method", [
  "PICKUP",
  "LOCAL_DELIVERY",
]);

export const bulkRequestStatusEnum = pgEnum("bulk_request_status", [
  "OPEN",
  "MATCHED",
  "ORDERED",
  "COMPLETED",
  "CANCELLED",
]);

// 1. Users Table
export const users = pgTable(
  "users",
  {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    phone: varchar("phone", { length: 20 }),
    passwordHash: text("password_hash").notNull(),
    role: userRoleEnum("role").notNull().default("BUYER"),
    avatar: text("avatar"),
    status: userStatusEnum("status").notNull().default("ACTIVE"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    emailIdx: index("users_email_idx").on(table.email),
    roleIdx: index("users_role_idx").on(table.role),
  })
);

// 2. Farmer Profiles Table
export const farmerProfiles = pgTable(
  "farmer_profiles",
  {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }).unique(),
    farmName: text("farm_name").notNull(),
    description: text("description"),
    address: text("address").notNull(),
    village: text("village"),
    taluk: text("taluk"),
    district: text("district"),
    latitude: doublePrecision("latitude"),
    longitude: doublePrecision("longitude"),
    verified: boolean("verified").notNull().default(false),
    rating: numeric("rating", { precision: 3, scale: 2 }).notNull().default("0"),
    reviewCount: integer("review_count").notNull().default(0),
    coverImage: text("cover_image"),
    profileImage: text("profile_image"),
    farmingPractices: text("farming_practices"),
    establishedYear: integer("established_year"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    userIdIdx: index("farmer_profiles_user_id_idx").on(table.userId),
    verifiedIdx: index("farmer_profiles_verified_idx").on(table.verified),
  })
);

// 3. Buyer Profiles Table
export const buyerProfiles = pgTable(
  "buyer_profiles",
  {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }).unique(),
    deliveryAddress: text("delivery_address"),
    landmark: text("landmark"),
    city: text("city"),
    pincode: text("pincode"),
    businessType: text("business_type"), // Hotel, Restaurant, Hostel, Consumer
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  }
);

// 4. Products Table
export const products = pgTable(
  "products",
  {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    farmerId: text("farmer_id").notNull().references(() => farmerProfiles.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    category: text("category").notNull(),
    description: text("description"),
    price: numeric("price", { precision: 10, scale: 2 }).notNull(),
    quantity: integer("quantity").notNull().default(0),
    reservedQuantity: integer("reserved_quantity").notNull().default(0),
    unit: productUnitEnum("unit").notNull().default("kg"),
    image: text("image"),
    harvestDate: date("harvest_date"),
    status: productStatusEnum("status").notNull().default("AVAILABLE"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    farmerIdIdx: index("products_farmer_id_idx").on(table.farmerId),
    categoryIdx: index("products_category_idx").on(table.category),
    statusIdx: index("products_status_idx").on(table.status),
  })
);

// 5. Inventory Logs Table (Audit trail of stock movements)
export const inventoryLogs = pgTable(
  "inventory_logs",
  {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    productId: text("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
    changeQuantity: integer("change_quantity").notNull(),
    balanceQuantity: integer("balance_quantity").notNull(),
    reason: text("reason").notNull(), // HARVEST, ORDER_RESERVATION, ORDER_FULFILLMENT, ADJUSTMENT
    createdAt: timestamp("created_at").notNull().defaultNow(),
  }
);

// 6. Orders Table
export const orders = pgTable(
  "orders",
  {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    buyerId: text("buyer_id").notNull().references(() => users.id),
    farmerId: text("farmer_id").notNull().references(() => farmerProfiles.id),
    totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
    fulfillmentMethod: fulfillmentMethodEnum("fulfillment_method").notNull().default("PICKUP"),
    preferredDate: date("preferred_date"),
    status: orderStatusEnum("status").notNull().default("REQUESTED"),
    notes: text("notes"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    buyerIdIdx: index("orders_buyer_id_idx").on(table.buyerId),
    farmerIdIdx: index("orders_farmer_id_idx").on(table.farmerId),
    statusIdx: index("orders_status_idx").on(table.status),
  })
);

// 7. Order Items Table
export const orderItems = pgTable(
  "order_items",
  {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    orderId: text("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
    productId: text("product_id").notNull().references(() => products.id),
    productName: text("product_name").notNull(), // Snapshot
    quantity: integer("quantity").notNull(),
    unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
    subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
  }
);

// 8. Bulk Requirements Table
export const bulkRequirements = pgTable(
  "bulk_requirements",
  {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    buyerId: text("buyer_id").notNull().references(() => users.id),
    productName: text("product_name").notNull(),
    quantity: integer("quantity").notNull(),
    unit: text("unit").notNull().default("kg"),
    maxPrice: numeric("max_price", { precision: 10, scale: 2 }).notNull(),
    requiredDate: date("required_date").notNull(),
    maxDistance: doublePrecision("max_distance"),
    notes: text("notes"),
    status: bulkRequestStatusEnum("status").notNull().default("OPEN"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  }
);

// 9. Bulk Offers Table (Farmer Bids on Requirements)
export const bulkOffers = pgTable(
  "bulk_offers",
  {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    requirementId: text("requirement_id").notNull().references(() => bulkRequirements.id, { onDelete: "cascade" }),
    farmerId: text("farmer_id").notNull().references(() => farmerProfiles.id),
    offeredQuantity: integer("offered_quantity").notNull(),
    offeredPrice: numeric("offered_price", { precision: 10, scale: 2 }).notNull(),
    message: text("message"),
    status: text("status").notNull().default("PENDING"), // PENDING, ACCEPTED, REJECTED
    createdAt: timestamp("created_at").notNull().defaultNow(),
  }
);

// 10. Reviews Table
export const reviews = pgTable(
  "reviews",
  {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    buyerId: text("buyer_id").notNull().references(() => users.id),
    farmerId: text("farmer_id").notNull().references(() => farmerProfiles.id),
    productId: text("product_id").references(() => products.id),
    orderId: text("order_id").notNull().references(() => orders.id),
    rating: integer("rating").notNull(),
    comment: text("comment"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  }
);

// 11. Notifications Table
export const notifications = pgTable(
  "notifications",
  {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    message: text("message").notNull(),
    type: text("type").notNull().default("ORDER_UPDATE"),
    isRead: boolean("is_read").notNull().default(false),
    link: text("link"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  }
);
