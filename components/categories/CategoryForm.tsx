"use client";
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
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import ImageUpload from "../custom ui/ImageUpload";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

const CategoryFormSchema = z.object({
  name: z.string().min(3).max(25),
  description: z.string().min(3).max(500),
  image: z.string(),
});

const CategoryForm = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof CategoryFormSchema>>({
    resolver: zodResolver(CategoryFormSchema),
    defaultValues: {
      name: "",
      description: "",
      image: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof CategoryFormSchema>) => {
    console.log(values);
    //startTransition(()=>{action(values).then(()=>{...}).catch(()=>{...};
  };
  return (
    <div className="p-10">
      <h1 className="text-2xl font-extrabold ">Crear nueva categoría</h1>
      <Separator className="mt-4 mb-8" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            disabled={isPending}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Nombre de la categoría" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            disabled={isPending}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe la categoría"
                    {...field}
                    rows={5}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image"
            disabled={isPending}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <ImageUpload
                    value={field.value ? [field.value] : []}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange("")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-start gap-4">
            <Button
              type="button"
              variant="destructive"
              onClick={() => router.push("/categories")}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              Crear
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CategoryForm;
