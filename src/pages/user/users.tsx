import React, { useEffect, useState, useContext } from 'react';
import { Grid, CircularProgress } from '@mui/material';
import Axios from 'axios';
import { useSnackbar } from 'notistack';
import { User } from '../../interfaces/user';
import UsersTable from '../../components/usersTable';
import PageHeading from '../../components/shared/pageHeading';
import ConfigHelper from '../../config/configHelper';
import { AppContext } from '../../userContext';

interface UsersState {
    users: Array<User>;
}

const Users = () => {
    const [usersState, setUsersState] = useState<UsersState>({
        users: [],
    });
    const { enqueueSnackbar } = useSnackbar();
    const context = useContext(AppContext);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const configHelper = new ConfigHelper();

    const getUsers = () => new Promise<void>((resolve) => {
        Axios.post(`${configHelper.idpUrl}/api/user/users`, {}, {
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
        resolve();
    });

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
        Axios.delete(`${process.env.idpUrl}/api/user/${id}`)
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
        if (context.getToken() === undefined) {
            return;
        }
        getUsers()
            .then(() => {
                setIsLoading(false);
            });
    }, [context]);

    if (isLoading) {
        return (<CircularProgress />);
    }
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
