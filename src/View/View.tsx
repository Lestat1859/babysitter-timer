import React, {useEffect, useState} from 'react';
import { useNavigate } from "react-router-dom";
import {useRecoilState} from "recoil";
import {durationState} from '../recoil_states';
import BabySittingElement from "../Babysitting/BabySittingElement";
import {addHours, addMinutes, Duration, format} from "date-fns";
import {sumDurations, filterUniqueYearsFromDates} from "../Utils/dates";


const months:string[] = ["Janvier","Février", "Mars", "Avril", "Mai", "juin", "juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
function View(){

    const navigate = useNavigate();
    const emptyDuration:Duration = {years:0,months:0,days:0,hours:0,minutes:0,seconds:0};

    const [totalDurations, setTotalDurations] = useState<Duration>(emptyDuration);
    const [babySittingYears, setBabySittingYears] = useState<number[]>([]);
    const [selectedYear,setSelectedYear] =  useState<number>(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState<string>(format(new Date(),'MMMM'));

    const [babySittings] = useRecoilState(durationState);




    useEffect(()=>{
        setBabySittingYears(filterBabySittingYears());
    },[]);


    useEffect(()=>{
        setBabySittingYears(filterBabySittingYears());
        setTotalDurations(sumDurations(filterBabySittingDurations()));
    },[babySittings]);

    function handleNewBabysitting(){
        navigate("/babysitting");
    }

    function handleSelectYearChange(event:any){
        //console.log('handler : ' + event.target.value)
        setSelectedYear(event.target.value)
    }

    function filterBabySittingYears(){
        const dates:Date[] = babySittings.map((babySitting)=>{
            return babySitting.arrivalDate
        })
        return filterUniqueYearsFromDates(dates);
    }

    function filterBabySittingDurations(){
        const durations = babySittings.map( (babySitting) =>
        {return babySitting.duration});
        return durations;
    }

    function handleMonthButtonClick(month:string){
        setSelectedMonth(month);
    }


    return(
        <>
            <div>
                <h2>
                    Liste des présences
                </h2>

                <h3>
                    {selectedMonth} {selectedYear}
                </h3>

                <div>
                    <label>Sélectionner l'année : </label>
                    <select value={selectedYear} onChange={handleSelectYearChange}>
                        {babySittingYears.sort((a,b)=>b-a).map((babySittingYear,index:number)=>(
                            <option key={`${babySittingYear}-${index}`}>{babySittingYear}</option>
                        ))}
                    </select>
                </div>
                <div>
                    {months.map((month)=>(
                        <button onClick={()=>handleMonthButtonClick(month)}>{month}</button>
                    ))}
                </div>

                <div>
                    {babySittings.map((durationItem, index)=>(
                        <BabySittingElement
                            key={`BabySittingElement-${index}`}
                            id={durationItem.id}
                            arrivalDate={durationItem.arrivalDate}
                            departureDate={durationItem.departureDate}
                            duration={durationItem.duration}
                        />
                        )
                    )}
                </div>
                <h4> Durée Totale sur la période : {totalDurations.hours}h{totalDurations.minutes}min</h4>
                <button onClick={handleNewBabysitting}>Nouvelle saisie de temps</button>
            </div>
        </>

    );
}

export default View;

