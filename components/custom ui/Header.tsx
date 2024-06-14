"use client";

import { useParams, usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Logo } from "./logo";
import { PublicRoute } from "@/lib/routes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ModeToggle } from "./toggle-mode";
import { useCurrentUser } from "@/hooks/use-current-user";
import { UserMenu } from "./user-menu";
import MenuHeader from "./MenuHeader";

const Header = () => {
  const user = useCurrentUser();
  const router = useRouter();
  const [scroll, setScroll] = useState(false);
  const path = usePathname();
  console.log("[]PARAMS LOG HEADER", path.startsWith("/auth"));
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 0; // Cambiar condición para detectar cualquier scroll
      setScroll(scrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <header
      className={cn(
        "fixed z-50 w-full flex items-center justify-between p-2 max-md:bg-brandingDark",
        scroll &&
          "bg-brandingDark bg-brandingSecond transition-all duration-500 ease-in-out shadow-md",
        path.startsWith("/auth") && "hidden"
      )}
    >
      <Logo size="small" />
      <MenuHeader />
      <div className="flex items-center justify-end gap-2">
        <ModeToggle />
        {!user ? (
          <Button
            variant={"third"}
            className="font-extrabold text-white"
            onClick={() => router.push(PublicRoute.LOGIN.href)}
          >
            Iniciar sesión
          </Button>
        ) : (
          <UserMenu />
        )}
      </div>
    </header>
  );
};

export default Header;
