"use client";
import { cn } from "@/lib/utils";
import { Circle } from "lucide-react";
import { formatCurrency } from "@/lib/formatCurrency";
import { ProductsWithVariantsAndImages } from "@/lib/infer-types";
import { useState } from "react";
import { Button } from "../ui/button";
import { ShoppingCart } from "lucide-react";
import ImagesSlider from "./images-slider";
import AdjustQuantityButton from "./adjustQuantity-button";
import { useCartStore } from "@/store/cart-store";

type SingleProductProps = {
  product: ProductsWithVariantsAndImages;
};

const SingleProduct = ({ product }: SingleProductProps) => {
  const [activeVariant, setActiveVariant] = useState(product.variants[0]);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, cart } = useCartStore();

  const addToCartHandler = () => {
    if (product) {
      addToCart({
        id: product.id,
        name: product.title as string,
        image: activeVariant.variantImages[0].imageUrl,
        price: product.price as number,
        variant: {
          id: activeVariant.id,
          quantity: quantity,
        },
      });
    }
  };

  return (
    <div className=" grid grid-cols-1 sm:grid-cols-2 sm:mt-5 gap-10 justify-items-center px-3">
      <ImagesSlider images={activeVariant.variantImages} />
      <div className=" flex flex-col sm:mt-5 md:mt-10 gap-2">
        <h1 className=" text-5xl font-semibold">{product?.title}</h1>
        <p className=" mt-4">
          Color: <span className="font-bold">{activeVariant?.productType}</span>
        </p>
        <div className=" flex gap-2 mt-2">
          {product?.variants.map((variant) => (
            <div key={variant.id}>
              <Circle
                onClick={() => setActiveVariant(variant)}
                fill={variant.color}
                stroke={variant.color}
                className={cn("w-7 h-7  rounded-full", {
                  "ring-primary ring-2 ring-offset-1":
                    variant.id === activeVariant?.id,
                })}
              />
            </div>
          ))}
        </div>
        <p className=" mt-4 font-semibold text-xl">
          {formatCurrency(product?.price!)}
        </p>
        <AdjustQuantityButton quantity={quantity} setQuantity={setQuantity} />
        <Button onClick={addToCartHandler} className=" mt-5">
          <ShoppingCart />
          Add to cart
        </Button>
        <h3 className=" font-semibold text-sm mt-5">Description</h3>
        <div
          className="text-muted-foreground mt-2"
          dangerouslySetInnerHTML={{ __html: product?.description! }}
        />
      </div>
    </div>
  );
};

export default SingleProduct;
