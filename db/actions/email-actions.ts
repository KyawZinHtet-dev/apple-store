"use server";
import { EmailVerification } from "@/components/email-templates/email-verification";
import { PasswordReset } from "@/components/email-templates/password-reset";
import TwoFactorCode from "@/components/email-templates/two-factor";
import getBaseUrl from "@/lib/get-baseUrl";
import { Resend } from "resend";

/// Resend
const resend = new Resend(process.env.RESEND_API_KEY);

/// Verify Email Sending
export const sendVerificationEmail = async (email: string, token: string) => {
  // get base url
  const emailVerificationLink = `${getBaseUrl()}/verify-email?token=${token}`;
  // send email
  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Account Confirmation Email By Apple Store",
    react: EmailVerification({ emailVerificationLink }),
  });

  return console.log(data, error);
};

/// Reset Password Email Sending
export const sendPasswordResetEmail = async (email: string, token: string) => {
  // get base url
  const passwordResetLink = `${getBaseUrl()}/create_new_password?token=${token}`;
  // send email
  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Password Reset Email By Apple Store",
    react: PasswordReset({ passwordResetLink }),
  });
};

/// Two Factor Code Email Sending
export const sendTwoFactorCodeEmail = async (email: string, code: string) => {
  // send email
  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Two Factor Code By Apple Store",
    react: TwoFactorCode({ twoFactorCode: code }),
  });
};
