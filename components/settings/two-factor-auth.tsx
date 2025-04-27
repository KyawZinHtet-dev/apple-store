"use client";
import SettingCard from "./setting-card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { twoFactorSchema } from "@/types/two-factor-schema";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { TwoFactorAuthenication } from "@/db/actions/two-factor-auth-action";

const TwoFactorAuth = ({
  isTwoFactorEnabled: initialIsTwoFactorEnabled,
  email,
}: {
  isTwoFactorEnabled: boolean;
  email: string;
}) => {
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(
    initialIsTwoFactorEnabled
  );

  const { execute, status } = useAction(TwoFactorAuthenication, {
    onSuccess: ({ data }: any) => {
      if (data?.success) {
        toast.success(data?.success.message, {
          description: data?.success.description,
        });
      }
      if (data?.error) {
        toast.error(data?.error.message, {
          description: data?.error.description,
        });
      }
    },
  });

  const handleSwitchChange = () => {
    try {
      const newValue = !isTwoFactorEnabled;
      setIsTwoFactorEnabled(newValue);
      const parsedValue = twoFactorSchema.parse({
        isTwoFactorEnabled: newValue,
        email,
      });
      execute(parsedValue);
    } catch (error) {
      console.error("Error executing action:", error);
      toast.error("Failed to update two-factor authentication status.");
    }
  };
  return (
    <div>
      <SettingCard>
        <div className=" justify-between flex items-center">
          <p className=" text-sm font-medium">Two Factor Authentication</p>
          <div className=" flex items-center gap-1">
            <Label
              className={cn(
                isTwoFactorEnabled ? "text-primary" : "text-destructive"
              )}
            >
              {isTwoFactorEnabled ? "Enabled" : "Disabled"}
            </Label>
            <Switch
              checked={isTwoFactorEnabled}
              onCheckedChange={handleSwitchChange}
              disabled={status === "executing"}
            />
          </div>
        </div>
      </SettingCard>
    </div>
  );
};

export default TwoFactorAuth;
