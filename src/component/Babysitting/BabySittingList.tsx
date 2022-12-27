
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
            <h2 className={" mb-3 text-xl font-semibold"}>
                Liste des présences
            </h2>

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


            <div>

                <button className={"mx-1 px-4 py-1 text-sm text-blue-600 font-semibold rounded-full border border-blue-200 hover:text-white hover:bg-blue-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"}
                    onClick={handleNewBabysitting}>Ajouter une présence</button>

            </div>
        </div>
    )
}

export default BabySittingList;
