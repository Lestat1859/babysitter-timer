import {addHours, addMinutes, Duration, intervalToDuration} from "date-fns";

const emptyDuration:Duration = {years:0,months:0,days:0,hours:0,minutes:0,seconds:0};

export function calculateDurationBetweenTwoDates<Duration>( Arrival:Date, Departure:Date){
    return (intervalToDuration({
        start:Arrival,
        end:Departure
    }))
};

export function dateStringToDate<Date>(dateString:string){
    const dateArray = dateString.split("-");
    const year = parseInt(dateArray[0]);
    const month = parseInt(dateArray[1])-1;
    const day = parseInt(dateArray[2]);
    return new Date(year, month, day);
};

export function lastThreeYears(year:number):number[]{
    return[year,year-1, year-2]
}


export function sumDurations(durations:Duration[]):Duration{
    const referenceDay:Date = new Date('1970-01-01T00:00:00.000');
    let tempDate:Date = referenceDay;
    let totalDuration = emptyDuration;

    durations.forEach((duration)=>{
        tempDate = addHours(tempDate,duration.hours || 0 );
        tempDate = addMinutes(tempDate,duration.minutes || 0 );
    });

    totalDuration = calculateDurationBetweenTwoDates(referenceDay,tempDate);

    return totalDuration
}

export function filterUniqueYearsFromDates(dates:Date[]):number[]{
const years = dates.map((date)=>{
    return date.getFullYear()
})
    // @ts-ignore
    return [...new Set(years)];
}

export function filterUniqueMonthsFromDates(dates:Date[]):number[]{
    const months = dates.map((date)=>{
        return date.getMonth()
    })
    // @ts-ignore
    return [...new Set(months)];
}

export function monthNumberToMonthString(month:number):string{
    const monthInString = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
    return monthInString[month];
}
