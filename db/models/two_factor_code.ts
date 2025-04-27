import { pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { users } from "./user";

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
