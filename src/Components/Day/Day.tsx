import React, {FC, ReactElement} from "react";
import {Typography} from "@mui/material";
import {DateTime} from "luxon";
import {CalendarEvent} from "../../Interfaces/CalendarEvent";

interface Props {
    day: number;
    date: DateTime;
    events: CalendarEvent[];
}

const Day: FC<Props> = (props: Props): ReactElement => {
    console.log(props.date);
    console.log(DateTime.local().toFormat('y-MM-dd'));
    return <>
        <div className="column is-2 mb-1"
             style={{
                 borderStyle: "solid",
                 borderColor: "black",
                 borderRadius: 5,
                 marginBottom: 0.2,
                 borderWidth: 1.5,
                 minHeight: 175,
                 maxHeight: 175,
                 background: (props.date.toFormat('y-MM-dd') === DateTime.local().toFormat('y-MM-dd') ? "#dad9d9" : "white")
        }}>
            <span>
                <b style={{color: "red"}}>{props.day}</b>
                &nbsp;
                <b>{props.date.weekdayShort}</b>
            </span>

            {props.events.map((event: CalendarEvent): ReactElement =>
                <Typography className="mt-2" variant={"body1"}>{event.name} {"-"} {event.time}</Typography>
            )}

        </div>
    </>
}

export default Day;
