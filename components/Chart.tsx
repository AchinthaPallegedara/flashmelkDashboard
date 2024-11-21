"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

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

// Calculate trending percentage
interface DataPoint {
  month: string;
  year: number;
  desktop: number;
}

interface TrendingResult {
  percentage: number;
  trending: "up" | "down";
}

const calculateTrending = (data: DataPoint[]): TrendingResult => {
  if (data.length < 2) return { percentage: 0, trending: "up" };
  const currentMonth = data[data.length - 1].desktop;
  const previousMonth = data[data.length - 2].desktop;
  const percentage =
    previousMonth === 0
      ? 100
      : parseFloat(
          (((currentMonth - previousMonth) / previousMonth) * 100).toFixed(1)
        );
  return {
    percentage: Math.abs(percentage),
    trending: percentage >= 0 ? "up" : "down",
  };
};

const chartConfig = {
  desktop: {
    label: "Bookings",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

interface BookingChartProps {
  data: Array<{
    month: string;
    year: number;
    desktop: number;
  }>;
}

export function ChartComponent({ data }: BookingChartProps) {
  const hasData = data.some((point) => point.desktop > 0);
  const { percentage, trending } = calculateTrending(data);
  const dateRange = data.length
    ? `${data[0].month} ${data[0].year} - ${data[data.length - 1].month} ${
        data[data.length - 1].year
      }`
    : "";

  if (!hasData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Booking Chart</CardTitle>
          <CardDescription>
            Show the booking trend for the last 6 months
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center min-h-[300px] text-muted-foreground">
          Not enough data to display the chart
        </CardContent>
        <CardFooter>
          <div className="flex w-full items-start gap-2 text-sm">
            <div className="grid gap-2">
              <div className="flex items-center gap-2 leading-none text-muted-foreground">
                No booking data available for this period
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Booking Chart</CardTitle>
        <CardDescription>
          Show the booking trend for the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="desktop"
              type="natural"
              fill="var(--color-desktop)"
              fillOpacity={0.4}
              stroke="var(--color-desktop)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending {trending} by {percentage}% this month{" "}
              {trending === "up" ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              {dateRange}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
