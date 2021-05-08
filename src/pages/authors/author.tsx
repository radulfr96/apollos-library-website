import { Formik } from 'formik';
import * as yup from 'yup';
import {
    Theme, Grid, Button, CircularProgress, makeStyles, SnackbarProps, createStyles,
} from '@material-ui/core';
import Axios from 'axios';
import { RouteComponentProps, RouteProps } from 'react-router';
import { WithSnackbarProps } from 'notistack';
import { Author } from '../../interfaces/author';
import PageHeading from '../../components/shared/PageHeading';
import InputTextField from '../../components/shared/InputTextField';
import CountryTypedown from '../../components/shared/countryTypedown';
import Country from '../../interfaces/country';
import { AppContext } from '../../Context';
import { useContext, useState } from 'react';

const useStyles = makeStyles((theme: Theme) => ({
    paper: {
        color: theme.palette.primary.main,
        width: '100%',
    },
    formButton: {
        marginRight: '10px',
    },
    publisherIdField: {
        marginBottom: '10px',
    },
}));


interface AuthorProps {
}

interface AuthorState {
    countries: Country[],
    author: Author,
    newAuthor: Boolean
}

interface AuthorParams {
    id: string | undefined;
}

export default function AuthorsPage(props: AuthorProps
    & RouteProps
    & WithSnackbarProps
    & RouteComponentProps<AuthorParams>): JSX.Element {
    const [authorState, setAuthorState] = useState<AuthorState>({
        countries: [],
        author: {
            authorID: 0,
            firstname: '',
            middlename: '',
            lastname: '',
            description: '',
            countryID: '',
        },
        newAuthor: false,
    });
    const context = useContext(AppContext);
    const classes = useStyles();
    
    const handleChange = (e: Event) => {
        setAuthorState({...authorState, [(e.target as HTMLFormElement).name]: (e.target as HTMLFormElement).value})
     }

    const updateAuthor = (author: Author, validateForm: Function) => {
        validateForm()
            .then((formKeys: any) => {
                if (Object.keys(formKeys).length === 0) {
                    Axios.patch('api/author/', author)
                        .then((response) => {
                            if (response.status === 200) {
                                renderSuccessSnackbar('Update successful');
                                props.history.goBack();
                            }
                        })
                        .catch((error) => {
                            if (error.response.status === 400) {
                                renderWarningSnackbar('Unable to update author invalid input');
                            } else {
                                renderErrorSnackbar('Unable to update author please contact admin');
                            }
                        });
                }
            });
    }

    const addAuthor = (author: Author, validateForm: Function) => {
        validateForm()
            .then((formKeys: any) => {
                if (Object.keys(formKeys).length === 0) {
                    Axios.post('api/author/', author)
                        .then((response) => {
                            if (response.status === 200) {
                                renderSuccessSnackbar('Add successful');
                                props.history.goBack();
                            }
                        })
                        .catch((error) => {
                            if (error.response.status === 400) {
                                renderWarningSnackbar('Unable to add author, invalid input');
                            } else {
                                renderErrorSnackbar('Unable to add author please contact admin');
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

    if (!authorState.newAuthor && authorState.author.authorID < 1) {
        return (<CircularProgress />);
    }

    return (
        <Grid item xs={6} container justify="center">
            <Grid item xs={12}>
                {
                    !authorState.newAuthor && (
                        <PageHeading headingText="Author Details" />
                    )
                }
                {
                    authorState.newAuthor && (
                        <PageHeading headingText="New Author" />
                    )
                }
            </Grid>
            <Grid item xs={12}>
                <Formik
                    initialValues={authorState.author}
                    onSubmit={(values) => {
                        console.log(values);
                    }}
                    validationSchema={
                        yup.object().shape({
                            firstname: yup.string()
                                .required('An author must have a firstname or alias'),
                        })
                    }
                >
                    {({
                        values,
                        errors,
                        handleChange,
                        setFieldValue,
                        validateForm,
                    }) => (
                        <Grid container item xs={12}>

                            {
                                !authorState.newAuthor && (
                                    <Grid item xs={12}>
                                        <InputTextField
                                            label="Author ID"
                                            required
                                            type="text"
                                            keyName="authorID"
                                            value={values.authorID}
                                            onChange={handleChange}
                                            error={!!(errors.authorID)}
                                            errorMessage={errors.authorID}
                                            readonly
                                        />
                                    </Grid>
                                )
                            }

                            <Grid item xs={12}>
                                <InputTextField
                                    label="Firstname"
                                    required
                                    type="text"
                                    keyName="firstname"
                                    value={values.firstname}
                                    onChange={handleChange}
                                    error={!!(errors.firstname)}
                                    errorMessage={errors.firstname}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <InputTextField
                                    label="Middlename"
                                    type="text"
                                    keyName="middlename"
                                    value={values.middlename}
                                    onChange={handleChange}
                                    error={!!(errors.middlename)}
                                    errorMessage={errors.middlename}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <InputTextField
                                    label="Lastname"
                                    type="text"
                                    keyName="lastname"
                                    value={values.lastname}
                                    onChange={handleChange}
                                    error={!!(errors.lastname)}
                                    errorMessage={errors.lastname}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <CountryTypedown
                                    label="Country *"
                                    type="text"
                                    required
                                    keyName="countryID"
                                    countries={authorState.countries}
                                    value={values.countryID}
                                    onChange={(e: Event) => {
                                        var field = e.target as HTMLInputElement;
                                        setFieldValue('countryID', authorState.countries.find((c) => c.name
                                            === field.innerText)?.countryID);
                                    }}
                                    error={!!(errors.countryID)}
                                    errorMessage={errors.countryID}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <InputTextField
                                    label="Description"
                                    type="text"
                                    keyName="description"
                                    value={values.description}
                                    onChange={handleChange}
                                    error={!!(errors.description)}
                                    errorMessage={errors.description}
                                />
                            </Grid>
                            <Grid item xs={12} style={{ paddingTop: '10px' }}>
                                {!authorState.newAuthor && (
                                    <Button
                                        className={classes.formButton}
                                        variant="contained"
                                        color="primary"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (errors !== null) {
                                                updateAuthor(values, validateForm);
                                            }
                                        }}
                                    >
                                        Update
                                    </Button>
                                )}
                                {authorState.newAuthor && (
                                    <Button
                                        className={classes.formButton}
                                        variant="contained"
                                        color="primary"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            addAuthor(values, validateForm);
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
                                        props.history.push('/authors');
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
