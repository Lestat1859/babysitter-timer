import React, {useEffect, useState} from 'react';
import {Duration, format} from "date-fns";
import {calculateDurationBetweenTwoDates, dateStringToDate} from '../../utils/dates'
import {useNavigate, useParams} from "react-router-dom";
import {useRecoilState} from "recoil";
import {
    addBabySittingToFireBase,
    updateBabySittingToFireBase,
    deleteBabySittingToFireBase
} from "../../services/BabySittingService";
import {babysittingState} from '../../recoil/recoil_states'
import { v4 as uuidv4 } from 'uuid';
import {IBabySitting} from "../../interfaces/IBabySitting";
import Buttons from "../Buttons/Buttons";

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
            deleteBabySittingToFireBase(idBabySittingToDelete).then(()=>{
                setBabySittings(babySittings.filter((babySitting) => babySitting.id !== idBabySittingToDelete));
                navigate(-1);
            })
        }
    }
    function addBabysitting(){
        const babySitting = {
            id:uuidv4(),
            arrivalDate: arrivalDate,
            departureDate: departureDate,
            duration:duration
        }

        addBabySittingToFireBase(babySitting).then(()=>{
            setBabySittings([...babySittings, babySitting]);
        });
        //console.table(babySitting);
    }
    function updateBabysitting(){
        const babySitting:IBabySitting = {
            id:idBabysitting || "",
            arrivalDate: arrivalDate,
            departureDate: departureDate,
            duration:duration
        }
        let babySitingsUpdated:IBabySitting[] = babySittings.slice();
        const babysittingPosition:number = babySitingsUpdated.findIndex((babysitting)=>babysitting.id===idBabysitting)
        babySitingsUpdated[babysittingPosition] = babySitting;

        updateBabySittingToFireBase(babySitting).then(()=>{
            setBabySittings(babySitingsUpdated);
        });
    }

    function handleArrivalTimeChange(event:any){
        const dateTemp = event.target.value.split(":");
        const newDate:Date = new Date(arrivalDate.getFullYear(),arrivalDate.getMonth(),arrivalDate.getDate(),dateTemp[0],dateTemp[1],0,0)
        setArrivalDate(newDate);
        setDuration(calculateDurationBetweenTwoDates(newDate,departureDate));
    };
    function handleDepartureTimeChange(event:any){
        const dateTemp = event.target.value.split(":");
        const newDate:Date = new Date(departureDate.getFullYear(),departureDate.getMonth(),departureDate.getDate(),dateTemp[0],dateTemp[1],0,0)
        setDepartureDate(newDate);
        setDuration(calculateDurationBetweenTwoDates(arrivalDate,newDate));
    };
    function handleArrivalDateChange(event:any){
        const newDate:Date = dateStringToDate(event.target.value);
        const newArrivalDate:Date = new Date(newDate.getFullYear(),newDate.getMonth(),newDate.getDate(),arrivalDate.getHours(),arrivalDate.getMinutes(),0,0);
        const newDepartureDate:Date = new Date(newDate.getFullYear(),newDate.getMonth(),newDate.getDate(),departureDate.getHours(),departureDate.getMinutes(),0,0)
        setArrivalDate(newArrivalDate);
        setDepartureDate(newDepartureDate);
        setDuration(calculateDurationBetweenTwoDates(newArrivalDate,newDepartureDate));
    };
    function handleDepartureDateChange(event:any){
        const newDate:Date = dateStringToDate(event.target.value);
        const newDepartureDate:Date = new Date(newDate.getFullYear(),newDate.getMonth(),newDate.getDate(),departureDate.getHours(),departureDate.getMinutes(),0,0);
        setDepartureDate(newDepartureDate);
        setDuration(calculateDurationBetweenTwoDates(arrivalDate,newDepartureDate));

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

            <h2 className={"mb-4 text-2xl font-semibold"}> {idBabysitting!==undefined ? "Modification d'une présence" : "Saisie d'une présence"}</h2>

            <div className={"flex flex-row flex-wrap justify-between"}>
                <div>
                    <div className={"mb-2"}>
                        <div className={"mb-1 flex flex-col"}>
                            <label> Date d'arrivée : </label>
                            <input className={"border p-1.5"} type="date" value={format(arrivalDate, "yyyy-MM-dd")} onChange={handleArrivalDateChange}/>
                        </div>

                        <div className={"mb-1 flex flex-col"}>
                            <label> Heure d'arrivée : </label>
                            <input  className={"border p-1.5"} type="time" value={format(arrivalDate, "HH:mm")} step="300" onChange={handleArrivalTimeChange} />
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

                <div className={"w-36"}>
                    <div className={"my-3 p-4 w-36 mx-auto h-28 bg-white rounded-xl shadow-lg items-center "}>
                        <p className={"pb-2 font-medium text-sm text-gray-500"}> Durée </p>
                        <p className={"font-medium text-3xl text-gray-800"}> {duration.hours } h {duration.minutes || 0}</p>
                    </div>
                </div>
            </div>

            <div className={"mt-12 mb-1 ml-0 border-t border-gray-300"}>
            </div>


            <div className={"mt-6 flex flex-wrap justify-around"}>
                <Buttons label={"Retour"} clickFunction={handleReturn} type={"back"} iconImage={"back"} ></Buttons>
                <Buttons label={"Enregistrer"} clickFunction={handleSave} type={"validate"} iconImage={"save"} ></Buttons>
                {idBabysitting!==undefined ? (
                    <Buttons label={"Supprimer"} clickFunction={deleteBabySitting} type={"cancel"} iconImage={"delete"} ></Buttons>
                ):
                    (<></>)
                }
            </div>
            <p></p>
        </section>
    )
}

export default Babysitting;
