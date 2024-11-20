import PendingCard from "@/components/PendingCard";
import { getAllPendingBookings } from "@/lib/actions/booking.action";
import { Loader } from "lucide-react";
import React from "react";

export type PendingBookingType = {
  booking_id: string;
  date: string;
  start_time: string;
  end_time: string;
  package_name: string;
  customer: {
    customer_id: string;
    name: string;
    email: string;
    phone: string;
  };
};
export const dynamic = "force-dynamic";
const Page = async () => {
  const pendingBookings = await getAllPendingBookings();
  if (!pendingBookings) {
    return (
      <div className="animate-spin">
        <Loader />
      </div>
    );
  } else if (!Array.isArray(pendingBookings)) {
    return <div className="text-xl text-red-500">{pendingBookings.error}</div>;
  } else {
    if (pendingBookings.length === 0)
      return (
        <div className="flex text-lg w-full h-[80vh] items-center justify-center">
          <p>No pending bookings</p>
        </div>
      );

    return (
      <div className=" mx-5 md:mx-20 md:my-10 my-5">
        <h1 className="text-xl font-semibold">Pending Bookings</h1>
        <p>Here you can see all pending bookings</p>
        <div className="mt-10 space-y-8">
          {pendingBookings.map((booking) => (
            <PendingCard key={booking.booking_id} booking={booking} />
          ))}
        </div>
      </div>
    );
  }
};

export default Page;
