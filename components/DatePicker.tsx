"use client"

import * as React from "react"
import { addDays, format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { DateRange, SelectRangeEventHandler } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface Range {
  from: Date;
  to: Date;
}

export function DatePickerRange({
  className,
  dates,
  onChange,
  minDate = new Date(),
}: 
{ dates: DateRange; 
  minDate?: Date;
  onChange: SelectRangeEventHandler
  className?: string
}) {
//   const [date, setDate] = React.useState<DateRange | undefined>({
//     from: new Date(2022, 0, 20),
//     to: addDays(new Date(2022, 0, 20), 20),
//   })

  return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal text-primary-gray",
              className
            )}
          >
            <CalendarIcon />
            {dates?.from ? (
              dates.to ? (
                <>
                  {format(dates.from!, "LLL dd, y")} -{" "}
                  {format(dates.to!, "LLL dd, y")}
                </>
              ) : (
                format(dates.from, "LLL dd, y")
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
            defaultMonth={new Date()}
            selected={dates}
            min={2}
            fromDate={new Date()}
            onSelect={onChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
  )
}



export function DatePickerDate({
    date,
    onChange
}: {
date: Date, 
onChange: (date: Date) => void}) {
 // const [ date, setDate] = React.useState<Date>()
 
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(date ) => onChange(date!)}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}