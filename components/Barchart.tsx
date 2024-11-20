"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
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

interface PackageStats {
  package: string;
  bookings: number;
}

interface PackageStatsChartProps {
  data: PackageStats[];
}

const chartConfig = {
  bookings: {
    label: "Bookings",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function PackageStatsChart({ data }: PackageStatsChartProps) {
  // Calculate total bookings for comparison
  const totalBookings = data.reduce((sum, item) => sum + item.bookings, 0);

  // Find the most popular package
  const mostPopular = data.reduce(
    (max, item) => (item.bookings > max.bookings ? item : max),
    data[0]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Package Bookings Statistics</CardTitle>
        <CardDescription>Total Bookings Distribution</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="package"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis tickLine={false} tickMargin={10} axisLine={false} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar
              dataKey="bookings"
              fill="var(--color-desktop)"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Most popular: {mostPopular.package} (
          {Math.round((mostPopular.bookings / totalBookings) * 100)}% of
          bookings)
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Total bookings: {totalBookings}
        </div>
      </CardFooter>
    </Card>
  );
}
