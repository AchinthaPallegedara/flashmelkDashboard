/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { getApprovedBookings } from "@/lib/actions/booking.action";
export const dynamic = "force-dynamic";

export default async function Page() {
  const result = await getApprovedBookings();
  const booking = Array.isArray(result)
    ? result.map((b: any) => ({
        id: b.booking_id,
        name: b.customer.name,
        ...b,
      }))
    : [];
  return (
    <div className="md:mx-20">
      <DataTable columns={columns} data={booking} />
    </div>
  );
}
