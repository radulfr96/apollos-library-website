import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Formik } from 'formik';
import * as yup from 'yup';
import {
    Grid, Button, CircularProgress,
} from '@mui/material';
import { push } from 'connected-react-router';
import Axios from 'axios';
import { WithSnackbarProps } from 'notistack';
import { Publisher } from '../../interfaces/publisher';
import PageHeading from '../../components/shared/PageHeading';
import InputTextField from '../../components/shared/InputTextField';
import CountryTypedown from '../../components/shared/countryTypedown';
import Country from '../../interfaces/country';
import { AppContext } from '../../Context';
import ConfigHelper from '../../config/configHelper';

interface PublisherState {
    publisher: Publisher;
    countries: Array<Country>;
    newPublisher: boolean;
}

const PublisherPage = (props: WithSnackbarProps) => {
    const [publisherState, setPublisherState] = useState<PublisherState>({
        publisher: {
            publisherId: 0,
            name: '',
            streetAddress: '',
            city: '',
            postcode: '',
            state: '',
            countryID: '',
            website: '',
        },
        countries: [],
        newPublisher: false,
    });
    const params = useParams();

    const { enqueueSnackbar } = props;
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

    const renderWarningSnackbar = (message: string): void => {
        enqueueSnackbar(message, {
            variant: 'warning',
        });
    };

    useEffect(() => {
        if (params.id !== undefined && params.id !== null) {
            Axios.post(`${configHelper.apiUrl}/api/publisher/${params.id}`, {}, {
                headers: {
                    Authorization: `Bearer ${context.getToken()}`,
                },
            })
                .then((response) => {
                    setPublisherState({
                        ...publisherState,
                        publisher: response.data.publisher,
                        newPublisher: false,
                    });
                });
        } else {
            setPublisherState({
                ...publisherState,
                newPublisher: true,
            });
        }

        Axios.post(`${configHelper.apiUrl}/api/reference/countries`, {}, {
            headers: {
                Authorization: `Bearer ${context.getToken()}`,
            },
        })
            .then((response) => {
                setPublisherState({
                    ...publisherState,
                    countries: response.data.countries,
                });
            });
    });

    const updatePublisher = (publisher: Publisher, validateForm: any) => {
        validateForm()
            .then((formKeys: any) => {
                if (Object.keys(formKeys).length === 0) {
                    Axios.patch('api/publisher/', publisher, {
                        headers: {
                            Authorization: `Bearer ${context.getToken()}`,
                        },
                    })
                        .then((response) => {
                            if (response.status === 200) {
                                renderSuccessSnackbar('Update successful');
                                push('/publishers');
                            }
                        })
                        .catch((error) => {
                            if (error.response.status === 400) {
                                renderWarningSnackbar('Unable to update publisher invalid input');
                            } else {
                                renderErrorSnackbar('Unable to update publisher please contact admin');
                            }
                        });
                }
            });
    };

    const addPublisher = (publisher: Publisher, validateForm: any) => {
        validateForm()
            .then((formKeys: any) => {
                if (Object.keys(formKeys).length === 0) {
                    Axios.post(`${configHelper.apiUrl}/api/publisher/`, publisher, {
                        headers: {
                            Authorization: `Bearer ${context.getToken()}`,
                        },
                    })
                        .then((response) => {
                            if (response.status === 200) {
                                renderSuccessSnackbar('Add successful');
                                push('/publishers');
                            }
                        })
                        .catch((error) => {
                            if (error.response.status === 400) {
                                renderWarningSnackbar('Unable to add publisher, invalid input');
                            } else {
                                renderErrorSnackbar('Unable to add publisher please contact admin');
                            }
                        });
                }
            });
    };

    if (!publisherState.newPublisher && publisherState.publisher.publisherId < 1) {
        return (<CircularProgress />);
    }

    return (
        <Grid item xs={6} container justifyContent="center">
            <Grid item xs={12}>
                {
                    !publisherState.newPublisher && (
                        <PageHeading headingText="Publisher Details" />
                    )
                }
                {
                    publisherState.newPublisher && (
                        <PageHeading headingText="New Publisher" />
                    )
                }
            </Grid>
            <Grid item xs={12}>
                <Formik
                    initialValues={publisherState.publisher}
                    onSubmit={() => { }}
                    validationSchema={
                        yup.object().shape({
                            name: yup.string()
                                .required('A publisher must have a name'),
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
                                !publisherState.newPublisher && (
                                    <Grid item xs={12}>
                                        <InputTextField
                                            label="Publisher Id"
                                            required
                                            type="text"
                                            keyName="publisherId"
                                            value={values.publisherId}
                                            onChange={handleChange}
                                            error={!!(errors.publisherId)}
                                            errorMessage={errors.publisherId}
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
                            <Grid item xs={12}>
                                <InputTextField
                                    label="Website"
                                    type="text"
                                    keyName="website"
                                    value={values.website}
                                    onChange={handleChange}
                                    error={!!(errors.website)}
                                    errorMessage={errors.website}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <InputTextField
                                    label="Street Address"
                                    type="text"
                                    keyName="streetAddress"
                                    value={values.streetAddress}
                                    onChange={handleChange}
                                    error={!!(errors.streetAddress)}
                                    errorMessage={errors.streetAddress}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <InputTextField
                                    label="City/Town"
                                    type="text"
                                    keyName="city"
                                    value={values.city}
                                    onChange={handleChange}
                                    error={!!(errors.city)}
                                    errorMessage={errors.city}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <InputTextField
                                    label="Postcode/Zip Code"
                                    type="text"
                                    keyName="postcode"
                                    value={values.postcode}
                                    onChange={handleChange}
                                    error={!!(errors.postcode)}
                                    errorMessage={errors.postcode}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <InputTextField
                                    label="State/Province"
                                    type="text"
                                    keyName="state"
                                    value={values.state}
                                    onChange={handleChange}
                                    error={!!(errors.state)}
                                    errorMessage={errors.state}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <CountryTypedown
                                    required
                                    countries={publisherState.countries}
                                    value={values.countryID}
                                    onBlur=""
                                    onChange={(e: any) => {
                                        setFieldValue('countryID', publisherState.countries.find((c) => c.name
                                            === e.target.innerText)?.countryID);
                                    }}
                                    error={!!(errors.countryID)}
                                    errorMessage={errors.countryID}
                                />
                            </Grid>
                            <Grid item xs={12} style={{ paddingTop: '10px' }}>
                                {!publisherState.newPublisher && (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (errors !== null) {
                                                updatePublisher(values, validateForm);
                                            }
                                        }}
                                    >
                                        Update
                                    </Button>
                                )}
                                {publisherState.newPublisher && (
                                    <Button
                                        sx={{ marginRight: '10px' }}
                                        variant="contained"
                                        color="primary"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (errors !== null) {
                                                addPublisher(values, validateForm);
                                            }
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
                                        push('/publishers');
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

export default PublisherPage;
