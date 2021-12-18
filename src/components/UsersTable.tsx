import React from 'react';
import {
    TableHead, TableRow, TableCell, TableSortLabel, TableContainer,
    Paper, Table, TableBody, IconButton, Typography,
} from '@mui/material';
import { ChevronRight, Delete } from '@mui/icons-material';
import { User } from '../interfaces/user';
import TableHelper, { Order } from '../util/TableFunctions';

interface HeadCell {
    id: keyof User;
    label: string;
}

const headCells: HeadCell[] = [
    { id: 'userID', label: 'User ID' },
    { id: 'username', label: 'Username' },
    { id: 'email', label: 'Email' },
    { id: 'isActive', label: ' User is Active' },
];

interface EnhancedTableProps {
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof User) => void;
    order: Order;
    orderBy: string;
}

const EnhancedTableHead = (props: EnhancedTableProps) => {
    const {
        onRequestSort, order, orderBy,
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
                                <Typography sx={{
                                    border: 0,
                                    clip: 'rect(0 0 0 0)',
                                    height: 1,
                                    margin: -1,
                                    overflow: 'hidden',
                                    padding: 0,
                                    position: 'absolute',
                                    top: 20,
                                    width: 1,
                                }}
                                >
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Typography>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
                <TableCell />
            </TableRow>
        </TableHead>
    );
};

interface RowProps {
    user: User;
    deleteUser: (userId: string) => void;
}

const Row = (props: RowProps) => {
    const { user, deleteUser } = props;

    return (
        <TableRow
            key={user.userID}
            hover
            sx={{
                transition: 'all 0.4s',
            }}
        >
            <TableCell>{user.userID}</TableCell>
            <TableCell>{user.username}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.isActive}</TableCell>
            <TableCell>
                <IconButton onClick={() => {
                    deleteUser(user.userID);
                }}
                >
                    <Delete sx={{
                        color: 'red',
                    }}
                    />
                </IconButton>
                <IconButton>
                    <a href={`/userdetails/${user.userID}`}>
                        <ChevronRight />
                    </a>
                </IconButton>
            </TableCell>
        </TableRow>
    );
};

interface UserTableProps {
    users: Array<User>;
    deleteUser: (userId: string) => void;
}

const UsersTable = (props: UserTableProps) => {
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof User>('userID');
    const { users, deleteUser } = props;

    const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof User) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    let tableContent = null;
    tableContent = TableHelper.stableSort(users, TableHelper.getSorting(order, orderBy))
        .map((row: User) => (
            <Row user={row} deleteUser={deleteUser} />
        ));

    return (
        <TableContainer component={Paper}>
            <Table
                aria-labelledby="tableTitle"
                aria-label="enhanced table"
                size="small"
            >
                <EnhancedTableHead
                    order={order}
                    orderBy={orderBy}
                    onRequestSort={handleRequestSort}
                />
                <TableBody>
                    {tableContent}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default UsersTable;
