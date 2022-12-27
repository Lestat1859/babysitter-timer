import React from "react";
import {useRecoilValue} from "recoil";
import {babysittingStatsState} from "../../recoil/recoil_states";

function BabySittingStats(){
    const {totalBabySittings,totalBabySittingHours, totalAmount} = useRecoilValue(babysittingStatsState);
    return (
        <>
            {
                totalBabySittings !==0 ? (
                    <>
                        <h2>
                            Statistiques
                        </h2>
                        <div>
                            <h4> Nombre de gardes sur la période : {totalBabySittings}</h4>
                            <h4> Durée Totale sur la période : {totalBabySittingHours} heures</h4>
                            <h4> Montant a déclarer : {totalAmount} €</h4>
                        </div>
                    </>
                ) : (<></>)
            }
        </>
    )
}



export default BabySittingStats