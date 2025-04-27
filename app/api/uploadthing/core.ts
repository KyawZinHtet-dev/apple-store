import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  }).onUploadComplete(async ({ metadata, file }) => {
    console.log("upload complete", file.ufsUrl);
  }),

  variantImagesUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 10,
    },
  }).onUploadComplete(async ({ metadata, file }) => {
    console.log("variant images upload complete", file.ufsUrl);
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
