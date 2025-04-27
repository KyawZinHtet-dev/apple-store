"use server";

import { eq } from "drizzle-orm";
import { db } from "./db/db_connection";
import { emailVerificationTokens } from "./db/models/email_verification_token";
import { users } from "./db/models/user";
import { passwordResetTokens } from "./db/models/password_reset_token";
import crypto from "crypto";
import { twoFactorCodes } from "./db/models/two_factor_code";

// check email verification token exists
const checkEmailVerificationToken = async (email: string) => {
  try {
    // get existing token equal to email
    const token = await db.query.emailVerificationTokens.findFirst({
      where: eq(emailVerificationTokens.email, email),
    });
    return token;
  } catch (error) {
    return null;
  }
};

// generate token
export const generateEmailVerificationToken = async (email: string) => {
  // generate token using uuid
  const token = crypto.randomUUID();
  // set token expiration
  const expires = new Date(Date.now() + 30 * 60 * 1000); // 30min
  // get existing token if exists
  const existingToken = await checkEmailVerificationToken(email);
  // if token exists
  if (existingToken) {
    // delete existing token
    await db
      .delete(emailVerificationTokens)
      .where(eq(emailVerificationTokens.id, existingToken.id));
  }
  // if token does not exist , create new token
  const newToken = await db
    .insert(emailVerificationTokens)
    .values({
      token,
      expires,
      email,
    })
    .returning();
  return newToken;
};

// verify token
export const verifyEmailVerificationToken = async (token: string) => {
  // check if token exists
  const existingToken = await db.query.emailVerificationTokens.findFirst({
    where: eq(emailVerificationTokens.token, token),
  });
  // if token does not exist
  if (!existingToken) return { error: "Token not found!" };
  // if token exists
  // check if token is expired
  // if token is expired
  if (existingToken.expires < new Date()) {
    // delete token
    await db
      .delete(emailVerificationTokens)
      .where(eq(emailVerificationTokens.id, existingToken.id));
    return { error: "Token expired" };
  }
  // if token is not expired
  // get existing user
  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, existingToken.email),
  });
  // if user does not exist
  if (!existingUser) {
    return { error: "User not found" };
  }
  // if user exists
  // update user
  await db
    .update(users)
    .set({
      emailVerified: new Date(),
      email: existingToken.email,
    })
    .where(eq(users.id, existingUser.id));
  // delete token
  await db
    .delete(emailVerificationTokens)
    .where(eq(emailVerificationTokens.id, existingToken.id));
  return { success: "Email verified" };
};

// check password reset token exists
export const checkPasswordResetToken = async (email: string) => {
  try {
    // get existing token equal to email
    const token = db.query.passwordResetTokens.findFirst({
      where: eq(passwordResetTokens.email, email),
    });
    return token;
  } catch (error) {
    return null;
  }
};

// generate password reset token
export const generatePasswordResetToken = async (email: string) => {
  // generate token using uuid
  const token = crypto.randomUUID();
  // set token expiration
  const expires = new Date(Date.now() + 30 * 60 * 1000); // 30min
  // get existing token if exists
  const existingToken = await checkPasswordResetToken(email);
  // if token exists
  if (existingToken) {
    // delete existing token
    await db
      .delete(passwordResetTokens)
      .where(eq(passwordResetTokens.id, existingToken.id));
  }
  // if token does not exist , create new token
  const newToken = await db
    .insert(passwordResetTokens)
    .values({
      token,
      expires,
      email,
    })
    .returning();
  return newToken;
};

// check password reset token exists
export const checkPasswordResetTokenByToken = async (token: string) => {
  try {
    // get existing token equal to email
    const existingToken = db.query.passwordResetTokens.findFirst({
      where: eq(passwordResetTokens.token, token),
    });
    return existingToken;
  } catch (error) {
    return null;
  }
};

// generate two factor token
export const generateTwoFactorCode = async (email: string) => {
  try {
    const code = crypto.randomInt(100000, 999999).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10min
    const existingCode = await db.query.twoFactorCodes.findFirst({
      where: eq(users.email, email),
    });
    if (existingCode) {
      await db
        .delete(twoFactorCodes)
        .where(eq(twoFactorCodes.id, existingCode.id));
    }
    const newCode = await db
      .insert(twoFactorCodes)
      .values({
        code,
        expires,
        email,
      })
      .returning();
    return newCode;
  } catch (error) {
    return null;
  }
};
