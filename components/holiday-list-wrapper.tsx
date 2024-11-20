import { getAllHolidays } from "@/lib/actions/holiday.action";
import { HolidayListClient } from "./HolidayListClient";

export async function HolidayListWrapper() {
  const holidays = await getAllHolidays();

  if (!holidays) {
    return <div>Error loading holidays. Please try again later.</div>;
  }

  return <HolidayListClient initialHolidays={holidays} />;
}
