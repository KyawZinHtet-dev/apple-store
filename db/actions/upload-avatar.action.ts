"use server";
import { actionClient } from "./safe-action";
import { uploadAvatarSchema } from "@/types/upload-avatar-schema";
import { db } from "../db_connection";
import { users } from "../models/user";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const uploadAvatar = actionClient
  .schema(uploadAvatarSchema)
  .action(async ({ parsedInput: { image, email } }) => {
    if (!email) {
      return {
        error: {
          message: "Error",
          description: "Email not found",
        },
      };
    }
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    if (!existingUser) {
      return {
        error: {
          message: "Error",
          description: "User not found",
        },
      };
    }
    await db.update(users).set({ image }).where(eq(users.email, email));
    revalidatePath("/dashboard/settings");
    return {
      success: {
        message: "Avatar updated successfully",
        description: "",
        image,
      },
    };
  });
