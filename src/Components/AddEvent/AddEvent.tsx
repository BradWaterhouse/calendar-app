import React, {ChangeEvent, FC, ReactElement, useState} from "react";
import {Alert, Button, Checkbox, FormControlLabel, FormGroup, TextField, Typography} from "@mui/material";
import {DatePicker, TimePicker} from "@mui/x-date-pickers";
import {DateTime} from "luxon";
import {useAbortController} from "../../Hooks/UseAbortController/UseAbortController";

interface Props {
    selectedDay: DateTime | null;
    selectedCalendar: number;
    fetchEvents: () => void;
}


const AddEvent: FC<Props> = (props: Props): ReactElement => {
    const [title, setTitle] = useState<string>("");
    const [startDate, setStartDate] = useState<DateTime | null>(props.selectedDay);
    const [startTime, setStartTime] = useState<DateTime | null>(DateTime.local);
    const [endDate, setEndDate] = useState<DateTime | null>(null);
    const [endTime, setEndTime] = useState<DateTime | null>(null);
    const [description, setDescription] = useState<string>("");
    const [toggleEndDateTime, setToggleEndDateTime] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

    const [addEventController] = useAbortController(1);

    const handleStartDateChange = (date: DateTime | null): void => setStartDate(date);

    const handleStartTimeChange = (time: DateTime | null): void => setStartTime(time);

    const handleEndDateChange = (date: DateTime | null): void => setEndDate(date);

    const handleEndTimeChange = (time: DateTime | null): void => setEndTime(time);

    const handleTitleChange = (event: ChangeEvent<HTMLInputElement>): void => setTitle(event.target.value);

    const handleDescriptionChange = (event: ChangeEvent<HTMLTextAreaElement>): void => setDescription(event.target.value);

    const handleToggle = (event: ChangeEvent<HTMLInputElement>): void => {
        setToggleEndDateTime(event.target.checked);

        if (!event.target.checked) {
            setEndDate(null);
            setEndTime(null);
        }
    }

    const addEvent = (): void => {
        setSuccess(false);
        setError(false);

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
                start_date: startDate?.toFormat('y-MM-dd'),
                start_time: startTime?.toFormat("HH:mm"),
                end_date: endDate?.toFormat('y-MM-dd')

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
                    props.fetchEvents();
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
                        <DatePicker label="Start Date" value={startDate} renderInput={(params) => <TextField {...params} />} onChange={handleStartDateChange} />
                    </div>
                    <div className="column is-3">
                        <TimePicker label="Start Time" value={startTime} renderInput={(params) => <TextField {...params} />} onChange={handleStartTimeChange} />
                    </div>
                    <div className="column is-6">
                        <FormControlLabel control={<Checkbox onChange={handleToggle} />} label="Add End Date" />
                    </div>
                    {toggleEndDateTime && (
                        <>
                            <div className="column is-3">
                                <DatePicker label="End Date" value={endDate} renderInput={(params) => <TextField {...params} />} onChange={handleEndDateChange} />
                            </div>
                            <div className="column is-3">
                                <TimePicker label="End Time" value={endTime} renderInput={(params) => <TextField {...params} />} onChange={handleEndTimeChange} />
                            </div>
                        </>
                    )}
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
