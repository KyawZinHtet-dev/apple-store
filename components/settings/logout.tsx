"use client";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import SettingCard from "@/components/settings/setting-card";
import { LogOut } from "lucide-react";
const Logout = () => {
  return (
    <SettingCard title="" description="">
      <p className="mb-3 font-medium text-destructive">Danger Zone</p>
      <Button
        className="w-full"
        variant={"destructive"}
        onClick={() => signOut({ callbackUrl: "/" })}
      >
        <LogOut /> Logout
      </Button>
    </SettingCard>
  );
};

export default Logout;
