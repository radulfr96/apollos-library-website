import React, { useEffect, useState, useContext } from 'react';
import { Grid } from '@mui/material';
import Axios from 'axios';
import { WithSnackbarProps } from 'notistack';
import { User } from '../../interfaces/user';
import UsersTable from '../../components/UsersTable';
import PageHeading from '../../components/shared/PageHeading';
import ConfigHelper from '../../config/configHelper';
import { AppContext } from '../../Context';

interface UsersState {
    users: Array<User>;
}

const Users = (props: WithSnackbarProps) => {
    const [usersState, setUsersState] = useState<UsersState>({
        users: [],
    });
    const context = useContext(AppContext);

    const configHelper = new ConfigHelper();

    const { enqueueSnackbar } = props;

    const getUsers = () => {
        console.log(context.getToken());
        Axios.post(`${configHelper.apiUrl}/api/user/users`, {}, {
            headers: {
                Authorization: `Bearer ${context.getToken()}`,
            },
        })
            .then((response) => {
                setUsersState({
                    ...usersState,
                    users: response.data.users,
                });
            });
    };

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

    const deleteUser = (id: string): void => {
        Axios.delete(`${process.env.MY_LIBRARY_API}/api/user/${id}`)
            .then((response) => {
                if (response.status === 200) {
                    renderSuccessSnackbar('Delete successful');
                    getUsers();
                }
            })
            .catch((error) => {
                if (error.response.status === 400) {
                    renderWarningSnackbar('You cannot delete the current logged in user.');
                } else {
                    renderErrorSnackbar('Unable to delete user please contact admin');
                }
            });
    };

    useEffect(() => {
        getUsers();
    });

    return (
        <Grid item xs={9} container justifyContent="center">
            <Grid item xs={12}>
                <PageHeading headingText="Users" />
            </Grid>
            <Grid item xs={12}>
                <UsersTable users={usersState.users} deleteUser={deleteUser} />
            </Grid>
        </Grid>
    );
};

export default Users;
