import * as React from 'react';
import {
    WithStyles, Grid, createStyles, withStyles, Button,
} from '@material-ui/core';
import { compose } from 'recompose';
import { Formik } from 'formik';
import * as yup from 'yup';
import Axios from 'axios';
import { WithSnackbarProps, withSnackbar } from 'notistack';
import PageHeading from '../../../components/shared/PageHeading';
import InputTextField from '../../../components/shared/InputTextField';
import ChangeUsernameInfo from '../../../interfaces/changeUsernameInfo';

interface ChangeUsernameProps {
    classes: any;
    enqueueSnackbar: any;
    closeSnackbar: any;
}

interface ChangeUsernameState {
    changeUsernameInfo: ChangeUsernameInfo;
}

const useStyles = createStyles({
    paper: {
        paddingTop: '20px',
        paddingLeft: '40px',
        paddingRight: '20px',
    },
    navPaper: {
        paddingTop: '20px',
        paddingLeft: '40px',
        paddingRight: '20px',
        marginRight: '20px',
        width: '150px',
    },
});

export class ChangeUsername extends React.Component<ChangeUsernameProps
    & WithStyles<typeof useStyles>
    & WithSnackbarProps
    , ChangeUsernameState> {
        constructor(props: ChangeUsernameProps) {
            super(props);
            this.updateUsername = this.updateUsername.bind(this);
            this.renderErrorSnackbar = this.renderErrorSnackbar.bind(this);
            this.renderSuccessSnackbar = this.renderSuccessSnackbar.bind(this);
            this.renderWarningSnackbar = this.renderWarningSnackbar.bind(this);

            this.state = {
                changeUsernameInfo: {
                    username: '',
                    password: '',
                },
            };
        }

    updateUsername(usernameInfo: ChangeUsernameInfo, validateForm: Function) {
        validateForm()
            .then((formKeys: any) => {
                if (Object.keys(formKeys).length === 0) {
                    Axios.patch('api/user', usernameInfo)
                        .then((response) => {
                            if (response.status === 200) {
                                this.renderSuccessSnackbar('Update username successful');
                            }
                        })
                        .catch((error) => {
                            if (error.response.status === 400) {
                                error.response.messages.forEach((message: string) => {
                                    this.renderWarningSnackbar(message);
                                });
                            } else {
                                this.renderErrorSnackbar('Unable to update username please contact admin');
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

    render() {
        return (
            <Grid container item xs={12}>
                <Grid item xs={12}>
                    <PageHeading headingText="Change Username" />
                </Grid>
                <Grid item xs={12}>
                    <Formik
                        initialValues={this.state.changeUsernameInfo}
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
                                            label="New Username"
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
                                                    this.updateUsername(values, validateForm);
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
}

export default compose<ChangeUsernameProps, {}>(
    withStyles(useStyles),
    withSnackbar,
)(ChangeUsername);
