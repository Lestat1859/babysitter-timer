
import BabySittingElement from "./BabySittingElement";
import { useRecoilValue} from "recoil";
import { filteredBabySittingState} from '../../recoil/recoil_states';
import React from "react";
import { useNavigate } from "react-router-dom";

function BabySittingList (){
    const babySittings = useRecoilValue(filteredBabySittingState);
    const navigate = useNavigate();

    function handleNewBabysitting(){
        navigate("/babysitting/add");
    }

    return(
        <div className={"mb-5 pt-6 pb-8 px-8 max-w-3xl mx-auto bg-gray-100 rounded-xl shadow-lg items-center space-x-4" }>
            <div className={"flex justify-between"}>
                <div>
                    <h2 className={" mb-3 text-xl font-semibold"}>
                        Liste des présences
                    </h2>
                    <p className={"text-gray-600 mb-2"}>Liste et détail des présences durant la période séléctionnée</p>
                </div>

                <button className={"mx-1 px-4 py-1 h-8 text-sm  bg-blue-600 text-gray-50 font-semibold rounded-md border border-blue-600 " +
                    "hover:text-blue-600 hover:bg-gray-50 hover:border-blue-600 " +
                    "focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"}
                        onClick={handleNewBabysitting}>Ajouter</button>
            </div>


            {babySittings.length !==0 ?
                (
                    <table className={"mb-3 table-auto"}>
                        <thead>
                            <tr>
                                <th className={"py-2 border border-slate-600 text-gray-50 font-medium bg-blue-500"}>Date</th>
                                <th className={"py-2 border border-slate-600 text-gray-50 font-medium bg-blue-500"}>Arrivée</th>
                                <th className={"py-2 border border-slate-600 text-gray-50 font-medium bg-blue-500"}>Départ</th>
                                <th className={"py-2 border border-slate-600 text-gray-50 font-medium bg-blue-500"}>Durée</th>
                                <th className={"py-2 border border-slate-600 text-gray-50 font-medium bg-blue-500"}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                        {babySittings.map((durationItem, index)=>(
                                <BabySittingElement
                                    key={`BabySittingElement-${index}`}
                                    id={durationItem.id}
                                    arrivalDate={durationItem.arrivalDate}
                                    departureDate={durationItem.departureDate}
                                    duration={durationItem.duration}
                                />
                            )
                        )
                        }
                        </tbody>
                    </table>
                ) : (<h4> Aucune garde durant cette période</h4>)
            }
        </div>
    )
}

export default BabySittingList;
