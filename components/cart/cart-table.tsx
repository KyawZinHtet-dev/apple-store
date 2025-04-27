import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/formatCurrency";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import Image from "next/image";
import { totalPrice } from "@/lib/total-price";
import EmptyCart from "@/public/empty_cart.png";
const CartTable = () => {
  const { removeItem, reduceQuantity, increaseQuantity, cart } = useCartStore();
  const total = totalPrice({ cart });
  return (
    <div className=" sm:w-2/3 mx-auto max-h-[50vh] overflow-y-auto">
      {cart.length === 0 ? (
        <div>
          <p className=" text-center font-semibold text-destructive">
            Your cart is empty!
          </p>
          <Image
            width={300}
            height={300}
            src={EmptyCart}
            alt="empty cart"
            className=" mx-auto"
          />
        </div>
      ) : (
        <Table>
          <TableCaption>A list of your recent cart items.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className=" w-[100px]">Name</TableHead>
              <TableHead className=" w-[100px] text-center">Image</TableHead>
              <TableHead className=" w-[100px] text-center">Quantity</TableHead>
              <TableHead className=" w-[100px] text-center">Price</TableHead>
              <TableHead className=" w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cart.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>
                  <Image
                    priority
                    className=" mx-auto"
                    width={50}
                    height={50}
                    src={item.image}
                    alt={item.name}
                  />
                </TableCell>
                <TableCell className="text-center">
                  <div className=" flex gap-2 justify-center items-center">
                    <Button
                      disabled={item.variant.quantity === 1}
                      size={"sm"}
                      onClick={() => reduceQuantity(item.id, item.variant.id)}
                    >
                      <Minus />
                    </Button>
                    <span className="text-center w-5">
                      {item.variant.quantity}
                    </span>
                    <Button
                      size={"sm"}
                      onClick={() => increaseQuantity(item.id, item.variant.id)}
                    >
                      <Plus />
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  {formatCurrency(item.price)}
                </TableCell>
                <TableCell>
                  <div className=" flex justify-end items-center">
                    <Trash2
                      onClick={() => removeItem(item.id, item.variant.id)}
                      className=" mr-2 text-destructive hover:text-destructive/80 hover:cursor-pointer hover:scale-110 duration-200"
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-center">
                {formatCurrency(total)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      )}
    </div>
  );
};

export default CartTable;
