import z from "zod";

export const uploadAvatarSchema = z.object({
  image: z.string().url({ message: "Select a valid image" }),
  email: z.string(),
});
