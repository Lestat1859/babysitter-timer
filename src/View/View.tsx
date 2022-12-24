import React, {useEffect, useState} from 'react';
import { useNavigate } from "react-router-dom";
import {useRecoilState, useRecoilValue} from "recoil";
import {babysittingState, babysittingStatsState} from '../recoil_states';
import {sumDurations, filterUniqueYearsFromDates} from "../Utils/dates";
import BabySittingList from "../Babysitting/BabySittingList";
import BabySittingFilters from "../Babysitting/BabySittingFilters";


function View(){

    const navigate = useNavigate();

    const [babySittingYears, setBabySittingYears] = useState<number[]>([]);
    const [babySittings] = useRecoilState(babysittingState);
    const {totalBabySittings,totalBabysittingDurations} = useRecoilValue(babysittingStatsState);


    useEffect(()=>{
        setBabySittingYears(filterBabySittingYears());
    },[]);


    useEffect(()=>{
        setBabySittingYears(filterBabySittingYears());
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

                <div>
                    <p>------------------------</p>
                    <button onClick={handleNewBabysitting}>Nouvelle saisie de temps</button>
                    <p>------------------------</p>
                </div>

            </div>

            {
                totalBabySittings !==0 ? (
                <div>
                    <h3> Nombre de gardes sur la période : {totalBabySittings}</h3>
                    <h3> Durée Totale sur la période : {totalBabysittingDurations.hours}h{totalBabysittingDurations.minutes}min</h3>
                </div>
                ) : (<>
                    <h3> Aucune garde sur la période</h3>
                </>)
            }

        </>

    );
}

export default View;

