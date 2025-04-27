"use server";

import { db } from "../db_connection";
import { format, subDays } from "date-fns";

export const analytics = async () => {
  try {
    const pendingOrders = await db.query.orders.findMany({
      where: (orders, { eq }) => eq(orders.status, "pending"),
    });

    const completedOrders = await db.query.orders.findMany({
      where: (orders, { eq }) => eq(orders.status, "completed"),
    });

    const totalUsers = await db.query.users.findMany();

    const totalProducts = await db.query.products.findMany();

    return {
      pendingOrders: pendingOrders.length,
      completedOrders: completedOrders.length,
      totalUsers: totalUsers.length,
      totalProducts: totalProducts.length,
    };
  } catch (error) {}
};

export const weeklyOrders = async () => {
  try {
    const currentDate = new Date();
    const days = Array.from({ length: 7 }, (_, i) =>
      format(subDays(currentDate, i), "yyyy-MM-dd")
    ).reverse();

    const datas = await Promise.all(
      days.map(async (day) => {
        const startDate = new Date(day);
        const endDate = new Date(day);
        endDate.setDate(startDate.getDate() + 1);

        const orders = await db.query.orders.findMany({
          where: (orders, { and, gte, lte }) =>
            and(
              gte(orders.createdAt, startDate),
              lte(orders.createdAt, endDate)
            ),
        });
        return orders.length;
      })
    );

    return days.map((day, i) => ({ day, orders: datas[i] }));
  } catch (error) {
    console.error(error);
    throw error; // or return a more informative error message
  }
};

export const lastWeekOrders = async () => {
  try {
    const lastWeek = await db.query.orders.findMany({
      where: (orders, { and, lte, gte }) =>
        and(
          gte(
            orders.createdAt,
            new Date(new Date().getTime() - 14 * 24 * 60 * 60 * 1000)
          ),
          lte(
            orders.createdAt,
            new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)
          )
        ),
    });
    return lastWeek.length;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
