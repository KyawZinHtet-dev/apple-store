import z from "zod";

export const stripePaymentSchema = z.object({
  amount: z.number(),
  currency: z.string(),
  cart: z.array(
    z.object({
      quantity: z.number(),
      productId: z.string(),
      variantId: z.string(),
      price: z.number(),
      image: z.string(),
    })
  ),
});
