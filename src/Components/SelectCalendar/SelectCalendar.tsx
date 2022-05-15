import React, {FC, ReactElement, useEffect, useState} from "react";
import {FormControl, InputLabel, MenuItem, Select, SelectChangeEvent} from "@mui/material";
import {UsersCalendar} from "../../Interfaces/UsersCalendar";
import {useAbortController} from "../../Hooks/UseAbortController/UseAbortController";

interface Props {
    selectedCalendarId: number | null
    handleChange: (event: SelectChangeEvent<number>) => void;
    setError: (error: string) => void;
}

interface Calendar {
    id: number;
    name: string;
}

const SelectCalendar: FC<Props> = (props: Props): ReactElement => {
    const [calendars, setCalendars] = useState<Calendar[]>([]);

    useEffect((): void => fetchCalendars(), [])

    const [calendarController] = useAbortController(1);

    const fetchCalendars = (): void => {
        fetch("http://127.0.0.1:8888/calendar/select", {
            method: "GET",
            signal: calendarController.signal,
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then((response: Response) => response.json())
            .then((data: Calendar[]): void => setCalendars(data))
            .catch((error: ErrorEvent): void => {
                    console.log(error.message);
                    props.setError("There has been an error displaying your calendars, please refresh the page and try again")
                }
            )
    }

    return (
        <>
            <div className="columns">
                <div className="column">
                    {props.selectedCalendarId !== undefined &&
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Select Calendar</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={props.selectedCalendarId ?? 0}
                                label="Select Calendar"
                                onChange={props.handleChange}
                            >
                                <MenuItem key={0} value={0}>{"Please Select Calendar"}</MenuItem>
                                {calendars.map((calendar: UsersCalendar): ReactElement =>
                                    <MenuItem key={calendar.id} value={calendar.id}>{calendar.name}</MenuItem>
                                )}
                            </Select>
                        </FormControl>
                    }
                </div>
            </div>
        </>
    )
}

export default SelectCalendar;
