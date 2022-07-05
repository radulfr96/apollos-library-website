import { Guid } from 'guid-typescript';

interface Book {
    bookId?: number;
    bookRecordId: number;
    isbn: string;
    eISBN: string;
    title: string;
    subtitle: string;
    edition?: number;
    publicationFormatId: number;
    fictionTypeId: number;
    formTypeId: number;
    businessId?: number;
    coverImage?: string;
    createdBy?: Guid;
    series: number[];
    genres: number[];
    authors: number[];
}

export default Book;
