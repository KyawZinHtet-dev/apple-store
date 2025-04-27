"use server";

import { variantSchema } from "@/types/variant-schema";
import { actionClient } from "./safe-action";
import { db } from "../db_connection";
import { variants } from "../models/variant";
import { variantTags } from "../models/variant_tag";
import { variantImages } from "../models/variant_image";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { products } from "../models/product";
import { z } from "zod";

export const createAndUpdateVariant = actionClient
  .schema(variantSchema)
  .action(
    async ({
      parsedInput: {
        id,
        productId,
        productType,
        color,
        variantImages: images,
        tags,
        editMode,
      },
    }) => {
      try {
        if (id && editMode) {
          await db
            .update(variants)
            .set({
              color,
              productType,
              updatedAt: new Date(),
            })
            .where(eq(variants.id, id));
          await db.delete(variantTags).where(eq(variantTags.variantId, id));
          await db.delete(variantImages).where(eq(variantImages.variantId, id));
          await db.insert(variantTags).values(
            tags.map((tag) => ({
              variantId: id,
              tag,
            }))
          );
          await db.insert(variantImages).values(
            images.map((image, index) => ({
              variantId: id,
              name: image.name,
              imageUrl: image.imageUrl,
              size: String(image.size),
              key: image.key,
              order: index,
            }))
          );
          const product = await db.query.products.findFirst({
            where: eq(products.id, productId),
          });
          revalidatePath("/dashboard/products");
          return {
            update: {
              message: "Variant updated",
              description: `Variant updated successfully for ${product?.title}`,
            },
          };
        }
        if (!id && !editMode) {
          const variant = await db
            .insert(variants)
            .values({
              productId,
              color,
              productType,
            })
            .returning();
          await db.insert(variantTags).values(
            tags.map((tag) => ({
              variantId: variant[0].id,
              tag,
            }))
          );
          await db.insert(variantImages).values(
            images.map((image, index) => ({
              variantId: variant[0].id,
              name: image.name,
              imageUrl: image.imageUrl,
              size: String(image.size),
              // key: image.key,
              order: index,
            }))
          );
          const product = await db.query.products.findFirst({
            where: eq(products.id, productId),
          });
          revalidatePath("/dashboard/products");
          return {
            success: {
              message: "Variant created",
              description: `Variant created successfully for ${product?.title}`,
            },
          };
        }
      } catch (error) {
        return {
          error: {
            message: "Error",
            description: "An unknown error occurred",
          },
        };
      }
    }
  );

export const deleteVariant = actionClient
  .schema(z.object({ id: z.string() }))
  .action(async ({ parsedInput: { id } }) => {
    try {
      await db.delete(variants).where(eq(variants.id, id));
      revalidatePath("/dashboard/products");
      return {
        success: {
          message: "Variant deleted successfully",
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
