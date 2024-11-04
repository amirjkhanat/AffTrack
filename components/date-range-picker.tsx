"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { addDays, format, startOfMonth, endOfMonth, startOfDay, endOfDay, subDays, subMonths } from "date-fns";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DatePickerWithRangeProps extends React.HTMLAttributes<HTMLDivElement> {
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
}

export function DatePickerWithRange({
  className,
  date,
  setDate,
}: DatePickerWithRangeProps) {
  const handlePresetChange = (value: string) => {
    const now = new Date();

    switch (value) {
      case "today":
        setDate({
          from: startOfDay(now),
          to: endOfDay(now),
        });
        break;
      case "yesterday":
        const yesterday = subDays(now, 1);
        setDate({
          from: startOfDay(yesterday),
          to: endOfDay(yesterday),
        });
        break;
      case "mtd":
        setDate({
          from: startOfMonth(now),
          to: endOfDay(now),
        });
        break;
      case "last-month":
        const lastMonth = subMonths(now, 1);
        setDate({
          from: startOfMonth(lastMonth),
          to: endOfMonth(lastMonth),
        });
        break;
    }
  };

  return (
    <div className={cn("flex gap-2", className)}>
      <Select onValueChange={handlePresetChange}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Select range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="yesterday">Yesterday</SelectItem>
          <SelectItem value="mtd">Month to Date</SelectItem>
          <SelectItem value="last-month">Last Month</SelectItem>
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}