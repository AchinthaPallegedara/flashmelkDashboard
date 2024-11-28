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
      - Note: ${booking.note}
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
          { method: "email", minutes: 60 },
          { method: "popup", minutes: 60 },
          { method: "popup", minutes: 10 },
        ],
      },
    };

    const response = await calendar.events.insert({
      auth: auth,
      calendarId: process.env.GOOGLE_CALENDAR_ID, // Use your personal calendar ID here
      requestBody: event,
    });

    console.log("Event created: %s", response.data.htmlLink);
    // Save the event ID to the booking record
    await db.booking.update({
      where: { booking_id: booking.booking_id },
      data: { google_event_id: response.data.id },
    });

    try {
      await ConfirmBookingEmail({
        customerName: customer.name,
        cus_email: customer.email,
        bookingId: booking.booking_id,
        BookingDate: booking.date,
        BookingStartTime: booking.start_time,
        BookingEndTime: booking.end_time,
        BookingType: booking.package_name,
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

export async function deleteFromGoogleCalendar(bookingId: string) {
  try {
    // Fetch the booking and its associated Google Calendar event ID
    const booking = await db.booking.findUnique({
      where: { booking_id: bookingId },
    });

    if (!booking || !booking.google_event_id) {
      throw new Error("Booking or Google Calendar event ID not found");
    }

    // Delete the event from Google Calendar
    await calendar.events.delete({
      auth: auth,
      calendarId: process.env.GOOGLE_CALENDAR_ID, // Your calendar ID
      eventId: booking.google_event_id,
    });

    console.log("Event deleted successfully from Google Calendar");

    return { success: true, message: "Event deleted successfully" };
  } catch (error) {
    console.error("Error deleting event from Google Calendar:", error);
    if (error instanceof Error) {
      throw new Error(
        `Failed to delete event from Google Calendar: ${error.message}`
      );
    } else {
      throw new Error(
        "Failed to delete event from Google Calendar: Unknown error"
      );
    }
  }
}
