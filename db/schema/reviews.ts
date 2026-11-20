import {
  pgTable,
  text,
  timestamp,
  integer,
  index,
  unique,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { users } from "./users";
import { farmers } from "./farmers";
import { products } from "./products";
import { orders } from "./orders";

export const reviews = pgTable(
  "reviews",
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
    productId: text("product_id").references(() => products.id),
    orderId: text("order_id")
      .notNull()
      .references(() => orders.id),
    rating: integer("rating").notNull(),
    comment: text("comment"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    farmerIdIdx: index("reviews_farmer_id_idx").on(table.farmerId),
    buyerIdIdx: index("reviews_buyer_id_idx").on(table.buyerId),
    // Prevent duplicate reviews for the same order
    uniqueOrderReview: unique("unique_order_review").on(
      table.buyerId,
      table.orderId
    ),
  })
);

export type ReviewInsert = typeof reviews.$inferInsert;
export type ReviewSelect = typeof reviews.$inferSelect;
