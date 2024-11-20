import { PackageStatsChart } from "@/components/Barchart";
import { ChartComponent } from "@/components/Chart";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  getBookingStats,
  getDashboardStats,
  getPackageBookingStats,
} from "@/lib/actions/booking.action";
import { CalendarDays, Users, BarChart, CalendarRange } from "lucide-react";
import React from "react";

const Home = async () => {
  const bookingData = await getBookingStats();
  const packageStats = await getPackageBookingStats();
  const dashboardData = await getDashboardStats();
  return (
    <div className="md:mx-20 mt-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Booking</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.nextBooking?.date}
            </div>
            <p className="text-xs text-muted-foreground">
              {dashboardData.nextBooking?.time},{" "}
              {dashboardData.nextBooking?.package}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Bookings
            </CardTitle>
            <CalendarRange className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.activeBookings.count}
            </div>
            <p className="text-xs text-muted-foreground">
              {dashboardData.activeBookings.change} from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.newClients.count}
            </div>
            <p className="text-xs text-muted-foreground">
              {dashboardData.newClients.change} from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Bookings
            </CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.totalBookings.count}
            </div>
            <p className="text-xs text-muted-foreground">
              {dashboardData.totalBookings.change} from last month
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
        <ChartComponent data={bookingData} />
        <PackageStatsChart data={packageStats} />
      </div>
    </div>
  );
};

export default Home;
