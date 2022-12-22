
import BabySittingElement from "./BabySittingElement";
import {useRecoilState} from "recoil";
import {durationState} from '../recoil_states';
import React from "react";


function BabySittingList (){
    const [babySittings] = useRecoilState(durationState);

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