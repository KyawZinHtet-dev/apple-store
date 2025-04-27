import { db } from "@/db/db_connection";
import React from "react";
import { ProductTable } from "./product-table";
import { columns } from "./columns";
import productDefaultImage from "@/public/product-default.png";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
const Products = async () => {
  const session = await auth();
  if (!session) return redirect("/");
  if (session.user.role !== "admin") return redirect("/404");

  const products = await db.query.products.findMany({
    with: { variants: { with: { variantImages: true, variantTags: true } } },
    orderBy: (products, { desc }) => [desc(products.updatedAt)],
  });

  const computedProducts = products.map((product) => ({
    id: product.id as string,
    title: product.title as string,
    description: product.description as string,
    image:
      product.variants[0]?.variantImages[0]?.imageUrl ||
      (productDefaultImage.src as string),
    variants: product.variants,
    price: product.price as number,
  }));

  return (
    <div>
      <ProductTable data={computedProducts} columns={columns} />
    </div>
  );
};
export default Products;
