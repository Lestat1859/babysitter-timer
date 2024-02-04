
import BabySittingElement from "./BabySittingElement";
import { useRecoilValue} from "recoil";
import { filteredBabySittingState} from '../../recoil/recoil_states';
import React from "react";
import { useNavigate } from "react-router-dom";
import Buttons from "../Buttons/Buttons";
import {logEvent} from "firebase/analytics";
import {fireBaseAnalytics} from "../../utils/firebase";

function BabySittingList (){
    const babySittings = useRecoilValue(filteredBabySittingState);
    const navigate = useNavigate();

    function handleNewBabysitting(){
        logEvent(fireBaseAnalytics,"babysitting_list_button_add");
        navigate("/babysitting/add");
    }

    return(
        <div className={"mb-5 pt-6 pb-8 px-8 max-w-3xl mx-auto bg-gray-100 rounded-xl shadow-lg"}>
            <div className={"flex justify-between items-center"}>
                    <h2 className={"mb-3 text-xl font-semibold"}>
                        Détail des présences
                    </h2>

                <Buttons label={"Ajouter"} clickFunction={handleNewBabysitting} type={"standard"} iconImage={"add"} ></Buttons>

            </div>
            <p className={"text-gray-600 mb-2"}>Détail des présences durant la période séléctionnée</p>

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
                ) : (<h4 className={"text-orange-600 font-semibold"}> Aucune garde durant cette période </h4>)
            }
        </div>
    )
}

export default BabySittingList;
