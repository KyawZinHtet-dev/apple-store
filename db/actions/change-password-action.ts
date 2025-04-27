"use server";
import { changePasswordSchema } from "@/types/change-password-schema";
import { actionClient } from "./safe-action";
import { db } from "@/db/db_connection";
import { eq } from "drizzle-orm";
import { users } from "@/db/models/user";
import bcrypt from "bcrypt";

export const changePassword = actionClient
  .schema(changePasswordSchema)
  .action(async ({ parsedInput: { old_password, new_password, email } }) => {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email!),
    });
    if (!user) {
      return {
        error: {
          message: "User not found",
        },
      };
    }
    const isOldPasswordCorrect = await bcrypt.compare(
      old_password,
      user.password!
    );
    if (!isOldPasswordCorrect) {
      return {
        error: {
          message: "Old password is incorrect",
        },
      };
    }
    const hashedPassword = await bcrypt.hash(new_password, 10);
    await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.email, email!));
    return {
      success: {
        message: "Password changed successfully",
      },
    };
  });
