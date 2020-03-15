import * as React from 'react';
import {
 withStyles, Theme, Grid, WithStyles,
} from '@material-ui/core';
import Axios from 'axios';
import { WithSnackbarProps, withSnackbar } from 'notistack';
import { compose } from 'recompose';
import { User } from '../../interfaces/user';
import UsersTable from '../../components/UsersTable';
import PageHeading from '../../components/shared/PageHeading';

interface GenresProps {
    classes: any;
    enqueueSnackbar: any;
    closeSnackbar: any;
}

const useStyles = (theme: Theme) => ({
    paper: {
        color: theme.palette.primary.main,
        width: '100%',
    },
});

interface GenresState {
    users: Array<User>;
}

export class Genres extends React.Component<
GenresProps
& WithStyles<typeof useStyles>
& WithSnackbarProps
, GenresState> {
    constructor(props: any) {
        super(props);
        this.renderErrorSnackbar = this.renderErrorSnackbar.bind(this);
        this.renderSuccessSnackbar = this.renderSuccessSnackbar.bind(this);
        this.renderWarningSnackbar = this.renderWarningSnackbar.bind(this);

        this.state = {
            users: [],
        };
    }

    componentDidMount() {
        this.getUsers();
    }

    getUsers() {
        Axios.get('/api/user')
        .then((response) => {
            this.setState({
                users: response.data.users,
            });
        });
    }

    deleteUser(id: string): void {
        Axios.delete(`api/user/${id}`)
            .then((response) => {
                if (response.status === 200) {
                    this.renderSuccessSnackbar('Delete successful');
                    this.getUsers();
                }
            })
            .catch((error) => {
                if (error.response.status === 400) {
                    this.renderWarningSnackbar('You cannot delete the current logged in user.');
                } else {
                    this.renderErrorSnackbar('Unable to delete user please contact admin');
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
            <Grid item xs={9} container justify="center">
                <Grid item xs={12}>
                    <PageHeading headingText="Users" />
                </Grid>
                <Grid item xs={12}>
                    <UsersTable users={this.state.users} deleteUser={this.deleteUser} />
                </Grid>
            </Grid>
        );
    }
}

export default compose<UsersProps, {}>(
    withStyles(useStyles),
    withSnackbar,
)(Users);
