"use server";
import { editUserNameSchema } from "@/types/edit-user-name-schema";
import { actionClient } from "./safe-action";
import { db } from "../db_connection";
import { eq } from "drizzle-orm";
import { users } from "@/db/models/user";
import { revalidatePath } from "next/cache";

export const updateUserName = actionClient
  .schema(editUserNameSchema)
  .action(async ({ parsedInput: { name, email } }) => {
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
    await db.update(users).set({ name }).where(eq(users.email, email));
    revalidatePath("/dashboard/settings");
    return {
      success: {
        message: "User name updated successfully",
        description: "",
      },
    };
  });
