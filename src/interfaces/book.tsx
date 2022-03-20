interface Book {
    bookID: number | undefined;
    isbn: string;
    eisbn: string;
    title: string;
    subtitle: string;
    seriesID: number | undefined;
    numberInSeries: number | undefined;
    edition: number;
    publicationFormatID: number;
    fictionTypeID: number;
    formTypeID: number;
    publisherID: number | undefined;
    coverImage: unknown | undefined;
    genres: number[];
    authors: number[];
}

export default Book;
