"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { editUserNameSchema } from "@/types/edit-user-name-schema";
import { updateUserName } from "@/db/actions/update-user-name-action";
import { useAction } from "next-safe-action/hooks";
import { Dispatch, SetStateAction } from "react";
const EditUserNameForm = ({
  name,
  email,
  setIsOpen,
}: {
  name: string;
  email: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const form = useForm<z.infer<typeof editUserNameSchema>>({
    resolver: zodResolver(editUserNameSchema),
    defaultValues: {
      name,
      email,
    },
  });

  const { execute, status } = useAction(updateUserName, {
    onSuccess: ({ data }: any) => {
      form.reset();
      if (data?.success) {
        toast.success(data?.success.message, {
          description: data?.success.description,
        });
        setIsOpen(false);
      }
      if (data?.error) {
        toast.error(data?.error.message, {
          description: data?.error.description,
        });
        setIsOpen(false);
      }
    },
  });

  const onSubmit = (values: z.infer<typeof editUserNameSchema>) => {
    execute({ ...values, email });
  };

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className=" flex-col flex gap-4">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            type="submit"
            className={cn(
              " mt-6 w-full",
              status === "executing" && "animate-pulse"
            )}
            disabled={status === "executing"}
          >
            Save
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default EditUserNameForm;
