import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { products } from "./product";
import { variants } from "./variant";
import { relations } from "drizzle-orm";
import { orders } from "./order";

export const orderProducts = pgTable("order_product", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  quantity: integer("quantity").notNull(),
  productId: text("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  variantId: text("variant_id")
    .notNull()
    .references(() => variants.id, { onDelete: "cascade" }),
  orderId: text("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

export const orderProductRelations = relations(orderProducts, ({ one }) => ({
  product: one(products, {
    relationName: "orderedProduct",
    fields: [orderProducts.productId],
    references: [products.id],
  }),
  variant: one(variants, {
    relationName: "orderedProductVariant",
    fields: [orderProducts.variantId],
    references: [variants.id],
  }),
  order: one(orders, {
    relationName: "orderedOrder",
    fields: [orderProducts.orderId],
    references: [orders.id],
  }),
}));
