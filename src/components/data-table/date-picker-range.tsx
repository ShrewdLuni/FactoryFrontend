"use client"

import { format, isSameDay } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { type DateRange } from "react-day-picker"
import { uk } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerWithRangeProps {
  date: DateRange | undefined;
  onDateChange: (date: DateRange | undefined) => void;
}

export function DatePickerWithRange({ date, onDateChange}: DatePickerWithRangeProps) {

  return (
      <Popover>
        <PopoverTrigger>          
          <Button
            variant="outline"
            id="date-picker-range"
            className="justify-start px-2.5 font-normal gap-2 h-8"
          >
            <CalendarIcon className="h-4 w-4" />
            {date?.from ? (
              date.to && !isSameDay(date.from, date.to) ? (
                <>
                  {/* {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")} */}
                  {format(date.from, "dd MMMM yyyy", { locale: uk })} -{" "}
                  {format(date.to, "dd MMMM yyyy", { locale: uk })}
                </>
              ) : (
                  format(date.from, "dd MMMM yyyy", { locale: uk })
                )
            ) : (
                <span>Виберіть дату</span>
              )}
          </Button>
        </PopoverTrigger>          
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={onDateChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
  )
}

