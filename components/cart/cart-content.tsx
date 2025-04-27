import { useCartStore } from "@/store/cart-store";

import CartTable from "./cart-table";
import StripePayment from "./stripe-payment";
import PaymentSuccess from "./payment-success";

const CartContent = () => {
  const { cartStatus } = useCartStore();
  return (
    <div>
      {cartStatus === "Order" && <CartTable />}
      {cartStatus === "Payment" && <StripePayment />}
      {cartStatus === "Success" && <PaymentSuccess />}
    </div>
  );
};

export default CartContent;
