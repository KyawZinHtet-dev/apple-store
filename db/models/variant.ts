import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { variantImages } from "./variant_image";
import { variantTags } from "./variant_tag";
import { products } from "./product";
import { createId } from "@paralleldrive/cuid2";
import { orderProducts } from "./order_product";

export const variants = pgTable("variant", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  productId: text("productId")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  color: text("color").notNull(),
  productType: text("productType").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

export const variantRelations = relations(variants, ({ one, many }) => ({
  products: one(products, {
    relationName: "productVariants",
    fields: [variants.productId],
    references: [products.id],
  }),
  variantImages: many(variantImages, { relationName: "variantImages" }),
  variantTags: many(variantTags, { relationName: "variantTags" }),
  orderProduct: many(orderProducts, { relationName: "orderedProductVariant" }),
}));
