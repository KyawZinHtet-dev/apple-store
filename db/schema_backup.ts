import {
  pgTable,
  text,
  primaryKey,
  integer,
  timestamp,
  boolean,
  pgEnum,
  real,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";
import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ]
);

export const emailVerificationTokens = pgTable(
  "email_verification_token",
  {
    id: text("id")
      .notNull()
      .$defaultFn(() => createId()),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
    email: text("email").notNull(),
  },
  (table) => {
    return {
      compoundKey: primaryKey({
        columns: [table.email, table.token],
      }),
    };
  }
);

export const passwordResetTokens = pgTable(
  "password_reset_token",
  {
    id: text("id")
      .notNull()
      .$defaultFn(() => createId()),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
    email: text("email").notNull(),
  },
  (table) => {
    return {
      compoundKey: primaryKey({
        columns: [table.email, table.token],
      }),
    };
  }
);

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
}));

export const twoFactorCodes = pgTable(
  "two_factor_code",
  {
    id: text("id")
      .notNull()
      .$defaultFn(() => createId()),
    code: text("code").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
    email: text("email").notNull(),
    userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => {
    return {
      compoundKey: primaryKey({
        columns: [table.email, table.code],
      }),
    };
  }
);

export const RoleEnum = pgEnum("roles", ["admin", "user"]);

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name"),
  email: text("email").unique(),
  password: text("password"),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  role: RoleEnum("roles").default("user"),
  isTwoFactorEnabled: boolean("isTwoFactorEnabled").default(false),
});

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
}));
