import { atom, selector } from "recoil";
import {IBabySitting} from "../interfaces/IBabySitting";
import {IBabysittingFilter} from "../interfaces/IBabysittingFilter";
import {IPriceTimeInterval} from "../interfaces/IPriceTimeInterval";
import {IAuth, defaultAuth} from "../interfaces/IAuth";
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

// État d'authentification avec gestion des rôles
const authState = atom<IAuth>({
    key: "authState",
    default: defaultAuth
});

const userRoleSelector = selector({
    key: "userRoleSelector",
    get: ({get}) => {
        const auth = get(authState);
        return {
            role: auth.role,
            isAdmin: auth.isAdmin,
            isAuthenticated: auth.email !== "null" && auth.uid !== "null"
        };
    }
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
        const priceIntervals = get(priceTimeIntervalState);
        const listBabySittings:IBabySitting[] = get(filteredBabySittingState);
        
        const totalBabySittings:number = listBabySittings.length;
        const totalBabysittingDurations:Duration = sumDurations(listBabySittings.map( (babySitting) =>
        {return babySitting.duration}));
        const totalBabySittingHours = formatDurationsInHours(totalBabysittingDurations);

        // Group sessions by User and Price to preserve "sum durations then round" logic
        const sessionsGroupedByUserAndPrice: Record<string, { duration: Duration[], price: number }> = {};
        
        listBabySittings.forEach(session => {
            const price = getPriceFromPriceIntervalsAndDate(
                priceIntervals,
                session.arrivalDate.getTime(),
                session.userId
            ) || 0;
            
            // Key to group by: UserID + Price
            const key = `${session.userId || 'default'}_${price}`;
            
            if (!sessionsGroupedByUserAndPrice[key]) {
                sessionsGroupedByUserAndPrice[key] = { duration: [], price: price };
            }
            sessionsGroupedByUserAndPrice[key].duration.push(session.duration);
        });
        
        let totalAmount = 0;
        
        Object.values(sessionsGroupedByUserAndPrice).forEach(group => {
            const totalDurationForGroup = sumDurations(group.duration);
            const totalHoursForGroup = formatDurationsInHours(totalDurationForGroup);
            totalAmount += totalHoursForGroup * group.price;
        });
        
        totalAmount = roundTwoDecimals(totalAmount);

        return {totalBabySittings, totalBabySittingHours, totalAmount};
    }
})


export {
    babysittingState,
    priceTimeIntervalState,
    babysittingFilterState,
    filteredBabySittingState,
    babysittingStatsState,
    authState,
    userRoleSelector
};
