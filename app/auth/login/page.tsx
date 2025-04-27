"use client";
import { loginUser } from "@/db/actions/login-action";
import { useAction } from "next-safe-action/hooks";
import { z } from "zod";
import { loginSchema } from "@/types/login-schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthForm from "@/components/authentication/auth-form";
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
import Link from "next/link";
import { cn } from "@/lib/utils";
import { PasswordInput } from "@/components/ui/password-input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const Login = () => {
  const [isTwofactorOn, setIsTwoFactorOn] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      code: "",
    },
  });

  const { execute, status } = useAction(loginUser, {
    onSuccess: ({ data }: any) => {
      if (data?.success) {
        form.reset();
        toast.success(data?.success.message, {
          description: data?.success.description,
        });
        setTimeout(() => {
          router.push("/");
        }, 1000);
      }
      if (data?.error) {
        form.reset();
        toast.error(data?.error.message, {
          description: data?.error.description,
        });
      }
      if (data?.twoFactor?.success) {
        toast.success(data?.twoFactor?.success.message, {
          description: data?.twoFactor?.success.description,
        });
        setIsTwoFactorOn(true);
      }
      if (data?.twoFactor?.error) {
        form.resetField("code");
        toast.error(data?.twoFactor?.error.message, {
          description: data?.twoFactor?.error.description,
        });
      }
    },
  });

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    execute(values);
  };

  const backButtonHandler = () => {
    setIsTwoFactorOn(false);
    form.reset();
  };

  return (
    <div className=" w-[420px] px-5">
      <AuthForm
        formTitle={isTwofactorOn ? "Two Factor Authentication" : "Login"}
        formDescription={
          isTwofactorOn
            ? "Enter your 2FA code below to login to your account."
            : "Enter your email and password below to login to your account."
        }
        showProvider={isTwofactorOn ? false : true}
        footerLabel={isTwofactorOn ? "" : "Sign up"}
        footerHerf={isTwofactorOn ? "" : "/auth/register"}
        footerDescription={isTwofactorOn ? "" : "Don't have an account?"}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {isTwofactorOn && (
              <FormField
                name="code"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>2FA Code</FormLabel>
                    <FormControl>
                      <InputOTP
                        {...field}
                        maxLength={6}
                        disabled={status === "executing"}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {!isTwofactorOn && (
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
                <FormField
                  name="password"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <div className=" flex items-center justify-between">
                        <FormLabel>Password</FormLabel>
                        <Button size={"sm"} asChild variant={"link"}>
                          <Link href={"/auth/password-reset"}>
                            Forgot your password?
                          </Link>
                        </Button>
                      </div>
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
              </div>
            )}
            <Button
              type="submit"
              className={cn(
                " mt-6 w-full",
                status === "executing" && "animate-pulse"
              )}
              disabled={status === "executing"}
            >
              {isTwofactorOn ? "Verify Code" : "Login"}
            </Button>
            {isTwofactorOn && (
              <Button
                type="button"
                variant={"link"}
                className=" mt-6 w-full"
                onClick={backButtonHandler}
              >
                Back to login
              </Button>
            )}
          </form>
        </Form>
      </AuthForm>
    </div>
  );
};

export default Login;
