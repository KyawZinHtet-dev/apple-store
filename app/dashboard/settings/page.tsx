import { auth } from "@/auth";
import ChangePassword from "@/components/settings/change-password";
import ProfileCard from "@/components/settings/profile-card";
import SettingCard from "@/components/settings/setting-card";
import TwoFactorAuth from "@/components/settings/two-factor-auth";
import { redirect } from "next/navigation";
import { cn } from "@/lib/utils";
import Logout from "@/components/settings/logout";

const Settings = async () => {
  const session = await auth();
  if (!session) return redirect("/");
  return (
    <SettingCard title="Settings" description="Manage your account settings">
      <div className={cn("grid gap-4 grid-cols-1")}>
        <ProfileCard session={session} />
        {!session.user.isOauth && (
          <div className=" flex flex-col gap-4">
            <ChangePassword session={session} />
            <TwoFactorAuth
              isTwoFactorEnabled={session.user.isTwoFactorEnabled}
              email={session.user.email!}
            />
          </div>
        )}
        <Logout />
      </div>
    </SettingCard>
  );
};

export default Settings;
