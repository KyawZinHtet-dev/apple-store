"use client";
import { Session } from "next-auth";
import SettingCard from "./setting-card";
import { UserRoundPen } from "lucide-react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import useMediaQuery from "@/hooks/useMediaQuery";
import EditUserNameForm from "./edit-user-name-form";
import { useState } from "react";
import AvatarUploadButton from "./avatar-upload-button";

type ProfileCardProps = {
  session: Session;
};
const ProfileCard = ({ session }: ProfileCardProps) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [isOpen, setIsOpen] = useState(false);
  const user = session.user!;
  const [isUpdateAvatar, setIsUpdateAvatar] = useState("");

  return (
    <div className=" mt-5">
      <SettingCard>
        <div>
          <div className="items-center gap-3 lg:gap-5 flex-col md:flex-row flex ">
            <div>
              <Avatar className=" bg-white text-primary w-24 h-24 md:w-20 md:h-20">
                <AvatarImage
                  src={isUpdateAvatar || user.image || ""}
                  referrerPolicy="no-referrer"
                />
                <AvatarFallback>
                  {user.name!.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="">
              <h3 className="font-semibold text-lg text-center md:text-left">
                {user.name!}
              </h3>
              <p className="text-sm text-muted-foreground">{user.email!}</p>
            </div>
          </div>
          <div>
            {isDesktop ? (
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <UserRoundPen className="w-5 h-5 text-muted-foreground float-end -translate-y-[80px]  hover:text-black cursor-pointer " />
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit user name</DialogTitle>
                    <DialogDescription>
                      Make changes to your user name here. Click save when
                      you're done.
                    </DialogDescription>
                  </DialogHeader>
                  <div className=" mx-auto w-full">
                    <EditUserNameForm
                      setIsOpen={setIsOpen}
                      name={user.name!}
                      email={user.email!}
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
                  <UserRoundPen className="w-5 h-5 text-muted-foreground float-end -translate-y-[150px] hover:text-black cursor-pointer " />
                </DrawerTrigger>
                <DrawerContent className=" ">
                  <DrawerHeader className="text-left">
                    <DrawerTitle>Edit user name</DrawerTitle>
                    <DrawerDescription>
                      Make changes to your user name here. Click save when
                      you're done.
                    </DrawerDescription>
                  </DrawerHeader>
                  <div className=" mx-auto w-full px-4 md:px-0">
                    <EditUserNameForm
                      setIsOpen={setIsOpen}
                      name={user.name!}
                      email={user.email!}
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
        <AvatarUploadButton
          email={user.email!}
          image={user.image || ""}
          setIsUpdateAvatar={setIsUpdateAvatar}
        />
      </SettingCard>
    </div>
  );
};

export default ProfileCard;
