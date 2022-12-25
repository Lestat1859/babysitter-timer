import {Duration} from "date-fns";
import React from "react";
import {deleteBabySittingFromLocalStorage} from "../Services/BabySittingService";
import {useRecoilState} from "recoil";
import {babysittingState} from "../recoil_states";


type DurationProps={
    id:string,
    arrivalDate:Date,
    departureDate:Date,
    duration:Duration
}
function BabySittingElement(props:DurationProps){
    const [babySittings, setBabySittings] = useRecoilState(babysittingState);

    function handleDelete(){
        const okToDelete:boolean = window.confirm("Voulez-vous vraiment supprimer cet saisie ?");
        if (okToDelete) {
            deleteBabySittingFromLocalStorage(props.id);
            setBabySittings(babySittings.filter((babySitting) => babySitting.id !== props.id))
        }
    }

    function handleUpdate(){

    }

    return (
        <>
            <tr>
                <td>{props.arrivalDate.toLocaleDateString()}</td>
                <td>{props.arrivalDate.toLocaleTimeString()}</td>
                <td>{props.departureDate.toLocaleTimeString()}</td>
                <td>{props.duration.hours}h{props.duration.minutes}min</td>
                <td>
                    <button onClick={handleUpdate}>Modifier</button>
                    <button onClick={handleDelete}>Supprimer</button>
                </td>
            </tr>
        </>
    )
}

export default BabySittingElement;