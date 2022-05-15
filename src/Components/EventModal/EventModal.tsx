import React, {FC, ReactElement} from "react";
import {Box, Button, Typography, Modal} from "@mui/material";
import {CalendarEvent} from "../../Interfaces/CalendarEvent";
import {DateTime} from "luxon";

interface Props {
    open: boolean
    handleClose: () => void;
    selectedDay: DateTime | null;
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
                width: 400,
                bgcolor: 'background.paper',
                border: '2px solid #000',
                boxShadow: 24,
                p: 4,
            }}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    {props.selectedDay?.toFormat('LLL d yyyy')}
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    {props.events.map((event: CalendarEvent, index: number): ReactElement =>
                        <Typography key={index} className="mt-2" variant={"body1"}>{event.title} {"-"} {event.time}</Typography>
                    )}
                </Typography>

                <Button variant="contained" className="mt-2 mb-4" onClick={props.handleClose}>Close</Button>
            </Box>
        </Modal>
            </>
    );
}

export default EventModal;
