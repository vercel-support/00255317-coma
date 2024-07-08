"use client";

import HeaderAdminBox from "@/components/custom ui/HeaderAdminBox";
import Container from "@/components/custom ui/container";
import { UserForm } from "@/components/profile/user-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCurrentUser } from "@/hooks/use-current-user";
import { CustomError } from "@/lib/custom-error.class";
import { cn } from "@/lib/utils";
import { UserRole } from "@prisma/client";
import { User2Icon } from "lucide-react";

const ProfilePage = () => {
  const user = useCurrentUser();
  if (!user) {
    throw new CustomError("Usuario no encontrado", 404);
  }

  return (
    <Container className="py-20">
      <HeaderAdminBox
        icon={
          <Avatar className="bg-branding">
            <AvatarImage
              src={user.image || undefined}
              alt={user.name || undefined}
            />
            <AvatarFallback>
              <User2Icon size={50} className="text-white" />
            </AvatarFallback>
          </Avatar>
        }
        title={user.email!}
        titleBigDetail={user.name}
        titleBoxLeft={""}
        contentBoxLeft={
          <p className={cn("badge text-white", user?.role!.toLowerCase())}>
            {user?.role === UserRole.ADMIN && "Admin"}
            {user?.role === UserRole.EMPLOYEE && "Empleado"}
            {user?.role === UserRole.CLIENT && "Cliente"}
          </p>
        }
        titleBoxRight={""}
        contentBoxRight={undefined}
        back
      />
      <UserForm />
    </Container>
  );
};

export default ProfilePage;
