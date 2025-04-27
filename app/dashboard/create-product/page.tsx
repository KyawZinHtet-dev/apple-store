import { auth } from "@/auth";
import React from "react";
import { redirect } from "next/navigation";
import CreateProductForm from "./create-product-form";

const CreateProduct = async () => {
  const session = await auth();
  if (session?.user.role !== "admin") return redirect("/404");
  return (
    <div>
      <CreateProductForm />
    </div>
  );
};
export default CreateProduct;
