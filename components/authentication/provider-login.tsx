"use client";
import { Button } from "../ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { signIn } from "next-auth/react";
const ProviderLogin = () => {
  return (
    <div className=" w-full mb-4 flex flex-col gap-2">
      <Button
        variant={"outline"}
        onClick={() => {
          signIn("google", {
            callbackUrl: "http://localhost:3000/",
            redirect: false,
          });
        }}
      >
        <span>Login with Google</span>
        <FcGoogle />
      </Button>
      <Button
        variant={"outline"}
        onClick={() => {
          signIn("github", {
            callbackUrl: "http://localhost:3000/",
            redirect: false,
          });
        }}
      >
        <span>Login with Github</span>
        <FaGithub />
      </Button>
    </div>
  );
};

export default ProviderLogin;
