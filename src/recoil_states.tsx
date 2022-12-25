import { atom, selector } from "recoil";
import {IbabySitting} from "./Interfaces/IbabySitting";
import {IbabysittingFilter} from "./Interfaces/IbabysittingFilter";
import {Duration} from "date-fns";
import {formatDurationsInHours, sumDurations} from "./Utils/dates";
import {fetchBabySittingsFromLocalStorage} from "./Services/BabySittingService";

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



        return {totalBabySittings,totalBabySittingHours};
    }
})


export {babysittingState, babysittingFilterState, filteredBabySittingState, babysittingStatsState};
