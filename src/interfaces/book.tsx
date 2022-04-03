interface Book {
    bookId?: number;
    isbn: string;
    eISBN: string;
    title: string;
    subtitle: string;
    seriesId?: number;
    numberInSeries?: number;
    edition?: number;
    publicationFormatId: number;
    fictionTypeId: number;
    formTypeId: number;
    publisherId?: number;
    coverImage?: string;
    genres: number[];
    authors: number[];
}

export default Book;
