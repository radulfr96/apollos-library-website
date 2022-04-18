interface Book {
    bookId?: number;
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
    series: number[];
    genres: number[];
    authors: number[];
}

export default Book;
