import React from 'react';
import { Toggle, Button } from 'rsuite';
import Purpose from './Purpose'
import TimePicker from './TimePicker'
import { Accordion } from 'react-bootstrap';


export default function CollapsedFilter(props){
    return(
        <div className="filter">
            <div className="filterForm">
                <div className="filterLeft">
                    <div className="filterPurose">
                        <p>Purpose</p>
                        <Purpose handlePurposeChange={props.handlePurposeChange}/>
                    </div>
                    <div className="filterTime">
                    <p>Time</p>
                    <TimePicker handleTimeChange={props.handleTimeChange}/>
                </div>
                </div>
                <div className="filterStatus">
                    <p>Status</p>
                    <div>
                        <div>
                            <p>Show Only Active Visits</p>
                            <Toggle disabled={props.inactiveVisitsOnly} onChange={props.handleToggleChange} />
                        </div>
                        
                        <div>
                        <p>Show Only Completed Visits</p>
                        <Toggle disabled={props.activeVisitsOnly} onChange={props.handleCompletedToggleChange} />
                    </div>
                    </div>
                </div>
            </div>
            <Accordion.Toggle eventKey="0"className="filterButtons" as="div" onClick={props.changeTableHeight}>
                <Button appearance="subtle">
                    Cancel
                </Button>
                <Button onClick={props.applyFilters} appearance="primary">
                    Apply
                    {/* {props.isLoading? <span>&nbsp;<Icon icon="spinner" pulse /></span> : ''} */}
                </Button>
            </Accordion.Toggle>
        </div>
    )
}