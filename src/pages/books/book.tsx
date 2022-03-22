import { useParams } from 'react-router';
import React, { useContext, useEffect, useState } from 'react';
import Axios from 'axios';
import { CircularProgress, Grid } from '@mui/material';
import { PublisherListItem } from '../../interfaces/publisherListItem';
import { AuthorListItem } from '../../interfaces/authorListItem';
import { Genre } from '../../interfaces/genre';
import PublicationFormat from '../../interfaces/publicationFormat';
import FormType from '../../interfaces/formType';
import FictionType from '../../interfaces/fictionType';
import Book from '../../interfaces/book';
import { AppContext } from '../../Context';
import ConfigHelper from '../../config/configHelper';

interface BookParams {
    id: string;
}

interface BookState {
    publishers: PublisherListItem[];
    authors: AuthorListItem[];
    publicationFormats: PublicationFormat[];
    formTypes: FormType[];
    fictionTypes: FictionType[];
    genres: Genre[];
    book: Book;
    newBook: boolean;
}

const BookPage = () => {
    const [bookState, setBookState] = useState<BookState>({
        publishers: [],
        authors: [],
        publicationFormats: [],
        formTypes: [],
        fictionTypes: [],
        genres: [],
        book: {
            bookID: 0,
            isbn: '',
            eisbn: '',
            title: '',
            subtitle: '',
            seriesID: undefined,
            numberInSeries: undefined,
            edition: 0,
            publicationFormatID: 0,
            fictionTypeID: 0,
            formTypeID: 0,
            publisherID: undefined,
            coverImage: undefined,
            genres: [],
            authors: [],
        },
        newBook: false,
    });

    const configHelper = new ConfigHelper();
    const context = useContext(AppContext);
    const { id } = useParams<BookParams>();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        if (context.getToken() === undefined) {
            return;
        }

        const requests = [];

        requests.push(Axios.get(`${configHelper.apiUrl}/api/reference/bookReferenceData`, {
            headers: {
                Authorization: `Bearer ${context.getToken()}`,
            },
        }));

        requests.push(Axios.get(`${configHelper.apiUrl}/api/author`, {
            headers: {
                Authorization: `Bearer ${context.getToken()}`,
            },
        }));

        requests.push(Axios.get(`${configHelper.apiUrl}/api/publisher`, {
            headers: {
                Authorization: `Bearer ${context.getToken()}`,
            },
        }));

        requests.push(Axios.get(`${configHelper.apiUrl}/api/genre`, {
            headers: {
                Authorization: `Bearer ${context.getToken()}`,
            },
        }));

        Promise.allSettled(requests).then((responses: Array<any>) => {
            if (id !== undefined && id !== null) {
                Axios.get(`${configHelper.apiUrl}/api/book/${id}`, {
                    headers: {
                        Authorization: `Bearer ${context.getToken()}`,
                    },
                })
                    .then((booksResponse) => {
                        setBookState({
                            ...bookState,
                            publicationFormats: responses[0].value.data.publicationFormats,
                            formTypes: responses[0].value.data.formTypes,
                            fictionTypes: responses[0].value.data.fictionTypes,
                            authors: responses[1].value.data.authors,
                            publishers: responses[2].value.data.publishers,
                            genres: responses[3].value.data.genres,
                            newBook: false,
                            book: booksResponse.data,
                        });
                        setIsLoading(false);
                    });
            } else {
                setBookState({
                    ...bookState,
                    publicationFormats: responses[0].value.data.publicationFormats,
                    formTypes: responses[0].value.data.formTypes,
                    fictionTypes: responses[0].value.data.fictionTypes,
                    authors: responses[1].value.data.authors,
                    publishers: responses[2].value.data.publishers,
                    genres: responses[3].value.data.genres,
                    newBook: true,
                });
                setIsLoading(false);
            }
        });
    }, [context]);

    if ((!bookState.newBook && bookState.book.bookID !== undefined) || isLoading) {
        return (<CircularProgress />);
    }

    return (
        <Grid item xs={6} container justifyContent="center" />
    );
};

export default BookPage;
