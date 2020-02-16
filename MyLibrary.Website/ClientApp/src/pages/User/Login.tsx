import React from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import {
    Paper, Grid, Button, WithStyles, withStyles, createStyles,
} from '@material-ui/core';
import Axios from 'axios';
import { WithSnackbarProps, withSnackbar } from 'notistack';
import { RouteComponentProps, withRouter } from 'react-router';
import { compose } from 'recompose';
import InputTextField from '../../components/shared/InputTextField';
import { LoginInfo } from '../../interfaces/loginInfo';
import PageHeading from '../../components/shared/PageHeading';

interface LoginState {
    loginInfo: LoginInfo;
}

interface LoginProps extends RouteComponentProps<{}> {
    classes: any;
    enqueueSnackbar: any;
    closeSnackbar: any;
}

const useStyles = createStyles({
    paper: {
        paddingTop: '20px',
        paddingLeft: '40px',
        paddingRight: '20px',
    },
    formButton: {
        marginBottom: '10px',
        marginRight: '10px',
        float: 'right',
    },
});

export class Login extends React.Component<
    LoginProps
    & WithStyles<typeof useStyles>
    & WithSnackbarProps
    , LoginState> {
    constructor(props: LoginProps) {
        super(props);
        this.login = this.login.bind(this);
        this.onChange = this.onChange.bind(this);
        this.renderErrorSnackbar = this.renderErrorSnackbar.bind(this);
        this.renderSuccessSnackbar = this.renderSuccessSnackbar.bind(this);
        this.renderWarningSnackbar = this.renderWarningSnackbar.bind(this);

        this.state = {
            loginInfo: {
                username: '',
                password: '',
            },
        };
    }

    onChange(key: string, value: any): void {
        const prevState = this.state;
        this.setState({
            loginInfo: {
                ...prevState.loginInfo,
                [key]: value,
            },
        });
    }

    login(loginInfo: LoginInfo, validateForm: Function) {
        validateForm()
            .then((formKeys: any) => {
                if (Object.keys(formKeys).length === 0) {
                    Axios.post('api/user/login', loginInfo)
                        .then((response) => {
                            if (response.status === 200) {
                                this.renderSuccessSnackbar('Login successful');
                                // this.context.getUserInfo();
                                this.props.history.push('/');
                            }
                        })
                        .catch((error) => {
                            if (error.response.status === 400) {
                                this.renderWarningSnackbar('Username or password is incorrect');
                            } else {
                                this.renderErrorSnackbar('Unable to login in user please contact admin');
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

    render(): JSX.Element {
        return (
            <Paper className={this.props.classes.paper}>
                <PageHeading headingText="Login" />
                <Formik
                    initialValues={this.state.loginInfo}
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
                                        className={this.props.classes.formButton}
                                        variant="contained"
                                        color="primary"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (errors !== null) {
                                                this.login(values, validateForm);
                                            }
                                        }}
                                    >
                                        Login
                                    </Button>
                                    <Button
                                        className={this.props.classes.formButton}
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => {
                                            this.props.history.push('/');
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
}

export default compose<LoginProps, {}>(
    withStyles(useStyles),
    withRouter,
    withSnackbar,
)(Login);
