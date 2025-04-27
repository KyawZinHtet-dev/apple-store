"use client";

import { TrendingUp } from "lucide-react";
import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

type AnalyticsChartProps = {
  chartData: { day: string; orders: number }[];
  lastWeekOrdersData: number;
};

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export const AnalyticsChart = ({
  chartData,
  lastWeekOrdersData,
}: AnalyticsChartProps) => {
  const totalOrdersOfThisWeek = chartData.reduce((iv, i) => iv + i.orders, 0);

  const percentage =
    ((totalOrdersOfThisWeek - lastWeekOrdersData) / lastWeekOrdersData) * 100;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders - Chart</CardTitle>
        <CardDescription>
          {chartData[0].day} - {chartData[chartData.length - 1].day}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="max-h-[250px] w-full" config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 24,
              bottom: 24,
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(8)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              dataKey="orders"
              type="natural"
              stroke="var(--color-desktop)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-desktop)",
              }}
              activeDot={{
                r: 6,
              }}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by {percentage.toFixed()}% this week
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total orders for the last 7 days
        </div>
      </CardFooter>
    </Card>
  );
};
