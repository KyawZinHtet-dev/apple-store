"use client";

import { Button } from "../ui/button";
import { Minus, Plus } from "lucide-react";

const AdjustQuantityButton = ({ quantity, setQuantity }) => {
  return (
    <div className="flex items-center w-full justify-between mt-4 gap-3 ">
      <Button
        disabled={quantity === 1}
        onClick={() => quantity > 1 && setQuantity((prev) => prev - 1)}
      >
        <Minus />
      </Button>
      <div className="font-semibold text-lg w-full text-center bg-slate-100 rounded-md py-1">
        Quantity: <span className=" font-bold">{quantity}</span>
      </div>
      <Button onClick={() => setQuantity((prev) => prev + 1)}>
        <Plus />
      </Button>
    </div>
  );
};

export default AdjustQuantityButton;
