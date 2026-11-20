import {
  pgTable,
  text,
  timestamp,
  boolean,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { users } from "./users";

export const notificationTypeEnum = pgEnum("notification_type", [
  "ORDER_PLACED",
  "ORDER_ACCEPTED",
  "ORDER_REJECTED",
  "ORDER_READY",
  "ORDER_COMPLETED",
  "NEW_REVIEW",
  "VERIFICATION_APPROVED",
  "VERIFICATION_REJECTED",
  "BULK_MATCH",
  "SYSTEM",
]);

export const notifications = pgTable(
  "notifications",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    message: text("message").notNull(),
    type: notificationTypeEnum("type").notNull().default("SYSTEM"),
    read: boolean("read").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    userIdIdx: index("notifications_user_id_idx").on(table.userId),
    readIdx: index("notifications_read_idx").on(table.read),
  })
);

export type NotificationInsert = typeof notifications.$inferInsert;
export type NotificationSelect = typeof notifications.$inferSelect;
