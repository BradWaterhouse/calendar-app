import React, {FC, ReactElement} from "react";
import {FormControl, InputLabel, MenuItem, Select, SelectChangeEvent} from "@mui/material";
import {UsersCalendar} from "../../Interfaces/UsersCalendar";

interface Props {
    calendars: UsersCalendar[]
    selectedCalendarId: number | null
    handleChange: (event: SelectChangeEvent<number>) => void;
}

const SelectCalendar: FC<Props> = (props: Props): ReactElement => {

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
                                {props.calendars.map((calendar: UsersCalendar): ReactElement =>
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
