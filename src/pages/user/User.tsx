import React, { useEffect, useState } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import {
    Grid, Button, CircularProgress,
} from '@material-ui/core';
import Axios from 'axios';
import { useParams } from 'react-router';
import { useHistory } from 'react-router-dom';
import { WithSnackbarProps } from 'notistack';
import { User } from '../../interfaces/user';
import { UpdateUserInfo } from '../../interfaces/updateUserInfo';
import PageHeading from '../../components/shared/PageHeading';
import InputTextField from '../../components/shared/InputTextField';
import { Role } from '../../interfaces/role';
import RoleSelector from '../../components/RoleSelector';
import UserHelper from './UserHelper';

interface UserState {
    user: User | undefined;
    updateInfo: UpdateUserInfo;
    roles: Array<Role>;
}

interface UserParams {
    id: string | undefined;
}

export default function UserPage(props: WithSnackbarProps) {
    const [userState, setUserState] = useState<UserState>({
        user: undefined,
        updateInfo: {
            userID: 0,
            username: '',
            password: '',
            confirmationPassword: '',
            roles: [],
        },
        roles: [],
    });

    const history = useHistory();
    const params = useParams<UserParams>();

    useEffect(() => {
        Axios.get(`/api/user/${params.id}`)
            .then((response) => {
                setUserState({
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

    const updateUser = (user: UpdateUserInfo, validateForm: any) => {
        validateForm()
            .then((formKeys: any) => {
                if (Object.keys(formKeys).length === 0) {
                    Axios.patch('api/user/', user)
                        .then((response) => {
                            if (response.status === 200) {
                                renderSuccessSnackbar('Update successful');
                                history.goBack();
                            }
                        })
                        .catch((error) => {
                            if (error.response.status === 400) {
                                renderWarningSnackbar('Unable to update user invalid input');
                            } else {
                                renderErrorSnackbar('Unable to update user please contact admin');
                            }
                        });
                }
            });
    };

    const checkUserIsUnique = (username: string) => {
        const helper = new UserHelper();
        helper.CheckUserIsUnique(username).then((result) => {
            if (result === null || result === undefined) {
                renderErrorSnackbar('Unable to check username, please contact admin');
            } else if (result === true) {
                renderWarningSnackbar('Username is taken please choose another');
            } else if (result === false) {
                renderSuccessSnackbar('Username is availiable');
            }
        });
    };

    if (userState.user === undefined) {
        return (<CircularProgress />);
    }

    return (
        <Grid item xs={9} container justify="center">
            <Grid item xs={12}>
                <PageHeading headingText="User Details" />
            </Grid>
            <Grid item xs={12}>
                <Formik
                    initialValues={userState.updateInfo}
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
                                    is: (password: string) => password?.length > 0,
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
                                            checkUserIsUnique(values.username);
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
                                        roles={userState.roles.map(
                                            (r) => r.name,
                                        )}
                                        selectedRoles={values.roles.map(
                                            (r: Role) => r.name,
                                        )}
                                        updateUserRoles={(newRoleNames: string[]) => {
                                            const newRoles = new Array<Role>();
                                            newRoleNames.forEach((n) => {
                                                const role = userState.roles.find(
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
                                            setUserState({
                                                ...userState,
                                                updateInfo: {
                                                    ...userState.updateInfo,
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
                                        variant="contained"
                                        color="primary"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (errors !== null) {
                                                updateUser(values, validateForm);
                                            }
                                        }}
                                    >
                                        Update
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => {
                                            history.push('/user');
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
