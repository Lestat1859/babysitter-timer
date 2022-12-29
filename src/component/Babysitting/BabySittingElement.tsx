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
        <section className={"p-2 border flex justify-between"}>

            <div>
                <p className={"mb-0.5 font-semibold "}> Le {props.arrivalDate.toLocaleDateString()}</p>
                <div className={"flex text-green-800"}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className={"ml-1 font-medium"}>{props.duration.hours}h{props.duration.minutes}min</p>
                </div>
            </div>

            <div>
                <p className={"mb-0.5 text-gray-700 "}>{format(props.arrivalDate,'HH:mm')}</p>
                <p className={"text-gray-700"}>{format(props.departureDate,'HH:mm')}</p>
            </div>

            <div className={"flex"}>


                <button className={"px-3 py-2 text-sm text-gray-600 font-semibold rounded-full md:hidden " +
                    "hover:text-white hover:bg-blue-600 hover:border-transparent " +
                    "focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"}
                        onClick={handleUpdate}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                </button>

                <div className={"hidden md:block md:flex"}>
                    <button className={"px-3 py-2 text-sm text-blue-600 font-semibold rounded-full" +
                        "hover:text-white hover:bg-blue-600 hover:border-transparent " +
                        "focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"}
                        onClick={handleUpdate}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 hover:text-white">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                    </button>

                    <button className={"px-3 py-2 text-sm text-red-600 font-semibold rounded-full" +
                        "hover:text-white hover:bg-red-600 hover:border-transparent " +
                        "focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"}
                            onClick={handleDelete}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 hover:text-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </button>
                </div>

            </div>
        </section>
    )
}

export default BabySittingElement;