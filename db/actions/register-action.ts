"use server";
import { registerSchema } from "@/types/register-schema";
import { actionClient } from "./safe-action";
import bcrypt from "bcrypt";
import { db } from "../db_connection";
import { users } from "@/db/models/user";
import { eq } from "drizzle-orm";
import { generateEmailVerificationToken } from "@/tokens";
import { sendVerificationEmail } from "@/db/actions/email-actions";

export const registerUser = actionClient
  .schema(registerSchema)
  .action(async ({ parsedInput: { name, email, password } }) => {
    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // get user if exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    // if user exists
    if (existingUser) {
      // if user is not verified
      if (!existingUser.emailVerified) {
        //generate email verification token
        const verificationToken = await generateEmailVerificationToken(email);
        // if token is not generated
        if (!verificationToken) {
          return {
            error: "Error",
            description: "Failed to generate email verification token",
          };
        }
        // update user
        await db
          .update(users)
          .set({
            name,
            password: hashedPassword,
          })
          .where(eq(users.email, email));

        // send verification email
        await sendVerificationEmail(
          verificationToken[0].email,
          verificationToken[0].token
        );
        // return if email is sent
        return {
          success: {
            message: "Email verification resent",
            description: "Please check your inbox and verify your email",
          },
        };
      }
      // if user is verified
      return {
        error: {
          message: "Error",
          description: "Provided email is already registered",
        },
      };
    }

    // if user does not exist
    // create new user
    await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
    });
    // generate email verification token for new user
    const verificationToken = await generateEmailVerificationToken(email);
    // if token is not generated
    if (!verificationToken) {
      return {
        error: {
          message: "Error",
          description: "Failed to generate email verification token",
        },
      };
    }
    // send verification email
    await sendVerificationEmail(
      verificationToken[0].email,
      verificationToken[0].token
    );

    return {
      success: {
        message: "Email verification sent",
        description: "Please check your inbox and verify your email",
      },
    };
  });
