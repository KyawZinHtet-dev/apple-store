"use server";
import { orderSchema, updateOrderStatusSchema } from "@/types/order-schema";
import { actionClient } from "./safe-action";
import { auth } from "@/auth";
import { db } from "../db_connection";
import { orderProducts, orders } from "../schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
export const createOrder = actionClient
  .schema(orderSchema)
  .action(
    async ({ parsedInput: { totalPrice, status, paymentId, products } }) => {
      try {
        const session = await auth();
        if (!session)
          return { error: { message: "Login required to checkout" } };
        const order = await db
          .insert(orders)
          .values({
            userId: session.user.id,
            total: totalPrice,
            status,
            receiptURL: "",
          })
          .returning();

        products.map(async ({ productId, variantId, quantity }) => {
          await db.insert(orderProducts).values({
            orderId: order[0].id,
            productId,
            variantId,
            quantity,
          });
        });

        return {
          success: {
            message: "Order success",
            description: "Order placed successfully",
          },
        };
      } catch (error) {
        return { error: { message: "Failed to create order" } };
      }
    }
  );

export const updateOrderStatus = actionClient
  .schema(updateOrderStatusSchema)
  .action(async ({ parsedInput: { orderId, status } }) => {
    try {
      await db
        .update(orders)
        .set({ status, updatedAt: new Date() })
        .where(eq(orders.id, orderId));
      revalidatePath("/dashboard/orders");
      return {
        success: {
          message: "Order status updated successfully",
        },
      };
    } catch (error) {
      return {
        error: {
          message: "Error",
          description: "An unknown error occurred",
        },
      };
    }
  });
