"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { VariantsWithImagesTags } from "@/lib/infer-types";
import { variantSchema } from "@/types/variant-schema";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import TagsInput from "./tag-input";
import VariantImagesInput from "./variant-images-input";
import {
  createAndUpdateVariant,
  deleteVariant,
} from "@/db/actions/variant-action";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { useEffect, useState } from "react";

type VariantDialogProps = {
  children: React.ReactNode;
  editMode: boolean;
  productId?: string;
  variant?: VariantsWithImagesTags;
};

type VariantImage = {
  name: string;
  imageUrl: string;
  size: number;
};

type VariantTag = {
  tag: string;
};

const VariantDialog = ({
  children,
  editMode,
  productId,
  variant,
}: VariantDialogProps) => {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof variantSchema>>({
    resolver: zodResolver(variantSchema, {}),
    defaultValues: {
      id: "",
      productId,
      editMode,
      color: "#000000",
      productType: "Black",
      variantImages: [],
      tags: ["iPhone", "iPad", "Macbook", "Airpods", "Accesories"],
    },
  });

  const { execute, status } = useAction(createAndUpdateVariant, {
    onSuccess: ({ data }: any) => {
      setOpen(false);
      if (data?.success) {
        toast.success(data?.success.message, {
          description: data?.success.description,
        });
        form.reset();
      }
      if (data?.error) {
        toast.error(data?.error.message, {
          description: data?.error.description,
        });
      }
      if (data?.update) {
        toast.success(data?.update.message, {
          description: data?.update.description,
        });
      }
    },
  });

  const { execute: deleteVariantExecute, status: deleteVariantStatus } =
    useAction(deleteVariant, {
      onSuccess: ({ data }: any) => {
        setOpen(false);
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
      },
    });

  function onSubmit(values: z.infer<typeof variantSchema>) {
    if (values.variantImages.length > 10) {
      form.setError("variantImages", {
        message: "Maximum of 10 images allowed",
      });
    }

    values.variantImages.map((image) => {
      if (image.imageUrl.startsWith("blob:")) {
        form.setError("variantImages", {
          message: "Please wait untill image is uploaded",
        });
      }
    });

    if (!form.getFieldState("variantImages").error) {
      execute(values);
    }
  }

  // for edit mode
  const getOldDataToEdit = () => {
    if (editMode && variant) {
      form.setValue("editMode", true);
      form.setValue("id", variant.id);
      form.setValue("productType", variant.productType);
      form.setValue("color", variant.color);
      form.setValue(
        "tags",
        variant.variantTags.map((tag) => tag.tag) as [string, ...string[]]
      );
      form.setValue(
        "variantImages",
        variant.variantImages.map((image) => ({
          name: image.name,
          imageUrl: image.imageUrl,
          size: Number(image.size),
        })) as [VariantImage, ...VariantImage[]]
      );
    }
  };

  useEffect(() => {
    if (editMode && variant) {
      getOldDataToEdit();
    }
  }, []);

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-[550px] w-11/12 rounded-lg">
          <DialogHeader className="px-1">
            <DialogTitle>
              {editMode ? "Edit" : "Create"} Product's Variant
            </DialogTitle>
            <DialogDescription>
              {editMode
                ? "Edit your variant here. After editing, don't forget to save."
                : "Create a new variant here. After creating, don't forget to save."}
            </DialogDescription>
          </DialogHeader>
          <div className=" max-h-[70vh] overflow-y-scroll overflow-x-hidden p-1 ">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <FormField
                  control={form.control}
                  name="productType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Variant Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter variant title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Variant Color</FormLabel>
                      <FormControl>
                        <Input type="color" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Variant Tags</FormLabel>
                      <FormControl>
                        <TagsInput
                          {...field}
                          handleOnChange={(e) => field.onChange(e)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <VariantImagesInput />
                <Button
                  disabled={status === "executing"}
                  className="w-full"
                  type="submit"
                >
                  {editMode ? "Update" : "Create"}
                </Button>
                {editMode && (
                  <Button
                    variant="destructive"
                    type="button"
                    disabled={deleteVariantStatus === "executing"}
                    className="w-full"
                    onClick={() => deleteVariantExecute({ id: variant?.id! })}
                  >
                    Delete
                  </Button>
                )}
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VariantDialog;
