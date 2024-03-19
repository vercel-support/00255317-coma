"use client";
import { navLinks } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const TopBar = () => {
  const [dropdownMenu, setDropdownMenu] = useState(false);
  const pathname = usePathname();
  return (
    <div className="sticky top-0 z-20 w-full flex justify-between px-8 py-2 items-center bg-background shadow-xl lg:hidden">
      <Image src="/logo-gesapp-blue.png" alt="Gesapp" width={50} height={50} />
      <div className="flex gap-8 max-md:hidden">
        {navLinks.map((link) => (
          <Link
            key={link.label}
            href={link.url}
            className={cn(
              "flex",
              "gap-4",
              "text-xl font-bold",
              "hover:text-primary",
              pathname === link.url ? "text-primary" : "text-neutral-500"
            )}
          >
            <p>{link.label}</p>
          </Link>
        ))}
      </div>
      <div className="relative flex gap-4 items-center">
        <Menu
          className="cursor-pointer md:hidden text-primary"
          onClick={() => setDropdownMenu(!dropdownMenu)}
        />
        {dropdownMenu && (
          <div className="absolute top-16 right-8 shadow-lg p-4 flex flex-col gap-4 bg-white rounded-md">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.url}
                className={cn(
                  "flex",
                  "gap-4",
                  "text-xl font-bold",
                  "hover:text-primary",
                  pathname === link.url ? "text-primary" : "text-neutral-500"
                )}
              >
                {link.icon} <p className="text-xl">{link.label}</p>
              </Link>
            ))}
          </div>
        )}
        <UserButton />
      </div>
    </div>
  );
};

export default TopBar;
