import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Holiday {
  holiday_id: string;
  date: string;
  type: string;
  start_time: string | null;
  end_time: string | null;
}

interface HolidayListProps {
  holidays: Holiday[];
  onDeleteHoliday: (id: string) => void;
}

export function HolidayList({ holidays, onDeleteHoliday }: HolidayListProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Existing Holidays</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {holidays.map((holiday) => (
            <Card key={holiday.holiday_id}>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium">
                    {format(new Date(holiday.date), "MMMM d, yyyy")}
                  </p>
                  <p className="text-sm text-gray-500">
                    {holiday.type === "full-day"
                      ? "Full Day"
                      : `Half Day (${holiday.start_time} - ${holiday.end_time})`}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onDeleteHoliday(holiday.holiday_id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
