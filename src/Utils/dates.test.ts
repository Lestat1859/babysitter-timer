import {
    calculateDurationBetweenTwoDates,
    sumDurations,
    dateStringToDate,
    filterUniqueYearsFromDates,
    filterUniqueMonthsFromDates,
    lastThreeYears,
    monthNumberToMonthString
} from './dates'

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





