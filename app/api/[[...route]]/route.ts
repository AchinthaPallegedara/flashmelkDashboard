"use server";
import { Hono } from "hono";
import { handle } from "hono/vercel";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";
import {
  getAllGalleries,
  getGalleriesbyCategory,
} from "@/lib/actions/gallery.action";
import {
  allBookings,
  checkBookingConflict,
  createNewBooking,
  getAllHolidays,
  getBookingByDate,
} from "@/lib/actions/booking.action";
import {
  checkExistingHoliday,
  checkHolidayByDate,
  createNewHoliday,
} from "@/lib/actions/holiday.action";

const app = new Hono().basePath("/api");

// Add CORS middleware before any routes
app.use("*", async (c, next) => {
  c.res.headers.set(
    "Access-Control-Allow-Origin",
    process.env.FRONTEND_URL || "http://localhost:3000"
  );
  c.res.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  c.res.headers.set("Access-Control-Allow-Headers", "Content-Type");
  c.res.headers.set("Access-Control-Max-Age", "86400");
  c.res.headers.set("Access-Control-Allow-Credentials", "true");

  if (c.req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: c.res.headers,
    });
  }

  await next();
});

// Validation schemas
const BookingSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(10, "Phone number is required"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  startTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Invalid time format"),
  endTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Invalid time format"),
  packageType: z.enum([
    "I-basic",
    "I-standard",
    "I-professional",
    "V-basic",
    "V-standard",
    "V-professional",
  ]),
});

const HolidaySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  type: z.enum(["full-day", "time-slot"]),
  startTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Invalid time format")
    .optional(),
  endTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Invalid time format")
    .optional(),
});

// Get bookings
app.get("/bookings", async (c) => {
  try {
    const date = c.req.query("date");
    if (date) {
      const filteredBookings = await getBookingByDate(date);
      return c.json(filteredBookings);
    }
    const bookings = await allBookings();
    return c.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return c.json({ error: "Failed to fetch bookings" }, 500);
  }
});

// Create booking
app.post("/bookings", async (c) => {
  try {
    const body = await c.req.json();
    const validatedData = BookingSchema.parse(body);

    // Check for holidays first
    const holiday = await checkHolidayByDate(validatedData.date);
    if (holiday) {
      throw new HTTPException(409, {
        message:
          holiday.type === "full-day"
            ? "Selected date is a holiday"
            : "Selected time slot falls on a holiday period",
      });
    }

    // Check for booking conflicts
    const conflictingBooking = await checkBookingConflict(validatedData);
    if (conflictingBooking) {
      throw new HTTPException(409, { message: "Time slot already booked" });
    }

    const newBooking = await createNewBooking(validatedData);
    return c.json(newBooking, 201);
  } catch (error) {
    console.error("Error creating booking:", error);
    if (error instanceof z.ZodError) {
      return c.json({ error: error.errors[0].message }, 400);
    }
    if (error instanceof HTTPException) {
      return c.json({ error: error.message }, error.status);
    }
    return c.json({ error: "Failed to create booking" }, 500);
  }
});

// Get holidays
app.get("/holidays", async (c) => {
  try {
    const date = c.req.query("date");
    if (date) {
      const filteredHolidays = await checkHolidayByDate(date);
      return c.json(filteredHolidays);
    }
    const holidays = await getAllHolidays();
    return c.json(holidays);
  } catch (error) {
    console.error("Error fetching holidays:", error);
    return c.json({ error: "Failed to fetch holidays" }, 500);
  }
});

// Create holiday
app.post("/holidays", async (c) => {
  try {
    const body = await c.req.json();
    const validatedData = HolidaySchema.parse(body);

    if (validatedData.type === "time-slot") {
      if (!validatedData.startTime || !validatedData.endTime) {
        throw new HTTPException(400, {
          message:
            "Start time and end time are required for time-slot holidays",
        });
      }
    }

    const existingHoliday = await checkExistingHoliday(
      validatedData.date,
      validatedData.startTime || "",
      validatedData.endTime || ""
    );

    if (existingHoliday) {
      throw new HTTPException(409, {
        message: "Holiday already exists for this date/time period",
      });
    }

    const newHoliday = await createNewHoliday({
      date: validatedData.date,
      type: validatedData.type,
      start_time: validatedData.startTime || "",
      end_time: validatedData.endTime || "",
    });

    return c.json(newHoliday, 201);
  } catch (error) {
    console.error("Error creating holiday:", error);
    if (error instanceof z.ZodError) {
      return c.json({ error: error.errors[0].message }, 400);
    }
    if (error instanceof HTTPException) {
      return c.json({ error: error.message }, error.status);
    }
    return c.json({ error: "Failed to create holiday" }, 500);
  }
});

// Get Galleries
app.get("/galleries", async (c) => {
  try {
    const galleries = await getAllGalleries();
    return c.json(galleries);
  } catch (error) {
    console.error("Error fetching galleries:", error);
    return c.json({ error: "Failed to fetch galleries" }, 500);
  }
});

// Get gallery by category
app.get("/galleries/:category", async (c) => {
  try {
    const category = c.req.param("category");
    const validCategories = [
      "FASHION",
      "COMMERCIAL",
      "EDITORIAL",
      "BEAUTY",
      "CORPORATE_PROFILES",
    ] as const;

    if (
      !validCategories.includes(category as (typeof validCategories)[number])
    ) {
      return c.json({ error: "Invalid category" }, 400);
    }

    const galleries = await getGalleriesbyCategory(
      category as (typeof validCategories)[number]
    );
    return c.json(galleries);
  } catch (error) {
    console.error("Error fetching galleries:", error);
    return c.json({ error: "Failed to fetch galleries" }, 500);
  }
});

export const GET = handle(app);
export const POST = handle(app);
export const DELETE = handle(app);
export const OPTIONS = handle(app);
