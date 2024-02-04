import {Duration, format} from "date-fns";
import React from "react";
import {deleteBabySittingToFireBase} from "../../services/BabySittingService";
import {useRecoilState} from "recoil";
import {babysittingState} from "../../recoil/recoil_states";
import { useNavigate } from "react-router-dom";
import Buttons from "../Buttons/Buttons";
import {logEvent} from "firebase/analytics";
import {fireBaseAnalytics} from "../../utils/firebase";


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
            logEvent(fireBaseAnalytics,"babysitting_element_button_delete");
            deleteBabySittingToFireBase(props.id).then(()=>{
                setBabySittings(babySittings.filter((babySitting) => babySitting.id !== props.id));
            })
        }
    }

    function handleUpdate(){
        logEvent(fireBaseAnalytics,"babysitting_element_button_update");
        navigate("/babysitting/edit/"+props.id);
    }

    return (
        <section className={"p-2 border flex justify-between bg-white"}>

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
                <Buttons label={""} clickFunction={handleUpdate} type={"transparentBgStyle"} iconImage={"detail"} hiddenMd={true}></Buttons>

                <div className={"hidden md:block md:flex"}>
                    <Buttons label={""} clickFunction={handleUpdate} type={"standard"} iconImage={"edit"} ></Buttons>
                    <Buttons label={""} clickFunction={handleDelete} type={"cancel"} iconImage={"delete"} ></Buttons>
                </div>
            </div>
        </section>
    )
}

export default BabySittingElement;
