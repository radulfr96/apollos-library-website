import * as React from 'react';
import { withStyles, Theme, Grid } from '@material-ui/core';
import Axios from 'axios';
import { User } from '../../interfaces/user';
import UsersTable from '../../components/UsersTable';

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

class Users extends React.Component<UsersProps, UsersState> {
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
                <UsersTable users={this.state.users} />
            </Grid>
        );
    }
}

export default withStyles(useStyles, { withTheme: true })(Users);
