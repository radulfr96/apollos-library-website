import {
    Theme, Grid, makeStyles,
} from '@material-ui/core';
import Axios from 'axios';
import { User } from '../../interfaces/user';
import UsersTable from '../../components/UsersTable';
import PageHeading from '../../components/shared/PageHeading';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';

interface UsersProps {
    classes: any;
    enqueueSnackbar: any;
    closeSnackbar: any;
}

const useStyles = makeStyles((theme: Theme) => ({
    paper: {
        color: theme.palette.primary.main,
        width: '100%',
    },
}));

interface UsersState {
    users: Array<User>;
}

export default function Users(props: UsersProps): JSX.Element {
    const classes = useStyles();
    const [usersState, setUsersState] = useState<UsersState>({
        users: [],
    });
    const history = useHistory();

    useEffect(() => {
        getUsers();
    });

    const getUsers = () => {
        Axios.get('/api/user')
            .then((response) => {
                setUsersState({
                    ...usersState,
                    users: response.data.users,
                });
            });
    }

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
    }

    const renderErrorSnackbar = (message: string): void => {
        props.enqueueSnackbar(message, {
            variant: 'error',
        });
    }

    const renderSuccessSnackbar = (message: string): void => {
        props.enqueueSnackbar(message, {
            variant: 'success',
        });
    }

    const renderWarningSnackbar = (message: string): void => {
        props.enqueueSnackbar(message, {
            variant: 'warning',
        });
    }

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
