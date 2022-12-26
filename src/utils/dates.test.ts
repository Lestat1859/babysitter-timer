import {
    calculateDurationBetweenTwoDates,
    sumDurations,
    dateStringToDate,
    filterUniqueYearsFromDates,
    filterUniqueMonthsFromDates,
    lastThreeYears,
    monthNumberToMonthString,
    formatDurationsInHours
} from './dates'
import {IbabySitting} from "../interfaces/IbabySitting";

const mockedStartDate:Date = new Date('1970-01-01T00:00:00.000');
const mockedEndDate:Date = new Date('1970-01-01T02:00:00.000');
const mockedDurations:Duration[] = [
    {years:0,months:0,days:0,hours:2,minutes:15,seconds:0},
    {years:0,months:0,days:0,hours:2,minutes:15,seconds:0}
]
const mockedDates:Date[] = [
    new Date("1970/01/01"),
    new Date("1970/02/01"),
    new Date("1980/03/01"),
    new Date("1980/03/01"),
    new Date("1990/02/01"),
    new Date("1990/01/01"),
]
const mockedDuration:Duration = {years:1,months:1,weeks:1,hours:1,minutes:1}
const mockedBabySittingFromLocalStorage:string = `
[
    {
        "id":"0964a48c-6a29-441b-838b-a3c42135c471",
        "arrivalDate":"2022-12-25T07:58:37.110Z",
        "departureDate":"2022-12-25T11:58:00.000Z",
        "duration":{"years":0,"months":0,"days":0,"hours":3,"minutes":59,"seconds":22}
    }
]
`

it('should get the year from local storage date',  () => {
    const babySitings:IbabySitting[] = JSON.parse(mockedBabySittingFromLocalStorage);
    babySitings[0].arrivalDate = new Date(babySitings[0].arrivalDate);
    expect(babySitings[0].arrivalDate.getFullYear()).toEqual(2022);
});

it('Should return the duration between two dates', () => {
    expect(calculateDurationBetweenTwoDates(mockedStartDate, mockedEndDate)).toEqual({years:0,months:0,days:0,hours:2,minutes:0,seconds:0});
});

it('Should return the date "1970-01-01" in Date format' , () => {
    expect(dateStringToDate("1970-01-01")).toEqual(new Date("01/01/1970"));
});

it('Should return the of the Durations' , () => {
    expect(sumDurations(mockedDurations)).toEqual({years:0,months:0,days:0,hours:4,minutes:30,seconds:0});
});

it( 'Should return the list of unique years from a date array', ()=>{
    expect(filterUniqueYearsFromDates(mockedDates)).toEqual([1970,1980,1990]);
})
it( 'Should return the list of unique months from a date array', ()=>{
    expect(filterUniqueMonthsFromDates(mockedDates)).toEqual([0,1,2]);
})

it( 'Should return the month in a string format', ()=>{
    expect(monthNumberToMonthString(0)).toEqual("Janvier");
    expect(monthNumberToMonthString(6)).toEqual("Juillet");
    expect(monthNumberToMonthString(11)).toEqual("Décembre");
})

it( 'Should return the last three years',()=>{
    expect (lastThreeYears(2022)).toEqual([2022,2021,2020]);
})

it( 'Should return the number oh hour of a duration',()=>{
    expect (formatDurationsInHours(mockedDuration)).toEqual(9650);
})




