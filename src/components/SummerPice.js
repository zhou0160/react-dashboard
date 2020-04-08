import React from 'react';

function SummeryPice(props){

    return(
        <div className="dataContener">
            <div className="dataContent">
                <p className="dataLabel">{props.data.label}</p>
                <div className="sumData">
                    <p className="checkinData">{props.data.checkin}</p>
                    <p className="checkoutData">{props.data.checkOut}</p>
                </div>
            </div>
        </div>
    )
}

export default SummeryPice