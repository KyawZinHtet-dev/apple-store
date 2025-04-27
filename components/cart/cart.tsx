"use client";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import usePrevious from "@/hooks/usePrevious";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import CartContent from "./cart-content";
import CartStatusIndicator from "./cart-status-indicator";

const Cart = () => {
  const { cart, setCartStatus, cartStatus } = useCartStore();
  const previousCart = usePrevious(cart);
  const [isAnimate, setIsAnimate] = useState(false);

  useEffect(() => {
    if (cart.length > previousCart.length) {
      // cart length increased, wiggle the icon
      setIsAnimate(true);
      setTimeout(() => setIsAnimate(false), 500);
    } else if (cart.length === previousCart.length) {
      // cart length didn't change, but quantity might have
      const currentQuantity = cart.reduce(
        (acc, item) => acc + item.variant.quantity,
        0
      );
      const previousQuantity = previousCart.reduce(
        (acc, item) => acc + item.variant.quantity,
        0
      );
      if (currentQuantity > previousQuantity) {
        // cart quantity increased, wiggle the icon
        setIsAnimate(true);
        setTimeout(() => setIsAnimate(false), 500);
      }
    }
  }, [cart, previousCart]);

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <div className=" relative">
          <ShoppingCart
            className={cn(isAnimate && "animate-wiggle", " cursor-pointer")}
            strokeWidth={2}
            size={24}
          />
          <span className=" absolute -top-3 -right-3 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center">
            {cart.length}
          </span>
        </div>
      </DrawerTrigger>
      <DrawerContent className=" max-w-screen-lg mx-auto">
        <DrawerHeader className="w-2/3 mx-auto">
          <DrawerTitle className=" text-center">Your Cart</DrawerTitle>
          <DrawerDescription className=" text-center">
            You can make changes and buy your items here.
          </DrawerDescription>
          <CartStatusIndicator />
        </DrawerHeader>
        <CartContent />
        <DrawerFooter>
          {cart.length > 0 && cartStatus === "Order" && (
            <Button
              onClick={() => setCartStatus("Payment")}
              className=" w-full sm:w-2/3 mx-auto"
            >
              Order
            </Button>
          )}
          <DrawerClose asChild>
            <Button variant={"outline"} className=" w-full sm:w-2/3 mx-auto">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default Cart;
