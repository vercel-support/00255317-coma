"use client";
import { FiAlertTriangle } from "react-icons/fi";
import { NewAppointmentSchema, TNewAppointment } from "@/schemas";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { Card } from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { FormError } from "./form-error";
import { PrivateRoute } from "@/lib/routes";
import { Button } from "../ui/button";
import { Trash } from "lucide-react";

const AppoinmentForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm();
  // const form = useForm<TNewAppointment>({
  //   resolver: zodResolver(NewAppointmentSchema),
  //   defaultValues: {
  //     name: initialData.name,
  //     description: initialData.description,
  //   },
  // });

  const onSubmit = () => {};
  // const onSubmit = (values: TNewCategory) => {
  //   startTransition(() => {
  //     updateCategory({
  //       ...values,
  //       id: initialData.id,
  //     })
  //       .then((data) => {
  //         if (data.error) {
  //           setError(data.message);
  //         }
  //         if (!data.error) {
  //           toast.success(data.message);
  //           router.push(PrivateRoute.CATEGORIES.path);
  //         }
  //       })
  //       .catch(() => {
  //         setError("Algo salió mal! Inténtalo de nuevo.");
  //       });
  //   });
  // };
  return (
    <Card className="w-full ">
      <Form {...form}>
        <form className="space-y-6 p-2" onSubmit={form.handleSubmit(onSubmit)}>
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
                      placeholder="Nombre de la categoría"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Breve descripción de la categoría"
                      disabled={isPending}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />

          <div className="w-full  mt-4">
            <div className="w-full flex items-center justify-center bg-destructive rounded-t-md pt-2">
              <div className="w-full flex gap-2 items-center justify-center font-bold text-xl text-white">
                <FiAlertTriangle strokeWidth={2} /> ZONA DE PELIGRO{" "}
                <FiAlertTriangle strokeWidth={2} />
              </div>
            </div>
            <div className="flex max-md:flex-col items-center gap-2 border-2 border-destructive rounded-b-md  p-2 justify-end bg-destructive">
              <div className="w-full lg:w-1/3 flex flex-row items-center justify-between rounded-lg border-2 p-4 border-destructive bg-background gap-2">
                Eliminar Categoría
                <Button
                  disabled={isPending}
                  variant={"destructive"}
                  size={"icon"}
                  onClick={() => setOpen(true)}
                  className="w-full"
                  type="button"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end justify-between gap-4">
            <Button disabled={isPending} type="submit" className="w-full">
              guardar
            </Button>
            <Button
              disabled={isPending}
              type="button"
              className="w-full"
              variant={"outline"}
              onClick={() => router.push(PrivateRoute.CATEGORIES.path)}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
};

export default AppoinmentForm;
