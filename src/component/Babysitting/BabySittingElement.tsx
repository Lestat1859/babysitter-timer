import {Duration, format} from "date-fns";
import React from "react";
import {deleteBabySittingToLocalStorage} from "../../services/BabySittingService";
import {useRecoilState} from "recoil";
import {babysittingState} from "../../recoil/recoil_states";
import { useNavigate } from "react-router-dom";


type DurationProps={
    id:string,
    arrivalDate:Date,
    departureDate:Date,
    duration:Duration
}
function BabySittingElement(props:DurationProps){
    const [babySittings, setBabySittings] = useRecoilState(babysittingState);
    const navigate = useNavigate();

    function handleDelete(){
        const okToDelete:boolean = window.confirm("Voulez-vous vraiment supprimer cette saisie ?");
        if (okToDelete) {
            deleteBabySittingToLocalStorage(props.id);
            setBabySittings(babySittings.filter((babySitting) => babySitting.id !== props.id))
        }
    }

    function handleUpdate(){
        navigate("/babysitting/edit/"+props.id);
    }


    return (
        <>
            <tr>
                <td className={"px-2 border border-slate-700"}>{props.arrivalDate.toLocaleDateString()}</td>
                <td className={"px-2 border border-slate-700"}>{format(props.arrivalDate,'HH:mm')}</td>
                <td className={"px-2 border border-slate-700"}>{format(props.departureDate,'HH:mm')}</td>
                <td className={"px-2 border border-slate-700"}>{props.duration.hours}h{props.duration.minutes}</td>
                <td className={"px-2 border border-slate-700"}>
                    <button className={"px-3 py-1 text-sm text-blue-600 font-semibold rounded-full  " +
                        "hover:text-white hover:bg-blue-600 hover:border-transparent " +
                        "focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"}
                        onClick={handleUpdate}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>

                    </button>

                    <button className={"px-3 py-1 text-sm text-red-700 font-semibold rounded-full  hover:text-white " +
                        "hover:bg-red-700 hover:border-transparent " +
                        "focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"}
                            onClick={handleDelete}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </button>
                </td>
            </tr>
        </>
    )
}

export default BabySittingElement;