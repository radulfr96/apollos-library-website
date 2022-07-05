import { Guid } from 'guid-typescript';

export interface Author {
    authorID: number;
    authorRecordID: number;
    firstname: string;
    middlename: string;
    lastname: string;
    countryID: string;
    description: string;
    createdBy?: Guid;
}
