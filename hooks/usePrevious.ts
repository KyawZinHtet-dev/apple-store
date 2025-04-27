import { useState, useEffect } from "react";
import { CartItem } from "@/store/cart-store";

const usePrevious = (value: CartItem[]) => {
  const [previousValue, setPreviousValue] = useState(value);

  useEffect(() => {
    setPreviousValue(value);
  }, [value]);

  return previousValue;
};

export default usePrevious;
