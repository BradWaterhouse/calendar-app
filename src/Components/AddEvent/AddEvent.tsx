import React, {ChangeEvent, FC, ReactElement, useState} from "react";
import {Alert, Button, Divider, TextField, Typography} from "@mui/material";
import {DatePicker, TimePicker} from "@mui/x-date-pickers";
import {DateTime} from "luxon";
import {useAbortController} from "../../Hooks/UseAbortController/UseAbortController";

interface Props {
    selectedDay: DateTime | null;
    selectedCalendar: number;
}


const AddEvent: FC<Props> = (props: Props): ReactElement => {
    const [title, setTitle] = useState<string>("");
    const [date, setDate] = useState<DateTime | null>(props.selectedDay);
    const [time, setTime] = useState<DateTime | null>(DateTime.local);
    const [description, setDescription] = useState<string>("");
    const [success, setSuccess] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

    const [addEventController] = useAbortController(1);

    const handleDateChange = (date: DateTime | null): void => setDate(date);

    const handleTimeChange = (time: DateTime | null): void => setTime(time);

    const handleTitleChange = (event: ChangeEvent<HTMLInputElement>): void => setTitle(event.target.value);

    const handleDescriptionChange = (event: ChangeEvent<HTMLTextAreaElement>): void => setDescription(event.target.value);

    const addEvent = (): void => {
        setSuccess(false);
        setError(false);

        console.log(JSON.stringify({
            title,
            description,
            calendarId: props.selectedCalendar,
            date: date?.toFormat('y-MM-dd'),
            time: time?.toFormat("HH:mm")

        }))

        fetch("http://127.0.0.1:8888/event/insert", {
            method: "POST",
            signal: addEventController.signal,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                calendarId: props.selectedCalendar,
                title,
                description,
                date: date?.toFormat('y-MM-dd'),
                time: time?.toFormat("HH:mm")

            })
        })
            .then((response: Response): Promise<{ error?: string }> => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    throw new Error("There has been an error");
                }
            })
            .then((response: { error?: string }): void => {
                if (response.hasOwnProperty("error")) {
                    throw new Error(response.error);
                } else {
                    setSuccess(true);
                }
            })
            .catch(() => setError(true))
    }

    return (
        <>
            <div className="add-event mt-6">
                <Typography className="has-text-centered mb-4" id="modal-modal-title" variant="h5" component="h2">Create
                    new event</Typography>

                <div className="columns is-multiline">
                    <div className="column is-6">
                        <TextField id="outlined-basic" name="title" label="Event Title" variant="outlined" fullWidth={true} value={title} onChange={handleTitleChange} />
                    </div>
                    <div className="column is-3">
                        <DatePicker label="Date" value={date} renderInput={(params) => <TextField {...params} />} onChange={handleDateChange} />
                    </div>
                    <div className="column is-3">
                        <TimePicker label="Time" value={time} renderInput={(params) => <TextField {...params} />} onChange={handleTimeChange} />
                    </div>
                    <div className="column is-12">
                        <TextField id="outlined-basic" name="description" variant="outlined" label="Event Description" multiline rows={4} fullWidth={true} value={description} onChange={handleDescriptionChange}/>
                    </div>
                </div>
            </div>

            {error && <Alert className="mt-4" severity="error">There has been an error adding your event, please try again.</Alert>}
            {success && <Alert className="mt-4" severity="success">Event has been added successfully.</Alert>}

            <Button variant="contained" color="success" className="mt-4 mb-2 is-pulled-left" disabled={(title === "" || description === "")} onClick={addEvent}>Add Event</Button>
        </>
    );
}

export default AddEvent;
