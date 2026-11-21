import {
  pgTable,
  text,
  timestamp,
  boolean,
  numeric,
  integer,
  pgEnum,
  index,
  doublePrecision,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { users } from "./users";

export const verificationStatusEnum = pgEnum("verification_status", [
  "PENDING",
  "VERIFIED",
  "REJECTED",
  "MORE_INFO_REQUESTED",
]);

export const farmers = pgTable(
  "farmers",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" })
      .unique(),
    farmName: text("farm_name").notNull(),
    description: text("description"),
    address: text("address").notNull(),
    latitude: doublePrecision("latitude"),
    longitude: doublePrecision("longitude"),
    verified: boolean("verified").notNull().default(false),
    rating: numeric("rating", { precision: 3, scale: 2 }).notNull().default("0"),
    reviewCount: integer("review_count").notNull().default(0),
    verificationStatus: verificationStatusEnum("verification_status")
      .notNull()
      .default("PENDING"),
    coverImage: text("cover_image"),
    profileImage: text("profile_image"),
    upiId: text("upi_id"),
    farmingPractices: text("farming_practices"),
    establishedYear: integer("established_year"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    userIdIdx: index("farmers_user_id_idx").on(table.userId),
    verifiedIdx: index("farmers_verified_idx").on(table.verified),
  })
);

export type FarmerInsert = typeof farmers.$inferInsert;
export type FarmerSelect = typeof farmers.$inferSelect;
