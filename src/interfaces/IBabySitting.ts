import { Duration } from 'date-fns';

export interface IBabySitting {
    id:string,
    arrivalDate: Date,
    departureDate: Date,
    duration : Duration
}
