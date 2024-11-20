"use server";
import { db } from "@/lib/db";
export const dynamic = "force-dynamic";
export const checkHolidayByDate = async (date: string) => {
  try {
    const holiday = await db.holiday.findFirst({
      where: {
        date: date,
        type: {
          in: ["full-day", "half-day"],
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
            type: "half-day",
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

const deletePassedHolidays = async () => {
  try {
    const holidays = await db.holiday.findMany({
      where: {
        date: {
          lt: new Date().toISOString(),
        },
      },
    });

    if (holidays.length > 0) {
      await db.holiday.deleteMany({
        where: {
          date: {
            lt: new Date().toISOString(),
          },
        },
      });
    }
  } catch (error) {
    console.log("Error deleting passed holidays:", error);
  }
};

export const getAllHolidays = async () => {
  try {
    deletePassedHolidays();
    const holidays = await db.holiday.findMany();
    return holidays;
  } catch (error) {
    console.log("Error fetching holidays:", error);
    return null;
  }
};

export const deleteHoliday = async (holidayId: string) => {
  try {
    const holiday = await db.holiday.delete({
      where: {
        holiday_id: holidayId,
      },
    });

    return holiday;
  } catch (error) {
    console.log("Error deleting holiday:", error);
    return null;
  }
};
