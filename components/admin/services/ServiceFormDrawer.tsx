"use client";
import { createService, editService } from "@/actions/services.action";
import ContainerFormDrawer from "@/components/custom ui/ContainerFormDrawer";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { NewServiceSchema, TNewService, TService } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { CurrencyType, LocaleType } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const ServiceFormDrawer = ({ initialData }: { initialData?: TService }) => {
  const router = useRouter();
  const [error, setError] = useState<string | undefined>("");
  const [open, setOpen] = useState<boolean>(false);

  const ButtonText = initialData ? "Actualizar" : "Crear";
  const Title = initialData ? "Edita el Servicio" : "Nuevo Servicio";
  const Description = initialData ? "Edita el Servicio" : "Nuevo Servicio";
  const [isPending, startTransition] = useTransition();
  const form = useForm<TService>({
    resolver: zodResolver(NewServiceSchema),
    defaultValues: {
      name: initialData ? initialData.name : "",
      description: initialData ? initialData.description : "",
      price: initialData ? initialData.price : 0.0,
      priceIdStripe: initialData ? initialData.priceIdStripe : null,
      currencyType: initialData ? initialData.currencyType : CurrencyType.USD,
      localeType: initialData ? initialData.localeType : LocaleType.en_US,
      duration: initialData ? initialData.duration : 60,
      online: initialData ? initialData.online : true,
      discount: initialData ? initialData.discount : null,
      percentageCommission: initialData
        ? initialData.percentageCommission
        : null,
      commission: initialData ? initialData.commission : null,
      appointments: initialData ? initialData.appointments : undefined,
      serviceTransaction: initialData
        ? initialData.serviceTransaction
        : undefined,
    },
  });

  const onSubmit = async (values: TNewService) => {
    NewServiceSchema.parse(values);
    startTransition(() => {
      if (initialData) {
        const id = initialData.id;
        editService({ ...values, id })
          .then((res) => {
            if (res.error) {
              setError(res.message);
            }
            if (!res.error) {
              toast.success(res.message);
              setOpen(false);
            }
          })
          .catch(() => {
            setError("Algo salió mal! Inténtalo de nuevo.");
          });
      } else {
        createService(values)
          .then((res) => {
            if (res.error) {
              setError(res.message);
            }
            if (!res.error) {
              toast.success(res.message);
              setOpen(false);
            }
          })
          .catch(() => {
            setError("Algo salió mal! Inténtalo de nuevo.");
          });
      }
    });
  };
  return (
    <ContainerFormDrawer
      buttonText={"Nuevo servicio"}
      title={Title}
      description={Description}
      open={open}
      setOpen={setOpen}
      edit={initialData ? true : false}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-6 p-2"
        >
          <div className="w-full flex max-md:flex-col items-center md:items-start justify-center gap-2">
            <FormField
              control={form.control}
              name="name"
              disabled={isPending}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre del servicio" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              disabled={isPending}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Precio</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step={0.01}
                      placeholder="0.00"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs font-light">
                    *Precio en dolares americanos
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="description"
            disabled={isPending}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe el sericio"
                    {...field}
                    rows={5}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="w-full flex max-md:flex-col items-center justify-center gap-2">
            <FormField
              control={form.control}
              name="duration"
              disabled={isPending}
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Duración</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step={1}
                      placeholder="¿Cuánto dura el serivicio?"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs font-light">
                    *Duración en minutos
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="online"
              disabled={isPending}
              render={({ field }) => (
                <FormItem className="w-full flex items-center gap-2 ">
                  <FormLabel>
                    {" "}
                    <span className="bg-red-500 p-2 rounded-md text-white font-bold">
                      Presencial
                    </span>
                    {"  "}
                    <span className="bg-green-500 p-2 rounded-md text-white font-bold">
                      Online
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-full flex items-center justify-start gap-4">
            <Button type="submit" disabled={isPending} className="w-full">
              {ButtonText}
            </Button>
          </div>
        </form>
      </Form>
    </ContainerFormDrawer>
  );
};

export default ServiceFormDrawer;
function setError(message: string) {
  throw new Error("Function not implemented.");
}
