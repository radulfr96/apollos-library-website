import React, { useState, useContext, useEffect } from 'react';
import {
    Grid, Fab,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import Axios from 'axios';
import { useStore } from 'react-redux';
import { useSnackbar } from 'notistack';
import { push } from 'connected-react-router';
import { AuthorListItem } from '../../interfaces/authorListItem';
import PageHeading from '../../components/shared/pageHeading';
import AuthorsTable from '../../components/authorsTable';
import { AppContext } from '../../context';
import ConfigHelper from '../../config/configHelper';

interface AuthorsState {
    authors: Array<AuthorListItem>;
}

const AuthorsPage = () => {
    const [authorsState, setAuthorsState] = useState<AuthorsState>({
        authors: [],
    });

    const configHelper = new ConfigHelper();
    const context = useContext(AppContext);
    const { enqueueSnackbar } = useSnackbar();
    const store = useStore();

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

    const getAuthors = () => {
        Axios.get(`${configHelper.apiUrl}/api/author`, {
            headers: {
                Authorization: `Bearer ${context.getToken()}`,
            },
        })
            .then((response) => {
                setAuthorsState({ ...authorsState, authors: response.data.authors });
            });
    };

    const deleteAuthor = (id: number): void => {
        Axios.delete(`${configHelper.apiUrl}/api/author/${id}`, {
            headers: {
                Authorization: `Bearer ${context.getToken()}`,
            },
        })
            .then((response) => {
                if (response.status === 200) {
                    renderSuccessSnackbar('Delete successful');
                    getAuthors();
                }
            })
            .catch(() => {
                renderErrorSnackbar('Unable to delete author please contact admin');
            });
    };

    useEffect(() => {
        getAuthors();
    });

    return (
        <Grid item xs={5} container justifyContent="center">
            <Grid item xs={12}>
                <PageHeading headingText="Authors" />
            </Grid>
            {
                context.isAdmin() && (
                    <Grid item xs={12}>
                        <AuthorsTable
                            authors={authorsState.authors}
                            deleteAuthor={deleteAuthor}
                        />
                    </Grid>
                )
            }

            <Grid item xs={12}>
                <Fab
                    color="primary"
                    aria-label="add"
                    sx={{
                        marginTop: '10px',
                        float: 'right',
                    }}
                    onClick={() => {
                        store.dispatch(push('/addauthor'));
                    }}
                >
                    <Add />
                </Fab>
            </Grid>
        </Grid>
    );
};

export default AuthorsPage;
