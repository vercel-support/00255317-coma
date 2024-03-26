"use client";
import { MenuItemsAdmin } from "@/lib/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@/components/auth/user-button";
import { ModeToggle } from "@/components/custom ui/toggle-mode";

const LeftSideBar = () => {
  const pathname = usePathname();

  return (
    <aside className="h-screen left-0 top-0 sticky p-8 pt-2 flex flex-col gap-4 bg-brandingLight shadow-lg max-md:hidden overflow-auto dark:bg-secondary">
      <div className="w-full flex items-center justify-center bg-branding rounded-md shadow-sm p-2">
        <Image
          src="/logo-gesapp-white.svg"
          alt="Gesapp"
          width={50}
          height={50}
        />
        <h3 className="text-white font-extrabold text-xl uppercase">Gesapp</h3>
      </div>
      <div className="w-full flex flex-col h-full justify-between">
        <div className="flex h-[80%] flex-col justify-between mb-3">
          {MenuItemsAdmin.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "flex",
                "gap-4",
                "text-md font-bold",
                "hover:text-brandingDark",
                pathname === link.path ? "text-branding" : "text-primary/70"
              )}
            >
              {link.icon} <p>{link.title}</p>
            </Link>
          ))}
        </div>
        <div className="w-full flex h-[10%] gap-4 text-xl font-bold items-center justify-between p-2 bg-branding rounded-md">
          <ModeToggle />
          <UserButton />
        </div>
      </div>
    </aside>
  );
};

export default LeftSideBar;
