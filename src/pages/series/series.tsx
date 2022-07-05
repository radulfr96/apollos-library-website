import React, { useContext, useEffect, useState } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import {
    Button, CircularProgress, Grid,
} from '@mui/material';
import { Guid } from 'guid-typescript';
import { push } from 'connected-react-router';
import Axios from 'axios';
import { useParams } from 'react-router';
import { useStore } from 'react-redux';
import { useSnackbar } from 'notistack';
import { Series } from '../../interfaces/series';
import PageHeading from '../../components/shared/pageHeading';
import InputTextField from '../../components/shared/inputTextField';
import ConfigHelper from '../../config/configHelper';
import { AppContext } from '../../userContext';
import ReportButton from '../../components/shared/reportButton';
import EntryTypeEnum from '../../enums/entryTypeEnum';

interface SeriesParams {
    id?: string;
}

interface SeriesState {
    series: Series;
    newSeries: boolean;
}

const SeriesPage = () => {
    const [seriesState, setSeriesState] = useState<SeriesState>({
        series: {
            seriesId: 0,
            seriesRecordId: 0,
            name: '',
            createdBy: Guid.createEmpty(),
            items: [],
        },
        newSeries: false,
    });
    const { enqueueSnackbar } = useSnackbar();
    const params = useParams<SeriesParams>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const configHelper = new ConfigHelper();
    const context = useContext(AppContext);
    const store = useStore();

    useEffect(() => {
        if (context.getToken() === undefined) {
            return;
        }
        if (params.id !== undefined && params.id !== null) {
            Axios.get(`${configHelper.apiUrl}/api/series/${params.id}`, {
                headers: {
                    Authorization: `Bearer ${context.getToken()}`,
                },
            })
                .then((response) => {
                    setSeriesState({
                        series: response.data,
                        newSeries: false,
                    });
                    setIsLoading(false);
                });
        } else {
            setSeriesState({
                ...seriesState,
                newSeries: true,
            });
            setIsLoading(false);
        }
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

    const updateSeries = (series: Series, validateForm: any) => {
        validateForm()
            .then((formKeys: any) => {
                if (Object.keys(formKeys).length === 0) {
                    Axios.put(`${configHelper.apiUrl}/api/series/`, series, {
                        headers: {
                            Authorization: `Bearer ${context.getToken()}`,
                        },
                    })
                        .then((response) => {
                            if (response.status === 200) {
                                renderSuccessSnackbar('Update successful');
                                store.dispatch(push('/serieslist'));
                            }
                        })
                        .catch((error) => {
                            if (error.response.status === 400) {
                                renderWarningSnackbar('Unable to update series invalid input');
                            } else {
                                renderErrorSnackbar('Unable to update series please contact admin');
                            }
                        });
                }
            });
    };

    const addSeries = (series: Series, validateForm: any) => {
        validateForm()
            .then((formKeys: any) => {
                if (Object.keys(formKeys).length === 0) {
                    Axios.post(`${configHelper.apiUrl}/api/series/`, series, {
                        headers: {
                            Authorization: `Bearer ${context.getToken()}`,
                        },
                    })
                        .then((response) => {
                            if (response.status === 200) {
                                renderSuccessSnackbar('Add successful');
                                store.dispatch(push('/serieslist'));
                            }
                        })
                        .catch((error) => {
                            if (error.response.status === 400) {
                                renderWarningSnackbar('Unable to add series invalid input');
                            } else {
                                renderErrorSnackbar('Unable to add series please contact admin');
                            }
                        });
                }
            });
    };

    if (isLoading) {
        return (<CircularProgress />);
    }

    return (
        <Grid item xs={12}>
            <Grid container spacing={2}>
                {
                    !seriesState.newSeries && (
                        <>
                            <Grid item xs={12}>
                                <PageHeading headingText="Series Details" />
                            </Grid>
                            <Grid item xs={12}>
                                <ReportButton createdBy={seriesState.series.createdBy} entryRecordId={seriesState.series.seriesRecordId} entryType={EntryTypeEnum.Series} />
                            </Grid>
                        </>
                    )
                }
                {
                    seriesState.newSeries && (
                        <Grid item xs={12}>
                            <PageHeading headingText="New Series" />
                        </Grid>
                    )
                }
                <Formik
                    initialValues={seriesState.series}
                    onSubmit={() => { }}
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
                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                <Grid item xs={3}>
                                    <Grid container spacing={2}>
                                        {
                                            !seriesState.newSeries && (
                                                <Grid item xs={12}>
                                                    <InputTextField
                                                        label="Series Id"
                                                        required
                                                        type="text"
                                                        keyName="seriesId"
                                                        value={values.seriesId}
                                                        onChange={handleChange}
                                                        error={!!(errors.seriesId)}
                                                        errorMessage={errors.seriesId}
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
                                            {!seriesState.newSeries && (
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        if (errors !== null) {
                                                            updateSeries(values, validateForm);
                                                        }
                                                    }}
                                                >
                                                    Update
                                                </Button>
                                            )}
                                            {seriesState.newSeries && (
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        if (errors !== null) {
                                                            addSeries(values, validateForm);
                                                        }
                                                    }}
                                                >
                                                    Add
                                                </Button>
                                            )}

                                            <Button
                                                sx={{ marginLeft: '10px' }}
                                                variant="contained"
                                                color="secondary"
                                                onClick={() => {
                                                    store.dispatch(push('/serieslist'));
                                                }}
                                            >
                                                Cancel
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    )}
                </Formik>
            </Grid>
        </Grid>
    );
};

export default SeriesPage;
