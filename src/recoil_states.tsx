import { atom, selector } from "recoil";
import {IbabySitting} from "./Interfaces/IbabySitting";
import {IbabysittingFilter} from "./Interfaces/IbabysittingFilter";

const defaultDurationState:IbabySitting[] = [];
const defaultBabysittingFilter:IbabysittingFilter = {
    id:'',
    year: new Date().getFullYear(),
    month: new Date().getMonth()+1
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
        let list:IbabySitting[]  = get(babysittingState);
        const filteredList:IbabysittingFilter = get(babysittingFilterState)
        if (filteredList.year !== 0){
            list = list.filter((babysitting)=>babysitting.arrivalDate.getFullYear()==filteredList.year);
            if (filteredList.month !== 0){
                list = list.filter((babysitting)=>babysitting.arrivalDate.getMonth()+1==filteredList.month)
            }
        }
        return list
    }
});





export {babysittingState, babysittingFilterState, filteredBabySittingState};
