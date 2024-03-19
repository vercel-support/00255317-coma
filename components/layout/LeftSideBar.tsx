"use client";
import { navLinks } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LeftSideBar = () => {
  const pathname = usePathname();

  return (
    <aside className="h-screen left-0 top-0 sticky p-10 flex flex-col gap-10 bg-background shadow-lg max-lg:hidden">
      <div className="w-full flex items-center justify-center">
        <Image
          src="/logo-gesapp-blue.png"
          alt="Gesapp"
          width={50}
          height={50}
        />
      </div>
      <div className="flex flex-col h-full justify-between">
        <div className="flex flex-col gap-12">
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
              {link.icon} <p>{link.label}</p>
            </Link>
          ))}
        </div>
        <div className="flex gap-4 text-xl font-bold items-center">
          <UserButton />
          <p className="text-lg text-primary">Editar perfil</p>
        </div>
      </div>
    </aside>
  );
};

export default LeftSideBar;
