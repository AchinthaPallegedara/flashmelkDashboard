"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { HolidayList } from "./holiday-list";
import { deleteHoliday, getAllHolidays } from "@/lib/actions/holiday.action";
import { toast } from "sonner";

interface Holiday {
  holiday_id: string;
  date: string;
  type: string;
  start_time: string | null;
  end_time: string | null;
}

interface HolidayListClientProps {
  initialHolidays: Holiday[];
}

export function HolidayListClient({ initialHolidays }: HolidayListClientProps) {
  const [holidays, setHolidays] = useState(initialHolidays);
  const router = useRouter();

  useEffect(() => {
    const refreshHolidays = async () => {
      const updatedHolidays = await getAllHolidays();
      if (updatedHolidays) {
        setHolidays(updatedHolidays);
      }
    };

    refreshHolidays();

    // Set up an interval to refresh holidays every 5 seconds
    const intervalId = setInterval(refreshHolidays, 5000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  const handleDeleteHoliday = async (id: string) => {
    try {
      const result = await deleteHoliday(id);
      if (result) {
        setHolidays(holidays.filter((holiday) => holiday.holiday_id !== id));
        toast("Holiday deleted successfully");
        router.refresh();
      } else {
        throw new Error("Failed to delete holiday");
      }
    } catch (error) {
      console.error("Error deleting holiday:", error);
      toast("Failed to delete holiday");
    }
  };

  return (
    <HolidayList holidays={holidays} onDeleteHoliday={handleDeleteHoliday} />
  );
}
