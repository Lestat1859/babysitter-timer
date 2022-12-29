
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
        <div className={"mb-5 pt-6 pb-8 px-8 max-w-3xl mx-auto bg-gray-100 rounded-xl shadow-lg"}>
            <div className={"flex justify-between items-center"}>
                    <h2 className={"mb-3 text-xl font-semibold"}>
                        Liste des présences
                    </h2>

                <button className={"mx-1 mb-2 px-4 py-2 text-sm text-blue-600 font-semibold rounded-md border border-blue-600 " +
                    "hover:text-white hover:bg-blue-600 hover:border-transparent " +
                    "focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"}
                        onClick={handleNewBabysitting}>

                    <div className={"flex items-center"}>
                        <div className={"mr-2"}>
                            Ajouter
                        </div>

                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </button>
            </div>
            <p className={"text-gray-600 mb-2"}>Liste et détail des présences durant la période séléctionnée</p>

            {babySittings.length !==0 ?
                (
                    <>
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
                    </>
                ) : (<h4 className={" font-semibold"}> Aucune garde durant cette période </h4>)
            }
        </div>
    )
}

export default BabySittingList;
