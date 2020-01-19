import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import { User } from '../../interfaces/user';
import { withStyles, Theme, TableContainer, Table } from '@material-ui/core';
import EnhancedTable from '../../components/UsersTable';

interface UsersProps {
    classes: any,
}

const useStyles = (theme: Theme) => ({
    paper: {
        color: theme.palette.primary.main,
        width: '100%',
    }
});

const users = new Array<User>();

class Users extends React.Component<UsersProps> {
    render() {
        const { classes } = this.props;

        return (
            <TableContainer component={Paper}>
                <Table>
                    <EnhancedTable users={users}>

                    </EnhancedTable>
                </Table>
            </TableContainer>
        )
    }
}

export default withStyles(useStyles, { withTheme: true })(Users);