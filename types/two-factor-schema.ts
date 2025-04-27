import { z } from "zod";

export const twoFactorSchema = z.object({
  isTwoFactorEnabled: z.boolean(),
  email: z.string().email().optional(),
});
