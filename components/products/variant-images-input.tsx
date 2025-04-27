import { variantSchema } from "@/types/variant-schema";
import { useFieldArray, useFormContext } from "react-hook-form";
import { z } from "zod";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UploadDropzone } from "@/app/api/uploadthing/uploadthing";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const VariantImagesInput = () => {
  const { control, getValues, setError } =
    useFormContext<z.infer<typeof variantSchema>>();
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "variantImages",
  });

  return (
    <div>
      <FormField
        control={control}
        name="variantImages"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Variant Images</FormLabel>
            <FormDescription>
              Upload variant's images maximum of 10
            </FormDescription>
            <FormControl>
              <UploadDropzone
                endpoint={"variantImagesUploader"}
                className=" ut-allowed-content:text-primary ut-label:text-primary ut-upload-icon:text-primary ut-button:bg-primary/90 ut-button:text-sm cursor-pointer ut-button:ut-uploading:after:bg-primary ut-button:focus-within:ring-primary"
                onBeforeUploadBegin={(files) => {
                  files.forEach((file) => {
                    append({
                      name: file.name,
                      size: file.size,
                      imageUrl: URL.createObjectURL(file),
                    });
                  });
                  return files;
                }}
                onUploadError={({ message }) => {
                  setError("variantImages", {
                    type: "validate",
                    message: message,
                  });
                }}
                onClientUploadComplete={(files) => {
                  const variantImages = getValues("variantImages");
                  variantImages.forEach((variantImage, index) => {
                    if (variantImage.imageUrl.startsWith("blob:")) {
                      const image = files.find(
                        (image) => image.name === variantImage.name
                      );
                      if (image) {
                        update(index, {
                          name: image.name,
                          size: image.size,
                          imageUrl: image.ufsUrl,
                        });
                      }
                    }
                  });
                }}
                config={{ mode: "auto" }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="flex gap-4 mt-2 flex-wrap justify-center items-center">
        {fields.map((image, index) => (
          <div
            key={index}
            className={cn(
              "relative",
              image.imageUrl.startsWith("blob:") && "animate-pulse"
            )}
          >
            <Image
              className=" object-cover rounded-md border border-muted-foreground"
              src={image.imageUrl}
              alt={image.name}
              width={80}
              height={80}
            />
            <Trash2
              onClick={(e) => {
                e.preventDefault();
                remove(index);
              }}
              strokeWidth={3}
              size={24}
              className="cursor-pointer text-destructive absolute top-0 right-0 bg-secondary/50 hover:bg-secondary/60 rounded-md p-1"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default VariantImagesInput;
