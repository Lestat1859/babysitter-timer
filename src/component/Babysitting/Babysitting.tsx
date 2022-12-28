import React, {useEffect, useState} from 'react';
import {Duration, format} from "date-fns";
import {calculateDurationBetweenTwoDates, dateStringToDate} from '../../utils/dates'
import {useNavigate, useParams} from "react-router-dom";
import {useRecoilState} from "recoil";
import {
    addBabySittingToLocalStorage,
    deleteBabySittingToLocalStorage,
    updateBabySittingToLocalStorage
} from "../../services/BabySittingService";
import {babysittingState} from '../../recoil/recoil_states'
import { v4 as uuidv4 } from 'uuid';
import {IbabySitting} from "../../interfaces/IbabySitting";

function Babysitting(){
    const emptyDuration:Duration = {years:0,months:0,days:0,hours:0,minutes:0,seconds:0};
    const [duration, setDuration] = useState<Duration>(emptyDuration);
    const [arrivalDate, setArrivalDate] = useState<Date>(new Date());
    const [departureDate, setDepartureDate] = useState<Date>(new Date());
    const [babySittings, setBabySittings] = useRecoilState(babysittingState);
    const navigate = useNavigate();
    const { idBabysitting } = useParams() || "";

    function handleReturn(){
        navigate(-1);
    }

    function handleSave(){
        if ((duration.days !== 0) || (duration.hours !== 0) || (duration.minutes !== 0) || (duration.seconds !== 0)){
            if (idBabysitting!== undefined){
                updateBabysitting();
            }else{
                addBabysitting();
            }
            navigate(-1);
        }
        else{
            alert("Vous devez saisir une durée supérieur a 0 avant de pouvoir enregistrer ")
        }
    }

    function deleteBabySitting(){
        const idBabySittingToDelete = idBabysitting || "";
        const okToDelete:boolean = window.confirm("Voulez-vous vraiment supprimer cette saisie ?");
        if (okToDelete) {
            deleteBabySittingToLocalStorage(idBabySittingToDelete);
            setBabySittings(babySittings.filter((babySitting) => babySitting.id !== idBabySittingToDelete))
        }
    }

    function addBabysitting(){
        const babySitting = {
            id:uuidv4(),
            arrivalDate: arrivalDate,
            departureDate: departureDate,
            duration:duration
        }
        addBabySittingToLocalStorage(babySitting);
        setBabySittings([...babySittings, babySitting]);
    }
    function updateBabysitting(){
        const babySitting:IbabySitting = {
            id:idBabysitting || "",
            arrivalDate: arrivalDate,
            departureDate: departureDate,
            duration:duration
        }
        let babySitingsUpdated:IbabySitting[] = babySittings.slice();
        const babysittingPosition:number = babySitingsUpdated.findIndex((babysitting)=>babysitting.id===idBabysitting)
        babySitingsUpdated[babysittingPosition] = babySitting;
        updateBabySittingToLocalStorage(babySitting);
        setBabySittings(babySitingsUpdated);
    }

    function handleArrivalTimeChange(event:any){
        const dateTemp = event.target.value.split(":");
        setArrivalDate(new Date(arrivalDate.getFullYear(),arrivalDate.getMonth(),arrivalDate.getDate(),dateTemp[0],dateTemp[1],0,0));
    };

    function handleDepartureTimeChange(event:any){
        const dateTemp = event.target.value.split(":");
        setDepartureDate(new Date(departureDate.getFullYear(),departureDate.getMonth(),departureDate.getDate(),dateTemp[0],dateTemp[1],0,0));
    };

    function handleArrivalDateChange(event:any){
        setArrivalDate(dateStringToDate(event.target.value));
    };

    function handleDepartureDateChange(event:any){
        setDepartureDate(dateStringToDate(event.target.value));
    };

    function calculateDuration(){
        if (arrivalDate<departureDate) {
            setDuration(calculateDurationBetweenTwoDates(arrivalDate,departureDate));
        }else{
            alert("La l'heure d'arrivée doit être antérieur à l'heure de départ.")
            setDuration(emptyDuration);
        }
    }

    function handleCalculateClick(){
        calculateDuration()
    };

    useEffect(()=>{
        setDuration(calculateDurationBetweenTwoDates(arrivalDate,departureDate));
        if (idBabysitting!== undefined){
            const babysitting = babySittings.find((element)=> element.id === idBabysitting);
            if (babysitting !==undefined){
                setArrivalDate(babysitting.arrivalDate);
                setDepartureDate(babysitting.departureDate);
                setDuration(calculateDurationBetweenTwoDates(babysitting.arrivalDate,babysitting.departureDate))
            }
        }
    },[]);


    return(
        <section className={"mt-24 pt-6 pb-6 px-8 max-w-lg mx-auto bg-gray-100 rounded-xl shadow-lg items-center"}>

            <h2 className={"mb-4 text-2xl font-semibold"}> Saisie d'une présence</h2>

            <div className={"flex flex-row flex-wrap justify-between"}>
                <div>
                    <div className={"mb-2"}>
                        <div className={"mb-1 flex flex-col"}>
                            <label> Date d'arrivée : </label>
                            <input className={"border p-1.5"} type="date" value={format(arrivalDate, "yyyy-MM-dd")} onChange={handleArrivalDateChange}/>
                        </div>

                        <div className={"mb-1 flex flex-col"}>
                            <label> Heure d'arrivée : </label>
                            <input  className={"border p-1.5"} type="time" value={format(arrivalDate, "HH:mm")} onChange={handleArrivalTimeChange} />
                        </div>
                    </div>


                    <div className={"mb-6"}>
                        <div className={"mb-1 flex flex-col"}>
                            <label> Date de départ : </label>
                            <input className={"border p-1.5"} type="date" value={format(departureDate, "yyyy-MM-dd")} onChange={handleDepartureDateChange}/>
                        </div>

                        <div className={"mb-1 flex flex-col"}>
                            <label> Heure de départ : </label>
                            <input  className={"border p-1.5"} type="time" value={format(departureDate, "HH:mm")} onChange={handleDepartureTimeChange} />
                        </div>
                    </div>
                </div>

                <div>
                    <div className={"my-3 p-4 w-36 mx-auto h-28 bg-white rounded-xl shadow-lg items-center "}>
                        <p className={"pb-2 font-medium text-sm text-gray-500"}> Durée </p>
                        <p className={"font-medium text-3xl text-gray-800"}> {duration.hours } h {duration.minutes || 0}</p>
                    </div>
                    <button className={"px-4 py-1 w-max text-sm text-green-600 font-semibold align-center rounded-md border border-green-600 " +
                        "hover:text-white hover:bg-green-600 hover:border-transparent " +
                        "focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"}
                            onClick={handleCalculateClick}> Calculer </button>
                </div>
            </div>


            <div className={"mt-12 mb-1 ml-0 border-t border-gray-300"}>
            </div>


            <div className={"mt-6 flex flex-wrap justify-around"}>

                <button className={"mx-1 mb-2 px-4 py-1 text-sm text-blue-600 font-semibold rounded-md border border-blue-600 " +
                    "hover:text-white hover:bg-blue-600 hover:border-transparent " +
                    "focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"}
                        onClick={handleReturn}>
                    <div className={"flex items-center"}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                        </svg>
                        <p className={"ml-2"}>Retour</p>
                    </div>
                </button>

                <button className={"mx-1 mb-2 px-4 py-1 text-sm text-blue-600 font-semibold rounded-md border border-blue-600 " +
                    "hover:text-white hover:bg-blue-600 hover:border-transparent " +
                    "focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"}
                    onClick={handleSave}>
                    <div className={"flex items-center"}>
                        <svg width="24px" height="24px" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor">
                            <path d="M3 19V5a2 2 0 012-2h11.172a2 2 0 011.414.586l2.828 2.828A2 2 0 0121 7.828V19a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="currentColor" stroke-width="1.5"></path>
                            <path d="M8.6 9h6.8a.6.6 0 00.6-.6V3.6a.6.6 0 00-.6-.6H8.6a.6.6 0 00-.6.6v4.8a.6.6 0 00.6.6zM6 13.6V21h12v-7.4a.6.6 0 00-.6-.6H6.6a.6.6 0 00-.6.6z" stroke="currentColor" stroke-width="1.5"></path>
                        </svg>
                        <p className={"ml-2"}>Enregistrer</p>
                    </div>
                </button>


                {idBabysitting!==undefined ? (
                    <button className={"mx-1 mb-2 px-4 py-1 text-sm text-red-600 font-semibold rounded-md border border-red-600 " +
                    "hover:text-white hover:bg-red-600 hover:border-transparent " +
                    "focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"}
                            onClick={deleteBabySitting}>
                    <div className={"flex items-center"}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 hover:text-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className={"ml-2"}>Supprimer</p>
                    </div>
                </button>
                ):
                    (<></>)
                }


            </div>

            <p></p>

        </section>
    )
}

export default Babysitting;