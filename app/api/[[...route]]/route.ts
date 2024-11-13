"use server";
import { Hono } from "hono";
import { handle } from "hono/vercel";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";
import {
  getAllGalleries,
  getGalleriesbyCategory,
} from "@/lib/actions/gallery.action";

// export const runtime = "edge";

const app = new Hono().basePath("/api");

// Add CORS middleware before any routes
app.use("*", async (c, next) => {
  // Add CORS headers
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

  // Handle OPTIONS request
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
  packageType: z.enum(["basic", "standard", "professional"]),
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
  description: z.string().min(1, "Description is required"),
});

interface Booking extends z.infer<typeof BookingSchema> {
  id: string;
}

interface Holiday extends z.infer<typeof HolidaySchema> {
  id: string;
}

// In-memory storage
const bookings: Booking[] = [];
let holidays: Holiday[] = [];

// Helper function to check time slot conflicts
const hasTimeConflict = (
  date: string,
  startTime: string,
  endTime: string,
  existingStartTime: string,
  existingEndTime: string
) => {
  return (
    (startTime >= existingStartTime && startTime < existingEndTime) ||
    (endTime > existingStartTime && endTime <= existingEndTime) ||
    (startTime <= existingStartTime && endTime >= existingEndTime)
  );
};

// Get bookings
app.get("/bookings", (c) => {
  try {
    const date = c.req.query("date");
    if (date) {
      const filteredBookings = bookings.filter(
        (booking) => booking.date === date
      );
      return c.json(filteredBookings);
    }
    return c.json(bookings);
  } catch {
    return c.json({ error: "Failed to fetch bookings" }, 500);
  }
});

// Create booking
app.post("/bookings", async (c) => {
  try {
    const body = await c.req.json();

    // Validate request body
    const validatedData = BookingSchema.parse(body);

    // Check for holidays first
    const holiday = holidays.find((h) => {
      if (h.date === validatedData.date) {
        if (h.type === "full-day") return true;
        if (h.type === "time-slot" && h.startTime && h.endTime) {
          return hasTimeConflict(
            validatedData.date,
            validatedData.startTime,
            validatedData.endTime,
            h.startTime,
            h.endTime
          );
        }
      }
      return false;
    });

    if (holiday) {
      throw new HTTPException(409, {
        message:
          holiday.type === "full-day"
            ? "Selected date is a holiday"
            : "Selected time slot falls on a holiday period",
      });
    }

    // Check for booking conflicts
    const conflictingBooking = bookings.find(
      (booking) =>
        booking.date === validatedData.date &&
        hasTimeConflict(
          validatedData.date,
          validatedData.startTime,
          validatedData.endTime,
          booking.startTime,
          booking.endTime
        )
    );

    if (conflictingBooking) {
      throw new HTTPException(409, { message: "Time slot already booked" });
    }

    const newBooking: Booking = {
      id: crypto.randomUUID(),
      ...validatedData,
    };

    bookings.push(newBooking);
    return c.json(newBooking, 201);
  } catch (error) {
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
app.get("/holidays", (c) => {
  try {
    const date = c.req.query("date");
    if (date) {
      const filteredHolidays = holidays.filter(
        (holiday) => holiday.date === date
      );
      return c.json(filteredHolidays);
    }
    return c.json(holidays);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return c.json({ error: "Failed to fetch holidays" }, 500);
  }
});

// Create holiday
app.post("/holidays", async (c) => {
  try {
    const body = await c.req.json();

    // Validate request body
    const validatedData = HolidaySchema.parse(body);

    // Additional validation for time-slot type
    if (validatedData.type === "time-slot") {
      if (!validatedData.startTime || !validatedData.endTime) {
        throw new HTTPException(400, {
          message:
            "Start time and end time are required for time-slot holidays",
        });
      }
    }

    // Check for existing holidays on the same date
    const existingHoliday = holidays.find((h) => {
      if (h.date === validatedData.date) {
        if (h.type === "full-day" || validatedData.type === "full-day")
          return true;
        if (
          h.type === "time-slot" &&
          h.startTime &&
          h.endTime &&
          validatedData.startTime &&
          validatedData.endTime
        ) {
          return hasTimeConflict(
            validatedData.date,
            validatedData.startTime,
            validatedData.endTime,
            h.startTime,
            h.endTime
          );
        }
      }
      return false;
    });

    if (existingHoliday) {
      throw new HTTPException(409, {
        message: "Holiday already exists for this date/time period",
      });
    }

    const newHoliday: Holiday = {
      id: crypto.randomUUID(),
      ...validatedData,
    };

    holidays.push(newHoliday);
    return c.json(newHoliday, 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: error.errors[0].message }, 400);
    }
    if (error instanceof HTTPException) {
      return c.json({ error: error.message }, error.status);
    }
    return c.json({ error: "Failed to create holiday" }, 500);
  }
});

// Delete holiday
app.delete("/holidays/:id", (c) => {
  try {
    const id = c.req.param("id");
    const holidayIndex = holidays.findIndex((h) => h.id === id);

    if (holidayIndex === -1) {
      throw new HTTPException(404, { message: "Holiday not found" });
    }

    holidays = holidays.filter((h) => h.id !== id);
    return c.json({ message: "Holiday deleted successfully" });
  } catch (error) {
    if (error instanceof HTTPException) {
      return c.json({ error: error.message }, error.status);
    }
    return c.json({ error: "Failed to delete holiday" }, 500);
  }
});

//Get Galleries
app.get("/galleries", async (c) => {
  try {
    const galleries = await getAllGalleries();

    return c.json(galleries);
  } catch (error) {
    console.log("Error fetching galleries:", error);
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
    console.log("Error fetching galleries:", error);
    return c.json({ error: "Failed to fetch galleries" }, 500);
  }
});

export const GET = handle(app);
export const POST = handle(app);
export const DELETE = handle(app);
export const OPTIONS = handle(app);
