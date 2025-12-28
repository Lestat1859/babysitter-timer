import {IPriceTimeInterval} from "../interfaces/IPriceTimeInterval";

function getPriceFromPriceIntervalsAndDate(priceIntervals:IPriceTimeInterval[], date:number, userId?: string) {
    // Find all intervals matching the date
    const validIntervals = priceIntervals.filter((interval: IPriceTimeInterval) => {
        const isAfterStart = date >= interval.begin.valueOf();
        const isBeforeEnd = !interval.end || date <= interval.end.valueOf();
        return isAfterStart && isBeforeEnd;
    });

    // 1. Try to find a user-specific interval
    if (userId) {
        const userInterval = validIntervals.find(interval => interval.userId === userId);
        if (userInterval) {
            return userInterval.price;
        }
    }

    // 2. Fallback: Find a default interval (no userId)
    const defaultInterval = validIntervals.find(interval => !interval.userId);

    if (defaultInterval) {
        return defaultInterval.price;
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
