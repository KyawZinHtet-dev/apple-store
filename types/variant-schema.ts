import z from "zod";

export const variantSchema = z.object({
  id: z.string().optional(),
  productId: z.string(),
  editMode: z.boolean(),
  color: z.string().nonempty({ message: "Color is required" }),
  productType: z
    .string()
    .min(3, { message: "Variant title must be at least 3 characters" }),
  variantImages: z
    .array(
      z.object({
        name: z.string(),
        imageUrl: z.string().url({ message: "Select a valid image" }),
        size: z.number(),
        key: z.string().optional(),
      })
    )
    .nonempty({ message: "At least one image is required" }),
  tags: z
    .array(z.string().min(3, { message: "Tag must be at least 3 characters" }))
    .nonempty({ message: "At least one tag is required" }),
});
