"use client";
import { UploadButton } from "@/app/api/uploadthing/uploadthing";
import { uploadAvatarSchema } from "@/types/upload-avatar-schema";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { uploadAvatar } from "@/db/actions/upload-avatar.action";
import { Upload } from "lucide-react";

const AvatarUploadButton = ({
  email,
  image,
  setIsUpdateAvatar,
}: {
  image: string | null;
  email: string;
  setIsUpdateAvatar: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const { execute, status } = useAction(uploadAvatar, {
    onSuccess: ({ data }: any) => {
      if (data?.success) {
        toast.success(data?.success.message, {
          description: data?.success.description,
        });
        setIsUpdateAvatar(data?.success.image);
      }
      if (data?.error) {
        toast.error(data?.error.message, {
          description: data?.error.description,
        });
      }
    },
  });

  return (
    <>
      <div>
        <UploadButton
          disabled={status === "executing"}
          onClientUploadComplete={(res) => {
            const parsedValue = uploadAvatarSchema.parse({
              email,
              image: res[0].url,
            });
            execute(parsedValue);
          }}
          onUploadError={(error) => {
            toast.error(error.message);
          }}
          className="scale-75 ut-button:bg-primary ut-button:text-primary-foreground  ut-button:hover:bg-primary/90 ut-button:focus-within:ring-primary ut-button:ut-uploading:bg-muted ut-button:ut-uploading:text-muted-foreground ut-button:ut-readying:bg-muted ut-button:ut-readying:text-muted-foreground ut-button:ut-uploading:after:bg-primary/80 ut-button:ut-uploading:after:text-muted-foreground"
          endpoint={"imageUploader"}
          content={{
            button({ ready }) {
              return (
                <span className=" flex gap-2 items-center">
                  <Upload size={18} />
                  {ready ? "Upload Avatar" : "Loading..."}
                </span>
              );
            },
          }}
        />
      </div>
    </>
  );
};

export default AvatarUploadButton;
