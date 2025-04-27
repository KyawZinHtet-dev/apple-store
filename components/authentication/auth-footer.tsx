import Link from "next/link";
import { Button } from "../ui/button";
type AuthFooterProps = {
  footerLabel: string;
  footerHerf: string;
  footerDescription: string;
};
const AuthFooter = ({
  footerLabel,
  footerHerf,
  footerDescription,
}: AuthFooterProps) => {
  return (
    <div className="text-center text-sm">
      {footerDescription}{" "}
      <Link
        href={footerHerf}
        className="underline underline-offset-4 hover:text-primary"
      >
        {footerLabel}
      </Link>
    </div>
  );
};

export default AuthFooter;
