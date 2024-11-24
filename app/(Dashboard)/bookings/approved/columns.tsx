"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  ChevronsUpDown,
  MoreHorizontal,
  Copy,
  Mail,
  Phone,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { deleteBooking } from "@/lib/actions/booking.action";

const BookingActions = ({ booking }: { booking: Booking }) => {
  const router = useRouter();

  async function deleteACustomer(id: string) {
    try {
      await deleteBooking(id);
      toast.success("Booking deleted successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete booking");
      console.error(error);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {booking.note && (
          <>
            <DropdownMenuLabel>Note</DropdownMenuLabel>
            <DropdownMenuItem>
              <p>{booking.note}</p>
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuLabel>Customer Details</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => {
            navigator.clipboard.writeText(booking.customer.email);
            toast.success("Email copied to clipboard");
          }}
        >
          <Mail />
          {booking.customer.email}
          <Copy className="text-muted-foreground" />
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            navigator.clipboard.writeText(booking.customer.phone);
            toast.success("Phone number copied to clipboard");
          }}
        >
          <Phone />
          {booking.customer.phone}
          <Copy className="text-muted-foreground" />
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="flex items-center justify-center space-x-2 text-red-900 bg-red-300 hover:bg-red-400"
          onClick={() => {
            deleteACustomer(booking.id);
          }}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export type Booking = {
  id: string;
  name: string;
  customer_id: string;
  date: string;
  start_time: string;
  end_time: string;
  package_name: string;
  note?: string;
  customer: {
    customer_id: string;
    name: string;
    email: string;
    phone: string;
  };
};

export const columns: ColumnDef<Booking>[] = [
  {
    id: "select",

    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-4 h-8 data-[state=open]:bg-accent"
        >
          Customer
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },

  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-4 h-8 data-[state=open]:bg-accent"
        >
          Date
          <ChevronsUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "start_time",
    header: "Start Time",
  },
  {
    accessorKey: "end_time",
    header: "End Time",
  },

  {
    accessorKey: "package_name",
    header: "Package",
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const booking = row.original;

      return <BookingActions booking={booking} />;
    },
  },
];
