"use server";
import { loginSchema } from "@/types/login-schema";
import { actionClient } from "./safe-action";
import { db } from "../db_connection";
import { eq } from "drizzle-orm";
import { users } from "../models/user";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { generateTwoFactorCode } from "@/tokens";
import { sendTwoFactorCodeEmail } from "./email-actions";
import { twoFactorCodes } from "../models/two_factor_code";

export const loginUser = actionClient
  .schema(loginSchema)
  .action(async ({ parsedInput: { email, password, code } }) => {
    // get existing user
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    // if user does not exist
    if (existingUser?.email !== email) {
      return {
        error: {
          message: "Error",
          description: "Invalid email or password",
        },
      };
    }
    // if user is not verified
    if (!existingUser?.emailVerified) {
      return {
        error: {
          message: "Error",
          description: "Email not verified",
        },
      };
    }
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!result || result.error) {
        throw new AuthError("CredentialsSignin");
      }

      if (existingUser.isTwoFactorEnabled) {
        if (code) {
          const twoFactorCode = await db.query.twoFactorCodes.findFirst({
            where: eq(twoFactorCodes.code, code),
          });
          if (!twoFactorCode) {
            return {
              twoFactor: {
                error: {
                  message: "Error",
                  description: "Invalid two factor code",
                },
              },
            };
          }
          if (twoFactorCode.expires < new Date()) {
            return {
              twoFactor: {
                error: {
                  message: "Error",
                  description: "Two factor code expired",
                },
              },
            };
          }
          await db
            .delete(twoFactorCodes)
            .where(eq(twoFactorCodes.id, twoFactorCode.id));
        } else {
          const twoFactorCode = await generateTwoFactorCode(existingUser.email);
          if (!twoFactorCode) {
            return {
              twoFactor: {
                error: {
                  message: "Failed to generate two factor code",
                },
              },
            };
          }
          sendTwoFactorCodeEmail(twoFactorCode[0].email, twoFactorCode[0].code);
          return {
            twoFactor: {
              success: {
                message: "Two factor code sent",
                description: "Please check your email for the two factor code",
              },
            },
          };
        }
      }

      return {
        success: {
          message: "Login successful",
          description: "You have been logged in successfully",
        },
      };
    } catch (error) {
      if (error instanceof AuthError) {
        switch (error.type) {
          case "CredentialsSignin":
            return {
              error: {
                message: "Error",
                description: "Invalid email or password",
              },
            };
          default:
            return {
              error: {
                message: "Error",
                description: "An unknown error occurred",
              },
            };
        }
      } else {
        return {
          error: {
            message: "Error",
            description: "An unknown error occurred",
          },
        };
      }
    }
  });
