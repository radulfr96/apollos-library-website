import React from 'react';
import {
 TableHead, TableRow, TableCell, TableSortLabel,
 makeStyles, createStyles, Theme, TableContainer,
 Paper, Table, TableBody,
} from '@material-ui/core';
import { User } from '../interfaces/user';
import TableHelper, { Order } from '../util/TableFunctions';

interface HeadCell {
    id: keyof User;
    label: string;
}

const headCells: HeadCell[] = [
    { id: 'userID', label: 'User ID' },
    { id: 'username', label: 'Username' },
    { id: 'isActive', label: ' User is Active' },
];

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        width: '100%',
    },
    paper: {
        width: '100%',
        marginBottom: theme.spacing(2),
    },
    table: {
        minWidth: 750,
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
    row: {
        transition: 'all 0.4s',
    },
}));

interface EnhancedTableProps {
    classes: ReturnType<typeof useStyles>;
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof User) => void;
    order: Order;
    orderBy: string;
}

function EnhancedTableHead(props: EnhancedTableProps) {
    const {
 classes, onRequestSort, order, orderBy,
} = props;
    const createSortHandler = (property: keyof User) => (event: React.MouseEvent<unknown>) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <span className={classes.visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </span>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
                <TableCell />
            </TableRow>
        </TableHead>
    );
}

export const Row: React.FC<{ row: User }> = ({ row }) => {
    const classes = useStyles();

    return (
        <TableRow key={row.userID} hover className={classes.row}>
            <TableCell>{row.userID}</TableCell>
            <TableCell component="th" scope="row">{row.username}</TableCell>
            <TableCell>{row.isActive}</TableCell>
            <TableCell />
        </TableRow>
    );
};

const UsersTable: React.FC<{ users: Array<User> }> = ({ users }) => {
    const classes = useStyles();
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof User>('userID');
    const tableHelper = new TableHelper();

    const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof User) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    let tableContent = null;
    tableContent = tableHelper.stableSort(users, tableHelper.getSorting(order, orderBy))
        .map((row: User) => (
            <Row row={row} />
        ));

    return (
        <>
            <TableContainer component={Paper}>
                <Table
                    className={classes.table}
                    aria-labelledby="tableTitle"
                    aria-label="enhanced table"
                >
                    <EnhancedTableHead
                        classes={classes}
                        order={order}
                        orderBy={orderBy}
                        onRequestSort={handleRequestSort}
                    />
                    <TableBody>
                        {tableContent}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};

export default UsersTable;
