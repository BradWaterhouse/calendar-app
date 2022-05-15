import React, {FC, ReactElement} from "react";
import {Button, Typography} from "@mui/material";
import {DateTime} from "luxon";

interface Props {
    selectedDate: DateTime;
    setSelectedDate: (date: DateTime) => void;
}

const SelectDate: FC<Props> = (props: Props): ReactElement => {

    const handleNextMonthChange = (): void => props.setSelectedDate(props.selectedDate.plus({month: 1}))

    const handlePreviousMonthChange = (): void => props.setSelectedDate(props.selectedDate.minus({month: 1}))

    //@ts-ignore
    const handleResetDateChange = (): void => props.setSelectedDate(DateTime.local)

    return (
        <>
            <div className="columns">
                <div className="column is-one-third mt-2">
                    <Button variant="contained" className="mt-2 mb-4" onClick={handlePreviousMonthChange}>Previous Month</Button>
                </div>

                <div className="column is-one-third has-text-centered">
                    <Typography className="mt-2 mb-1" variant={"h2"}>{props.selectedDate.toFormat("LLL yyyy")}</Typography>
                    <Button variant="outlined" className="mt-2 mb-4" onClick={handleResetDateChange}>Reset</Button>
                </div>

                <div className="column is-one-third has-text-right mt-2">
                    <Button variant="contained" className="mt-2 mb-4" onClick={handleNextMonthChange}>Next Month</Button>
                </div>
            </div>
        </>
    )
}

export default SelectDate;
