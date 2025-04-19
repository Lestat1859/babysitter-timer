import { atom, selector } from "recoil";
import {IBabySitting} from "../interfaces/IBabySitting";
import {IBabysittingFilter} from "../interfaces/IBabysittingFilter";
import {IPriceTimeInterval} from "../interfaces/IPriceTimeInterval";
import {Duration} from "date-fns";
import {formatDurationsInHours, sumDurations} from "../utils/dates";
// Import removed to address unused import warning
import {getPriceFromPriceIntervalsAndDate, roundTwoDecimals} from "../utils/price";

const defaultBabysittingFilter:IBabysittingFilter = {
    id:'',
    year: new Date().getFullYear(),
    month: new Date().getMonth()+1
}

const defaultPriceTimeIntervalState:IPriceTimeInterval[]=[];


const defaultBabysitting:IBabySitting[]=[];

const babysittingState = atom({
    key: "babysittingState",
    //default: fetchBabySittingsFromLocalStorage()
    default: defaultBabysitting
});

const priceTimeIntervalState = atom({
    key: "priceTimeIntervalState",
    default:defaultPriceTimeIntervalState
})


const babysittingFilterState = atom({
    key: "babysittingFilterState",
    default: defaultBabysittingFilter
});

const filteredBabySittingState = selector({
    key: "filteredBabySittingState",
    get : async ({get})=>{
        let listBabySittings:IBabySitting[]  = get(babysittingState);

        const filteredList:IBabysittingFilter = get(babysittingFilterState)
        if (filteredList.year !== 0){
            listBabySittings = listBabySittings.filter((babysitting)=>babysitting.arrivalDate.getFullYear()===filteredList.year);
            if (filteredList.month !== 0){
                listBabySittings = listBabySittings.filter((babysitting)=>babysitting.arrivalDate.getMonth()+1===filteredList.month)
            }
        }
        return listBabySittings.sort((babySittingA:any, babySittingB:any)=>babySittingB.arrivalDate-babySittingA.arrivalDate)
    }
});

const babysittingStatsState = selector({
    key:"babysittingStatsState",
    get:({get})=>{
        const filteredList:IBabysittingFilter = get(babysittingFilterState)
        let priceDate = new Date()
        priceDate.setFullYear(filteredList.year)
        priceDate.setMonth(filteredList.month-1)
        const price = getPriceFromPriceIntervalsAndDate(get(priceTimeIntervalState), priceDate.valueOf()) || 0;
        const listBabySittings:IBabySitting[] = get(filteredBabySittingState);
        const totalBabySittings:number = listBabySittings.length;
        const totalBabysittingDurations:Duration = sumDurations(listBabySittings.map( (babySitting) =>
        {return babySitting.duration}));
        const totalBabySittingHours = formatDurationsInHours(totalBabysittingDurations);
        const totalAmount:number = roundTwoDecimals(totalBabySittingHours * price);
        return {totalBabySittings, totalBabySittingHours, totalAmount};
    }
})


export {
    babysittingState,
    priceTimeIntervalState,
    babysittingFilterState,
    filteredBabySittingState,
    babysittingStatsState
};
