"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import Image from "next/image";
import { ArrowUpDown, Circle, CirclePlus, MoreHorizontal } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import { deleteProductById } from "@/db/actions/product-actions";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { deleteProductSchema } from "@/types/product-schema";
import VariantDialog from "@/components/products/variant-dialog";
import { VariantsWithImagesTags } from "@/lib/infer-types";

export type Product = {
  id: string;
  title: string;
  price: number;
  image: string;
  variants: any;
};

const ActionCell = ({ row }: { row: Row<Product> }) => {
  const { execute, status } = useAction(deleteProductById, {
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

  const product = row.original;
  const handleDelete = () => {
    const id = product.id;
    const parseValue = deleteProductSchema.parse({ id });
    execute(parseValue);
  };

  return (
    <div>
      <AlertDialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem className="cursor-pointer focus:bg-primary/20 text-primary focus:text-primary">
              <Link href={`/dashboard/create-product?id=${product.id}`}>
                Edit Product
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem
              asChild
              className="cursor-pointer focus:bg-destructive/20 text-destructive focus:text-destructive"
            >
              <AlertDialogTrigger>Delete Product</AlertDialogTrigger>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <AlertDialogContent className="rounded-lg w-11/12">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              product and remove your data from our servers.
            </AlertDialogDescription>
            <div className="pt-2 pb-3">
              Product Title : <b>{product.title}</b>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="focus-visible:ring-0">
              Cancle
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90 focus-visible:ring-0"
              asChild
            >
              <Button disabled={status === "executing"} onClick={handleDelete}>
                Delete
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      let id = row.index;
      return <div className="font-medium text-sm">{++id}</div>;
    },
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const title = row.getValue("title") as string;
      return <div className="font-medium text-sm pl-4">{title}</div>;
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(price);

      return (
        <div className="font-medium text-xs text-left pl-4">{formatted}</div>
      );
    },
  },
  {
    accessorKey: "variants",
    header: "Variants",
    cell: ({ row }) => {
      const variants = row.getValue("variants") as VariantsWithImagesTags[];

      return (
        <div className="flex gap-1">
          <VariantDialog editMode={false} productId={row.original.id}>
            <CirclePlus className="h-5 w-5 text-muted-foreground hover:cursor-pointer hover:text-black transition-all duration-100" />
          </VariantDialog>
          {variants.map((variant) => (
            <div key={variant.id}>
              <VariantDialog
                editMode={true}
                variant={variant}
                productId={row.original.id}
              >
                <Circle
                  fill={variant.color}
                  stroke={variant.color}
                  className="h-5 w-5"
                />
              </VariantDialog>
            </div>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      const image = row.getValue("image") as string;
      const title = row.getValue("title") as string;
      return (
        <div className="w-12 h-12 overflow-hidden flex items-center">
          <Image
            width={40}
            height={40}
            src={image}
            alt={title}
            className="rounded-md w-auto h-auto object-cover"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return <ActionCell row={row} />;
    },
  },
];
