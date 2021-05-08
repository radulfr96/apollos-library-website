import React, { useState } from 'react';
import {
    Grid, Button,
} from '@material-ui/core';
import { Formik } from 'formik';
import * as yup from 'yup';
import Axios from 'axios';
import { WithSnackbarProps } from 'notistack';
import PageHeading from '../../../components/shared/PageHeading';
import InputTextField from '../../../components/shared/InputTextField';
import ChangePasswordInfo from '../../../interfaces/changePasswordInfo';

interface ChangePasswordState {
    changePasswordInfo: ChangePasswordInfo;
}

// const useStyles = makeStyles({
//     paper: {
//         paddingTop: '20px',
//         paddingLeft: '40px',
//         paddingRight: '20px',
//     },
//     navPaper: {
//         paddingTop: '20px',
//         paddingLeft: '40px',
//         paddingRight: '20px',
//         marginRight: '20px',
//         width: '150px',
//     },
// });

export default function UpdatePassword(props: WithSnackbarProps): JSX.Element {
    const [updatePasswordState] = useState<ChangePasswordState>({
        changePasswordInfo: {
            password: '',
            newPassword: '',
            newPasswordConfirmation: '',
        },
    });

    const renderErrorSnackbar = (message: string): void => {
        props.enqueueSnackbar(message, {
            variant: 'error',
        });
    };

    const renderSuccessSnackbar = (message: string): void => {
        props.enqueueSnackbar(message, {
            variant: 'success',
        });
    };

    const renderWarningSnackbar = (message: string): void => {
        props.enqueueSnackbar(message, {
            variant: 'warning',
        });
    };

    const updatePassword = (passwordInfo: ChangePasswordInfo, validateForm: any) => {
        validateForm()
            .then((formKeys: any) => {
                if ((Object.keys(formKeys).length) === 0) {
                    Axios.patch('api/user/password', passwordInfo)
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
        <Grid container item xs={12}>
            <Grid item xs={12}>
                <PageHeading headingText="Update Password" />
            </Grid>
            <Grid item xs={12}>
                <Formik
                    initialValues={updatePasswordState.changePasswordInfo}
                    onSubmit={(values) => {
                        console.log(values);
                    }}
                    validationSchema={
                        yup.object().shape({
                            password: yup.string()
                                .required('You must enter a password confirmation'),
                            newPassword: yup.string()
                                .required('You must enter a new password')
                                .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, 'Password must be at least 6 characters long and contain one number and uppercase character.'),
                            newPasswordConfirmation: yup.string()
                                .oneOf([yup.ref('password')], 'Confirm password must matched password')
                                .required('You must enter your password confirmation to register'),
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
                                        label="Password"
                                        required
                                        type="password"
                                        keyName="password"
                                        value={values.password}
                                        onChange={handleChange}
                                        error={!!(errors.password)}
                                        errorMessage={errors.password}
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
                        )}
                </Formik>
            </Grid>
        </Grid>
    );
}
