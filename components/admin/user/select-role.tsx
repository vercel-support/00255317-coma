"use client";
import { ChangedRole } from "@/actions/user.action";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PrivateRoute } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { ChangeRoleSchema, TChangeRole } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserRole } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export const SelectRole = ({
  userId,
  role,
}: {
  userId: string;
  role: UserRole;
}) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const roles = [
    { id: UserRole.ADMIN, name: "Administrador" },
    { id: UserRole.EMPLOYEE, name: "Empleado" },
    { id: UserRole.CLIENT, name: "Cliente" },
  ];

  const form = useForm<TChangeRole>({
    resolver: zodResolver(ChangeRoleSchema),
    defaultValues: {
      userId,
      role,
    },
  });

  const onSubmit = async (values: TChangeRole) => {
    startTransition(() => {
      const data = {
        id: userId,
        role: values.role,
      };
      ChangedRole(data)
        .then((data) => {
          if (data.error) {
            toast.error(data.message);
          }
          if (!data.error) {
            toast.success(data.message);
            router.push(PrivateRoute.USERS.href);
          }
        })
        .catch((err: any) => {
          toast.error("Algo salió mal!. Inténtalo de nuevo.");
        });
    });
  };

  return (
    <div>
      <Form {...form}>
        <form className="space-y-6 p-6" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem className="w-full">
                <Select
                  disabled={isPending}
                  onValueChange={(value) => {
                    field.onChange(value);
                    form.handleSubmit(onSubmit)();
                  }}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        defaultValue={field.value}
                        placeholder="Selecciona un rol"
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {roles.map((r) => (
                      <SelectItem key={r.id} value={r.id}>
                        <p
                          className={cn("badge text-white", r.id.toLowerCase())}
                        >
                          {r.name}
                        </p>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
};
