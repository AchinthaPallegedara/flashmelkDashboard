"use server";

import { google } from "googleapis";
import { Booking } from "@prisma/client";
import { db } from "@/lib/db";
import { ConfirmBookingEmail } from "./email.action";

const calendar = google.calendar({ version: "v3" });

const auth = new google.auth.JWT({
  email: process.env.GOOGLE_CLIENT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY,
  scopes: ["https://www.googleapis.com/auth/calendar"],
});

export async function addToGoogleCalendar(booking: Booking) {
  try {
    const customer = await db.customer.findUnique({
      where: { customer_id: booking.customer_id },
    });

    if (!customer) {
      throw new Error("Customer not found");
    }

    const event = {
      summary: `Booking:${customer.name}-${booking.package_name}`,
      description: `
      
      Customer Details:
      - Name: ${customer.name}
      - Email: ${customer.email}
      - Phone: ${customer.phone}
      Booking Details:
      - Package: ${booking.package_name}
      `,
      start: {
        dateTime: `${booking.date}T${booking.start_time}:00`,
        timeZone: "Asia/Colombo",
      },
      end: {
        dateTime: `${booking.date}T${booking.end_time}:00`,
        timeZone: "Asia/Colombo",
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 24 * 60 },
          { method: "popup", minutes: 60 },
        ],
      },
    };

    const response = await calendar.events.insert({
      auth: auth,
      calendarId: process.env.GOOGLE_CALENDAR_ID, // Use your personal calendar ID here
      requestBody: event,
    });

    console.log("Event created: %s", response.data.htmlLink);
    try {
      await ConfirmBookingEmail({
        customerName: customer.name,
        cus_email: customer.email,
        bookingId: booking.booking_id,
        BookingDate: booking.date,
        BookingStartTime: booking.start_time,
        BookingEndTime: booking.end_time,
      });
    } catch (error) {
      console.error("Error sending confirmation email:", error);
    }

    return response.data;
  } catch (error) {
    console.error("Error adding event to Google Calendar:", error);
    if (error instanceof Error) {
      throw new Error(
        `Failed to add event to Google Calendar: ${error.message}`
      );
    } else {
      throw new Error("Failed to add event to Google Calendar: Unknown error");
    }
  }
}
