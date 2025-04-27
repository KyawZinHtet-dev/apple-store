import { z } from "zod";

export const changePasswordSchema = z
  .object({
    old_password: z
      .string()
      .nonempty({ message: "Old password is required" })
      .min(6, { message: "Password must be at least 6 characters" }),
    new_password: z
      .string()
      .nonempty({ message: "New password is required" })
      .min(6, { message: "Password must be at least 6 characters" }),
    confirm_new_password: z
      .string()
      .nonempty({ message: "Confirm password is required" })
      .min(6, { message: "Password must be at least 6 characters" }),
    email: z
      .string()
      .email({ message: "Please enter a valid email address" })
      .nullable(),
  })
  .refine((data) => data.new_password === data.confirm_new_password, {
    message: "Password do not match",
    path: ["confirm_new_password"],
  });
