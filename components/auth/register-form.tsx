"use client";
import { register } from "@/actions/register";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { FormError } from "@/components/custom ui/form-error";
import { Formsuccess } from "@/components/custom ui/form-success";
import { Button } from "@/components/ui/button";
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
import { RegisterSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Checkbox } from "../ui/checkbox";
import Link from "next/link";

export const RegisterForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSetsuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: undefined,
      password: undefined,
      name: undefined,
      acepTerms: false,
    },
  });

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setError("");
    setSetsuccess("");

    startTransition(() => {
      register(values).then((data) => {
        setSetsuccess(data.success);
        setError(data.error);
        if (data.success) {
          form.reset();
        }
      });
    });
  };
  return (
    <div className="max-h-[100vh] md:max-h-[98vh] rounded-xl overflow-y-auto">
      <CardWrapper
        headerLabel="Crea una cuenta"
        backButtonLabel="Iniciar sesión"
        backButtonHref="/auth/login"
      >
        <Form {...form}>
          <form
            className="max-h-[90%] space-y-6"
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
                        disabled={isPending}
                        placeholder="Tu nombre completo."
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
                        disabled={isPending}
                        placeholder="tu_email@email.com"
                        type="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="******"
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormError message={error} />
            <Formsuccess message={success} />
            <FormField
              control={form.control}
              name="acepTerms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow bg-white dark:bg-background">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Términos y Condiciones</FormLabel>
                    <FormDescription>
                      Acepta nuestros{" "}
                      <Link href="/examples/forms" className="text-blue-600">
                        Términos y Condiciones
                      </Link>{" "}
                      para continuar.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <Button disabled={isPending} type="submit" className="w-full">
              Crear cuenta
            </Button>
          </form>
        </Form>
      </CardWrapper>
    </div>
  );
};
