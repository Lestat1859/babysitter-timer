import { atom, selector } from "recoil";
import {IbabySitting} from "./Interfaces/IbabySitting";
import {IbabysittingFilter} from "./Interfaces/IbabysittingFilter";
import {Duration} from "date-fns";
import {sumDurations} from "./Utils/dates";

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

const babysittingStatsState = selector({
    key:"babysittingStatsState",
    get:({get})=>{
        const listBabySittings:IbabySitting[] = get(filteredBabySittingState);
        const totalBabySittings:number = listBabySittings.length;
        const totalBabysittingDurations:Duration = sumDurations(listBabySittings.map( (babySitting) =>
        {return babySitting.duration}))

        return {totalBabySittings,totalBabysittingDurations};
    }
})


export {babysittingState, babysittingFilterState, filteredBabySittingState, babysittingStatsState};
