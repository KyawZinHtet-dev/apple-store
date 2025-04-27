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

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/db/db_connection";
import { formatCurrency } from "@/lib/formatCurrency";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import Image from "next/image";
import { Circle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Orders = async () => {
  const session = await auth();
  if (!session) return redirect("/");

  const orders = await db.query.orders.findMany({
    where: (orders, { eq }) => eq(orders.userId, session.user.id),
    with: {
      orderProduct: {
        with: {
          product: true,
          variant: {
            with: {
              variantImages: true,
            },
          },
          order: true,
        },
      },
    },
    orderBy: (orders, { desc }) => [desc(orders.createdAt)],
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders</CardTitle>
        <CardDescription>
          You can check your orders and status here.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>A list of your recent orders.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Order ID</TableHead>
              <TableHead className="text-center">Total</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Ordered On</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell className="text-center font-medium">
                  {formatCurrency(order.total / 100)}
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    className={cn(
                      order.status === "pending" &&
                        "bg-yellow-500 hover:bg-yellow-500/80",
                      order.status === "completed" &&
                        "bg-green-500 hover:bg-green-500/80",
                      order.status === "cancelled" &&
                        "bg-red-500 hover:bg-red-500/80"
                    )}
                  >
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  {order.createdAt?.toLocaleString()}
                </TableCell>
                <TableCell className="text-center">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">View Details</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] w-11/12 rounded-md">
                      <DialogHeader>
                        <DialogTitle className="flex items-center justify-between mr-2">
                          <p>Order Details</p>
                          <span
                            className={cn(
                              order.status === "pending" && "text-yellow-500",
                              order.status === "completed" && "text-green-500",
                              order.status === "cancelled" && "text-red-500",
                              "text-xs font-semibold tracking-widest"
                            )}
                          >
                            {order.status}
                          </span>
                        </DialogTitle>
                        <DialogDescription className="text-left">
                          You can check your order details here.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto">
                        <Table>
                          <TableCaption>
                            <strong>Order ID:</strong> {order.id}
                          </TableCaption>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Product</TableHead>
                              <TableHead className="text-center">
                                Image
                              </TableHead>
                              <TableHead className="text-center">
                                Variant
                              </TableHead>
                              <TableHead className="text-center">
                                Quantity
                              </TableHead>
                              <TableHead className="text-center">
                                Price
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {order.orderProduct.map((orderProduct, index) => (
                              <TableRow key={index}>
                                <TableCell>
                                  {orderProduct.product.title}
                                </TableCell>
                                <TableCell className="text-center">
                                  <Image
                                    src={
                                      orderProduct.variant.variantImages[0]
                                        .imageUrl
                                    }
                                    alt={orderProduct.product.title!}
                                    width={50}
                                    height={50}
                                  />
                                </TableCell>
                                <TableCell className="text-center">
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Circle
                                          fill={orderProduct.variant.color}
                                          color={orderProduct.variant.color}
                                          className=" mx-auto"
                                        />
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>
                                          {orderProduct.variant.productType}
                                        </p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </TableCell>
                                <TableCell className="text-center">
                                  {orderProduct.quantity}
                                </TableCell>
                                <TableCell className="text-center font-medium">
                                  {formatCurrency(orderProduct.product.price!)}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                          <TableFooter>
                            <TableRow>
                              <TableCell colSpan={4}>Total</TableCell>
                              <TableCell className="text-center">
                                {formatCurrency(order.total / 100)}
                              </TableCell>
                            </TableRow>
                          </TableFooter>
                        </Table>
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant={"outline"} className=" w-full ">
                            Close
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
export default Orders;
