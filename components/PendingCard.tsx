"use client";
import React, { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Check, Mail, Phone, User, X } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { PendingBookingType } from "@/app/(Dashboard)/bookings/pending/page";
import {
  approveBooking,
  deletePandingBooking,
} from "@/lib/actions/booking.action";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function parsePackageName(packageName: string): {
  session: string;
  type: string;
} {
  const [type, level] = packageName.split("-") as [string, string];

  const typeDescription =
    type === "P"
      ? "Photo"
      : type === "V"
      ? "Video"
      : type === "C"
      ? "CYC Wall"
      : "Session";
  const sessionDescription = `${capitalize(level)} Session`;

  return { session: sessionDescription, type: typeDescription };
}

function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);

  // Array of weekday and month names for formatting
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Extract date components
  const dayOfWeek = days[date.getDay()];
  const dayOfMonth = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  // Format as "Thursday(20), November 20, 2024"
  return `${dayOfWeek}, ${month} ${dayOfMonth}, ${year}`;
}

const PendingCard = ({ booking }: { booking: PendingBookingType }) => {
  const packageDetails = parsePackageName(booking.package_name);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleApproveBooking = async (id: string) => {
    await setLoading(true);
    try {
      approveBooking(id);
      router.refresh();
      toast.success("Booking approved");
      return;
    } catch (error) {
      toast.error("Error approving booking");
      console.error("Error approving booking", error);
    } finally {
      setLoading(false);
    }
  };
  const handleDisapproveBooking = async (id: string) => {
    setLoading(true);
    try {
      await deletePandingBooking(id);
      router.refresh();
      toast.success("Booking rejected");
      return;
    } catch (error) {
      toast.error("Error approving booking");
      console.error("Error approving booking", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <div className="w-full flex md:justify-between my-5 items-start max-md:flex-col">
          <div className="flex space-x-3 items-center ">
            <h2 className="text-xl font-semibold max-md:text-muted-foreground ">
              {packageDetails.session}
            </h2>
            <Badge className="rounded-full max-md:bg-muted-foreground h-5">
              {packageDetails.type}
            </Badge>
          </div>
          <div className="flex flex-col justify-end md:text-right">
            <h2 className="text-xl font-semibold">
              {formatDate(booking.date)}
            </h2>
            <p className="text-lg">
              {booking.start_time} to {booking.end_time}
            </p>
          </div>
        </div>
        <div className="flex md:justify-between md:items-end max-md:flex-col">
          <div>
            <div className="flex space-x-2 items-center">
              <User size={21} className="text-zinc-500" />
              <p>{booking.customer.name}</p>
            </div>
            <Link
              href={`mailto:${booking.customer.email}`}
              className="flex space-x-2 hover:underline items-center"
            >
              <Mail size={18} className="text-zinc-500" />
              <p>{booking.customer.email}</p>
            </Link>

            <Link
              href={`tel:${booking.customer.phone}`}
              className="flex space-x-2 hover:underline items-center"
            >
              <Phone size={18} className="text-zinc-500" />
              <p>{booking.customer.phone}</p>
            </Link>
          </div>
          <div className="flex space-x-3 max-md:justify-end max-md:mt-5">
            <Button
              disabled={loading}
              variant={"secondary"}
              className="hover:bg-red-500 hover:text-white  transition-all"
              onClick={() => handleDisapproveBooking(booking.booking_id)}
            >
              {loading ? "•••" : "Reject"}
              <X />
            </Button>
            <Button
              disabled={loading}
              className="hover:bg-[#FFAB11] hover:text-black transition-all"
              onClick={() => handleApproveBooking(booking.booking_id)}
            >
              {loading ? "Approving..." : "Approve"}
              <Check />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PendingCard;
