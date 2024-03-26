"use client";
import { newPassword } from "@/actions/new-password";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { FormError } from "@/components/custom ui/form-error";
import { Formsuccess } from "@/components/custom ui/form-success";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { NewPasswordSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

export const NewPasswordForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [error, setError] = useState<string | undefined>("");
  const [success, setSetsuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
    setError("");
    setSetsuccess("");
    startTransition(() => {
      newPassword(values, token).then((data) => {
        setSetsuccess(data?.success);
        setError(data?.error);
      });
    });
  };
  return (
    <CardWrapper
      headerLabel="Nueva contraseña"
      backButtonLabel="Iniciar sesión"
      backButtonHref="/auth/login"
    >
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nueva contraseña</FormLabel>
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
          <Button disabled={isPending} type="submit" className="w-full">
            Cambiar contraseña
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
