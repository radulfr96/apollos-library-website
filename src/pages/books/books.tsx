import {
    CircularProgress, Grid, Fab,
} from '@mui/material';
import { Link } from 'react-router-dom';
import Axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Add } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import PageHeading from '../../components/shared/pageHeading';
import ConfigHelper from '../../config/configHelper';
import { AppContext } from '../../userContext';
import BookListItem from '../../interfaces/bookListItem';
import BooksTable from '../../components/booksTable';

interface BooksState {
    books: Array<BookListItem>;
}

const Books = () => {
    const [booksState, setBooksState] = useState<BooksState>({
        books: [],
    });
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const configHelper = new ConfigHelper();
    const context = useContext(AppContext);
    const { enqueueSnackbar } = useSnackbar();

    const renderErrorSnackbar = (message: string): void => {
        enqueueSnackbar(message, {
            variant: 'error',
        });
    };

    const renderSuccessSnackbar = (message: string): void => {
        enqueueSnackbar(message, {
            variant: 'success',
        });
    };

    const getBooks = () => new Promise<void>((resolve) => {
        Axios.get(`${configHelper.apiUrl}/api/book`, {
            headers: {
                Authorization: `Bearer ${context.getToken()}`,
            },
        })
            .then((response) => {
                setBooksState({ ...booksState, books: response.data.books });
            });
        resolve();
    });

    const deleteBook = (id: number): void => {
        Axios.delete(`${configHelper.apiUrl}/api/book/${id}`, {
            headers: {
                Authorization: `Bearer ${context.getToken()}`,
            },
        })
            .then((response) => {
                if (response.status === 200) {
                    renderSuccessSnackbar('Delete successful');
                    getBooks();
                }
            })
            .catch(() => {
                renderErrorSnackbar('Unable to delete book please contact admin');
            });
    };

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
        <Grid xs={8}>
            <Grid container justifyContent="center">
                <Grid item xs={12}>
                    <PageHeading headingText="Books" />
                </Grid>
                <Grid item xs={12}>
                    <BooksTable deleteBook={deleteBook} books={booksState.books} />
                </Grid>
                <Grid item xs={12}>
                    <Link to="/addbook">
                        <Fab
                            color="primary"
                            aria-label="add"
                            sx={{
                                marginTop: '10px',
                                float: 'right',
                            }}
                        >
                            <Add />
                        </Fab>
                    </Link>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Books;
