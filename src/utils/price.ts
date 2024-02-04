import {IPriceTimeInterval} from "../interfaces/IPriceTimeInterval";
function getPriceFromPriceIntervalsAndDate(priceIntervals:any, date:number) {
    //const epochDate = Math.floor(date.getTime() / 1000); // Convert the input date to epoch format

    // Find the corresponding value for the input date
    // @ts-ignore
    const matchingInterval = priceIntervals.find(interval => date >= interval.begin.valueOf() && date <= interval.end.valueOf());

    if (matchingInterval) {
        return matchingInterval.price;
    } else {
        return null; // Return null if no matching interval is found
    }
}

function roundTwoDecimals(value:number) {
    const intermediateValue = value * 100;
    const roundedValue = Math.ceil(intermediateValue) / 100;
    return roundedValue;
}




export {getPriceFromPriceIntervalsAndDate,roundTwoDecimals}