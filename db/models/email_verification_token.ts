import { pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

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
