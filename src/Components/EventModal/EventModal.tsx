import React, {FC, ReactElement} from "react";
import {Box, Button, Typography, Modal, Divider} from "@mui/material";
import {CalendarEvent} from "../../Interfaces/CalendarEvent";
import {DateTime} from "luxon";
import AddEvent from "../AddEvent/AddEvent";

interface Props {
    open: boolean
    handleClose: () => void;
    selectedDay: DateTime | null;
    selectedCalendarId: number;
    events: CalendarEvent[]
}

const EventModal: FC<Props> = (props: Props): ReactElement => {
    return (
        <>
        <Modal
            // hideBackdrop
            open={props.open}
            onClose={props.handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={{
                position: 'absolute' as 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: "55%",
                bgcolor: 'background.paper',
                border: '2px solid #000',
                boxShadow: 24,
                p: 4,
            }}>
                <Typography className="has-text-centered" id="modal-modal-title" variant="h5" component="h2">
                    {props.selectedDay?.toFormat('LLL d yyyy')}
                </Typography>
                <div style={{ margin: 2 }}>
                    {props.events.map((event: CalendarEvent): ReactElement =>
                        <>
                            <Typography key={event.id} className="mt-2" variant={"h6"}>{event.title} {"-"} {event.time}</Typography>
                            <Divider className="mt-2" variant="middle" />
                            <Typography className="mt-2" variant={"subtitle2"}>{event.description}</Typography>
                        </>
                    )}
                </div>

                <AddEvent selectedDay={props.selectedDay} selectedCalendar={props.selectedCalendarId} />

                <Button variant="contained" color="error" className="mt-4 mb-2 is-pulled-right" onClick={props.handleClose}>Close</Button>
            </Box>
        </Modal>
            </>
    );
}

export default EventModal;
