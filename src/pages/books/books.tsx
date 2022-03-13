import { Add } from '@mui/icons-material';
import {
    CircularProgress, Fab, Grid,
} from '@mui/material';
import Axios from 'axios';
import { useSnackbar } from 'notistack';
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BooksTable from '../../components/BooksTable';
import PageHeading from '../../components/shared/PageHeading';
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
    const { enqueueSnackbar } = useSnackbar();
    const [isLoading, setIsLoading] = useState<boolean>(true);

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
                renderErrorSnackbar('Unable to delete genre please contact admin');
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
        <Grid item xs={5} container justifyContent="center">
            <Grid item xs={12}>
                <PageHeading headingText="Books" />
            </Grid>
            <Grid item xs={12}>
                <BooksTable books={booksState.books} deleteBook={deleteBook} />
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
    );
};

export default Books;
