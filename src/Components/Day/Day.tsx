import React, {FC, ReactElement} from "react";
import { Typography } from "@mui/material";
import {DateTime} from "luxon";
import {CalendarEvent} from "../../Interfaces/CalendarEvent";

interface Props {
    day: number;
    date: DateTime;
    events: CalendarEvent[];
    setSelectedDay: (date: DateTime) => void;
    setOpen: (open: boolean) => void;
}

const Day: FC<Props> = (props: Props): ReactElement => {

    const setActiveDay = (date: DateTime) => {
        props.setSelectedDay(date);
        date && props.setOpen(true);
    }

    return <>
        <div className="column is-one-fifth mb-1" onClick={() => setActiveDay(props.date)}
             style={{
                 borderStyle: "solid",
                 borderColor: "black",
                 borderRadius: 5,
                 marginBottom: 0.2,
                 width: "14.2857%",
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
                <Typography
                    key={index}
                    className="mt-1"
                    variant={"body1"}
                    style={{backgroundColor: event.end_date ? "#99f0ff" : "", textAlign: "center"}}
                >
                    {event.title}
                </Typography>
            )}

        </div>
    </>
}

export default Day;
