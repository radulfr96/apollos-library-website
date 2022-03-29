interface Book {
    bookId?: number;
    isbn: string;
    eisbn: string;
    title: string;
    subtitle: string;
    seriesId?: number;
    numberInSeries?: number;
    edition?: number;
    publicationFormatId: number;
    fictionTypeId: number;
    formTypeId: number;
    publisherId?: number;
    coverImage?: File;
    genres: number[];
    authors: number[];
}

export default Book;
