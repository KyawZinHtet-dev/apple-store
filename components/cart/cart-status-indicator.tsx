import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import { Handshake, Minus, ShoppingCart, Wallet } from "lucide-react";

const CartStatusIndicator = () => {
  const { cartStatus, setCartStatus } = useCartStore();

  return (
    <div className="flex gap-2 justify-around items-center my-2">
      <ShoppingCart
        onClick={() => setCartStatus("Order")}
        className={cn(
          " cursor-pointer",
          cartStatus === "Order" ||
            cartStatus === "Payment" ||
            cartStatus === "Success"
            ? "text-primary"
            : ""
        )}
      />
      <Minus
        className={cn(
          cartStatus === "Payment" || cartStatus === "Success"
            ? "text-primary"
            : ""
        )}
      />
      <Wallet
        onClick={() => setCartStatus("Payment")}
        className={cn(
          " cursor-pointer",
          cartStatus === "Payment" || cartStatus === "Success"
            ? "text-primary"
            : ""
        )}
      />
      <Minus className={cn(cartStatus === "Success" && "text-primary")} />
      <Handshake
        className={cn(
          " cursor-pointer",
          cartStatus === "Success" && "text-primary"
        )}
      />
    </div>
  );
};

export default CartStatusIndicator;
