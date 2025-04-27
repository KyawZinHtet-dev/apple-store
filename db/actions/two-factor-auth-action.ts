"use server";
import { twoFactorSchema } from "@/types/two-factor-schema";
import { actionClient } from "./safe-action";
import { db } from "../db_connection";
import { eq } from "drizzle-orm";
import { users } from "../models/user";

export const TwoFactorAuthenication = actionClient
  .schema(twoFactorSchema)
  .action(async ({ parsedInput }) => {
    const { isTwoFactorEnabled, email } = parsedInput;
    const user = db.query.users.findFirst({
      where: eq(users.email, email!),
    });
    if (!user) {
      return {
        error: {
          message: "User not found",
          description: "The user with the provided email was not found.",
        },
      };
    }
    await db
      .update(users)
      .set({ isTwoFactorEnabled })
      .where(eq(users.email, email!));
    return {
      success: {
        message: "Two factor authentication status updated successfully.",
      },
    };
  });
