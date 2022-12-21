import {Duration} from "date-fns";
import React from "react";


type DurationProps={
    id:string,
    arrivalDate:Date,
    departureDate:Date,
    duration:Duration
}
function BabySittingElement(props:DurationProps){

    function handleElementSelected(){
        alert('élement ' + props.id + ' sélectionné.')
    }

    return (
        <>
            <h4 onClick={handleElementSelected}>
                Le {props.arrivalDate.toLocaleDateString()} : de  {props.arrivalDate.toLocaleTimeString()} à {props.departureDate.toLocaleTimeString()}
            </h4>
            <h5>
                soit : {props.duration.hours}h{props.duration.minutes}min
            </h5>
        </>

    )
}

export default BabySittingElement;