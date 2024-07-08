"use client";
import { editAppointment } from "@/actions/appoinment";
import { FormError } from "@/components/custom ui/form-error";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { AppointmentSchema, TAppointment } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { StatusAppointment } from "@prisma/client";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const AppointmentAgreeForm = ({
  initialData,
}: {
  initialData?: TAppointment;
}) => {
  const [error, setError] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [formValues, setFormValues] = useState<TAppointment | null>(null);

  const form = useForm<TAppointment>({
    resolver: zodResolver(AppointmentSchema),
    defaultValues: {
      id: initialData && initialData.id,
      bookingDate: initialData && initialData.bookingDate,
      appointmentDate: initialData ? initialData.appointmentDate : undefined,
      appointmentTime: initialData ? initialData.appointmentTime : undefined,
      status: initialData && initialData.status,
      coupleName: initialData && initialData.coupleName,
      situation: initialData && initialData.situation,
      message: initialData && initialData.message,
      userId: initialData && initialData.userId,
      employeeId: initialData && initialData.employeeId,
      serviceId: initialData && initialData.serviceId,
      linkMeet: initialData && initialData.linkMeet,
    },
  });

  const onSubmit = async (values: TAppointment) => {
    AppointmentSchema.parse(values);
    if (!values.appointmentDate) {
      setError("Debes escoger una fecha para la cita.");
      return;
    }
    if (values.status === StatusAppointment.CANCELED) {
      setShowCancelDialog(true);
      setFormValues(values);
      return;
    }
    submitForm(values);
  };

  const submitForm = async (values: TAppointment) => {
    startTransition(() => {
      if (initialData) {
        editAppointment({ values })
          .then((res) => {
            if (res.error) {
              setError(res.message);
            } else {
              toast.success(res.message);
            }
          })
          .catch(() => {
            setError("Algo salió mal! Inténtalo de nuevo.");
          });
      } else {
        toast.error("Ha ocurrido un error, no hay datos");
      }
    });
  };

  const statusAppointment = [
    { id: StatusAppointment.PENDING, name: "Pendiente" },
    { id: StatusAppointment.CONFIRMED, name: "Confirmar" },
    { id: StatusAppointment.CANCELED, name: "Cancelar" },
  ];

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-6 p-2"
        >
          <div className="w-full flex max-md:flex-col items-center md:items-start justify-center gap-4">
            <div className="w-full md:w-1/2 flex flex-col items-start justify-center gap-8 ">
              <FormLabel className="font-bold">datos de la cita</FormLabel>
              <ul className="space-y-4">
                <li className="flex items-center gap-2">
                  <span className="font-bold">Cita solicitada el :</span>{" "}
                  {initialData?.bookingDate.toLocaleDateString("es-ES")}
                </li>
                <li className="flex items-center gap-2">
                  <span className="font-bold">Nombre del solicitante:</span>{" "}
                  {initialData?.user?.name}
                </li>
                <li className="flex items-center gap-2">
                  <span className="font-bold">Nombre de la pareja:</span>{" "}
                  {initialData?.coupleName ?? ""}
                </li>
                <li className="flex items-center gap-2">
                  <span className="font-bold">Situación de la pareja: </span>
                  {initialData?.situation}
                </li>
                <li className="flex items-center gap-2">
                  <span className="font-bold">Mensaje del solicitante: </span>
                  {initialData?.message}
                </li>
                <li className="flex items-center gap-2">
                  <span className="font-bold">Tipo de servicio:</span>{" "}
                  {initialData?.service?.name}
                </li>
              </ul>
            </div>
            <div className="w-full md:w-1/2 flex flex-col items-start justify-center gap-8 ">
              <FormField
                control={form.control}
                name="appointmentDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="font-bold">
                      Fecha de la Asesoría
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Escoge una fecha</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 z-50" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? field.value : undefined}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Escoge una fecha para agendar la asesoría para el
                      pacientes.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="appointmentTime"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="font-bold">
                      Hora de la Asesoría
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        className="w-[240px] pl-3 text-left font-normal"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormDescription>
                      Escoge una hora para agendar la asesoría para el paciente.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="linkMeet"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="font-bold">
                      Enlace Google Meets
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="w-[240px] pl-3 text-left font-normal"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="w-1/3">
                    <FormLabel className="font-bold">Confirmar cita</FormLabel>
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
                            placeholder="Confirmar o Cancelar"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {statusAppointment.map((t) => (
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
            </div>
          </div>
          <FormError message={error} />
          <div className="w-full flex items-center justify-start gap-4">
            <Button type="submit" disabled={isPending} className="w-full">
              Confirmar y enviar cita al paciente
            </Button>
          </div>
        </form>
      </Form>

      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancelar Cita</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres cancelar esta cita? Esta acción
              enviará un correo electrónico al usuario notificando la
              cancelación.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setShowCancelDialog(false)}>
              No, mantener cita
            </Button>
            <Button
              onClick={() => {
                setShowCancelDialog(false);
                if (formValues) {
                  submitForm(formValues);
                }
              }}
            >
              Sí, cancelar cita
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AppointmentAgreeForm;
