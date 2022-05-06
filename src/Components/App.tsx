import React, {FC, ReactElement, useState} from 'react';
import {SelectChangeEvent, Typography} from '@mui/material';
import SelectCalendar from "./SelectCalendar/SelectCalendar";
import Day from "./Day/Day";
import {DateTime} from "luxon";
import SelectDate from "./SelectDate/SelectDate";
import {CalendarEvent} from "../Interfaces/CalendarEvent";

interface Calendar {
    id: number;
    name: string;
}

const calendarsDummyData: Calendar[] = [
    {id: 1, name: "Brad's calendar"},
    {id: 2, name: "Em's calendar"}
]

const calendarDummyEvents: CalendarEvent[] = [
    {id: 1, name: "Dentists", date: "2022-05-08", time: "14:30", information: "check up"},
    {id: 2, name: "Car MOT", date: "2022-05-09", time: "14:30", information: "MOT"},
    {id: 2, name: "Car Service", date: "2022-05-09", time: "16:30", information: "MOT"},
    {id: 2, name: "Vets", date: "2022-06-09", time: "16:30", information: "Vets"},
]

const App: FC = (): ReactElement => {
    const [selectedCalendarId, setSelectedCalendarId] = useState<number>(calendarsDummyData[0].id);
    const [selectedDate, setSelectedDate] = useState<DateTime>(DateTime.local);
    const [events, setEvents] = useState<CalendarEvent[]>(calendarDummyEvents)

    const handleSelect = (event: SelectChangeEvent<number>): void => setSelectedCalendarId(event.target.value as number);

    const handleNextMonth = (): void => setSelectedDate(selectedDate.plus({month: 1}))

    const handlePreviousMonth = (): void => setSelectedDate(selectedDate.minus({month: 1}))

    const handleResetMonth = (): void => setSelectedDate(DateTime.local)

    const getDaysInSelectedMonth = (): number[] => {
        const days = [];
        const daysInMonth = selectedDate.daysInMonth;

        for (let i = 1; i <= daysInMonth; i ++) {
            days.push(i);
        }

        return days;
    }

    const getEventsForDate = (date: string): CalendarEvent[] => events.filter((event: CalendarEvent) => event.date === date);


  return (
    <div className="container">
      <div className="columns">
        <div className="column is-12 has-text-centered">
          <Typography className="mt-2" variant={"h2"}>Calendar</Typography>
          <Typography className="mt-2" variant={"h6"}>Organisation, made easy.</Typography>
        </div>
      </div>

        <SelectCalendar calendars={calendarsDummyData} selectedCalendarId={selectedCalendarId} handleChange={handleSelect} />

        <SelectDate
            handleNextMonthChange={handleNextMonth}
            handlePreviousMonthChange={handlePreviousMonth}
            handleResetDateChange={handleResetMonth}
            selectedDate={selectedDate}
        />

        <div className="columns is-multiline">
            {getDaysInSelectedMonth().map((day: number) => {
                const startOfMonthMinusOneDay = selectedDate.startOf("month").minus({day: 1});
                const date = startOfMonthMinusOneDay.plus({day: day});

                return <Day key={day} day={day} date={date} events={getEventsForDate(date.toFormat('y-MM-dd'))} />
            })}
        </div>

    </div>
  );
}

export default App;
