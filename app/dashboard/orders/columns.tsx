"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import Image from "next/image";
import { ArrowDownIcon, ArrowUpDown, Circle } from "lucide-react";
import React from "react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
import { OrdersWithUsersAndOrderProducts } from "@/lib/infer-types";
import { formatCurrency } from "@/lib/formatCurrency";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { updateOrderStatus } from "@/db/actions/order-action";
import { updateOrderStatusSchema } from "@/types/order-schema";
import { useSession } from "next-auth/react";

export type Orders = OrdersWithUsersAndOrderProducts;

const ActionCell = ({ row }: { row: Row<Orders> }) => {
  const order = row.original;

  return (
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
                <TableHead className="text-center">Image</TableHead>
                <TableHead className="text-center">Variant</TableHead>
                <TableHead className="text-center">Quantity</TableHead>
                <TableHead className="text-center">Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.orderProduct.map((orderProduct, index) => (
                <TableRow key={index}>
                  <TableCell>{orderProduct.product.title}</TableCell>
                  <TableCell className="text-center">
                    <Image
                      src={orderProduct.variant.variantImages[0].imageUrl}
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
                          <p>{orderProduct.variant.productType}</p>
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
  );
};

export const columns: ColumnDef<Orders>[] = [
  {
    header: "ID",
    cell: ({ row }) => {
      let id = row.index;
      return <div className="font-medium text-sm">{++id}</div>;
    },
  },
  {
    accessorKey: "id",
    header: () => (
      <div className="font-medium text-sm text-center">Order ID</div>
    ),
    cell: ({ row }) => {
      const orderId = row.getValue("id") as string;
      return <div className="font-medium text-sm text-center">{orderId}</div>;
    },
  },
  {
    accessorKey: "total",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const total = row.getValue("total") as number;
      return (
        <div className="font-medium text-sm pl-4">
          {formatCurrency(total / 100)}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => <div className="font-medium text-sm text-center">Status</div>,
    cell: ({ row }) => {
      const OrderStatus = row.getValue("status") as string;
      const session = useSession();

      const { execute } = useAction(updateOrderStatus, {
        onSuccess: ({ data }: any) => {
          if (data?.success) {
            toast.success(data?.success.message, {
              description: data?.success.description,
            });
          }
          if (data?.error) {
            toast.error(data?.error.message, {
              description: data?.error.description,
            });
          }
        },
      });

      const handleOrderStatus = (status: string) => {
        const orderId = row.getValue("id") as string;
        const parseValue = updateOrderStatusSchema.parse({ orderId, status });
        execute(parseValue);
      };

      return (
        <div className="flex justify-center items-center">
          {session?.data?.user?.role === "admin" ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Badge
                  className={cn(
                    OrderStatus === "pending" &&
                      "bg-yellow-500 hover:bg-yellow-500/80",
                    OrderStatus === "completed" &&
                      "bg-green-500 hover:bg-green-500/80",
                    OrderStatus === "cancelled" &&
                      "bg-red-500 hover:bg-red-500/80",
                    "cursor-pointer"
                  )}
                >
                  {OrderStatus}
                </Badge>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  className="focus:text-yellow-500 text-yellow-500"
                  onClick={() => handleOrderStatus("pending")}
                >
                  Pending
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-green-500 focus:text-green-500"
                  onClick={() => handleOrderStatus("completed")}
                >
                  Completed
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-500 focus:text-red-500"
                  onClick={() => handleOrderStatus("cancelled")}
                >
                  Cancelled
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Badge
              className={cn(
                OrderStatus === "pending" &&
                  "bg-yellow-500 hover:bg-yellow-500/80",
                OrderStatus === "completed" &&
                  "bg-green-500 hover:bg-green-500/80",
                OrderStatus === "cancelled" && "bg-red-500 hover:bg-red-500/80"
              )}
            >
              {OrderStatus}
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: () => (
      <div className="font-medium text-sm text-center">Ordered On</div>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt") as string);
      const orderedDate = format(date, "dd/MM/yyyy hh:mm a");
      return (
        <div className="font-medium text-sm text-center">{orderedDate}</div>
      );
    },
  },
  {
    accessorKey: "actions",
    header: () => (
      <div className="font-medium text-sm text-center">Actions</div>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-center">
          <ActionCell row={row} />
        </div>
      );
    },
  },
];
