import { timestamp, pgTable, text, boolean, pgEnum } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { relations } from "drizzle-orm";
import { orders } from "./order";

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
  customerId: text("customerId"),
});

export const userRelations = relations(users, ({ many }) => ({
  orders: many(orders, { relationName: "userOrders" }),
}));
