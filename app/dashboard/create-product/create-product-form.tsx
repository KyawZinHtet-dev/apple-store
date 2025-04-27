"use client";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { productSchema } from "@/types/product-schema";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import {
  createAndUpdateProduct,
  getProductById,
} from "@/db/actions/product-actions";

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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DollarSign } from "lucide-react";
import TiptapEditor from "./tiptap";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const CreateProductForm = () => {
  const router = useRouter();
  const id = useSearchParams().get("id") || null;

  const getProductForEdit = async (id: string) => {
    const response = await getProductById(id);
    if (response?.error) {
      router.push("/dashboard/products");
      toast.error(response?.error.message);
      return;
    }
    if (response?.success) {
      form.setValue("id", response?.success.id!);
      form.setValue("title", response?.success.title!);
      form.setValue("description", response?.success.description!);
      form.setValue("price", response?.success.price!);
    }
  };

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
    },
  });

  const { execute, status } = useAction(createAndUpdateProduct, {
    onSuccess: ({ data }: any) => {
      form.reset();
      if (data?.success) {
        toast.success(data?.success.message, {
          description: data?.success.description,
        });
      }
      if (data?.error) {
        toast.error(data?.error.message, {
          description: data?.error.description,
        });
      }
      if (data?.update) {
        router.push("/dashboard/products");
        toast.success(data?.update.message);
      }
    },
  });

  const onSubmit = (values: z.infer<typeof productSchema>) => {
    execute(values);
  };

  useEffect(() => {
    if (id) {
      getProductForEdit(id);
    }
  }, [id]);

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Create Product</CardTitle>
          <CardDescription>Create a new product for your store</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Product title" {...field} />
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
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <TiptapEditor value={field.value} status={status} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (MMK)</FormLabel>
                    <FormControl>
                      <div className=" flex items-center gap-1">
                        <DollarSign
                          className=" bg-muted p-2 rounded-md"
                          size={36}
                        />
                        <Input
                          placeholder="Product price in MMK"
                          {...field}
                          type="number"
                          min={0}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                disabled={status === "executing"}
                type="submit"
                className=" w-full"
              >
                {id ? "Update Product" : "Create Product"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateProductForm;
