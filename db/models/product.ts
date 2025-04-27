import { pgTable, timestamp, text, integer } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { variants } from "./variant";
import { orderProducts } from "./order_product";

export const products = pgTable("product", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  title: text("title"),
  description: text("description"),
  price: integer("price"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

export const productRelations = relations(products, ({ many }) => ({
  variants: many(variants, { relationName: "productVariants" }),
  orderProduct: many(orderProducts, { relationName: "orderedProduct" }),
}));
