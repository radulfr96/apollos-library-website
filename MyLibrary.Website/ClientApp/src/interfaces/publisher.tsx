/* eslint-disable semi */
import Country from './country';

export interface Publisher {
    publisherId: number;
    name: string;
    streetAddress: string;
    city: string;
    postcode: string;
    state: string;
    country: Country;
    website: string;
}
