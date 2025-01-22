import * as React from "react";

import { Calendar } from "@/components/ui/calendar";

export function ResumeCalendar() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <div>
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border  w-max mx-auto mt-5"
      />
    </div>
  );
}
