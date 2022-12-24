import React, {useEffect, useState} from 'react';
import { useNavigate } from "react-router-dom";
import {useRecoilState} from "recoil";
import {babysittingState} from '../recoil_states';
import {sumDurations, filterUniqueYearsFromDates} from "../Utils/dates";
import BabySittingList from "../Babysitting/BabySittingList";
import BabySittingFilters from "../Babysitting/BabySittingFilters";


function View(){

    const navigate = useNavigate();
    const emptyDuration:Duration = {years:0,months:0,days:0,hours:0,minutes:0,seconds:0};

    const [totalDurations, setTotalDurations] = useState<Duration>(emptyDuration);
    const [babySittingYears, setBabySittingYears] = useState<number[]>([]);
    const [babySittings] = useRecoilState(babysittingState);


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

    return(
        <>
            <div>
                <h2>
                    Liste des présences
                </h2>

                <div>
                    <BabySittingFilters />
                </div>

                <div>
                    <BabySittingList />
                </div>

                <h4> Durée Totale sur la période : {totalDurations.hours}h{totalDurations.minutes}min</h4>
                <button onClick={handleNewBabysitting}>Nouvelle saisie de temps</button>
            </div>
        </>

    );
}

export default View;

