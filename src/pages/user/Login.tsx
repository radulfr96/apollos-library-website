import React, { useContext, useState } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import {
    Paper, Grid, Button,
} from '@mui/material';
import Axios from 'axios';
import { useHistory } from 'react-router';
import { WithSnackbarProps } from 'notistack';
import InputTextField from '../../components/shared/InputTextField';
import { LoginInfo } from '../../interfaces/loginInfo';
import PageHeading from '../../components/shared/PageHeading';
import { AppContext } from '../../Context';

interface LoginState {
    loginInfo: LoginInfo;
}

export default function Login(props: WithSnackbarProps): JSX.Element {
    const context = useContext(AppContext);
    const history = useHistory();
    const [loginState] = useState<LoginState>({
        loginInfo: {
            username: '',
            password: '',
        },
    });

    const login = (loginInfo: LoginInfo, validateForm: any) => {
        validateForm()
            .then((formKeys: any) => {
                if (Object.keys(formKeys).length === 0) {
                    Axios.post('api/user/login', loginInfo)
                        .then((response) => {
                            if (response.status === 200) {
                                renderSuccessSnackbar('Login successful');
                                context.getUserInfo();
                                history.push('/');
                            }
                        })
                        .catch((error) => {
                            if (error.response.status === 400) {
                                renderWarningSnackbar('Username or password is incorrect');
                            } else {
                                renderErrorSnackbar('Unable to login in user please contact admin');
                            }
                        });
                }
            });
    };

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

    return (
        <Paper
            sx={{
                paddingTop: '20px',
                paddingLeft: '40px',
                paddingRight: '20px',
            }}
        >
            <PageHeading headingText="Login" />
            <Formik
                initialValues={loginState.loginInfo}
                onSubmit={(values) => {
                    console.log(values);
                }}
                validationSchema={
                    yup.object().shape({
                        username: yup.string()
                            .required('You must enter your username to login'),
                        password: yup.string()
                            .required('You must enter your password to login'),
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
                                label="Username"
                                required
                                type="text"
                                keyName="username"
                                value={values.username}
                                onChange={handleChange}
                                error={!!(errors.username)}
                                errorMessage={errors.username}
                            />
                        </Grid>
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
                            <Button
                                sx={{
                                    marginBottom: '10px',
                                    marginRight: '10px',
                                    float: 'right',
                                }}
                                variant="contained"
                                color="primary"
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (errors !== null) {
                                        login(values, validateForm);
                                    }
                                }}
                            >
                                Login
                            </Button>
                            <Button
                                sx={{
                                    marginBottom: '10px',
                                    marginRight: '10px',
                                    float: 'right',
                                }}
                                variant="contained"
                                color="secondary"
                                onClick={() => {
                                    history.push('/');
                                }}
                            >
                                Cancel
                            </Button>
                        </Grid>
                    </Grid>

                )}
            </Formik>
        </Paper>
    );
}