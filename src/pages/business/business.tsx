import React, { useContext, useEffect, useState } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import {
    Grid, Button, CircularProgress,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { push } from 'connected-react-router';
import Axios from 'axios';
import { useSnackbar } from 'notistack';
import { useStore } from 'react-redux';
import Business from '../../interfaces/business';
import PageHeading from '../../components/shared/pageHeading';
import InputTextField from '../../components/shared/inputTextField';
import CountryTypedown from '../../components/shared/countryTypedown';
import Country from '../../interfaces/country';
import { AppContext } from '../../userContext';
import ConfigHelper from '../../config/configHelper';
import BusinessType from '../../interfaces/businessTypes';
import Dropdown from '../../components/shared/dropdown';
import DropdownOption from '../../interfaces/dropdownOption';

interface BusinessParams {
    id?: string;
}

interface BusinessState {
    business: Business;
    countries: Array<Country>;
    businessTypes: Array<BusinessType>
    newBusiness: boolean;
}

const BusinessPage = () => {
    const [businessState, setBusinessState] = useState<BusinessState>({
        business: {
            businessId: 0,
            name: '',
            streetAddress: '',
            city: '',
            postcode: '',
            state: '',
            countryID: '',
            website: '',
            businessTypeId: 1,
        },
        countries: [],
        businessTypes: [],
        newBusiness: false,
    });
    const params = useParams<BusinessParams>();
    const { enqueueSnackbar } = useSnackbar();
    const configHelper = new ConfigHelper();
    const context = useContext(AppContext);
    const [isLoading, setIsLoading] = useState<boolean>(true);
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

    const renderWarningSnackbar = (message: string): void => {
        enqueueSnackbar(message, {
            variant: 'warning',
        });
    };

    useEffect(() => {
        if (context.getToken() === undefined) {
            return;
        }

        const requests = [];

        requests.push(Axios.get(`${configHelper.apiUrl}/api/reference/businesstypes`, {
            headers: {
                Authorization: `Bearer ${context.getToken()}`,
            },
        }));

        requests.push(Axios.get(`${configHelper.apiUrl}/api/reference/countries`, {
            headers: {
                Authorization: `Bearer ${context.getToken()}`,
            },
        }));

        Promise.allSettled(requests).then((responses: Array<any>) => {
            if (params.id !== undefined && params.id !== null) {
                Axios.get(`${configHelper.apiUrl}/api/business/${params.id}`, {
                    headers: {
                        Authorization: `Bearer ${context.getToken()}`,
                    },
                })
                    .then((pubResponse) => {
                        setBusinessState({
                            ...businessState,
                            business: pubResponse.data,
                            businessTypes: responses[0].value.data,
                            countries: responses[1].value.data,
                            newBusiness: false,
                        });
                        setIsLoading(false);
                    });
            } else {
                setBusinessState({
                    ...businessState,
                    businessTypes: responses[0].value.data,
                    countries: responses[1].value.data,
                    newBusiness: true,
                });
                setIsLoading(false);
            }
        });
    }, [context]);

    const updateBusiness = (business: Business, validateForm: any) => {
        validateForm()
            .then((formKeys: any) => {
                if (Object.keys(formKeys).length === 0) {
                    Axios.put(`${configHelper.apiUrl}/api/business/`, business, {
                        headers: {
                            Authorization: `Bearer ${context.getToken()}`,
                        },
                    })
                        .then((response) => {
                            if (response.status === 200) {
                                renderSuccessSnackbar('Update successful');
                                store.dispatch(push('/businesses'));
                            }
                        })
                        .catch((error) => {
                            if (error.response.status === 400) {
                                renderWarningSnackbar('Unable to update business invalid input');
                            } else {
                                renderErrorSnackbar('Unable to update business please contact admin');
                            }
                        });
                }
            });
    };

    const addBusiness = (business: Business, validateForm: any) => {
        validateForm()
            .then((formKeys: any) => {
                if (Object.keys(formKeys).length === 0) {
                    Axios.post(`${configHelper.apiUrl}/api/business/`, business, {
                        headers: {
                            Authorization: `Bearer ${context.getToken()}`,
                        },
                    })
                        .then((response) => {
                            if (response.status === 200) {
                                renderSuccessSnackbar('Add successful');
                                store.dispatch(push('/businesses'));
                            }
                        })
                        .catch((error) => {
                            if (error.response.status === 400) {
                                renderWarningSnackbar('Unable to add business, invalid input');
                            } else {
                                renderErrorSnackbar('Unable to add business please contact admin');
                            }
                        });
                }
            });
    };

    if (isLoading) {
        return (<CircularProgress />);
    }
    return (
        <Grid item xs={6} container justifyContent="center">
            <Grid item xs={12}>
                {
                    !businessState.newBusiness && (
                        <PageHeading headingText="Business Details" />
                    )
                }
                {
                    businessState.newBusiness && (
                        <PageHeading headingText="New Business" />
                    )
                }
            </Grid>
            <Formik
                initialValues={businessState.business}
                onSubmit={() => { }}
                validationSchema={
                    yup.object().shape({
                        name: yup.string()
                            .required('A business must have a name'),
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
                    <Grid item xs={12}>
                        <Grid container spacing={2}>
                            {
                                !businessState.newBusiness && (
                                    <Grid item xs={12}>
                                        <InputTextField
                                            label="Business Id"
                                            required
                                            type="text"
                                            keyName="businessId"
                                            value={values.businessId}
                                            onChange={handleChange}
                                            error={!!(errors.businessId)}
                                            errorMessage={errors.businessId}
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
                                <Dropdown
                                    required
                                    label="Business Type"
                                    labelId="businessTypeLabelId"
                                    id="businessTypeId"
                                    keyName="businessTypeId"
                                    value={values.businessTypeId}
                                    onChange={handleChange}
                                    options={
                                        businessState.businessTypes.map<DropdownOption>((businessType: BusinessType) => ({
                                            value: businessType.businessTypeId,
                                            text: businessType.name,
                                        } as DropdownOption))
                                    }
                                    errorMessage="A business must have a type format."
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
                                    countries={businessState.countries}
                                    value={values.countryID}
                                    onBlur={() => { }}
                                    onChange={(e: any) => {
                                        setFieldValue('countryID', businessState.countries.find((c) => c.name
                                            === e.target.innerText)?.countryID);
                                    }}
                                    error={!!(errors.countryID)}
                                    errorMessage={errors.countryID}
                                />
                            </Grid>
                            <Grid item xs={12} style={{ paddingTop: '10px' }}>
                                {!businessState.newBusiness && (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (errors !== null) {
                                                updateBusiness(values, validateForm);
                                            }
                                        }}
                                    >
                                        Update
                                    </Button>
                                )}
                                {businessState.newBusiness && (
                                    <Button
                                        sx={{ marginRight: '10px' }}
                                        variant="contained"
                                        color="primary"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (errors !== null) {
                                                addBusiness(values, validateForm);
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
                                        store.dispatch(push('/businesses'));
                                    }}
                                >
                                    Cancel
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                )}
            </Formik>
        </Grid>
    );
};

export default BusinessPage;
