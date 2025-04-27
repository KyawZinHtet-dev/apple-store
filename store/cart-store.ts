import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Variant = {
  id: string;
  quantity: number;
};
export type CartItem = {
  id: string;
  name: string;
  image: string;
  price: number;
  variant: Variant;
};
type CartStore = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeItem: (id: string, variantId: string) => void;
  reduceQuantity: (id: string, variantId: string) => void;
  increaseQuantity: (id: string, variantId: string) => void;
  cartStatus: "Order" | "Payment" | "Success";
  setCartStatus: (status: "Order" | "Payment" | "Success") => void;
  clearCart: () => void;
};

export const useCartStore = create(
  persist<CartStore>(
    (set) => ({
      cart: [],
      cartStatus: "Order",
      addToCart: (item) =>
        set((state) => {
          const existingItem = state.cart.find(
            (i) => i.variant.id === item.variant.id
          );
          if (existingItem) {
            return {
              cart: state.cart.map((i) =>
                i.variant.id === item.variant.id
                  ? {
                      ...i,
                      variant: {
                        ...i.variant,
                        quantity: i.variant.quantity + item.variant.quantity,
                      },
                    }
                  : i
              ),
            };
          }

          return {
            cart: [
              ...state.cart,
              {
                ...item,
                variant: { ...item.variant, quantity: item.variant.quantity },
              },
            ],
          };
        }),
      reduceQuantity: (id, variantId) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === id && item.variant.id === variantId
              ? {
                  ...item,
                  variant: {
                    ...item.variant,
                    quantity:
                      item.variant.quantity > 1 ? item.variant.quantity - 1 : 1,
                  },
                }
              : item
          ),
        })),
      increaseQuantity: (id, variantId) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === id && item.variant.id === variantId
              ? {
                  ...item,
                  variant: {
                    ...item.variant,
                    quantity: item.variant.quantity + 1,
                  },
                }
              : item
          ),
        })),
      removeItem: (id, variantId) =>
        set((state) => ({
          cart: state.cart.filter(
            (item) => item.id !== id || item.variant.id !== variantId
          ),
        })),
      setCartStatus(status) {
        set({ cartStatus: status });
      },
      clearCart: () => set({ cart: [] }),
    }),
    { name: "cart-store" }
  )
);
