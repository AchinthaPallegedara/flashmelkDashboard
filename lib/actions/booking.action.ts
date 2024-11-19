"use server";
import { db } from "@/lib/db";
import {
  createCustomer,
  getCustomerByEmail,
  updateCustomer,
} from "./customer.action";
import { addToGoogleCalendar } from "./GoogleCalendar";
import { CreateBookingEmail } from "@/app/api/send/route";

// Fetch all bookings
export const allBookings = async () => {
  try {
    const bookings = await db.booking.findMany({
      where: {
        status: {
          not: "disapproved",
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });
    return bookings;
  } catch (error) {
    console.log("Error fetching bookings:", error);
    return { error: "Error fetching bookings" };
  }
};

// Get bookings by a specific date
export const getBookingByDate = async (date: string) => {
  try {
    const bookings = await db.booking.findMany({
      where: {
        date,
        status: {
          not: "disapproved",
        },
      },
      orderBy: { start_time: "asc" },
    });
    return bookings;
  } catch (error) {
    console.log("Error fetching bookings:", error);
    return { error: "Error fetching bookings by date" };
  }
};

// Check for booking conflict by comparing times
export async function checkBookingConflict(bookingData: {
  date: string;
  startTime: string;
  endTime: string;
}) {
  try {
    return await db.booking.findFirst({
      where: {
        date: bookingData.date,
        OR: [
          {
            AND: [
              { start_time: { lte: bookingData.startTime } },
              { end_time: { gt: bookingData.startTime } },
            ],
          },
          {
            AND: [
              { start_time: { lt: bookingData.endTime } },
              { end_time: { gte: bookingData.endTime } },
            ],
          },
        ],
      },
    });
  } catch (error) {
    console.error("Error in checkBookingConflict:", error);
    throw error;
  }
}
// Create a new booking
export const createNewBooking = async (data: {
  date: string;
  name: string;
  email: string;
  phone: string;
  startTime: string;
  endTime: string;
  packageType:
    | "I-basic"
    | "I-standard"
    | "I-professional"
    | "V-basic"
    | "V-standard"
    | "V-professional";
}) => {
  try {
    // Check for any conflicts before creating the booking
    const conflictingBooking = await checkBookingConflict(data);
    if (conflictingBooking) {
      throw new Error("Time slot already booked");
    }

    // Proceed with customer creation if needed
    let customer = await getCustomerByEmail(data.email);
    if (!customer) {
      customer = await createCustomer({
        email: data.email,
        name: data.name,
        phone: data.phone,
      });
      if (customer) {
        customer = await updateCustomer(customer.customer_id, {
          name: data.name,
          phone: data.phone,
        });
      }
    }

    if (!customer) {
      throw new Error("Failed to create or find customer");
    }

    // Create the booking
    const booking = await db.booking.create({
      data: {
        date: data.date, // Ensure date is passed in valid DateTime format
        start_time: data.startTime, // Full date and time
        end_time: data.endTime, // Full date and time
        package_name: data.packageType,
        customer_id: customer.customer_id,
        status: "pending",
      },
    });
    try {
      await CreateBookingEmail({
        customerName: data.name,
        cus_email: data.email,
      });
    } catch (error) {
      console.log("Error sending booking email:", error);
    }

    return booking;
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error creating booking:", error.message);
    } else {
      console.log("Error creating booking:", error);
    }
    if (error instanceof Error) {
      throw new Error(error.message || "Error creating booking");
    } else {
      throw new Error("Error creating booking");
    }
  }
};

// Fetch all holidays
export const getAllHolidays = async () => {
  try {
    const holidays = await db.holiday.findMany({
      orderBy: {
        date: "asc",
      },
    });
    return holidays;
  } catch (error) {
    console.log("Error fetching holidays:", error);
    return { error: "Error fetching holidays" };
  }
};

export const getAllPendingBookings = async () => {
  try {
    const bookings = await db.booking.findMany({
      where: {
        status: "pending",
      },
      include: {
        customer: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });
    return bookings;
  } catch (error) {
    console.log("Error fetching pending bookings:", error);
    return { error: "Error fetching pending bookings" };
  }
};

export const approveBooking = async (bookingId: string) => {
  try {
    const booking = await db.booking.update({
      where: {
        booking_id: bookingId,
      },
      data: {
        status: "approved",
      },
    });

    let calendarEvent = null;
    try {
      // Add the approved booking to Google Calendar
      calendarEvent = await addToGoogleCalendar(booking);
    } catch (calendarError) {
      console.error("Error adding to Google Calendar:", calendarError);
      // We'll continue even if calendar addition fails
    }

    return { booking, calendarEvent };
  } catch (error) {
    console.error("Error approving booking:", error);
    if (error instanceof Error) {
      return { error: `Error approving booking: ${error.message}` };
    } else {
      return { error: "Error approving booking: Unknown error" };
    }
  }
};

export const deleteBooking = async (bookingId: string) => {
  try {
    const booking = await db.booking.delete({
      where: {
        booking_id: bookingId,
      },
    });
    return booking;
  } catch (error) {
    console.log("Error deleting booking:", error);
    return { error: "Error deleting booking" };
  }
};

export const getPendingBookingsCount = async () => {
  try {
    const count = await db.booking.count({
      where: {
        status: "pending",
      },
    });
    return count;
  } catch (error) {
    console.log("Error fetching pending bookings count:", error);
    return { error: "Error fetching pending bookings count" };
  }
};

export const getApprovedBookings = async () => {
  try {
    const bookings = await db.booking.findMany({
      where: {
        status: "approved",
      },
      include: {
        customer: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });
    return bookings;
  } catch (error) {
    console.log("Error fetching approved bookings:", error);
    return { error: "Error fetching approved bookings" };
  }
};
