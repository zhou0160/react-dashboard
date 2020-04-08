import React from 'react';
import { DateRangePicker } from 'rsuite';

function TimePicker(props){

    return(
        <DateRangePicker onChange={props.handleTimeChange}/>
    )
}

export default TimePicker;