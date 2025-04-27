import { z } from "zod";

export const createNewPasswordSchema = z
  .object({
    password: z
      .string()
      .nonempty({
        message: "Password is required",
      })
      .min(6, { message: "Password must be at least 6 characters" }),
    confirm_password: z.string().nonempty({
      message: "Confirm password is required",
    }),
    password_reset_token: z.string().nullable(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Password do not match",
    path: ["confirm_password"],
  });
