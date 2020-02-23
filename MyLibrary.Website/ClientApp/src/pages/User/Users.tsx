import * as React from 'react';
import {
 withStyles, Theme, Grid, WithStyles,
} from '@material-ui/core';
import Axios from 'axios';
import { User } from '../../interfaces/user';
import UsersTable from '../../components/UsersTable';
import PageHeading from '../../components/shared/PageHeading';

interface UsersProps {
    classes: any;
}

const useStyles = (theme: Theme) => ({
    paper: {
        color: theme.palette.primary.main,
        width: '100%',
    },
});

interface UsersState {
    users: Array<User>;
}

class Users extends React.Component<
UsersProps
& WithStyles<typeof useStyles>
, UsersState> {
    constructor(props: UsersProps) {
        super(props);

        this.state = {
            users: [],
        };
    }

    componentDidMount() {
        Axios.get('/api/user')
            .then((response) => {
                this.setState({
                    users: response.data.users,
                });
            });
    }

    render() {
        return (
            <Grid item xs={9} container justify="center">
                <Grid item xs={12}>
                    <PageHeading headingText="Users" />
                </Grid>
                <Grid item xs={12}>
                    <UsersTable users={this.state.users} />
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(useStyles, { withTheme: true })(Users);
