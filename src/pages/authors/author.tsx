import React, { useContext, useEffect, useState } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import {
    Grid, Button, CircularProgress,
} from '@mui/material';
import Axios from 'axios';
import { push } from 'connected-react-router';
import { useStore } from 'react-redux';
import { useParams } from 'react-router';
import { useSnackbar } from 'notistack';
import { Author } from '../../interfaces/author';
import PageHeading from '../../components/shared/PageHeading';
import InputTextField from '../../components/shared/InputTextField';
import CountryTypedown from '../../components/shared/countryTypedown';
import Country from '../../interfaces/country';
import ConfigHelper from '../../config/configHelper';
import { AppContext } from '../../Context';

interface AuthorParams {
    id: string;
}

interface AuthorState {
    countries: Country[],
    author: Author,
    newAuthor: boolean
}

const AuthorsPage = () => {
    const [authorState, setAuthorsState] = useState<AuthorState>({
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
    const { enqueueSnackbar } = useSnackbar();
    const configHelper = new ConfigHelper();
    const context = useContext(AppContext);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const store = useStore();
    const { id } = useParams<AuthorParams>();

    useEffect(() => {
        if (context.getToken() === undefined) {
            return;
        }

        Axios.get(`${configHelper.apiUrl}/api/reference/countries`, {
            headers: {
                Authorization: `Bearer ${context.getToken()}`,
            },
        })
            .then((response) => {
                if (id !== undefined && id !== null) {
                    Axios.get(`${configHelper.apiUrl}/api/author/${id}`, {
                        headers: {
                            Authorization: `Bearer ${context.getToken()}`,
                        },
                    })
                        .then((authorsResponse) => {
                            setAuthorsState({
                                ...authorState,
                                author: authorsResponse.data,
                                countries: response.data,
                                newAuthor: false,
                            });
                            setIsLoading(false);
                        });
                } else {
                    setAuthorsState({
                        ...authorState,
                        countries: response.data,
                        newAuthor: true,
                    });
                    setIsLoading(false);
                }
            });
    }, [context]);

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

    const renderWarningSnackbar = (message: string): void => {
        enqueueSnackbar(message, {
            variant: 'warning',
        });
    };

    const updateAuthor = (author: Author, validateForm: any) => {
        validateForm()
            .then((formKeys: any) => {
                if (Object.keys(formKeys).length === 0) {
                    Axios.patch(`${configHelper.apiUrl}/api/author`, author, {
                        headers: {
                            Authorization: `Bearer ${context.getToken()}`,
                        },
                    })
                        .then((response) => {
                            if (response.status === 200) {
                                renderSuccessSnackbar('Update successful');
                                store.dispatch(push('/authors'));
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
    };

    const addAuthor = (author: Author, validateForm: any) => {
        validateForm()
            .then((formKeys: any) => {
                if (Object.keys(formKeys).length === 0) {
                    Axios.post(`${configHelper.apiUrl}/api/author`, author, {
                        headers: {
                            Authorization: `Bearer ${context.getToken()}`,
                        },
                    })
                        .then((response) => {
                            if (response.status === 200) {
                                renderSuccessSnackbar('Add successful');
                                store.dispatch(push('/authors'));
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
    };

    if ((!authorState.newAuthor && authorState.author.authorID < 1) || isLoading) {
        return (<CircularProgress />);
    }

    return (
        <Grid item xs={6} container justifyContent="center">
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
                    onSubmit={() => { }}
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
                                    required
                                    countries={authorState.countries}
                                    value={values.countryID}
                                    onBlur={undefined}
                                    onChange={(e: Event) => {
                                        const field = e.target as HTMLInputElement;
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
                                        sx={{ marginRight: '10px' }}
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
                                        sx={{ marginRight: '10px' }}
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
                                    sx={{ marginRight: '10px' }}
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => {
                                        store.dispatch(push('/authors'));
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
};

export default AuthorsPage;
