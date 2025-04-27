import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/db/db_connection";
import { OrderTable } from "./order-table";
import { columns } from "./columns";
import { SessionProvider } from "next-auth/react";

const Orders = async () => {
  const session = await auth();
  if (!session) return redirect("/");

  const orders = await db.query.orders.findMany({
    where: (orders, { eq, sql }) => {
      if (session.user.role === "admin") return sql`true`;
      return eq(orders.userId, session.user.id);
    },
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
    orderBy: (orders, { desc }) => [desc(orders.updatedAt)],
  });

  return (
    <div>
      <SessionProvider session={session}>
        <OrderTable data={orders} columns={columns} />
      </SessionProvider>
    </div>
  );
};
export default Orders;
