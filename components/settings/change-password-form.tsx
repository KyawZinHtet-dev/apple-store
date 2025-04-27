"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { PasswordInput } from "@/components/ui/password-input";
import { cn } from "@/lib/utils";
import { changePasswordSchema } from "@/types/change-password-schema";
import { changePassword } from "@/db/actions/change-password-action";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";
import { signOut } from "next-auth/react";

const ChangePasswordForm = ({
  email,
  setIsOpen,
}: {
  email: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const form = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      old_password: "",
      new_password: "",
      confirm_new_password: "",
      email,
    },
  });
  const { execute, status } = useAction(changePassword, {
    onSuccess: ({ data }: any) => {
      form.reset();
      if (data?.success) {
        toast.success(data?.success.message, {
          description: data?.success.description,
        });
        setIsOpen(false);
        setTimeout(() => {
          signOut({ callbackUrl: "/auth/login" });
        }, 3000);
      }
      if (data?.error) {
        toast.error(data?.error.message, {
          description: data?.error.description,
        });
        setIsOpen(false);
      }
    },
  });

  const onSubmit = (values: z.infer<typeof changePasswordSchema>) => {
    execute({ ...values, email });
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className=" flex-col flex gap-4">
            <FormField
              name="old_password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <div className=" flex items-center justify-between">
                    <FormLabel>Old Password</FormLabel>
                    <Button size={"sm"} asChild variant={"link"}>
                      <Link href={"/auth/password-reset"}>
                        Forgot your password?
                      </Link>
                    </Button>
                  </div>
                  <FormControl>
                    <PasswordInput
                      autoComplete="off"
                      placeholder="old password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="new_password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      autoComplete="off"
                      placeholder="new password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="confirm_new_password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      autoComplete="off"
                      placeholder="confirm new password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            type="submit"
            className={cn(
              "mt-6 w-full",
              status === "executing" && "animate-pulse"
            )}
            disabled={status === "executing"}
          >
            Save
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ChangePasswordForm;
