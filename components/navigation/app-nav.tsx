import AppLogo from "./app-logo";
import UserButton from "./user-button";
import { auth } from "@/auth";
import Cart from "../cart/cart";
const AppNav = async () => {
  const session = await auth();

  return (
    <nav className="p-4 shadow-sm rounded-lg backdrop:filter backdrop-blur bg-slate-500 bg-opacity-10">
      <ul className=" flex justify-between items-center">
        <li>
          <AppLogo />
        </li>
        <li className=" flex items-center gap-5">
          <Cart />
          <UserButton expires={session?.expires!} user={session?.user!} />
        </li>
      </ul>
    </nav>
  );
};

export default AppNav;
