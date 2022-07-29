import { push } from 'connected-react-router';
import { Button, CircularProgress, Grid } from '@mui/material';
import Axios from 'axios';
import { useStore } from 'react-redux';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import * as yup from 'yup';
import React, { useContext, useEffect, useState } from 'react';
import InputTextField from '../../../components/shared/inputTextField';
import PageHeading from '../../../components/shared/pageHeading';
import ConfigHelper from '../../../config/configHelper';
import { AppContext } from '../../../userContext';

interface BudgetSettingsState {
    year: number;
    userBudgetSettingId: number;
    yearlyBudget: number;
}

const BudgetSettings = () => {
    const context = useContext(AppContext);
    const configHelper = new ConfigHelper();
    const [isLoading, setIsLoading] = useState<Boolean>(true);
    const { enqueueSnackbar } = useSnackbar();
    const store = useStore();

    const [budgetSettingsState, setBudgetSettingsState] = useState<BudgetSettingsState>();

    useEffect(() => {
        if (context.getToken() === undefined) {
            return;
        }

        Axios.get(`${configHelper.apiUrl}/api/usersettings/budgetsetting`, {
            headers: {
                Authorization: `Bearer ${context.getToken()}`,
            },
        })
            .then((response) => {
                setBudgetSettingsState({
                    ...budgetSettingsState,
                    year: response.data.year,
                    userBudgetSettingId: response.data.userBudgetSettingId,
                    yearlyBudget: response.data.yearlyBudget,
                });
                setIsLoading(false);
            });
        setIsLoading(false);
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

    const updateBudget = (values: BudgetSettingsState, validateForm: any) => {
        validateForm()
            .then((formKeys: any) => {
                if (Object.keys(formKeys).length === 0) {
                    Axios.patch(`${configHelper.apiUrl}/api/usersettings/budgetsetting`, {
                        yearlyBudget: budgetSettingsState?.yearlyBudget,
                    }, {
                        headers: {
                            Authorization: `Bearer ${context.getToken()}`,
                        },
                    })
                        .then((response) => {
                            if (response.status === 200) {
                                renderSuccessSnackbar('Update successful');
                                store.dispatch(push('/'));
                            }
                        })
                        .catch((error) => {
                            if (error.response.status === 400) {
                                renderWarningSnackbar('Unable to update budget invalid input');
                            } else {
                                renderErrorSnackbar('Unable to update budget please contact admin');
                            }
                        });
                }
            });
    };

    if (isLoading) {
        return (<CircularProgress />);
    }

    return (
        <Formik
            initialValues={budgetSettingsState as BudgetSettingsState}
            enableReinitialize
            onSubmit={() => { }}
            validationSchema={
                yup.object().shape({
                    yearlyBudget: yup.string()
                        .min(10.00)
                        .required('You must enter a budget of at least 10.00'),
                })
            }
        >
            {({
                values,
                errors,
                handleChange,
                validateForm,
            }) => (
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <PageHeading headingText="Budget Settings" />
                    </Grid>
                    <Grid item xs={12}>
                        <InputTextField
                            label="Year"
                            required
                            type="text"
                            keyName="year"
                            value={values.year}
                            onChange={handleChange}
                            error={!!(errors.year)}
                            errorMessage={errors.year}
                            readonly
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <InputTextField
                            label="Yearly Budget"
                            required
                            type="text"
                            keyName="yearlyBudget"
                            value={values.yearlyBudget}
                            onChange={handleChange}
                            error={!!(errors.yearlyBudget)}
                            errorMessage={errors.yearlyBudget}
                            readonly
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            type="button"
                            variant="contained"
                            color="primary"
                            onClick={(e) => {
                                e.preventDefault();
                                updateBudget(values, validateForm);
                            }}
                        >
                            Save
                        </Button>
                    </Grid>
                </Grid>
            )}
        </Formik>
    );
};

export default BudgetSettings;
