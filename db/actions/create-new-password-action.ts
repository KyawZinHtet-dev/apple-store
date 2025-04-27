"use server";
import { createNewPasswordSchema } from "@/types/create-new-password-schema";
import { actionClient } from "./safe-action";
import { checkPasswordResetTokenByToken } from "@/tokens";
import { db } from "../db_connection";
import { users } from "../models/user";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import { passwordResetTokens } from "../models/password_reset_token";

export const createNewPassword = actionClient
  .schema(createNewPasswordSchema)
  .action(async ({ parsedInput: { password, password_reset_token } }) => {
    const pool = new Pool({
      connectionString: process.env.NEON_DATABASE_URL,
    });
    const dbPool = drizzle(pool);
    try {
      // if no password reset token
      if (!password_reset_token) {
        return {
          error: {
            message: "Missing token",
            description: "Please provide valid token",
          },
        };
      }
      // get existing token from database
      const existingToken =
        await checkPasswordResetTokenByToken(password_reset_token);
      // if token does not exist in database
      if (!existingToken) {
        return {
          error: {
            message: "Invalid token",
            description: "Please provide valid token",
          },
        };
      }
      // if token exists in database
      // check token expiration
      // if token is expired
      if (new Date() > existingToken.expires) {
        return {
          error: {
            message: "Token expired",
            description: "Please provide valid token",
          },
        };
      }
      // if token is not expired
      // get existing user
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, existingToken.email),
      });
      // if user does not exist
      if (!existingUser) {
        return {
          error: {
            message: "User not found",
            description: "Please provide valid email",
          },
        };
      }
      // if user exists
      // hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      // update user password && delete token using dbPool for transaction purposes
      await dbPool.transaction(async (contex) => {
        await contex
          .update(users)
          .set({
            password: hashedPassword,
          })
          .where(eq(users.id, existingUser.id));
        await contex
          .delete(passwordResetTokens)
          .where(eq(passwordResetTokens.id, existingToken.id));
      });
      return {
        success: {
          message: "Password reset success",
          description: "You can now login with your new password",
        },
      };
    } catch (error) {
      console.log(error);
    }
  });
