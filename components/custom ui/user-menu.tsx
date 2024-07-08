"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrentUser } from "@/hooks/use-current-user";
import { FaUser } from "react-icons/fa";
import { LogoutButton } from "@/components/auth/logout-button";
import { ExitIcon } from "@radix-ui/react-icons";
import { LayoutDashboard, UserRoundCog } from "lucide-react";
import Link from "next/link";
import { UserRole } from "@prisma/client";
import { DropdownMenuLabel, Separator } from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";
import { PrivateRoute } from "@/lib/routes";

export const UserMenu = () => {
  const user = useCurrentUser();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={user?.image || ""} />
          <AvatarFallback className="bg-brandingThird">
            <FaUser className="text-white h-6 w-6" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40 space-y-2" align="end">
        <DropdownMenuLabel className="text-gray-500 bg-primary-foreground p-1 uppercase font-bold flex items-center justify-between gap-x-1 flex-wrap">
          <p className=" text-md ">
            {user?.name?.split(" ")[0]?.substring(0, 15)}{" "}
          </p>
          <p
            className={cn(
              "w-10 text-[6px] text-white p-1 rounded-md text-center overflow-hidden",
              user?.role.toLowerCase()
            )}
          >
            {user?.role === UserRole.ADMIN && "Admin"}
            {user?.role === UserRole.EMPLOYEE && "Empleado"}
            {user?.role === UserRole.CLIENT && "Cliente"}
          </p>
        </DropdownMenuLabel>
        <Separator />
        {user?.role === UserRole.ADMIN && (
          <DropdownMenuItem>
            <Link href={PrivateRoute.APPOINTMENTS.href}>
              <DropdownMenuItem className="cursor-pointer">
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Admin
              </DropdownMenuItem>
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem>
          <Link href={PrivateRoute.PROFILE.href}>
            <DropdownMenuItem className="cursor-pointer">
              <UserRoundCog className="w-4 h-4 mr-2" />
              Perfil
            </DropdownMenuItem>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <LogoutButton>
            <DropdownMenuItem className="cursor-pointer">
              <ExitIcon className="w-4 h-4 mr-2" />
              Cerrar sesión
            </DropdownMenuItem>
          </LogoutButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
