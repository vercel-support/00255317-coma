import { MenuItems } from "@/lib/constants";
import { Menu } from "lucide-react";
import Link from "next/link";
import React from "react";
import {
  Cloud,
  CreditCard,
  Github,
  Keyboard,
  LifeBuoy,
  LogOut,
  Mail,
  MessageSquare,
  Plus,
  PlusCircle,
  Settings,
  User,
  UserPlus,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
const MenuHeader = () => {
  return (
    <div className="flex items-center justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="md:hidden">
          <Menu className="text-white" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-screen">
          <DropdownMenuGroup className="flex flex-col">
            {MenuItems.map((item) => (
              <Link key={item.name} href={item.href}>
                {item.title}
              </Link>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="w-full flex intems-center justify-between max-md:hidden gap-6">
        {MenuItems.map((item) => (
          <Link key={item.name} href={item.href} className="text-white">
            {item.title}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MenuHeader;
