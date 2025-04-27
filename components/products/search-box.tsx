"use client";
import { ProductsWithVariantsAndImages } from "@/lib/infer-types";
import { Input } from "../ui/input";
import { SearchIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/formatCurrency";

type SearchBoxProps = {
  prductsWithVariantsAndImages: ProductsWithVariantsAndImages[];
};
const SearchBox = ({ prductsWithVariantsAndImages }: SearchBoxProps) => {
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState<
    ProductsWithVariantsAndImages[]
  >([]);
  const fliteredProducts = prductsWithVariantsAndImages.filter((product) => {
    return product?.title?.toLowerCase().includes(searchValue.toLowerCase());
  });

  useEffect(() => {
    setSearchResults(fliteredProducts);
  }, [searchValue]);

  return (
    <div className="mt-4">
      <div className="relative">
        <Input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          type="text"
          placeholder="Search products..."
          className="w-full"
        />
        <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
          {searchValue === "" && (
            <SearchIcon
              className="h-5 w-5 text-muted-foreground"
              aria-hidden="true"
            />
          )}
          {searchValue && (
            <XIcon
              onClick={() => setSearchValue("")}
              className="h-5 w-5 text-muted-foreground cursor-pointer"
              aria-hidden="true"
            />
          )}
        </div>
      </div>
      {searchValue && (
        <div className="relative max-w-screen-lg mx-auto">
          <div className="mt-2 absolute w-full z-40 p-4 rounded-md  bg-white border border-gray-300">
            {searchResults.length > 0 && (
              <div>
                <p className="font-semibold mb-2">
                  Total search results{" "}
                  <span className="font-bold">{searchResults.length}</span>
                </p>
                <div className=" max-h-60 overflow-y-auto flex flex-col gap-1">
                  {searchResults.map((product) => (
                    <Link
                      href={`/products/${product.id}`}
                      key={product.id}
                      className="w-full my-1 hover:text-primary transition-all duration-200 flex justify-between items-center pr-3 rounded-md gap-2"
                    >
                      <div className=" flex items-center gap-3 justify-between w-3/5 min-h-10">
                        <p>{product.title}</p>
                        <Image
                          src={product.variants[0].variantImages[0].imageUrl}
                          alt={product.title!}
                          width={50}
                          height={50}
                          className="mix-blend-multiply"
                        />
                      </div>
                      <p className="font-semibold">
                        {formatCurrency(product.price!)}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {searchResults.length === 0 && (
              <div className="animate-pulse flex flex-col items-center justify-center h-full py-5">
                <p className="font-semibold text-2xl mb-4">No result found!</p>
                <div className="h-10 w-10 border-t-4 border-b-4 border-primary rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBox;
