import z from "zod";

export const orderSchema = z.object({
  totalPrice: z.number(),
  status: z.enum(["pending", "cancelled", "completed"]),
  paymentId: z.string(),
  products: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number(),
      variantId: z.string(),
    })
  ),
});

export const updateOrderStatusSchema = z.object({
  orderId: z.string(),
  status: z.enum(["pending", "cancelled", "completed"]),
});
