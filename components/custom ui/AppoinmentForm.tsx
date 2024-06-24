"use client";
import { FiAlertTriangle } from "react-icons/fi";
import {
  AppoinmentFormSchema,
  NewAppointmentSchema,
  TAppointmentForm,
  TNewAppointment,
} from "@/schemas";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { newPetitionAppoinment } from "@/actions/appoinment";
import { useCurrentUser } from "@/hooks/use-current-user";

const AppoinmentForm = ({ serviceId }: { serviceId: string }) => {
  const [error, setError] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const user = useCurrentUser();
  const form = useForm<TAppointmentForm>({
    resolver: zodResolver(AppoinmentFormSchema),
    defaultValues: {
      name: user ? user.name! : undefined,
      coupleName: undefined,
      email: user ? user.email! : undefined,
      phone: undefined,
      situation: undefined,
      message: undefined,
      serviceId,
      employeeId: "66741992ff29abc95f8de5c6",
    },
  });

  const onSubmit = (values: TAppointmentForm) => {
    startTransition(() => {
      newPetitionAppoinment({ values })
        .then((data) => {
          if (data.error) {
            setError(data.message);
          }
          if (!data.error) {
            toast.success(data.message);
            // router.push(PrivateRoute.CATEGORIES.path);
          }
        })
        .catch(() => {
          setError("Algo salió mal! Inténtalo de nuevo.");
        });
    });
  };

  const situation = [
    {
      id: "Noviazgo o en Búsqueda de pareja.",
      name: "Noviazgo o en Búsqueda de pareja.",
    },
    { id: "Pareja estable", name: "Pareja estable" },
    { id: "Recien casados.", name: "Recien casados." },
    {
      id: "Pareja o matrimonio con hijos.",
      name: "Pareja o matrimonio con hijos.",
    },
  ];
  return (
    <Card className="w-full p-8">
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
                      placeholder="tu nombre"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="coupleName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de la pareja</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Nombre de tu pareja"
                      disabled={isPending}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="w-full flex items-center gap-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        {...field}
                        placeholder="tu_email@email.com"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        {...field}
                        placeholder="Tu teléfono de contacto"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="situation"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="font-bold">
                    {" "}
                    ¿En qué fase está tu relación?{" "}
                  </FormLabel>
                  <Select
                    disabled={isPending}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="--Selecciona--"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {situation.map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Cuentanos que te gustaria tratar en la Asesoría.
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Mensaje"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />

          <div className="flex flex-col items-end justify-between gap-4">
            <Button
              disabled={isPending}
              type="submit"
              className="w-full font-bold"
            >
              Reserva tu asesoría exclusiva
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
};

export default AppoinmentForm;
