import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import { User } from '../../interfaces/user';
import { withStyles, Theme, TableContainer, Table } from '@material-ui/core';
import TableHelper, { Order } from '../../Util/TableFunctions';

interface HeadCell {
    disablePadding: boolean;
    id: keyof User;
    label: string;
}

interface UsersProps {
    classes: any,
}

const headCells: HeadCell[] = [
    { id: 'userID', disablePadding: true, label: 'User ID' },
    { id: 'username', disablePadding: false, label: 'Username' },
    { id: 'isActive', disablePadding: false, label: ' User is Active' },
];

const useStyles = (theme: Theme) => ({
    paper: {
        color: theme.palette.primary.main,
        width: '100%',
    }
});

function EnhancedTable() {
    //const classes = useStyles();
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof Users>('userID');
    const [selected, setSelected] = React.useState<string[]>([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
  
    const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof Users) => {
      const isAsc = orderBy === property && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(property);
    };
};

class Users extends React.Component<UsersProps> {
    render() {
        const { classes } = this.props;
        
        return (
            <Paper className={classes.paper}>
                <TableContainer>
                    <Table>
                        <EnhancedTable>

                        </EnhancedTable>
                    </Table>
                </TableContainer>
            </Paper>
        )
    }
}

export default withStyles(useStyles, { withTheme: true })(Users);