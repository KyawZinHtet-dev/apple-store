import { z } from "zod";

export const editUserNameSchema = z.object({
  name: z
    .string()
    .nonempty({
      message: "Name is required",
    })
    .min(4, { message: "Name must be at least 4 character" }),
  email: z
    .string()
    .email({ message: "Please enter a valid email address" })
    .nullable(),
});
