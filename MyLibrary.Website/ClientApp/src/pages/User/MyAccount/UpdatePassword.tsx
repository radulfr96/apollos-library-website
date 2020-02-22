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
import ChangePasswordInfo from '../../../interfaces/changePasswordInfo';

interface ChangePasswordProps {
    classes: any;
    enqueueSnackbar: any;
    closeSnackbar: any;
}

interface ChangePasswordState {
    changePasswordInfo: ChangePasswordInfo;
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

export class UpdatePassword extends React.Component<ChangePasswordProps
    & WithStyles<typeof useStyles>
    & WithSnackbarProps,
    ChangePasswordState> {
    constructor(props: ChangePasswordProps) {
        super(props);
        this.updatePassword = this.updatePassword.bind(this);
        this.renderErrorSnackbar = this.renderErrorSnackbar.bind(this);
        this.renderSuccessSnackbar = this.renderSuccessSnackbar.bind(this);
        this.renderWarningSnackbar = this.renderWarningSnackbar.bind(this);

        this.state = {
            changePasswordInfo: {
                newPassword: '',
                newPasswordConfirmation: '',
                password: '',
            },
        };
    }

    updatePassword(passwordInfo: ChangePasswordInfo, validateForm: Function) {
        validateForm()
            .then((formKeys: any) => {
                if ((Object.keys(formKeys).length) === 0) {
                    Axios.patch('api/user/password', passwordInfo)
                        .then((response) => {
                            if (response.status === 200) {
                                this.renderSuccessSnackbar('Update password successful');
                            }
                        })
                        .catch((error) => {
                            if (error.response.status === 400) {
                                error.response.messages.forEach((message: string) => {
                                    this.renderWarningSnackbar(message);
                                });
                            } else {
                                this.renderErrorSnackbar('Unable to update password please contact admin');
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
                    <PageHeading headingText="Update Password" />
                </Grid>
                <Grid item xs={12}>
                    <Formik
                        initialValues={this.state.changePasswordInfo}
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
                                            className={this.props.classes.formButton}
                                            variant="contained"
                                            color="primary"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (errors !== null) {
                                                    this.updatePassword(values, validateForm);
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

export default compose<ChangePasswordProps, {}>(
    withStyles(useStyles),
    withSnackbar,
)(UpdatePassword);
