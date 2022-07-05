import { Guid } from 'guid-typescript';

interface Business {
    businessId: number;
    businessRecordId: number;
    name: string;
    streetAddress: string;
    city: string;
    postcode: string;
    state: string;
    countryID: string;
    website: string;
    businessTypeId: number;
    createdBy: Guid;
}

export default Business;
