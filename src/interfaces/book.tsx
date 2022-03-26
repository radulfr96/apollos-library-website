interface Book {
    bookID?: number;
    isbn: string;
    eisbn: string;
    title: string;
    subtitle: string;
    seriesID?: number;
    numberInSeries?: number;
    edition?: number;
    publicationFormatID: number;
    fictionTypeID: number;
    formTypeID: number;
    publisherID?: number;
    coverImage?: File;
    genres: number[];
    authors: number[];
}

export default Book;
