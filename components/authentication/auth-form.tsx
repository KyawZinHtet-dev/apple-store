import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import ProviderLogin from "./provider-login";
import AuthFooter from "./auth-footer";

type AuthFormProps = {
  children: React.ReactNode;
  formTitle: string;
  formDescription: string;
  showProvider: boolean;
  footerLabel: string;
  footerHerf: string;
  footerDescription: string;
};

const AuthForm = ({
  children,
  formTitle,
  formDescription,
  footerLabel,
  footerHerf,
  footerDescription,
  showProvider,
}: AuthFormProps) => {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{formTitle}</CardTitle>
          <CardDescription>{formDescription}</CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
        <CardFooter className="flex flex-col">
          {showProvider && <ProviderLogin />}
          <AuthFooter
            footerLabel={footerLabel}
            footerHerf={footerHerf}
            footerDescription={footerDescription}
          />
        </CardFooter>
      </Card>
    </div>
  );
};

export default AuthForm;
