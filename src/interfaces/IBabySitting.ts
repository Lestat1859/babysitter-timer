import { Duration } from 'date-fns';

export interface IBabySitting {
    id:string,
    arrivalDate: Date,
    departureDate: Date,
    duration : Duration,
    userId?: string,        // Optionnel pour compatibilité avec anciennes données
    userEmail?: string      // Optionnel pour affichage, fallback "Iloukia" pour anciennes données
}
