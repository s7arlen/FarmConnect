import {
  pgTable,
  text,
  timestamp,
  numeric,
  pgEnum,
  index,
  date,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { users } from "./users";
import { farmers } from "./farmers";

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

export const orders = pgTable(
  "orders",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    buyerId: text("buyer_id")
      .notNull()
      .references(() => users.id),
    farmerId: text("farmer_id")
      .notNull()
      .references(() => farmers.id),
    totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
    fulfillmentMethod: fulfillmentMethodEnum("fulfillment_method")
      .notNull()
      .default("PICKUP"),
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

export type OrderInsert = typeof orders.$inferInsert;
export type OrderSelect = typeof orders.$inferSelect;
