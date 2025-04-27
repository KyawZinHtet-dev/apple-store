import { z } from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .nonempty({
        message: "Name is required",
      })
      .min(4, { message: "Name must be at least 4 characters" }),
    email: z
      .string()
      .nonempty({
        message: "Email is required",
      })
      .email({ message: "Please enter a valid email address" }),
    password: z
      .string()
      .nonempty({
        message: "Password is required",
      })
      .min(6, { message: "Password must be at least 6 characters" }),
    confirm_password: z.string().nonempty({
      message: "Confirm password is required",
    }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Password do not match",
    path: ["confirm_password"],
  });
