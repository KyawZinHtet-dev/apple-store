import { pgTable, real, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { text } from "drizzle-orm/pg-core";
import { users } from "./user";
import { relations } from "drizzle-orm";
import { orderProducts } from "./order_product";

export const orders = pgTable("order", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  total: real("total").notNull(),
  status: text("status").notNull(),
  receiptURL: text("receiptURL").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

export const orderRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    relationName: "userOrders",
    fields: [orders.userId],
    references: [users.id],
  }),
  orderProduct: many(orderProducts, { relationName: "orderedOrder" }),
}));
