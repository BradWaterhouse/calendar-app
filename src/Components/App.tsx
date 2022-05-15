import React, {FC, ReactElement, useState} from 'react';
import {Alert, Typography} from '@mui/material';
import SelectCalendar from "./SelectCalendar/SelectCalendar";
import Day from "./Day/Day";
import {DateTime} from "luxon";
import SelectDate from "./SelectDate/SelectDate";
import {CalendarEvent} from "../Interfaces/CalendarEvent";
import EventModal from "./EventModal/EventModal";

const App: FC = (): ReactElement => {
    const [selectedCalendarId, setSelectedCalendarId] = useState<number>(0);
    const [selectedDate, setSelectedDate] = useState<DateTime>(DateTime.local);
    const [selectedDay, setSelectedDay] = useState<DateTime | null>();
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [error, setError] = useState<string>("");
    const [open, setOpen] = useState(false);

    const setActiveDay = (date: DateTime) => {
        setSelectedDay(date);
       date && setOpen(true);
    }

    const getDaysInSelectedMonth = (): number[] => {
        const days = [];
        const daysInMonth = selectedDate.daysInMonth;

        for (let i = 1; i <= daysInMonth; i ++) {
            days.push(i);
        }

        return days;
    }

    const getEventsForDate = (date: string | null | undefined): CalendarEvent[] => {
        if (date) {
            return events.filter((event: CalendarEvent) => DateTime.fromISO(event.date).toFormat('y-MM-dd') === date)
        }

        return [];
    };

  return (
    <div className="container">
      <div className="columns">
        <div className="column is-12 has-text-centered">
          <Typography className="mt-2" variant={"h2"}>Calendar</Typography>
          <Typography className="mt-2" variant={"h6"}>Organisation, made easy.</Typography>
            {error && <Alert severity="error">{error}</Alert>}
        </div>
      </div>

        <SelectCalendar
            selectedCalendarId={selectedCalendarId}
            setSelectedCalendarId={setSelectedCalendarId}
            setEvents={setEvents}
            setError={setError}
        />

        <SelectDate
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
        />

        <div className="columns is-multiline">
            {getDaysInSelectedMonth().map((day: number): ReactElement => {
                const startOfMonthMinusOneDay = selectedDate.startOf("month").minus({day: 1});
                const date = startOfMonthMinusOneDay.plus({day: day});

                return <Day
                    key={day}
                    day={day}
                    date={date}
                    events={getEventsForDate(date.toFormat('y-MM-dd'))}
                    setSelectedDate={setActiveDay}
                />
            })}
        </div>

        <EventModal
            open={open}
            handleClose={() => setOpen(false)}
            selectedDay={selectedDay ?? null}
            events={getEventsForDate(selectedDay?.toFormat("y-MM-dd"))}
        />

    </div>
  );
}

export default App;
