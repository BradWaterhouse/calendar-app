import React, {FC, ReactElement, useState} from 'react';
import {Alert, Typography} from '@mui/material';
import SelectCalendar from "./SelectCalendar/SelectCalendar";
import Day from "./Day/Day";
import {DateTime} from "luxon";
import SelectDate from "./SelectDate/SelectDate";
import {CalendarEvent} from "../Interfaces/CalendarEvent";
import EventModal from "./EventModal/EventModal";
import {AdapterLuxon} from '@mui/x-date-pickers/AdapterLuxon';
import {LocalizationProvider} from '@mui/x-date-pickers';
import {useAbortController} from "../Hooks/UseAbortController/UseAbortController";
import day from "./Day/Day";

const App: FC = (): ReactElement => {
    const [selectedCalendarId, setSelectedCalendarId] = useState<number>(0);
    const [selectedDate, setSelectedDate] = useState<DateTime>(DateTime.local);
    const [selectedDay, setSelectedDay] = useState<DateTime | null>();
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [error, setError] = useState<string>("");
    const [open, setOpen] = useState(false);

    const [eventsController] = useAbortController(1);

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

    const getDaysInSelectedMonth = (): number[] => {
        const days = [];
        const daysInMonth = selectedDate.daysInMonth;
        const firstDayOfMonthAsDay = selectedDate?.startOf("month").weekday;

        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i);
        }

        for (let i = 1; i < firstDayOfMonthAsDay; i++) {
            days.unshift(0)
        }

        return days;
    }

    const getEventsForDate = (date: string | null | undefined): CalendarEvent[] => {
        if (date) {
            return events.filter(
                (event: CalendarEvent) =>
                    date >= DateTime.fromISO(event.start_date).toFormat('y-MM-dd') &&
                    date <= DateTime.fromISO((event.end_date ? event.end_date : event.start_date)).toFormat('y-MM-dd')
            )
        }

        return [];
    };

    return (
        <LocalizationProvider dateAdapter={AdapterLuxon}>
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
                    fetchEvents={fetchEvents}
                />

                <SelectDate
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                />

                <div className="columns is-multiline">
                    {getDaysInSelectedMonth().map((day: number): ReactElement => {
                        const startOfMonthMinusOneDay = selectedDate.startOf("month").minus({day: 1});
                        const date = startOfMonthMinusOneDay.plus({day: day});

                        if (day > 0) {
                            return <Day
                                key={day}
                                day={day}
                                date={date}
                                events={getEventsForDate(date.toFormat('y-MM-dd'))}
                                setSelectedDay={setSelectedDay}
                                setOpen={setOpen}
                            />
                        }

                        return <>
                            <div className="column is-one-fifth mb-1" style={{width: "14.2857%",}}>
                            </div>
                        </>

                    })}
                </div>

                <EventModal
                    open={open}
                    handleClose={() => setOpen(false)}
                    selectedDay={selectedDay ?? null}
                    selectedCalendarId={selectedCalendarId}
                    events={getEventsForDate(selectedDay?.toFormat("y-MM-dd"))}
                    fetchEvents={fetchEvents}
                />

            </div>
        </LocalizationProvider>
    );
}

export default App;
