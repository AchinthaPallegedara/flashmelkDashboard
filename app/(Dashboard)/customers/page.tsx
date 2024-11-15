/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { getAllCustomers } from "@/lib/actions/customer.action";

export default async function Page() {
  const result = await getAllCustomers();

  return (
    <div className="md:mx-20">
      {result ? (
        <DataTable columns={columns} data={result} />
      ) : (
        <p>No customer data available.</p>
      )}
    </div>
  );
}
