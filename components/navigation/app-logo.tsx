import { Apple } from "lucide-react";
import Link from "next/link";

const AppLogo = () => {
  return (
    <Link
      href={"/"}
      className=" font-bold text-xl flex items-center  rounded-lg  text-white"
    >
      <Apple strokeWidth={3} size={36} fill="#fff" stroke="#16a34a" />
      <span className=" italic text-4xl text-primary">Store</span>
    </Link>
  );
};

export default AppLogo;
