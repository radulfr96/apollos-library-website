import * as React from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import {
    withStyles, Theme, Grid, WithStyles, Button, CircularProgress,
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
import UserHelper from './UserHelper';

interface UserProps {
    classes: any;
}

const useStyles = (theme: Theme) => ({
    paper: {
        color: theme.palette.primary.main,
        width: '100%',
    },
    formButton: {
        marginRight: '10px',
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
                        roles: response.data.user.roles,
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
                                this.renderWarningSnackbar('Unable to update user invalid input');
                            } else {
                                this.renderErrorSnackbar('Unable to update user please contact admin');
                            }
                        });
                }
            });
    }

    checkUserIsUnique(username: string) {
        const helper = new UserHelper();
        helper.CheckUserIsUnique(username).then((result) => {
            if (result === null || result === undefined) {
                this.renderErrorSnackbar('Unable to check username, please contact admin');
            } else if (result === true) {
                this.renderWarningSnackbar('Username is taken please choose another');
            } else if (result === false) {
                this.renderSuccessSnackbar('Username is availiable');
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
                                    .required('A user must have a username'),
                                roles: yup.array()
                                    .required('A user must have a role'),
                                password: yup.string()
                                    .notRequired()
                                    .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, 'Password must be at least 6 characters long and contain one number and uppercase character.'),
                                confirmationPassword: yup.string()
                                    .oneOf([yup.ref('password')], 'Confirmation password must matched password')
                                    .when(
                                        'password', {
                                        // eslint-disable-next-line no-restricted-globals
                                        is: (password) => password?.length > 0,
                                        then: yup.string().required('Confirmation password is required'),
                                    },
                                    ),
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
                                            onBlur={() => {
                                                this.checkUserIsUnique(values.username);
                                            }}
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
                                            value={values.confirmationPassword}
                                            onChange={handleChange}
                                            error={!!(errors.confirmationPassword)}
                                            errorMessage={errors.confirmationPassword}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <RoleSelector
                                            roles={this.state.roles.map(
                                                (r) => r.name,
                                            )}
                                            selectedRoles={values.roles.map(
                                                (r) => r.name,
                                            )}
                                            updateUserRoles={(newRoleNames: string[]) => {
                                                const newRoles = new Array<Role>();
                                                newRoleNames.forEach((n) => {
                                                    const role = this.state.roles.find(
                                                        (r) => r.name === n,
                                                    );
                                                    if (role !== undefined) {
                                                        const newRole: Role = {
                                                            roleId: role.roleId,
                                                            name: role.name,
                                                        };
                                                        newRoles.push(newRole);
                                                    }
                                                });
                                                // eslint-disable-next-line no-param-reassign
                                                values.roles = newRoles;
                                                this.setState({
                                                    ...this.state,
                                                    updateInfo: {
                                                        ...this.state.updateInfo,
                                                        roles: newRoles,
                                                    },
                                                });
                                            }}
                                            error={!!(errors.roles)}
                                            errorMessage="A user must have a role"
                                        />
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
                                                this.props.history.push('/user');
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
