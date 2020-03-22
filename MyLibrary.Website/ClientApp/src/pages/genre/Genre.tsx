import * as React from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import {
    withStyles, Theme, Grid, WithStyles, Button, Typography, CircularProgress,
} from '@material-ui/core';
import Axios from 'axios';
import { withRouter, RouteComponentProps, RouteProps } from 'react-router';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import compose from 'recompose/compose';
import { Genre } from '../../interfaces/genre';
import PageHeading from '../../components/shared/PageHeading';
import InputTextField from '../../components/shared/InputTextField';

interface GenreProps {
    classes: any;
}

const useStyles = (theme: Theme) => ({
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
});

interface GenreState {
    genre: Genre;
    newGenre: boolean;
}

interface GenreParams {
    id: string | undefined;
}

class GenrePage extends React.Component<
    GenreProps
    & WithStyles<typeof useStyles>
    & RouteProps
    & WithSnackbarProps
    & RouteComponentProps<GenreParams>
    , GenreState> {
    constructor(props: any) {
        super(props);
        this.updateGenre = this.updateGenre.bind(this);
        this.addGenre = this.addGenre.bind(this);
        this.onChange = this.onChange.bind(this);
        this.renderErrorSnackbar = this.renderErrorSnackbar.bind(this);
        this.renderSuccessSnackbar = this.renderSuccessSnackbar.bind(this);
        this.renderWarningSnackbar = this.renderWarningSnackbar.bind(this);

        this.state = {
            genre: {
                genreId: 0,
                name: '',
            },
            newGenre: false,
        };
    }

    componentDidMount() {
        if (this.props.match.params.id !== undefined && this.props.match.params.id !== null) {
            const { id } = this.props.match.params;

            Axios.get(`/api/genre/${id}`)
                .then((response) => {
                    this.setState({
                        genre: response.data.genre,
                        newGenre: false,
                    });
                });
        } else {
            this.setState({
                ...this.state,
                newGenre: true,
            });
        }
    }

    onChange(key: string, value: any): void {
        const prevState = this.state;
        this.setState({
            ...this.state,
            genre: {
                ...prevState.genre,
                [key]: value,
            },
        });
    }

    updateGenre(genre: Genre, validateForm: Function) {
        validateForm()
            .then((formKeys: any) => {
                if (Object.keys(formKeys).length === 0) {
                    Axios.patch('api/genre/', genre)
                        .then((response) => {
                            if (response.status === 200) {
                                this.renderSuccessSnackbar('Update successful');
                                this.props.history.goBack();
                            }
                        })
                        .catch((error) => {
                            if (error.response.status === 400) {
                                this.renderWarningSnackbar('Unable to update genre invalid input');
                            } else {
                                this.renderErrorSnackbar('Unable to update genre please contact admin');
                            }
                        });
                }
            });
    }

    addGenre(genre: Genre, validateForm: Function) {
        validateForm()
            .then((formKeys: any) => {
                if (Object.keys(formKeys).length === 0) {
                    Axios.post('api/genre/', genre)
                        .then((response) => {
                            if (response.status === 200) {
                                this.renderSuccessSnackbar('Add successful');
                                this.props.history.goBack();
                            }
                        })
                        .catch((error) => {
                            if (error.response.status === 400) {
                                this.renderWarningSnackbar('Unable to add genre invalid input');
                            } else {
                                this.renderErrorSnackbar('Unable to add genre please contact admin');
                            }
                        });
                }
            });
    }

    renderErrorSnackbar(message: string): void {
        this.props.enqueueSnackbar(message, {
            variant: 'error',
        });
    }

    renderSuccessSnackbar(message: string): void {
        this.props.enqueueSnackbar(message, {
            variant: 'success',
        });
    }

    renderWarningSnackbar(message: string): void {
        this.props.enqueueSnackbar(message, {
            variant: 'warning',
        });
    }

    render() {
        if (!this.state.newGenre && this.state.genre.genreId < 1) {
            return (<CircularProgress />);
        }

        return (
            <Grid item xs={6} container justify="center">
                <Grid item xs={12}>
                    {
                        !this.state.newGenre && (
                            <PageHeading headingText="Genre Details" />
                        )
                    }
                    {
                        this.state.newGenre && (
                            <PageHeading headingText="New Genre" />
                        )
                    }
                </Grid>
                {
                    !this.state.newGenre && (
                        <Grid item container xs={12} className={this.props.classes.userIdField}>
                            <Grid item xs={2}>
                                <Typography>Genre ID:</Typography>
                            </Grid>
                            <Grid item xs={10}>
                                <Typography>{this.state.genre.genreId}</Typography>
                            </Grid>
                        </Grid>
                    )
                }
                <Grid item xs={12}>
                    <Formik
                        initialValues={this.state.genre}
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
                                        {!this.state.newGenre && (
                                            <Button
                                                className={this.props.classes.formButton}
                                                variant="contained"
                                                color="primary"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    if (errors !== null) {
                                                        this.updateGenre(values, validateForm);
                                                    }
                                                }}
                                            >
                                                Update
                                            </Button>
                                        )}
                                        {this.state.newGenre && (
                                            <Button
                                                className={this.props.classes.formButton}
                                                variant="contained"
                                                color="primary"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    if (errors !== null) {
                                                        this.addGenre(values, validateForm);
                                                    }
                                                }}
                                            >
                                                Add
                                            </Button>
                                        )}

                                        <Button
                                            className={this.props.classes.formButton}
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => {
                                                this.props.history.push('/genres');
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
}

export default compose<GenreProps, {}>(
    withStyles(useStyles),
    withRouter,
    withSnackbar,
)(GenrePage);
