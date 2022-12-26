import { atom, selector } from "recoil";
import {IbabySitting} from "../interfaces/IbabySitting";
import {IbabysittingFilter} from "../interfaces/IbabysittingFilter";
import {Duration} from "date-fns";
import {formatDurationsInHours, sumDurations} from "../utils/dates";
import {fetchBabySittingsFromLocalStorage} from "../services/BabySittingService";

import {firebaseAuth} from "../utils/firebase";

const defaultDurationState:IbabySitting[] = [];
const defaultBabysittingFilter:IbabysittingFilter = {
    id:'',
    year: new Date().getFullYear(),
    month: new Date().getMonth()+1
}

const babysittingState = atom({
    key: "babysittingState",
    default: fetchBabySittingsFromLocalStorage()
});

const babysittingFilterState = atom({
    key: "babysittingFilterState",
    default: defaultBabysittingFilter
});

const filteredBabySittingState = selector({
    key: "filteredBabySittingState",
    get : async ({get})=>{
        let listBabySittings:IbabySitting[]  = get(babysittingState);

        const filteredList:IbabysittingFilter = get(babysittingFilterState)
        if (filteredList.year !== 0){
            listBabySittings = listBabySittings.filter((babysitting)=>babysitting.arrivalDate.getFullYear()==filteredList.year);
            if (filteredList.month !== 0){
                listBabySittings = listBabySittings.filter((babysitting)=>babysitting.arrivalDate.getMonth()+1==filteredList.month)
            }
        }
        return listBabySittings
    }
});

const babysittingStatsState = selector({
    key:"babysittingStatsState",
    get:({get})=>{
        const listBabySittings:IbabySitting[] = get(filteredBabySittingState);
        const totalBabySittings:number = listBabySittings.length;
        const totalBabysittingDurations:Duration = sumDurations(listBabySittings.map( (babySitting) =>
        {return babySitting.duration}));
        const totalBabySittingHours = formatDurationsInHours(totalBabysittingDurations);
        const totalAmount:number = totalBabySittingHours*9;
        return {totalBabySittings, totalBabySittingHours, totalAmount};
    }
})


export {
    babysittingState,
    babysittingFilterState,
    filteredBabySittingState,
    babysittingStatsState
};