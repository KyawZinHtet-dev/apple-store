import { CartItem } from "@/store/cart-store";
type TotalPriceProps = { cart: CartItem[] };
export const totalPrice = ({ cart }: TotalPriceProps) => {
  return cart.reduce(
    (iValue, item) => iValue + item.price * item.variant.quantity,
    0
  );
};
