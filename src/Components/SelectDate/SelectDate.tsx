import React, {FC, ReactElement} from "react";
import {Button, Typography} from "@mui/material";
import {DateTime} from "luxon";

interface Props {
    handleNextMonthChange: () => void;
    handlePreviousMonthChange: () => void;
    handleResetDateChange: () => void;
    selectedDate: DateTime
}

const SelectDate: FC<Props> = (props: Props): ReactElement => {
    return (
        <>
            <div className="columns">
                <div className="column is-one-third mt-2">
                    <Button variant="contained" className="mt-2 mb-4" onClick={props.handlePreviousMonthChange}>Previous Month</Button>
                </div>

                <div className="column is-one-third has-text-centered">
                    <Typography className="mt-2 mb-1" variant={"h2"}>{props.selectedDate.toFormat("LLL yyyy")}</Typography>
                    <Button variant="outlined" className="mt-2 mb-4" onClick={props.handleResetDateChange}>Reset</Button>
                </div>

                <div className="column is-one-third has-text-right mt-2">
                    <Button variant="contained" className="mt-2 mb-4" onClick={props.handleNextMonthChange}>Next Month</Button>
                </div>
            </div>
        </>
    )
}

export default SelectDate;
