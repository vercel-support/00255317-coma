import { PrivateRoute } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { Store } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
interface LogoProps {
  flexCol?: boolean;
}
export const Logo = ({ flexCol = false }: LogoProps) => {
  return (
    <Link href={PrivateRoute.TPV.href}>
      <div
        className={cn(
          "text-2xl text-branding font-bold uppercase flex flex-col items-center justify-center",
          flexCol ? "flex-col" : "flex-row gap-x-2"
        )}
      >
        <span className="relative">
          <Image
            src="/LOGO_HORIZONTAL_TAGLINE_945PX.svg"
            alt="COMA"
            width={250}
            height={250}
          />
        </span>
      </div>
    </Link>
  );
};
