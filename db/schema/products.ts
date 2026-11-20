import {
  pgTable,
  text,
  timestamp,
  numeric,
  integer,
  pgEnum,
  index,
  date,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { farmers } from "./farmers";

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
]);

export const products = pgTable(
  "products",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    farmerId: text("farmer_id")
      .notNull()
      .references(() => farmers.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    category: text("category").notNull(),
    description: text("description"),
    price: numeric("price", { precision: 10, scale: 2 }).notNull(),
    quantity: integer("quantity").notNull().default(0),
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
    nameIdx: index("products_name_idx").on(table.name),
  })
);

export type ProductInsert = typeof products.$inferInsert;
export type ProductSelect = typeof products.$inferSelect;
