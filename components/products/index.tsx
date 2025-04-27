"use client";
import { ProductsWithVariantsAndImages } from "@/lib/infer-types";
import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/formatCurrency";
import TagFilter from "./tag-filter";
import { useState } from "react";

type ProductProps = {
  products: ProductsWithVariantsAndImages[];
};
const Products = ({ products }: ProductProps) => {
  const [filteredProductsByTag, setFilteredProductsByTag] = useState(products);

  const allTags = products.flatMap((product) =>
    product.variants.flatMap((variant) =>
      variant.variantTags.map((tag) => tag.tag)
    )
  );

  const filterProductsByTag = (tag: string) => {
    if (tag === "All") {
      setFilteredProductsByTag(products);
    } else {
      setFilteredProductsByTag(
        products.filter((product) =>
          product.variants.some((variant) =>
            variant.variantTags.some((tagObj) => tagObj.tag === tag)
          )
        )
      );
    }
  };

  return (
    <div>
      <TagFilter tags={allTags} filterProductsByTag={filterProductsByTag} />
      <div className=" flex justify-center">
        <div className="grid grid-cols-1 min-[450px]:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 justify-items-center gap-4">
          {filteredProductsByTag.map((product) => (
            <div
              key={product.id}
              className=" shadow-sm p-5 rounded-lg bg-gray-200 hover:shadow-md transition-all hover:bg-gray-300 duration-200 cursor-pointer flex flex-col justify-between items-stretch"
            >
              <Image
                className=" rounded-md mix-blend-multiply"
                src={product.variants[0].variantImages[0].imageUrl}
                width={500}
                height={500}
                alt={product.title!}
                priority
              />
              <div>
                <h3 className="font-semibold text-xl my-3">{product.title}</h3>
                <div className=" flex justify-between">
                  <p className="text-sm font-medium">
                    {formatCurrency(product.price!)}
                  </p>
                  {/* <Link
                  className="text-sm font-medium underline transition-all duration-200 hover:underline-offset-2 hover:text-primary"
                  href={`/products/${product.id}`}
                >
                  Details
                </Link> */}
                </div>
                <Link
                  href={`/products/${product.id}`}
                  className="relative inline-flex mt-5 w-full items-center justify-start px-4 py-2 overflow-hidden font-medium transition-all bg-white rounded-md hover:bg-white group"
                >
                  <span className="w-[20rem] h-[20rem] rounded rotate-[-40deg] bg-primary absolute bottom-0 left-0 -translate-x-full ease-out duration-1000 transition-all translate-y-full mb-12 ml-20 group-hover:ml-0 group-hover:mb-40 group-hover:translate-x-7"></span>
                  <span className="relative w-full text-center text-black transition-colors duration-300 ease-in-out group-hover:text-white flex items-center gap-2 justify-center">
                    View Details
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;
