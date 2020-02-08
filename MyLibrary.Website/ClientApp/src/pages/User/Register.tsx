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
import InputTextField from '../../components/InputTextField';
import { RegisterInfo } from '../../interfaces/registerInfo';

interface RegisterState {
    registrationInfo: RegisterInfo;
}

interface RegisterProps extends RouteComponentProps<{}> {
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

export class Register extends React.Component<
    RegisterProps
    & WithStyles<typeof useStyles>
    & WithSnackbarProps
    , RegisterState> {
    constructor(props: RegisterProps) {
        super(props);
        this.register = this.register.bind(this);
        this.onChange = this.onChange.bind(this);
        this.renderErrorSnackbar = this.renderErrorSnackbar.bind(this);
        this.renderSuccessSnackbar = this.renderSuccessSnackbar.bind(this);
        this.renderWarningSnackbar = this.renderWarningSnackbar.bind(this);

        this.state = {
            registrationInfo: {
                username: '',
                password: '',
                confirmationPassword: '',
            },
        };
    }

    onChange(key: string, value: any): void {
        const prevState = this.state;
        this.setState({
            registrationInfo: {
                ...prevState.registrationInfo,
                [key]: value,
            },
        });
    }

    checkUserIsUnique(username: string) {
        Axios.get(`api/user/${username}`)
            .then((response) => {
                if (response.data.result === true) {
                    this.renderWarningSnackbar('Username is not unique please choose another');
                } else if (response.data.result === false) {
                    this.renderSuccessSnackbar('Username is availiable');
                } else {
                    this.renderErrorSnackbar('Unable to check username, please contact admin');
                }
            })
            .catch(() => {
                this.renderErrorSnackbar('Unable to check username, please contact admin');
            });
        return null;
    }

    register(registrationInfo: RegisterInfo, validateForm: Function) {
        validateForm()
            .then(() => {
                Axios.post('api/user/', registrationInfo)
                    .then((response) => {
                        if (response.status === 200) {
                            this.renderSuccessSnackbar('Registration successful');
                            this.props.history.push('/');
                        }
                    })
                    .catch((error) => {
                        if (error.response.status === 400) {
                            this.renderWarningSnackbar(error.data);
                        } else {
                            this.renderErrorSnackbar('Unable to login in user please contact admin');
                        }
                    });
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
            <div>
                <Formik
                    initialValues={this.state.registrationInfo}
                    onSubmit={(values) => {
                        console.log(values);
                    }}
                    validationSchema={
                        yup.object().shape({
                            username: yup.string()
                                .required('You must enter a username to register'),
                            password: yup.string()
                                .required('You must enter your a password to register'),
                            confirmationPassword: yup.string()
                                .required('You must enter your confirmation password to register'),
                        })
                    }
                >
                    {({
                        values,
                        errors,
                        handleChange,
                        handleBlur,
                        validateForm,
                    }) => (
                            <Paper className={this.props.classes.paper}>
                                <Grid container item xs={12}>
                                    <Grid item xs={12}>
                                        <InputTextField
                                            label="Username"
                                            required
                                            type="text"
                                            keyName="username"
                                            value={values.username}
                                            onChange={handleChange}
                                            onBlur={() => {
                                                this.checkUserIsUnique(values.username);
                                            }}
                                            error={!!(errors.username)}
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
                                            onBlur={handleBlur}
                                            error={!!(errors.password)}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <InputTextField
                                            label="Confirm Password"
                                            required
                                            type="password"
                                            keyName="confirmPassword"
                                            value={values.confirmationPassword}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={!!(errors.confirmationPassword)}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button
                                            className={this.props.classes.formButton}
                                            variant="contained"
                                            color="primary"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                this.register(values, validateForm);
                                            }}
                                        >
                                            Register
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
                            </Paper>
                        )}
                </Formik>
            </div>
        );
    }
}

export default compose<RegisterProps, {}>(
    withStyles(useStyles),
    withRouter,
    withSnackbar,
)(Register);
