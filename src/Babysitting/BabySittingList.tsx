
import BabySittingElement from "./BabySittingElement";
import { useRecoilValue} from "recoil";
import { filteredBabySittingState} from '../recoil_states';
import React from "react";


function BabySittingList (){
    const babySittings = useRecoilValue(filteredBabySittingState);

    return(
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
    )
}

export default BabySittingList;


/*
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
 */