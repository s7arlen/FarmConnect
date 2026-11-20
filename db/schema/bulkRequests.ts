import {
  pgTable,
  text,
  timestamp,
  numeric,
  integer,
  pgEnum,
  index,
  date,
  doublePrecision,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { users } from "./users";
import { farmers } from "./farmers";

export const bulkRequestStatusEnum = pgEnum("bulk_request_status", [
  "OPEN",
  "MATCHED",
  "ORDERED",
  "COMPLETED",
  "CANCELLED",
]);

export const bulkMatchStatusEnum = pgEnum("bulk_match_status", [
  "PENDING",
  "ACCEPTED",
  "REJECTED",
]);

export const bulkRequests = pgTable(
  "bulk_requests",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    buyerId: text("buyer_id")
      .notNull()
      .references(() => users.id),
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
  },
  (table) => ({
    buyerIdIdx: index("bulk_requests_buyer_id_idx").on(table.buyerId),
    statusIdx: index("bulk_requests_status_idx").on(table.status),
  })
);

export const bulkMatches = pgTable(
  "bulk_matches",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    requestId: text("request_id")
      .notNull()
      .references(() => bulkRequests.id, { onDelete: "cascade" }),
    farmerId: text("farmer_id")
      .notNull()
      .references(() => farmers.id),
    matchScore: integer("match_score").notNull().default(0),
    status: bulkMatchStatusEnum("status").notNull().default("PENDING"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    requestIdIdx: index("bulk_matches_request_id_idx").on(table.requestId),
    farmerIdIdx: index("bulk_matches_farmer_id_idx").on(table.farmerId),
  })
);

export type BulkRequestInsert = typeof bulkRequests.$inferInsert;
export type BulkRequestSelect = typeof bulkRequests.$inferSelect;
export type BulkMatchInsert = typeof bulkMatches.$inferInsert;
export type BulkMatchSelect = typeof bulkMatches.$inferSelect;
