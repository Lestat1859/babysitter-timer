import React, {useEffect, useState} from 'react';
import {Duration, format} from "date-fns";
import {calculateDurationBetweenTwoDates, dateStringToDate} from '../../utils/dates'
import {useNavigate, useParams} from "react-router-dom";
import {useRecoilState} from "recoil";
import {babysittingState} from '../../recoil/recoil_states'
import { v4 as uuidv4 } from 'uuid';
import {addBabySittingToLocalStorage, updateBabySittingToLocalStorage} from "../../services/BabySittingService";
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
        <section>
            <div>
                <label> Date d'arrivée : </label>
                <input type="date" value={format(arrivalDate, "yyyy-MM-dd")} onChange={handleArrivalDateChange}/>
            </div>

            <div>
                <label> Heure d'arrivée : </label>
                <input  type="time" value={format(arrivalDate, "HH:mm")} onChange={handleArrivalTimeChange} />
            </div>

            <p></p>

            <div>
                <label> Date de départ : </label>
                <input type="date" value={format(departureDate, "yyyy-MM-dd")} onChange={handleDepartureDateChange}/>
            </div>

            <div>
                <label> Heure de départ : </label>
                <input  type="time" value={format(departureDate, "HH:mm")} onChange={handleDepartureTimeChange} />
            </div>

            <p></p>

            <div>
                <button onClick={handleCalculateClick}> Calculer  </button>
            </div>

            <div>
                <button onClick={handleSave}> Enregistrer  </button>
                <button onClick={handleReturn}> Retour  </button>
            </div>


            <p></p>
            <h4> Durée : {duration.hours } h {duration.minutes || 0} min </h4>
        </section>
    )
}

export default Babysitting;