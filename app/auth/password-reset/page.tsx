"use client";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AuthForm from "@/components/authentication/auth-form";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { passwordResetSchema } from "@/types/password-reset-schema";
import { resetPassword } from "@/db/actions/password-reset-action";
import { useRouter } from "next/navigation";

const PasswordReset = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof passwordResetSchema>>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      email: "",
    },
  });

  const { execute, status } = useAction(resetPassword, {
    onSuccess: ({ data }: any) => {
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
        toast.error(data?.error.message, {
          description: data?.error.description,
        });
        setTimeout(() => {
          router.push("/auth/login");
        }, 3000);
      }
    },
  });

  const onSubmit = (values: z.infer<typeof passwordResetSchema>) => {
    execute(values);
  };

  return (
    <div className="w-[420px] px-5">
      <AuthForm
        formTitle={"Password Reset"}
        formDescription={"Enter your email below to reset your password."}
        showProvider={false}
        footerLabel=""
        footerHerf=""
        footerDescription=""
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className=" flex-col flex gap-4">
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="example@gmail.com" {...field} />
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
              Reset Password
            </Button>
          </form>
        </Form>
      </AuthForm>
    </div>
  );
};

export default PasswordReset;
