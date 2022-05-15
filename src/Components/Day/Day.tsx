import React, {FC, ReactElement} from "react";
import { Typography } from "@mui/material";
import {DateTime} from "luxon";
import {CalendarEvent} from "../../Interfaces/CalendarEvent";

interface Props {
    day: number;
    date: DateTime;
    events: CalendarEvent[];
    handleOpen: () => void;
    setSelectedDate: (date: DateTime) => void;
}

const Day: FC<Props> = (props: Props): ReactElement => {
    return <>
        <div className="column is-2 mb-1" onClick={() => props.setSelectedDate(props.date)}
             style={{
                 borderStyle: "solid",
                 borderColor: "black",
                 borderRadius: 5,
                 marginBottom: 0.2,
                 borderWidth: 1.5,
                 minHeight: 175,
                 maxHeight: 175,
                 background: (props.date.toFormat('y-MM-dd') === DateTime.local().toFormat('y-MM-dd') ? "#dad9d9" : "white"),
                 cursor: "pointer"
        }}>
            <span>
                <b style={{color: "red"}}>{props.day}</b>
                &nbsp;
                <b>{props.date.weekdayShort}</b>
            </span>

            {props.events.map((event: CalendarEvent, index: number): ReactElement =>
                <Typography key={index} className="mt-2" variant={"body1"}>{event.title} {"-"} {event.time}</Typography>
            )}

        </div>
    </>
}

export default Day;
