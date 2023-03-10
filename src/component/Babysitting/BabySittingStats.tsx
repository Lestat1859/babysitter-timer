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
                        <div className={"mb-5 pt-6 pb-8 px-8 max-w-3xl mx-auto bg-gray-100 rounded-xl shadow-lg items-center" }>
                            <h2 className={"text-xl font-semibold"}>
                                Statistiques
                            </h2>
                            <div className={"flex flex-wrap justify-between"}>
                                <div className={"my-3 mx-3 p-4 w-min-42 mx-auto bg-white rounded-xl shadow-lg items-center "}>
                                    <p className={"pb-2 font-medium text-sm text-gray-500"}> Nombre de gardes  </p>
                                    <p className={"font-medium text-3xl text-gray-800"}> {totalBabySittings}</p>
                                </div>
                                <div className={"my-3 mx-3 p-4 w-min-42 mx-auto bg-white rounded-xl shadow-lg items-center "}>
                                    <p className={"pb-2 font-medium text-sm text-gray-500"}> Durée Totale </p>
                                    <p className={"font-medium text-3xl text-gray-800"}> {totalBabySittingHours} heures</p>
                                </div>
                                <div className={"my-3 mx-3 p-4 w-min-42 mx-auto bg-white rounded-xl shadow-lg items-center "}>
                                    <p className={"pb-2 font-medium text-sm text-gray-500"}> A déclarer </p>
                                    <p className={"font-medium text-3xl text-gray-800"}> {totalAmount} € </p>
                                </div>
                            </div>

                        </div>

                    </>
                ) : (<></>)
            }
        </>
    )
}



export default BabySittingStats