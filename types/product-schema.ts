import z from "zod";

export const productSchema = z.object({
  id: z.string().optional(),
  title: z
    .string()
    .nonempty({
      message: "Title is required",
    })
    .min(4, { message: "Title must be at least 4 character" }),
  description: z
    .string()
    .nonempty({
      message: "Description is required",
    })
    .min(4, { message: "Description must be at least 4 character" }),
  price: z.coerce
    .number({
      invalid_type_error: "Price is required",
    })
    .positive({
      message: "Price must be greater than 0",
    }),
});

export const deleteProductSchema = z.object({ id: z.string() });
