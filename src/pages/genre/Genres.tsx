import React, { useEffect, useState } from 'react';
import {
    Grid, Fab,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import Axios from 'axios';
import { useHistory } from 'react-router';
import { WithSnackbarProps } from 'notistack';
import { Genre } from '../../interfaces/genre';
import PageHeading from '../../components/shared/PageHeading';
import GenresTable from '../../components/GenresTable';

interface GenresState {
    genres: Array<Genre>;
}

export default function Genres(props: WithSnackbarProps): JSX.Element {
    const [genreState, setGenreState] = useState<GenresState>({
        genres: [],
    });
    const history = useHistory();

    useEffect(() => {
        getGenres();
    });

    const getGenres = () => {
        Axios.get('/api/genre')
            .then((response) => {
                setGenreState({ ...genreState, genres: response.data.genres });
            });
    };

    const deleteGenre = (id: number): void => {
        Axios.delete(`api/genre/${id}`)
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

    const renderErrorSnackbar = (message: string): void => {
        props.enqueueSnackbar(message, {
            variant: 'error',
        });
    };

    const renderSuccessSnackbar = (message: string): void => {
        props.enqueueSnackbar(message, {
            variant: 'success',
        });
    };

    return (
        <Grid item xs={5} container justifyContent="center">
            <Grid item xs={12}>
                <PageHeading headingText="Genres" />
            </Grid>
            <Grid item xs={12}>
                <GenresTable genres={genreState.genres} deleteGenre={deleteGenre} />
            </Grid>
            <Grid item xs={12}>
                <Fab
                    color="primary"
                    aria-label="add"
                    sx={{
                        marginTop: '10px',
                        float: 'right',
                    }}
                    onClick={() => {
                        history.push('addgenre');
                    }}
                >
                    <Add />
                </Fab>
            </Grid>
        </Grid>
    );
}