import React, {FC, ReactElement, useEffect, useState} from 'react';
import {Alert, SelectChangeEvent, Typography} from '@mui/material';
import SelectCalendar from "./SelectCalendar/SelectCalendar";
import Day from "./Day/Day";
import {DateTime} from "luxon";
import SelectDate from "./SelectDate/SelectDate";
import {CalendarEvent} from "../Interfaces/CalendarEvent";
import {useAbortController} from "../Hooks/UseAbortController/UseAbortController";
import EventModal from "./EventModal/EventModal";

const App: FC = (): ReactElement => {
    const [selectedCalendarId, setSelectedCalendarId] = useState<number>(0);
    const [selectedDate, setSelectedDate] = useState<DateTime>(DateTime.local);
    const [selectedDay, setSelectedDay] = useState<DateTime | null>();
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [error, setError] = useState<string>("");
    const [open, setOpen] = useState(false);

    const [eventsController] = useAbortController(1);

    useEffect((): void => fetchEvents(), [selectedCalendarId]);

    const handleOpen = (): void => setOpen(true);

    const handleClose = (): void => setOpen(false);

    const setActiveDay = (date: DateTime) => {
        setSelectedDay(date);
       date && handleOpen();
    }

    const fetchEvents = (): void => {
        fetch("http://127.0.0.1:8888/calendar/events", {
            method: "POST",
            signal: eventsController.signal,
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

        <SelectCalendar selectedCalendarId={selectedCalendarId} handleChange={handleSelect} setError={setError} />

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
                    handleOpen={handleOpen}
                    setSelectedDate={setActiveDay}
                />
            })}
        </div>

        <EventModal
            open={open}
            handleClose={handleClose}
            selectedDay={selectedDay ?? null}
            events={getEventsForDate(selectedDay?.toFormat("y-MM-dd"))}
        />

    </div>
  );
}

export default App;
