import {
    Grid, Fab, makeStyles,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import Axios from 'axios';
import { useHistory } from 'react-router';
import { Genre } from '../../interfaces/genre';
import PageHeading from '../../components/shared/PageHeading';
import GenresTable from '../../components/GenresTable';
import { useEffect, useState } from 'react';

interface GenresProps {
    enqueueSnackbar: any;
    closeSnackbar: any;
}

const useStyles = makeStyles({
    addGenreButton: {
        marginTop: '10px',
        float: 'right',
    },
    navLink: {
        color: '#FFFFFF',
        textDecoration: 'none',
    },
});

interface GenresState {
    genres: Array<Genre>;
}

export default function Genres(props: GenresProps): JSX.Element {
    const [genreState, setGenreState] = useState<GenresState>({
        genres: [],
    });
    const classes = useStyles();
    const history = useHistory();

    useEffect(() => {
        getGenres();
    });

    const getGenres = () => {
        Axios.get('/api/genre')
            .then((response) => {
                setGenreState({...genreState, genres: response.data.genres});
            })
            .catch(() => {
            });
    }

    const deleteGenre = (id: string): void => {
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
    }

    const renderErrorSnackbar = (message: string): void => {
        props.enqueueSnackbar(message, {
            variant: 'error',
        });
    }

    const renderSuccessSnackbar = (message: string): void => {
        props.enqueueSnackbar(message, {
            variant: 'success',
        });
    }

    const renderWarningSnackbar = (message: string): void => {
        props.enqueueSnackbar(message, {
            variant: 'warning',
        });
    }

    return (
        <Grid item xs={5} container justify="center">
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
                    className={classes.addGenreButton}
                    onClick={() => {
                        history.push('addgenre');
                    }}
                >
                    <AddIcon />
                </Fab>
            </Grid>
        </Grid>
    );
}
