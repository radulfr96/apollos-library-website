import React, { useContext, useState } from 'react';
import {
    Grid, Button,
} from '@mui/material';
import { Formik } from 'formik';
import * as yup from 'yup';
import Axios from 'axios';
import { useSnackbar } from 'notistack';
import PageHeading from '../../../components/shared/pageHeading';
import InputTextField from '../../../components/shared/inputTextField';
import ChangePasswordInfo from '../../../interfaces/changePasswordInfo';
import { AppContext } from '../../../userContext';
import ConfigHelper from '../../../config/configHelper';

interface ChangePasswordState {
    changePasswordInfo: ChangePasswordInfo;
}

const UpdatePassword = () => {
    const [updatePasswordState] = useState<ChangePasswordState>({
        changePasswordInfo: {
            currentPassword: '',
            newPassword: '',
            newPasswordConfirmation: '',
        },
    });

    const snackbar = useSnackbar();
    const context = useContext(AppContext);
    const configHelper = new ConfigHelper();

    const renderErrorSnackbar = (message: string): void => {
        snackbar.enqueueSnackbar(message, {
            variant: 'error',
        });
    };

    const renderSuccessSnackbar = (message: string): void => {
        snackbar.enqueueSnackbar(message, {
            variant: 'success',
        });
    };

    const renderWarningSnackbar = (message: string): void => {
        snackbar.enqueueSnackbar(message, {
            variant: 'warning',
        });
    };

    const updatePassword = (passwordInfo: ChangePasswordInfo, validateForm: any) => {
        validateForm()
            .then((formKeys: any) => {
                const command = {
                    currentPassword: passwordInfo.currentPassword,
                    newPassword: passwordInfo.newPassword,
                };

                if ((Object.keys(formKeys).length) === 0) {
                    Axios.put(`${configHelper.idpUrl}/api/user/password`, command, {
                        headers: {
                            Authorization: `Bearer ${context.getToken()}`,
                        },
                    })
                        .then((response) => {
                            if (response.status === 200) {
                                renderSuccessSnackbar('Update password successful');
                            }
                        })
                        .catch((error) => {
                            if (error.response.status === 400) {
                                error.response.messages.forEach((message: string) => {
                                    renderWarningSnackbar(message);
                                });
                            } else {
                                renderErrorSnackbar('Unable to update password please contact admin');
                            }
                        });
                }
            });
    };

    return (
        <Grid xs={12}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <PageHeading headingText="Update Password" />
                </Grid>
                <Formik
                    initialValues={updatePasswordState.changePasswordInfo}
                    onSubmit={() => { }}
                    validationSchema={
                        yup.object().shape({
                            currentPassword: yup.string()
                                .required('You must enter your current password'),
                            newPassword: yup.string()
                                .required('You must enter a new password')
                                .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, 'Password must be at least 6 characters long and contain one number and uppercase character.'),
                            newPasswordConfirmation: yup.string()
                                .oneOf([yup.ref('newPassword')], 'Confirm password must matched new password')
                                .required('You must enter your new password again'),
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
                                <Grid item xs={12}>
                                    <InputTextField
                                        label="Current Password"
                                        required
                                        type="password"
                                        keyName="currentPassword"
                                        value={values.currentPassword}
                                        onChange={handleChange}
                                        error={!!(errors.currentPassword)}
                                        errorMessage={errors.currentPassword}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <InputTextField
                                        label="New Password"
                                        required
                                        type="password"
                                        keyName="newPassword"
                                        value={values.newPassword}
                                        onChange={handleChange}
                                        error={!!(errors.newPassword)}
                                        errorMessage={errors.newPassword}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <InputTextField
                                        label="New Password Confirmation"
                                        required
                                        type="password"
                                        keyName="newPasswordConfirmation"
                                        value={values.newPasswordConfirmation}
                                        onChange={handleChange}
                                        error={!!(errors.newPasswordConfirmation)}
                                        errorMessage={errors.newPasswordConfirmation}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (errors !== null) {
                                                updatePassword(values, validateForm);
                                            }
                                        }}
                                    >
                                        Update
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    )}
                </Formik>
            </Grid>
        </Grid>
    );
};

export default UpdatePassword;
