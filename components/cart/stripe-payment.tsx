"use client";
import { useCartStore } from "@/store/cart-store";
import { totalPrice } from "@/lib/total-price";
import { Elements } from "@stripe/react-stripe-js";
import stripeInit from "@/lib/stripe-init";
import StripePaymentForm from "./stripe-payment-form";
import { useEffect } from "react";

const stripePromise = stripeInit();

const StripePayment = () => {
  const { cart, setCartStatus } = useCartStore();
  const total = totalPrice({ cart }) * 100;

  useEffect(() => {
    if (cart.length === 0) {
      setCartStatus("Order");
    }
  }, []);

  return (
    <div className="px-4 sm:w-2/3 mx-auto">
      <Elements
        stripe={stripePromise!}
        options={{ mode: "payment", currency: "usd", amount: total }}
      >
        <StripePaymentForm />
      </Elements>
    </div>
  );
};

export default StripePayment;
