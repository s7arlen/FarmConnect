import {
  pgTable,
  text,
  timestamp,
  pgEnum,
  varchar,
  index,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

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

export const users = pgTable(
  "users",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    phone: varchar("phone", { length: 20 }),
    passwordHash: text("password_hash"),
    role: userRoleEnum("role").notNull().default("BUYER"),
    avatar: text("avatar"),
    googleId: varchar("google_id", { length: 255 }).unique(),
    authProvider: varchar("auth_provider", { length: 50 }).default("local"),
    status: userStatusEnum("status").notNull().default("ACTIVE"),
    emailVerified: timestamp("email_verified"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    emailIdx: index("users_email_idx").on(table.email),
    roleIdx: index("users_role_idx").on(table.role),
    googleIdIdx: index("users_google_id_idx").on(table.googleId),
  })
);

export type UserInsert = typeof users.$inferInsert;
export type UserSelect = typeof users.$inferSelect;
