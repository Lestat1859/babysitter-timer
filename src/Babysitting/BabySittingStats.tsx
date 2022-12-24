import React from "react";
import {useRecoilValue} from "recoil";
import {babysittingStatsState} from "../recoil_states";

function BabySittingStats(){
    const {totalBabySittings,totalBabysittingDurations} = useRecoilValue(babysittingStatsState);
    return (
        <>
            {
                totalBabySittings !==0 ? (
                    <div>
                        <h3> Nombre de gardes sur la période : {totalBabySittings}</h3>
                        <h3> Durée Totale sur la période : {totalBabysittingDurations.hours}h{totalBabysittingDurations.minutes}min</h3>
                    </div>
                ) : (
                    <>
                        <h3> Aucune garde sur la période</h3>
                    </>
                )
            }
        </>
    )
}


export default BabySittingStats