import { pgTable, real, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { variants } from "./variant";
import { createId } from "@paralleldrive/cuid2";
export const variantImages = pgTable("variant_image", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  variantId: text("variantId")
    .notNull()
    .references(() => variants.id, { onDelete: "cascade" }),
  imageUrl: text("imageUrl").notNull(),
  name: text("name").notNull(),
  size: text("size").notNull(),
  order: real("order").notNull(),
});

export const variantImageRelations = relations(variantImages, ({ one }) => ({
  variants: one(variants, {
    relationName: "variantImages",
    fields: [variantImages.variantId],
    references: [variants.id],
  }),
}));
