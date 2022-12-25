import React from "react";
import {useRecoilValue} from "recoil";
import {babysittingStatsState} from "../recoil_states";

function BabySittingStats(){
    const {totalBabySittings,totalBabySittingHours, totalAmount} = useRecoilValue(babysittingStatsState);
    return (
        <>
            <h2>
                Statistiques
            </h2>
            {
                totalBabySittings !==0 ? (
                    <div>
                        <h4> Nombre de gardes sur la période : {totalBabySittings}</h4>
                        <h4> Durée Totale sur la période : {totalBabySittingHours} heures</h4>
                        <h4> Montant a déclarer : {totalAmount} €</h4>
                    </div>
                ) : (
                    <>
                        <h4> Aucune garde sur la période</h4>
                    </>
                )
            }
        </>
    )
}


export default BabySittingStats