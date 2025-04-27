"use server";
import { stripePaymentSchema } from "@/types/stripe-payment-schema";
import { actionClient } from "./safe-action";
import { auth } from "@/auth";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const stripePayment = actionClient
  .schema(stripePaymentSchema)
  .action(async ({ parsedInput: { amount, currency, cart } }) => {
    const user = await auth();
    if (!user) return { error: { message: "Login required to checkout" } };
    if (!amount) return { error: { message: "No products in cart" } };
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: { enabled: true, allow_redirects: "always" },
      metadata: { cart: JSON.stringify(cart).substring(0, 500) },
    });

    return {
      success: {
        message: "Payment successful",
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
        userEmail: user.user.email,
      },
    };
  });
