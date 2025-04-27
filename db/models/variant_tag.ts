import { pgTable, text } from "drizzle-orm/pg-core";
import { variants } from "./variant";
import { relations } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";

export const variantTags = pgTable("variant_tag", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  variantId: text("variantId")
    .notNull()
    .references(() => variants.id, { onDelete: "cascade" }),
  tag: text("tag").notNull(),
});

export const variantTagRelations = relations(variantTags, ({ one }) => ({
  variants: one(variants, {
    relationName: "variantTags",
    fields: [variantTags.variantId],
    references: [variants.id],
  }),
}));
