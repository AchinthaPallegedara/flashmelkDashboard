import { HolidayAddForm } from "@/components/holiday-add-form";
import { HolidayListWrapper } from "@/components/holiday-list-wrapper";
import { Suspense } from "react";
export const dynamic = "force-dynamic";
export default function HolidayManagement() {
  return (
    <div className="md:mx-20 mt-10">
      <h1 className="text-3xl font-bold mb-8">Holiday Management</h1>
      <div className="flex flex-col space-y-10">
        <HolidayAddForm />
        <Suspense fallback={<div>Loading holidays...</div>}>
          <HolidayListWrapper />
        </Suspense>
      </div>
    </div>
  );
}
