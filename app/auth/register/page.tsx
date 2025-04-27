"use client";
import { registerUser } from "@/db/actions/register-action";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { registerSchema } from "@/types/register-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PasswordInput } from "@/components/ui/password-input";
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

const Register = () => {
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirm_password: "",
    },
  });

  const { execute, status } = useAction(registerUser, {
    onSuccess: ({ data }) => {
      form.reset();
      if (data?.success) {
        toast.success(data?.success.message, {
          description: data?.success.description,
        });
      }

      if (data?.error) {
        const { message, description } = data?.error as {
          message: string;
          description: string;
        };
        toast.error(message, {
          description,
        });
      }
    },
  });

  const onSubmit = (values: z.infer<typeof registerSchema>) => {
    execute(values);
  };

  return (
    <div className="w-[420px] px-5">
      <AuthForm
        formTitle={"Register"}
        formDescription={"Enter your email below to register your account."}
        showProvider={false}
        footerLabel={"Login"}
        footerHerf="/auth/login"
        footerDescription={"Already have an account?"}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className=" flex-col flex gap-4">
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        autoComplete="off"
                        placeholder="password"
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
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        autoComplete="off"
                        placeholder="confirm password"
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
              Sign up
            </Button>
          </form>
        </Form>
      </AuthForm>
    </div>
  );
};

export default Register;
