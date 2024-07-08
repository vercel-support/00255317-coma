"use client";

import { updateUser } from "@/actions/user.action";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useCurrentUser } from "@/hooks/use-current-user";
import { SettingsUserSchema, TSettingsUser } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { ClipLoader } from "react-spinners";
import { toast } from "sonner";
import { FormError } from "../custom ui/form-error";

export const UserForm = () => {
  const user = useCurrentUser();
  const [error, setError] = useState<string | undefined>();
  const { update } = useSession();
  const [isPending, startTransition] = useTransition();

  const form = useForm<TSettingsUser>({
    resolver: zodResolver(SettingsUserSchema),
    defaultValues: {
      name: user?.name || undefined,
      email: user?.email || undefined,
      password: undefined,
      newPassword: undefined,
      isTwoFactorEnabled: user?.isTwoFactorEnabled || undefined,
    },
  });

  const onSubmit = (values: TSettingsUser) => {
    startTransition(() => {
      updateUser(values)
        .then((data) => {
          if (data.error) {
            setError(data.message);
          }
          if (!data.error) {
            toast.success(data.message);
            update();
          }
        })
        .catch(() => {
          setError("Algo salió mal. Por favor, inténtelo de nuevo.");
        });
    });
  };

  return (
    <Card className="w-full h-screen overflow-y-auto customScroll ">
      <CardHeader className="text-2xl font-semibold text-center">
        Perfil
      </CardHeader>
      <CardDescription className="p-4 xt-left">
        Actualiza tu información personal y configura tu cuenta de usuario.
        Puedes cambiar tu nombre, email, contraseña y activar la autenticación
        de dos factores. Algunas opciones pueden estar deshabilitadas si has
        iniciado sesión con una cuenta de terceros, como Google o Facebook.
      </CardDescription>
      <CardContent>
        <Form {...form}>
          <form
            autoComplete="off"
            className="space-y-6"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Jhon Doe"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="ejemplo@email.com"
                        disabled={isPending || user?.isOAuth === true}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {user?.isOAuth === false && (
                <>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contraseña</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="******"
                            disabled={isPending || user?.isOAuth === true}
                            autoComplete="off"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nueva contraseña</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="******"
                            disabled={isPending || user?.isOAuth === true}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              <FormField
                control={form.control}
                name="isTwoFactorEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Autenticación de Dos Factores</FormLabel>
                      <FormDescription>
                        Activa la autenticación de dos factores para agregar una
                        capa adicional de seguridad a tu cuenta.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        disabled={isPending}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <FormError message={error} />
            <Button disabled={isPending} type="submit">
              {isPending ? <ClipLoader color="#1950e0" /> : "Guardar"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
