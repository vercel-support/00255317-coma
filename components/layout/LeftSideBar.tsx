"use client";
import { MenuItemsAdmin } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LeftSideBar = () => {
  const pathname = usePathname();

  return (
    <aside className="h-screen left-0 top-0 sticky p-10 flex flex-col gap-4 bg-brandingLight shadow-lg max-lg:hidden overflow-auto">
      <div className="w-full flex items-start justify-center">
        <Image
          src="/logo-gesapp-blue.png"
          alt="Gesapp"
          width={50}
          height={50}
        />
      </div>
      <div className="flex flex-col h-full justify-between">
        <div className="flex h-[80%] flex-col justify-between mb-3">
          {MenuItemsAdmin.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "flex",
                "gap-4",
                "text-xl font-bold",
                "hover:text-brandingDark",
                pathname === link.path ? "text-branding" : "text-neutral-500"
              )}
            >
              {link.icon} <p>{link.title}</p>
            </Link>
          ))}
        </div>
        <div className="flex h-[20%] gap-4 text-xl font-bold items-center">
          <UserButton />
          <p className="text-sm text-primary">Editar perfil</p>
        </div>
      </div>
    </aside>
  );
};

export default LeftSideBar;
