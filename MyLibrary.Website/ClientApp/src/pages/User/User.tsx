import * as React from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import {
    withStyles, Theme, Grid, WithStyles, Button, CircularProgress, Typography,
} from '@material-ui/core';
import Axios from 'axios';
import { withRouter, RouteComponentProps, RouteProps } from 'react-router';
import { withSnackbar, WithSnackbarProps } from 'notistack';
import compose from 'recompose/compose';
import { User } from '../../interfaces/user';
import { UpdateUserInfo } from '../../interfaces/updateUserInfo';
import PageHeading from '../../components/shared/PageHeading';
import InputTextField from '../../components/shared/InputTextField';
import { Role } from '../../interfaces/role';
import RoleSelector from '../../components/RoleSelector';

interface UserProps {
    classes: any;
}

const useStyles = (theme: Theme) => ({
    paper: {
        color: theme.palette.primary.main,
        width: '100%',
    },
});

interface UserState {
    user: User | undefined;
    updateInfo: UpdateUserInfo;
    roles: Array<Role>;
}

interface UserParams {
    id: string | undefined;
}

class UserPage extends React.Component<
    UserProps
    & WithStyles<typeof useStyles>
    & RouteProps
    & WithSnackbarProps
    & RouteComponentProps<UserParams>
    , UserState> {
    constructor(props: any) {
        super(props);
        this.updateUser = this.updateUser.bind(this);
        this.onChange = this.onChange.bind(this);
        this.renderErrorSnackbar = this.renderErrorSnackbar.bind(this);
        this.renderSuccessSnackbar = this.renderSuccessSnackbar.bind(this);
        this.renderWarningSnackbar = this.renderWarningSnackbar.bind(this);

        this.state = {
            user: undefined,
            updateInfo: {
                userID: 0,
                username: '',
                password: undefined,
                confirmationPassword: undefined,
                roles: [],
            },
            roles: [],
        };

        Axios.get(`/api/user/${this.props.match.params.id}`)
            .then((response) => {
                this.setState({
                    user: response.data.user,
                    updateInfo: {
                        username: response.data.user.username,
                        password: '',
                        confirmationPassword: '',
                        userID: response.data.user.userID,
                        roles: [],
                    },
                    roles: response.data.roles,
                });
            });
    }

    onChange(key: string, value: any): void {
        const prevState = this.state;
        this.setState({
            updateInfo: {
                ...prevState.updateInfo,
                [key]: value,
            },
        });
    }

    updateUser(user: UpdateUserInfo, validateForm: Function) {
        validateForm()
            .then((formKeys: any) => {
                if (Object.keys(formKeys).length === 0) {
                    Axios.patch('api/user/', user)
                        .then((response) => {
                            if (response.status === 200) {
                                this.renderSuccessSnackbar('Update successful');
                                this.props.history.goBack();
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

    render() {
        if (this.state.user === undefined) {
            return (<CircularProgress />);
        }

        return (
            <Grid item xs={9} container justify="center">
                <Grid item xs={12}>
                    <PageHeading headingText="User Details" />
                </Grid>
                <Grid item xs={12}>
                    <Formik
                        initialValues={this.state.updateInfo}
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
                                            label="Confirmation Password"
                                            type="password"
                                            keyName="confirmationPassword"
                                            value={values.password}
                                            onChange={handleChange}
                                            error={!!(errors.password)}
                                            errorMessage={errors.password}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography>User Roles</Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <RoleSelector roles={this.state.roles} />
                                    </Grid>
                                    <Grid item xs={12} style={{ paddingTop: '10px' }}>
                                        <Button
                                            className={this.props.classes.formButton}
                                            variant="contained"
                                            color="primary"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (errors !== null) {
                                                    this.updateUser(values, validateForm);
                                                }
                                            }}
                                        >
                                            Update
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
                </Grid>
            </Grid>
        );
    }
}

export default compose<UserProps, {}>(
    withStyles(useStyles),
    withRouter,
    withSnackbar,
)(UserPage);
