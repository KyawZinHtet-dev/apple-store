"use client";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {  z } from "zod";
import { PasswordInput } from "@/components/ui/password-input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import AuthForm from "@/components/authentication/auth-form";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { createNewPasswordSchema } from "@/types/create-new-password-schema";
import { createNewPassword } from "@/db/actions/create-new-password-action";
import { useRouter, useSearchParams } from "next/navigation";

const Register = () => {
  const router = useRouter();
  const password_reset_token = useSearchParams().get("token");
  const form = useForm<z.infer<typeof createNewPasswordSchema>>({
    resolver: zodResolver(createNewPasswordSchema),
    defaultValues: {
      password: "",
      confirm_password: "",
      password_reset_token: "",
    },
  });

  const { execute, result, status, isPending } = useAction(createNewPassword, {
    onSuccess: ({ data }) => {
      form.reset();
      if (data?.success) {
        toast.success(data?.success.message, {
          description: data?.success.description,
        });
        setTimeout(() => {
          router.push("/auth/login");
        }, 3000);
      }

      if (data?.error) {
        const { message, description } = data?.error as {
          message: string;
          description: string;
        };
        toast.error(message, {
          description,
        });
        setTimeout(() => {
          router.push("/auth/login");
        });
      }
    },
  });

  const onSubmit = (values: z.infer<typeof createNewPasswordSchema>) => {
    execute({ ...values, password_reset_token });
  };

  return (
    <div className="flex h-screen justify-center w-full items-center">
      <div className="w-[420px] px-5">
        <AuthForm
          formTitle={"Create New Password"}
          formDescription={"Enter your new password and confirm it"}
          showProvider={false}
          footerLabel=""
          footerHerf=""
          footerDescription=""
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className=" flex-col flex gap-4">
                <FormField
                  name="password"
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
                  name="confirm_password"
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
                Confirm
              </Button>
            </form>
          </Form>
        </AuthForm>
      </div>
    </div>
  );
};

export default Register;
