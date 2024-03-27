"use client";
import { ChangedPermission } from "@/actions/user.action";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { ChangePermissionSchema, TChangePermission } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export const SwitchPermission = ({
  userId,
  permission,
}: {
  userId: string;
  permission: boolean;
}) => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<TChangePermission>({
    resolver: zodResolver(ChangePermissionSchema),
    defaultValues: {
      userId,
      permission,
    },
  });

  const onSubmit = async (values: TChangePermission) => {
    startTransition(() => {
      const data = {
        id: userId,
        permission: values.permission,
      };
      ChangedPermission(data)
        .then((data) => {
          if (data.error) {
            toast.error(data.message);
          }
          if (!data.error) {
            toast.success(data.message);
          }
        })
        .catch((err: any) => {
          toast.error("Something went wrong!");
        });
    });
  };

  return (
    <div>
      <Form {...form}>
        <form className="space-y-6 p-6" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="permission"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Switch
                    disabled={isPending}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    type="submit"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
};
