"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MenuItemsAdmin } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@/components/auth/user-button";
import { ModeToggle } from "@/components/custom ui/toggle-mode";

const TopBar = () => {
  const pathname = usePathname();
  return (
    <div className="sticky top-0 z-20 w-full flex justify-between px-8 py-2 items-center bg-card shadow-xl md:hidden">
      <div className="w-[50%] flex items-center justify-center bg-branding rounded-md shadow-sm">
        <Image
          src="/logo-gesapp-white.svg"
          alt="Gesapp"
          width={50}
          height={50}
        />
        <h3 className="text-white font-extrabold text-xl uppercase">Gesapp</h3>
      </div>
      <div className="relative flex gap-4 items-center">
        <ModeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Menu className="cursor-pointer md:hidden text-primary" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {MenuItemsAdmin.map((link) => (
              <DropdownMenuItem key={link.name}>
                <Link
                  href={link.href}
                  className={cn(
                    "flex",
                    "gap-4",
                    "text-xl font-bold",
                    "hover:text-brandingDark dark:hover:text-brandingLight",
                    pathname === link.path
                      ? "text-branding"
                      : "text-neutral-500"
                  )}
                >
                  {link.icon} <p className="text-xl">{link.title}</p>
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <UserButton />
      </div>
    </div>
  );
};

export default TopBar;
