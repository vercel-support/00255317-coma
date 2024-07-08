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
import Link from "next/link";
import { PrivateRoute } from "@/lib/routes";
import { UserRoundCog } from "lucide-react";

export const UserButton = () => {
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
      <DropdownMenuContent className="w-40" align="end">
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
