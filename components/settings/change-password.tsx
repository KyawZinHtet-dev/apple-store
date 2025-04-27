"use client";
import { KeyRound } from "lucide-react";
import SettingCard from "./setting-card";
import useMediaQuery from "@/hooks/useMediaQuery";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import ChangePasswordForm from "./change-password-form";
import { Session } from "next-auth";

const ChangePassword = ({ session }: { session: Session }) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [isOpen, setIsOpen] = useState(false);
  const user = session.user!;
  return (
    <div className=" mt-5">
      <SettingCard>
        <div className=" justify-between flex items-center">
          <p className=" text-sm font-medium">Change Password</p>
          <div>
            {isDesktop ? (
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <KeyRound className=" w-5 h-5 text-muted-foreground hover:text-black cursor-pointer" />
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                    <DialogDescription>
                      Make changes to your password here. After saving, you'll
                      be logged out.
                    </DialogDescription>
                  </DialogHeader>
                  <div className=" mx-auto w-full">
                    <ChangePasswordForm
                      email={user.email!}
                      setIsOpen={setIsOpen}
                    />
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className=" w-full"
                      >
                        Cancel
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            ) : (
              <Drawer open={isOpen} onOpenChange={setIsOpen}>
                <DrawerTrigger asChild>
                  <KeyRound className=" w-5 h-5 text-muted-foreground hover:text-black cursor-pointer" />
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader className="text-left">
                    <DrawerTitle>Change Password</DrawerTitle>
                    <DrawerDescription>
                      Make changes to your password here. After saving, you'll
                      be logged out.
                    </DrawerDescription>
                  </DrawerHeader>
                  <div className=" mx-auto w-full px-4 md:px-0">
                    <ChangePasswordForm
                      email={user.email!}
                      setIsOpen={setIsOpen}
                    />
                  </div>
                  <DrawerFooter className="pt-2">
                    <DrawerClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            )}
          </div>
        </div>
      </SettingCard>
    </div>
  );
};

export default ChangePassword;
