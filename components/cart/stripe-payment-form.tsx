"use client";
import { useCartStore } from "@/store/cart-store";
import { totalPrice } from "@/lib/total-price";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "../ui/button";
import { useAction } from "next-safe-action/hooks";
import { stripePayment } from "@/db/actions/stripe-payment-action";
import { toast } from "sonner";
import { stripePaymentSchema } from "@/types/stripe-payment-schema";
import { useState } from "react";
import { createOrder } from "@/db/actions/order-action";
import { orderSchema } from "@/types/order-schema";
const StripePaymentForm = () => {
  const { cart, setCartStatus, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const total = totalPrice({ cart }) * 100;
  const stripe = useStripe();
  const elements = useElements();

  const { execute } = useAction(createOrder, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        setCartStatus("Success");
        clearCart();
        toast.success(data?.success.message, {
          description: data?.success.description,
        });
      }
      if (data?.error) {
        toast.error(data?.error.message);
      }
    },
  });

  const onSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!stripe || !elements) {
      setLoading(false);
      return;
    }
    const { error: submitError } = await elements.submit();
    if (submitError) {
      toast.error(submitError.message);
      setLoading(false);
      return;
    }

    const response = await stripePayment(
      stripePaymentSchema.parse({
        amount: total,
        currency: "usd",
        cart: cart.map((item) => ({
          quantity: item.variant.quantity,
          price: item.price,
          productId: item.id,
          variantId: item.variant.id,
          image: item.image,
        })),
      })
    );

    if (response?.data?.error) {
      toast.error(response?.data?.error.message);
      setLoading(false);
      return;
    }

    if (response?.data?.success) {
      const paymentResponse = await stripe.confirmPayment({
        elements,
        clientSecret: response.data.success.clientSecret!,
        redirect: "if_required",
        confirmParams: {
          return_url: "http://localhost:3000/payment/success",
          receipt_email: response.data.success.userEmail!,
        },
      });

      if (paymentResponse.error) {
        toast.error(paymentResponse.error.message);
        setLoading(false);
        return;
      } else {
        execute(
          orderSchema.parse({
            totalPrice: total,
            status: "pending",
            paymentId: response.data.success.paymentIntentId,
            products: cart.map((item) => ({
              productId: item.id,
              variantId: item.variant.id,
              quantity: item.variant.quantity,
            })),
          })
        );
        setLoading(false);
      }
    }
  };

  return (
    <form onSubmit={onSubmitHandler}>
      <PaymentElement />
      <Button
        className=" w-full mt-3"
        type="submit"
        disabled={!stripe || !elements || loading}
      >
        Pay
      </Button>
    </form>
  );
};

export default StripePaymentForm;
