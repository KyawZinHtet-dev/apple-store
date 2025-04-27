import React from "react";
import {
  analytics,
  lastWeekOrders,
  weeklyOrders,
} from "@/db/actions/analytics-action";
import AnalyticsCard from "@/components/analytics/analytics-card";
import { Handshake, Hourglass, ShoppingBag, Users } from "lucide-react";
import { AnalyticsChart } from "@/components/analytics/analytics-chart";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const Analytics = async () => {
  const session = await auth();
  if (!session) return redirect("/");
  if (session.user.role !== "admin") return redirect("/404");

  const analyticsData = await analytics();
  const { pendingOrders, completedOrders, totalUsers, totalProducts } =
    analyticsData!;

  const weeklyOrdersData = await weeklyOrders();
  const lastWeekOrdersData = await lastWeekOrders();

  return (
    <div>
      <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 mb-5 gap-4 min-[400px]:grid-cols-2">
        <AnalyticsCard
          count={pendingOrders}
          icon={<Hourglass size={16} className="text-muted-foreground" />}
          title="Pending Orders"
        />
        <AnalyticsCard
          count={completedOrders}
          icon={<Handshake size={16} className="text-muted-foreground" />}
          title="Completed Orders"
        />
        <AnalyticsCard
          count={totalUsers}
          icon={<Users size={16} className="text-muted-foreground" />}
          title="Total Users"
        />
        <AnalyticsCard
          count={totalProducts}
          icon={<ShoppingBag size={16} className="text-muted-foreground" />}
          title="Total Products"
        />
      </div>
      <AnalyticsChart
        chartData={weeklyOrdersData}
        lastWeekOrdersData={lastWeekOrdersData}
      />
    </div>
  );
};
export default Analytics;
