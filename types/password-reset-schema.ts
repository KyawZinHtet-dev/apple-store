import { z } from "zod";
export const passwordResetSchema = z.object({
  email: z
    .string()
    .nonempty({
      message: "Email is required",
    })
    .email({ message: "Please enter a valid email address" }),
});
