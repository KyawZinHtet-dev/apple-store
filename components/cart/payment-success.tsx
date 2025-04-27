import { PartyPopper } from "lucide-react";
import { Button } from "../ui/button";
import { useEffect } from "react";
import { useCartStore } from "@/store/cart-store";
import { redirect } from "next/navigation";
import confetti from "canvas-confetti";

const PaymentSuccess = () => {
  const { setCartStatus } = useCartStore();

  const fireConfetti = () => {
    const end = Date.now() + 3 * 1000; // 3 seconds
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

    const frame = () => {
      if (Date.now() > end) return;

      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors: colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors: colors,
      });

      requestAnimationFrame(frame);
    };
    frame();
  };

  useEffect(() => {
    fireConfetti();
    setTimeout(() => {
      setCartStatus("Order");
    }, 5000);
  }, []);

  return (
    <div className=" my-10 text-center">
      <div className=" flex justify-center items-center mb-5">
        <PartyPopper size={44} className=" animate-bounce" />
      </div>
      <h2 className=" text-3xl font-bold mb-4">Your payment was successful</h2>
      <p className=" text-xl font-medium text-muted-foreground">
        Thank you for your payment.
      </p>
      <Button onClick={() => redirect("/dashboard/orders")} className=" mt-5">
        View Orders
      </Button>
    </div>
  );
};

export default PaymentSuccess;
