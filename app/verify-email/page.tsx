"use client";

import AuthForm from "@/components/authentication/auth-form";
import { cn } from "@/lib/utils";
import { verifyEmailVerificationToken } from "@/tokens";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const VerifyEmail = () => {
  const token = useSearchParams().get("token");
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const handleVerifyEmail = useCallback(() => {
    if (!token) {
      redirect("/404");
    }
    verifyEmailVerificationToken(token).then((res) => {
      if (res.error) {
        setError(res.error);
      }
      if (res.success) {
        setSuccess(res.success);
        setTimeout(() => {
          router.push("/auth/login");
        }, 3000);
      }
    });
  }, []);

  useEffect(() => {
    handleVerifyEmail();
  }, []);

  return (
    <div className="flex h-screen justify-center w-full items-center">
      <div className=" w-96">
        <AuthForm
          formTitle={"Verifying Email"}
          formDescription={
            "If verifying success it will automatically redirect you to login page"
          }
          showProvider={false}
          footerLabel={""}
          footerHerf={""}
          footerDescription={""}
        >
          <p
            className={cn(
              "text-2xl text-center font-bold",
              success && "text-primary",
              error && "text-destructive",
              !success && !error && "animate-pulse"
            )}
          >
            {!success && !error
              ? "Email Verifying..."
              : success
                ? success
                : error}
          </p>
        </AuthForm>
      </div>
    </div>
  );
};

export default VerifyEmail;
