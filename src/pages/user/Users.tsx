import React, { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import Axios from 'axios';
import { WithSnackbarProps } from 'notistack';
import { User } from '../../interfaces/user';
import UsersTable from '../../components/UsersTable';
import PageHeading from '../../components/shared/PageHeading';

interface UsersState {
    users: Array<User>;
}

export default function Users(props: WithSnackbarProps): JSX.Element {
    const [usersState, setUsersState] = useState<UsersState>({
        users: [],
    });

    const getUsers = () => {
        Axios.get('/api/user')
            .then((response) => {
                setUsersState({
                    ...usersState,
                    users: response.data.users,
                });
            });
    };

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

    const deleteUser = (id: string): void => {
        Axios.delete(`api/user/${id}`)
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
        <Grid item xs={9} container justify="center">
            <Grid item xs={12}>
                <PageHeading headingText="Users" />
            </Grid>
            <Grid item xs={12}>
                <UsersTable users={usersState.users} deleteUser={deleteUser} />
            </Grid>
        </Grid>
    );
}
