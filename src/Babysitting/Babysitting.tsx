import React, {useEffect, useState} from 'react';
import {Duration, format, intervalToDuration} from "date-fns";
import {calculateDurationBetweenTwoDates, dateStringToDate} from '../Utils/dates'
import {useNavigate} from "react-router-dom";
import {useRecoilState} from "recoil";
import {babysittingState} from '../recoil_states'
import { v4 as uuidv4 } from 'uuid';

function Babysitting(){

    const emptyDuration:Duration = {years:0,months:0,days:0,hours:0,minutes:0,seconds:0};

    const [duration, setDuration] = useState<Duration>(emptyDuration);
    const [arrivalDate, setArrivalDate] = useState<Date>(new Date());
    const [departureDate, setDepartureDate] = useState<Date>(new Date());

    const [durationAtom, setDurationAtom] = useRecoilState(babysittingState);

    const navigate = useNavigate();


    function handleReturn(){
        navigate(-1);
    }

    function handleSave(){
        setDurationAtom([...durationAtom, {
            id:uuidv4(),
            arrivalDate: arrivalDate,
            departureDate: departureDate,
            duration:duration
        }]);
        alert('Données enregistrés')
        navigate(-1);
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
    },[]);


    return(

        <>
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
        </>
    )
}



export default Babysitting;