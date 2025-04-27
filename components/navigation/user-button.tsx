"use client";
import { Session } from "next-auth";
import { Button } from "../ui/button";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { LogInIcon, LogOutIcon, Settings, Truck } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

const UserButton = ({ user }: Session) => {
  const router = useRouter();
  if (user) {
    return (
      <div>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Avatar className=" w-9 h-9">
              <AvatarImage
                src={user.image!}
                className="cursor-pointer"
                referrerPolicy="no-referrer"
              />
              <AvatarFallback className=" text-primary shadow-sm border font-bold cursor-pointer">
                {user.name!.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="p-3">
            <DropdownMenuLabel className=" border rounded-md">
              <div className=" flex justify-between items-center bg-primary text-white gap-3  p-2 rounded-md">
                <Avatar className=" bg-white text-primary w-9 h-9">
                  <AvatarImage src={user.image!} referrerPolicy="no-referrer" />
                  <AvatarFallback>
                    {user.name!.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="">
                  <h3 className="font-bold text-sm">{user.name!}</h3>
                  <p className="text-xs">{user.email!}</p>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => router.push("/dashboard/orders")}
              className="cursor-pointer group"
            >
              <div className="flex gap-3 items-center">
                <Truck
                  size={18}
                  className="transition-transform duration-300 ease-in-out group-hover:translate-x-1 group-hover:scale-105 group-hover:text-primary"
                />
                <span className="text-sm">My Orders</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer group"
              onClick={() => {
                router.push("/dashboard/settings");
              }}
            >
              <div className="flex gap-3 items-center">
                <Settings
                  size={18}
                  className="transition-transform duration-300 ease-in-out group-hover:rotate-[180deg] group-hover:text-primary"
                />
                <span className="text-sm">Settings</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer group"
              onClick={() => signOut()}
            >
              <div className="flex gap-3 items-center">
                <LogOutIcon
                  size={18}
                  className="transition-all group-hover:animate-wiggle text-destructive"
                />
                <span className="text-sm text-destructive">Logout</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  } else {
    return (
      <div>
        <Button asChild>
          <Link href={"/auth/login"}>
            <LogInIcon />
            <span>Login</span>
          </Link>
        </Button>
      </div>
    );
  }
};

export default UserButton;
