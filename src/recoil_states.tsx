import { atom, selector } from "recoil";
import {IbabySitting} from "./Interfaces/IbabySitting";
import {IbabysittingFilter} from "./Interfaces/IbabysittingFilter";

const defaultDurationState:IbabySitting[] = [];
const defaultBabysittingFilter:IbabysittingFilter = {
    id:'',
    year:0,
    month:0,

}

const babysittingState = atom({
    key: "durationState",
    default: defaultDurationState
});

const babysittingFilterState = atom({
    key: "babysittingFilterState",
    default: defaultBabysittingFilter
});



const filteredBabySittingState = selector({
    key: "filteredBabySittingState",
    get : ({get})=>{
        const list:IbabySitting[]  = get(babysittingState);
        const filter:IbabysittingFilter = get(babysittingFilterState)
        //const filteredList:IbabySitting[] = get(babysittingFilterState);


        if (filter.year !== 0){
            return list.filter((babysitting)=>babysitting.arrivalDate.getFullYear()===filter.year);
        }else {
            return list
        }



        //return list.filter((babysitting)=>babysitting.arrivalDate.getFullYear()===2023);



    }
});





export {babysittingState, filteredBabySittingState};
