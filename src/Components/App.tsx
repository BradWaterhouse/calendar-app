import React, {FC, ReactElement, useState} from 'react';
import {SelectChangeEvent, Typography} from '@mui/material';
import SelectCalendar from "./SelectCalendar/SelectCalendar";
import Day from "./Day/Day";
import {DateTime} from "luxon";
import SelectDate from "./SelectDate/SelectDate";

interface Calendar {
    id: number;
    name: string;
}

const calendarsDummyData: Calendar[] = [
    {id: 1, name: "Brad's calendar"},
    {id: 2, name: "Em's calendar"}
]

const App: FC = (): ReactElement => {
    const [selectedCalendarId, setSelectedCalendarId] = useState<number>(calendarsDummyData[0].id);
    const [selectedDate, setSelectedDate] = useState<DateTime>(DateTime.local);

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
                return <Day key={day} day={day} date={startOfMonthMinusOneDay.plus({day: day})} />
            })}
        </div>

    </div>
  );
}

export default App;
