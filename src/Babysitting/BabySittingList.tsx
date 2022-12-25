
import BabySittingElement from "./BabySittingElement";
import { useRecoilValue} from "recoil";
import { filteredBabySittingState} from '../recoil_states';
import React from "react";
import { useNavigate } from "react-router-dom";

function BabySittingList (){
    const babySittings = useRecoilValue(filteredBabySittingState);
    const navigate = useNavigate();

    function handleNewBabysitting(){
        navigate("/babysitting");
    }

    return(
        <>
            <h2>
                Liste des présences
            </h2>
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

            <div>
                <p>------------------------</p>
                <button onClick={handleNewBabysitting}>Ajouter une présence</button>
                <p>------------------------</p>
            </div>
        </>
    )
}

export default BabySittingList;
