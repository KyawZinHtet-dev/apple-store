"use server";
import { passwordResetSchema } from "@/types/password-reset-schema";
import { actionClient } from "./safe-action";
import { db } from "../db_connection";
import { users } from "../models/user";
import { eq } from "drizzle-orm";
import { generatePasswordResetToken } from "@/tokens";
import { sendPasswordResetEmail } from "@/db/actions/email-actions";

export const resetPassword = actionClient
  .schema(passwordResetSchema)
  .action(async ({ parsedInput: { email } }) => {
    // get existing user
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    // if user does not exist
    if (!existingUser) {
      return {
        error: {
          message: "Email not found",
          description: "Please provide valid email",
        },
      };
    }
    // if user exists
    // generate password reset token
    const passwordResetToken = await generatePasswordResetToken(email);
    // if token is not generated
    if (!passwordResetToken) {
      return {
        error: {
          message: "Error",
          description: "Failed to generate password reset token",
        },
      };
    }
    // send password reset email
    await sendPasswordResetEmail(
      passwordResetToken[0].email,
      passwordResetToken[0].token
    );
    return {
      success: {
        message: "Password reset email sent",
        description: "Please check your inbox and reset your password",
      },
    };
  });
