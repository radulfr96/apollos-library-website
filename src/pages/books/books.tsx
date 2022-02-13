import { CircularProgress, Grid } from '@mui/material';
import Axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useStore } from 'react-redux';
import ConfigHelper from '../../config/configHelper';
import { AppContext } from '../../Context';
import BookListItem from '../../interfaces/bookListItem';

interface BooksState {
    books: Array<BookListItem>;
}

const Books = () => {
    const [booksState, setBooksState] = useState<BooksState>({
        books: [],
    });

    const configHelper = new ConfigHelper();
    const context = useContext(AppContext);
    const store = useStore();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const getBooks = () => new Promise<void>((resolve) => {
        Axios.get(`${configHelper.apiUrl}/api/book`, {
            headers: {
                Authorization: `Bearer ${context.getToken()}`,
            },
        })
            .then((response) => {
                setBooksState({ ...booksState, books: response.data.books });
                resolve();
            });
    });

    useEffect(() => {
        if (context.getToken() === undefined) {
            return;
        }

        getBooks()
            .then(() => {
                setIsLoading(false);
            });
    }, [context]);

    if (isLoading) {
        return (<CircularProgress />);
    }
    return (
        <Grid item xs={5} container justifyContent="center" />
    );
};

export default Books;
