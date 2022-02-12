import React, { useContext, useEffect, useState } from 'react';
import {
    Grid, Fab, CircularProgress,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import Axios from 'axios';
import { useSnackbar } from 'notistack';
import { Link } from 'react-router-dom';
import { Genre } from '../../interfaces/genre';
import PageHeading from '../../components/shared/PageHeading';
import GenresTable from '../../components/GenresTable';
import ConfigHelper from '../../config/configHelper';
import { AppContext } from '../../Context';

interface GenresState {
    genres: Array<Genre>;
}

const Genres = () => {
    const [genreState, setGenreState] = useState<GenresState>({
        genres: [],
    });
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { enqueueSnackbar } = useSnackbar();
    const configHelper = new ConfigHelper();
    const context = useContext(AppContext);

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

    const getGenres = () => new Promise<void>((resolve) => {
        Axios.get(`${configHelper.apiUrl}/api/genre`, {
            headers: {
                Authorization: `Bearer ${context.getToken()}`,
            },
        })
            .then((response) => {
                setGenreState({ ...genreState, genres: response.data.genres });
            });
        resolve();
    });

    const deleteGenre = (id: number): void => {
        Axios.delete(`${configHelper.apiUrl}/api/genre/${id}`, {
            headers: {
                Authorization: `Bearer ${context.getToken()}`,
            },
        })
            .then((response) => {
                if (response.status === 200) {
                    renderSuccessSnackbar('Delete successful');
                    getGenres();
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
        getGenres()
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
                <PageHeading headingText="Genres" />
            </Grid>
            <Grid item xs={12}>
                <GenresTable genres={genreState.genres} deleteGenre={deleteGenre} />
            </Grid>
            <Grid item xs={12}>
                <Link to="/addgenre">
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

export default Genres;
