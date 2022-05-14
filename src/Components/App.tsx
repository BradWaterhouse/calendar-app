import React, {FC, ReactElement, useEffect, useState} from 'react';
import {Alert, SelectChangeEvent, Typography} from '@mui/material';
import SelectCalendar from "./SelectCalendar/SelectCalendar";
import Day from "./Day/Day";
import {DateTime} from "luxon";
import SelectDate from "./SelectDate/SelectDate";
import {CalendarEvent} from "../Interfaces/CalendarEvent";
import {useAbortController} from "../Hooks/UseAbortController/UseAbortController";

interface Calendar {
    id: number;
    name: string;
}

const App: FC = (): ReactElement => {
    const [calendars, setCalendars] = useState<Calendar[]>([]);
    const [selectedCalendarId, setSelectedCalendarId] = useState<number>(0);
    const [selectedDate, setSelectedDate] = useState<DateTime>(DateTime.local);
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [error, setError] = useState<string>("");

    const [controller] = useAbortController(1);

    useEffect((): void => fetchCalendars(), [])

    useEffect((): void => fetchEvents(), [selectedCalendarId]);

    const fetchCalendars = (): void => {
        fetch("http://127.0.0.1:8888/calendar/select", {
            method: "GET",
            signal: controller.signal,
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then((response: Response) => response.json())
            .then((data: Calendar[]): void => setCalendars(data))
            .catch((error: ErrorEvent): void => {
                console.log(error.message);
                setError("There has been an error displaying your calendars, please refresh the page and try again")
                }
            )
    }

    const fetchEvents = (): void => {
        fetch("http://127.0.0.1:8888/calendar/events", {
            method: "POST",
            signal: controller.signal,
            body: JSON.stringify({id: selectedCalendarId}),
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then((response: Response) => response.json())
            .then((data: CalendarEvent[]): void => setEvents(data))
            .catch((error: ErrorEvent): void => {
                console.log(error.message);
                setError("There has been an error displaying your calendar events, please refresh the page and try again");
                }
            )
    }

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

    const getEventsForDate = (date: string): CalendarEvent[] => events.filter((event: CalendarEvent) => DateTime.fromISO(event.date).toFormat('y-MM-dd') === date);

  return (
    <div className="container">
      <div className="columns">
        <div className="column is-12 has-text-centered">
          <Typography className="mt-2" variant={"h2"}>Calendar</Typography>
          <Typography className="mt-2" variant={"h6"}>Organisation, made easy.</Typography>
            {error && <Alert severity="error">This is an error alert — check it out!</Alert>}
        </div>
      </div>

        <SelectCalendar calendars={calendars} selectedCalendarId={selectedCalendarId} handleChange={handleSelect} />

        <SelectDate
            handleNextMonthChange={handleNextMonth}
            handlePreviousMonthChange={handlePreviousMonth}
            handleResetDateChange={handleResetMonth}
            selectedDate={selectedDate}
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
                />
            })}
        </div>

    </div>
  );
}

export default App;
