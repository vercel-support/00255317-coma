"use client";
import { resetPassword } from "@/actions/reset-password";
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
import { ResetSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

export const ResetForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSetsuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: z.infer<typeof ResetSchema>) => {
    setError("");
    setSetsuccess("");
    console.log(values);
    startTransition(() => {
      resetPassword(values).then((data) => {
        setSetsuccess(data?.success);
        setError(data?.error);
      });
    });
  };
  return (
    <CardWrapper
      headerLabel="¿Olvidaste tu contraseña?"
      backButtonLabel="Iniciar sesión"
      backButtonHref="/auth/login"
    >
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-4">
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
                      placeholder="ejemplo@email.com"
                      type="email"
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
            Enivar email
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
