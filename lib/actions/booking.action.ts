"use server";
import { db } from "@/lib/db";
import {
  createCustomer,
  getCustomerByEmail,
  updateCustomer,
} from "./customer.action";
import { addToGoogleCalendar } from "./GoogleCalendar";
import { CreateBookingEmail } from "./email.action";
import { format } from "date-fns";

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
  note?: string;
  packageType:
    | "P-basic"
    | "P-standard"
    | "P-professional"
    | "V-basic"
    | "V-standard"
    | "V-professional"
    | "C-professional"
    | "C-platinum"
    | "Individual-QuickSession"
    | "Individual-Branding&Creative"
    | "Individual-Executive"
    | "FamilySession"
    | "Graduation-ALLINCLUSIVESession"
    | "Family-Maternity"
    | "Family-ALLINCLUSIVESession"
    | "Graduation-QuickSession"
    | "Graduation-StandardSession"
    | "ModelPortfolio-Pro"
    | "ModelPortfolio-Standard";
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
        note: data.note,
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
        date: "desc",
      },
    });
    return bookings;
  } catch (error) {
    console.log("Error fetching approved bookings:", error);
    return { error: "Error fetching approved bookings" };
  }
};

export async function getBookingStats() {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5); // -5 to include current month

  const bookings = await db.booking.findMany({
    where: {
      created_at: {
        gte: sixMonthsAgo,
      },
    },
    select: {
      created_at: true,
    },
  });

  const monthlyBookings = bookings.reduce(
    (acc: Record<string, number>, booking) => {
      const date = new Date(booking.created_at);
      const monthYear = `${date.getMonth()}-${date.getFullYear()}`;
      acc[monthYear] = (acc[monthYear] || 0) + 1;
      return acc;
    },
    {}
  );

  const last6Months = [];
  const monthNames = [
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

  // Generate data for last 6 months
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthYear = `${date.getMonth()}-${date.getFullYear()}`;

    last6Months.push({
      month: monthNames[date.getMonth()],
      year: date.getFullYear(),
      desktop: monthlyBookings[monthYear] || 0,
    });
  }

  return last6Months;
}

export async function getPackageBookingStats() {
  const packageTypes = [
    "P-basic",
    "P-standard",
    "P-professional",
    "V-basic",
    "V-standard",
    "V-professional",
    "C-professional",
    "C-platinum",
  ];

  const stats = await Promise.all(
    packageTypes.map(async (packageType) => {
      const count = await db.booking.count({
        where: {
          package_name: packageType,
        },
      });

      return {
        package: packageType,
        bookings: count,
      };
    })
  );

  // Map the stats to transform package names
  const transformedStats = stats.map(({ package: packageType, bookings }) => {
    const [prefix, suffix] = packageType.split("-");
    const transformedPackage = `${prefix}-${suffix[0].toUpperCase()}`;
    return {
      package: transformedPackage,
      bookings,
    };
  });

  return transformedStats;
}

export async function getDashboardStats() {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // Start of today
  const currentTime = now.toTimeString().split(" ")[0]; // Current time in HH:mm:ss
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1); // Start of last month
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0); // End of last month
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1); // Start of current month

  const [
    nextBooking,
    currentActiveBookingsCount,
    lastMonthActiveBookingsCount,
    currentNewClientsCount,
    lastMonthNewClientsCount,
    currentTotalBookingsCount,
    lastMonthTotalBookingsCount,
    futureActiveBookingsCount, // New count for future active bookings
    totalBookingsCount, // New total bookings count
  ] = await Promise.all([
    // Fetch the next upcoming booking
    db.booking.findFirst({
      where: {
        status: "approved",
        OR: [
          {
            date: today.toISOString(),
            start_time: {
              gt: currentTime, // Today's bookings after the current time
            },
          },
          {
            date: {
              gt: today.toISOString(), // Future bookings strictly after today
            },
          },
        ],
      },
      orderBy: [
        { date: "asc" }, // Sort by date
        { start_time: "asc" }, // Then by start time
      ],
    }),
    // Count active bookings this month (including ongoing bookings today)
    db.booking.count({
      where: {
        status: "approved",
        OR: [
          {
            date: today.toISOString(),
            start_time: {
              lte: currentTime, // Started already
            },
            end_time: {
              gt: currentTime, // Still ongoing
            },
          },
          {
            date: {
              gte: currentMonthStart.toISOString(),
              lt: today.toISOString(), // Past dates in the current month
            },
          },
        ],
      },
    }),
    // Count active bookings last month
    db.booking.count({
      where: {
        status: "approved",
        date: {
          gte: lastMonthStart.toISOString(),
          lte: lastMonthEnd.toISOString(), // Last month only
        },
      },
    }),
    // Count new clients this month
    db.customer.count({
      where: {
        created_at: {
          gte: currentMonthStart.toISOString(),
          lte: now.toISOString(), // Current month only
        },
      },
    }),
    // Count new clients last month
    db.customer.count({
      where: {
        created_at: {
          gte: lastMonthStart.toISOString(),
          lte: lastMonthEnd.toISOString(), // Last month only
        },
      },
    }),
    // Count total bookings this month
    db.booking.count({
      where: {
        date: {
          gte: currentMonthStart.toISOString(),
          lte: now.toISOString(), // Current month only
        },
      },
    }),
    // Count total bookings last month
    db.booking.count({
      where: {
        date: {
          gte: lastMonthStart.toISOString(),
          lte: lastMonthEnd.toISOString(), // Last month only
        },
      },
    }),
    // Count future active bookings
    db.booking.count({
      where: {
        status: "approved",
        date: {
          gt: today.toISOString(), // Strictly future dates
        },
      },
    }),
    // Count all bookings (total bookings)
    db.booking.count({}),
  ]);

  // Calculate percentage change
  const getPercentageChange = (current: number, previous: number): string => {
    if (previous === 0) return "+100%"; // Avoid division by zero
    const change = ((current - previous) / previous) * 100;
    return `${change > 0 ? "+" : ""}${change.toFixed(1)}%`;
  };

  // Determine the human-readable date for the next booking
  let nextBookingDateDisplay = null;
  if (nextBooking) {
    const nextBookingDate = new Date(nextBooking.date);
    if (nextBookingDate.toDateString() === today.toDateString()) {
      nextBookingDateDisplay = "Today";
    } else if (
      nextBookingDate.toDateString() ===
      new Date(today.getTime() + 24 * 60 * 60 * 1000).toDateString()
    ) {
      nextBookingDateDisplay = "Tomorrow";
    } else {
      nextBookingDateDisplay = format(nextBookingDate, "EEE, MMM d"); // Example: Wed, Nov 23
    }
  }

  return {
    nextBooking: nextBooking
      ? {
          date: nextBookingDateDisplay || "No date available",
          time: `${nextBooking.start_time} to ${nextBooking.end_time}`, // Use time strings directly
          package: nextBooking.package_name || "No package available",
        }
      : null,
    activeBookings: {
      count: currentActiveBookingsCount,
      change: getPercentageChange(
        currentActiveBookingsCount,
        lastMonthActiveBookingsCount
      ),
    },
    futureActiveBookings: futureActiveBookingsCount, // Include in the response
    totalBookings: {
      count: totalBookingsCount, // Total bookings
    },
    newClients: {
      count: currentNewClientsCount,
      change: getPercentageChange(
        currentNewClientsCount,
        lastMonthNewClientsCount
      ),
    },
    totalBookingsByMonth: {
      count: currentTotalBookingsCount,
      change: getPercentageChange(
        currentTotalBookingsCount,
        lastMonthTotalBookingsCount
      ),
    },
  };
}
