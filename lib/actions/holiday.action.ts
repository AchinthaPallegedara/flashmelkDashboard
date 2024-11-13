"use server";
import { db } from "@/lib/db";

export const checkHolidayByDate = async (date: string) => {
  try {
    const holiday = await db.holiday.findFirst({
      where: {
        date: date,
        type: {
          in: ["full-day", "time-slot"],
        },
      },
    });

    return holiday;
  } catch (error) {
    console.log("Error fetching holiday:", error);
    return null;
  }
};

export const checkExistingHoliday = async (
  date: string,
  end_time: string,
  start_time: string
) => {
  try {
    const holiday = await db.holiday.findFirst({
      where: {
        date: date,
        OR: [
          { type: "full-day" },
          {
            type: "time-slot",
            start_time: {
              lte: end_time,
            },
            end_time: {
              gte: start_time,
            },
          },
        ],
      },
    });

    return holiday;
  } catch (error) {
    console.log("Error fetching holiday:", error);
    return null;
  }
};

export const createNewHoliday = async ({
  date,
  end_time,
  start_time,
  type,
}: {
  date: string;
  end_time: string;
  start_time: string;
  type: string;
}) => {
  try {
    const holiday = await db.holiday.create({
      data: {
        date: date,
        end_time: end_time,
        start_time: start_time,
        type,
      },
    });

    return holiday;
  } catch (error) {
    console.log("Error creating holiday:", error);
    return null;
  }
};
