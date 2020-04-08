import React from 'react';
import Check from '../image/check.svg'
import X from '../image/x.svg'
import SummeryPice from './SummerPice'

function Summery(props){

    let allPurpose = [{
        label:'Total',
        checkin:0,
        checkOut:0
    },
    {
        label:'Meeting',
        checkin:0,
        checkOut:0
    },
    {
        label:'Event',
        checkin:0,
        checkOut:0
    },
    {
        label:'Interview',
        checkin:0,
        checkOut:0
    },
    {
        label:'Other',
        checkin:0,
        checkOut:0
    }]

    props.summeryData.forEach(element => {
        allPurpose.forEach(item => {
            if(item.label === element.purpose__description){
                item.checkin = element.purpose_count
                item.checkOut = element.checkout_count
            }
        })
        allPurpose[0].checkin += element.purpose_count
        allPurpose[0].checkOut += element.checkout_count
    });


    const summeryList = allPurpose.map((item, index) => <SummeryPice key={Date.now()+index} data={item}/>)

    return (
        <div className="summery">
            <div className="sumLable">
                <div className="checkIn">
                    <img src={Check} alt="check mark"/>
                    <p>Check-in</p>
                </div>
                <div className="checkOut">
                    <img src={X} alt="check-out mark"/>
                    <p>Check-out</p>
                </div>
            </div>
            {summeryList}
        </div>
    )
}

export default Summery