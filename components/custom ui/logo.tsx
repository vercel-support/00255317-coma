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
          "text-2xl text-blue-500 font-bold uppercase flex flex-col items-center justify-center",
          flexCol ? "flex-col" : "flex-row gap-x-2"
        )}
      >
        <span className="relative">
          <Image
            src="/logo-gesapp-blue.svg"
            alt="Kiosco"
            width={50}
            height={50}
          />
        </span>
        <p
          className={cn(
            "hidden md:block font-bold text-blue-500 ",
            "md:text-3xl"
          )}
        >
          Kiosco
        </p>
      </div>
    </Link>
  );
};
