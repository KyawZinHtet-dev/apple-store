"use server";
import { deleteProductSchema, productSchema } from "@/types/product-schema";
import { actionClient } from "./safe-action";
import { db } from "../db_connection";
import { eq } from "drizzle-orm";
import { products } from "../models/product";
import { revalidatePath } from "next/cache";

export const createAndUpdateProduct = actionClient
  .schema(productSchema)
  .action(async ({ parsedInput: { id, title, description, price } }) => {
    try {
      // if id provided, update product
      if (id) {
        const existingProduct = await db.query.products.findFirst({
          where: eq(products.id, id),
        });
        // if product does not exist
        if (!existingProduct) {
          return {
            error: {
              message: "Error",
              description: "Product not found",
            },
          };
        }
        // if product exists update product
        await db
          .update(products)
          .set({ title, description, price })
          .where(eq(products.id, id));

        revalidatePath("/dashboard/products");

        return {
          update: {
            message: "Product updated successfully",
          },
        };
      }
      // if id not provided, create new product
      await db.insert(products).values({ title, description, price });
      return {
        success: {
          message: "Product created successfully",
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

export const getProductById = async (id: string) => {
  try {
    const product = await db.query.products.findFirst({
      where: eq(products.id, id),
    });
    if (!product) {
      return {
        error: {
          message: "Product not found",
        },
      };
    }
    return {
      success: product,
    };
  } catch (error) {
    return {
      error: {
        message: "Something went wrong",
      },
    };
  }
};

export const deleteProductById = actionClient
  .schema(deleteProductSchema)
  .action(async ({ parsedInput }) => {
    const { id } = parsedInput;
    try {
      await db.delete(products).where(eq(products.id, id));
      revalidatePath("/dashboard/products");
      return {
        success: {
          message: "Product deleted successfully",
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
