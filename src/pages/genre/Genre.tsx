import * as React from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import {
    withStyles, Theme, Grid, WithStyles, Button, CircularProgress, makeStyles,
} from '@material-ui/core';
import Axios from 'axios';
import { useParams } from 'react-router';
import { Genre } from '../../interfaces/genre';
import PageHeading from '../../components/shared/PageHeading';
import InputTextField from '../../components/shared/InputTextField';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../Context';
import { useHistory } from 'react-router-dom';

interface GenreProps {
    enqueueSnackbar: any;
    closeSnackbar: any;
}

const useStyles = makeStyles((theme: Theme) => ({
    paper: {
        color: theme.palette.primary.main,
        width: '100%',
    },
    formButton: {
        marginRight: '10px',
    },
    userIdField: {
        marginBottom: '10px',
    },
}));

interface GenreState {
    genre: Genre;
    newGenre: boolean;
}

interface GenreParams {
    id: string | undefined;
}

export default function GenrePage(props: GenreProps): JSX.Element {
    const [genreState, setGenreState] = useState<GenreState>({
        genre: {
            name: '',
            genreId: 0,
        },
        newGenre: false,
    });

    const context = useContext(AppContext);
    const classes = useStyles();
    const history = useHistory();
    const params = useParams<GenreParams>();

    useEffect(() => {
        if (params.id !== undefined && params.id !== null) {
            Axios.get(`/api/genre/${params.id}`)
                .then((response) => {
                    setGenreState({
                        genre: response.data.genre,
                        newGenre: false,
                    });
                });
        } else {
            setGenreState({
                ...genreState,
                newGenre: true,
            });
        }
    });

    const onChange = (key: string, value: any): void => {
        setGenreState({
            ...genreState,
            genre: {
                ...genreState.genre,
                [key]: value,
            },
        });
    }

    const updateGenre = (genre: Genre, validateForm: Function) => {
        validateForm()
            .then((formKeys: any) => {
                if (Object.keys(formKeys).length === 0) {
                    Axios.patch('api/genre/', genre)
                        .then((response) => {
                            if (response.status === 200) {
                                renderSuccessSnackbar('Update successful');
                                history.goBack();
                            }
                        })
                        .catch((error) => {
                            if (error.response.status === 400) {
                                renderWarningSnackbar('Unable to update genre invalid input');
                            } else {
                                renderErrorSnackbar('Unable to update genre please contact admin');
                            }
                        });
                }
            });
    }

    const addGenre = (genre: Genre, validateForm: Function) => {
        validateForm()
            .then((formKeys: any) => {
                if (Object.keys(formKeys).length === 0) {
                    Axios.post('api/genre/', genre)
                        .then((response) => {
                            if (response.status === 200) {
                                renderSuccessSnackbar('Add successful');
                                history.goBack();
                            }
                        })
                        .catch((error) => {
                            if (error.response.status === 400) {
                                renderWarningSnackbar('Unable to add genre invalid input');
                            } else {
                                renderErrorSnackbar('Unable to add genre please contact admin');
                            }
                        });
                }
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

    if (!genreState.newGenre && genreState.genre.genreId < 1) {
        return (<CircularProgress />);
    }

    return (
        <Grid item xs={6} container justify="center">
            <Grid item xs={12}>
                {
                    !genreState.newGenre && (
                        <PageHeading headingText="Genre Details" />
                    )
                }
                {
                    genreState.newGenre && (
                        <PageHeading headingText="New Genre" />
                    )
                }
            </Grid>
            <Grid item xs={12}>
                <Formik
                    initialValues={genreState.genre}
                    onSubmit={(values) => {
                        console.log(values);
                    }}
                    validationSchema={
                        yup.object().shape({
                            name: yup.string()
                                .required('A genre must have a name'),
                        })
                    }
                >
                    {({
                        values,
                        errors,
                        handleChange,
                        validateForm,
                    }) => (
                            <Grid container item xs={12}>

                                {
                                    !genreState.newGenre && (
                                        <Grid item xs={12}>
                                            <InputTextField
                                                label="Genre Id"
                                                required
                                                type="text"
                                                keyName="genreId"
                                                value={values.genreId}
                                                onChange={handleChange}
                                                error={!!(errors.genreId)}
                                                errorMessage={errors.genreId}
                                                readonly
                                            />
                                        </Grid>
                                    )
                                }

                                <Grid item xs={12}>
                                    <InputTextField
                                        label="Name"
                                        required
                                        type="text"
                                        keyName="name"
                                        value={values.name}
                                        onChange={handleChange}
                                        error={!!(errors.name)}
                                        errorMessage={errors.name}
                                    />
                                </Grid>
                                <Grid item xs={12} style={{ paddingTop: '10px' }}>
                                    {!genreState.newGenre && (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (errors !== null) {
                                                    updateGenre(values, validateForm);
                                                }
                                            }}
                                        >
                                            Update
                                        </Button>
                                    )}
                                    {genreState.newGenre && (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (errors !== null) {
                                                    addGenre(values, validateForm);
                                                }
                                            }}
                                        >
                                            Add
                                        </Button>
                                    )}

                                    <Button
                                        className={classes.formButton}
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => {
                                            history.push('/genres');
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </Grid>
                            </Grid>
                        )}
                </Formik>
            </Grid>
        </Grid>
    );
}
