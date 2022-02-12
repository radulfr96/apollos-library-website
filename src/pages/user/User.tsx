import React, {
    useContext, useEffect, useState,
} from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import {
    Grid, Button, CircularProgress,
} from '@mui/material';
import Axios from 'axios';
import { push } from 'connected-react-router';
import { useParams } from 'react-router';
import { useStore } from 'react-redux';
import { useSnackbar } from 'notistack';
import { UpdateUserInfo } from '../../interfaces/updateUserInfo';
import PageHeading from '../../components/shared/PageHeading';
import InputTextField from '../../components/shared/InputTextField';
import RoleSelector from '../../components/RoleSelector';
import UserHelper from './UserHelper';
import { AppContext } from '../../Context';
import ConfigHelper from '../../config/configHelper';

interface UserState {
    updateInfo: UpdateUserInfo;
    roles: Array<string>;
}

const UserPage = () => {
    const [userState, setUserState] = useState<UserState>({
        updateInfo: {
            userID: 0,
            username: '',
            roles: [],
        },
        roles: [],
    });
    const [isLoading, setIsLoading] = useState<Boolean>(true);
    const { enqueueSnackbar } = useSnackbar();
    const store = useStore();
    const id = useParams();
    const context = useContext(AppContext);
    const configHelper = new ConfigHelper();

    useEffect(() => {
        if (context.getToken() === undefined) {
            return;
        }

        Axios.post(`${configHelper.apiUrl}/api/user/`, {
            UserID: id,
        }, {
            headers: {
                Authorization: `Bearer ${context.getToken()}`,
            },
        })
            .then((response) => {
                setUserState({
                    updateInfo: {
                        username: response.data.username,
                        userID: response.data.userID,
                        roles: response.data.userRoles,
                    },
                    roles: response.data.roles,
                });
                setIsLoading(false);
            });
    }, [context]);

    const renderErrorSnackbar = (message: string): void => {
        enqueueSnackbar(message, {
            variant: 'error',
        });
    };

    const renderSuccessSnackbar = (message: string): void => {
        enqueueSnackbar(message, {
            variant: 'success',
        });
    };

    const renderWarningSnackbar = (message: string): void => {
        enqueueSnackbar(message, {
            variant: 'warning',
        });
    };

    const updateUser = (user: UpdateUserInfo, validateForm: any) => {
        validateForm()
            .then((formKeys: any) => {
                if (Object.keys(formKeys).length === 0) {
                    Axios.patch(`${configHelper.apiUrl}/api/user/`, user, {
                        headers: {
                            Authorization: `Bearer ${context.getToken()}`,
                        },
                    })
                        .then((response) => {
                            if (response.status === 200) {
                                renderSuccessSnackbar('Update successful');
                                push('/user');
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
        const helper = new UserHelper(context.getToken());
        helper.CheckUsernameIsUnique(username).then((result) => {
            if (result === null || result === undefined) {
                renderErrorSnackbar('Unable to check username, please contact admin');
            } else if (result === true) {
                renderWarningSnackbar('Username is taken please choose another');
            } else if (result === false) {
                renderSuccessSnackbar('Username is availiable');
            }
        });
    };

    if (isLoading) {
        return (<CircularProgress />);
    }
    return (
        <Grid item xs={9} container justifyContent="center">
            <Grid item xs={12}>
                <PageHeading headingText="User Details" />
            </Grid>
            <Grid item xs={12}>
                <Formik
                    initialValues={userState.updateInfo}
                    enableReinitialize
                    onSubmit={() => { }}
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
                                .when('password', {
                                    // eslint-disable-next-line no-restricted-globals
                                    is: (password: string) => password?.length > 0,
                                    then: yup.string().required('Confirmation password is required'),
                                }),
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
                                <RoleSelector
                                    roles={userState.roles}
                                    selectedRoles={userState.updateInfo.roles}
                                    updateUserRoles={(newRoleNames: string[]) => {
                                        const newRoles = new Array<string>();
                                        newRoleNames.forEach((n) => {
                                            const role = userState.roles.find(
                                                (r) => r === n,
                                            );
                                            if (role !== undefined) {
                                                newRoles.push(role);
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
                                        store.dispatch(push('/user'));
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
};

export default UserPage;
