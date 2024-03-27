"use client";
import { Separator } from "@/components/ui/separator";
import { TEmployee, TUser } from "@/schemas";
import { columns } from "./columns";
import { FlexContainer } from "@/components/custom ui/flex-container";
import { SubHeading } from "@/components/custom ui/sub-heading";
import { DataTable } from "@/components/custom ui/dataTable/DataTable";

export const UsersClient = ({ data }: { data: TUser[] }) => {
  return (
    <>
      <FlexContainer row between className="items-center space-y-3">
        <SubHeading
          title={`Usuarios (${data.length})`}
          description={
            "Lista de usuarios registrados en el sistema. Aquí puedes editar el rol de los usuarios y darles permiso de acceso a la plataforma. También puedes eliminar usuarios del sistema. Un usuario sin permisos no podrá acceder a la plataforma. Hay tres roles de usuario: Administrador, Empleado y Cliente. El rol de Administrador tiene acceso a todas las funcionalidades del sistema. El rol de Empleado tiene acceso solo a la TPV. El rol de Cliente tiene acceso a su perfil y solo estos usuarios pueden comprar a crédito en tu negocio."
          }
        />
      </FlexContainer>
      <Separator />
      <div className="bg-secondary rounded-lg shadow-md p-6">
        <DataTable
          columns={columns}
          data={data as TUser[]}
          searchKey={"name"}
        />
      </div>
    </>
  );
};
