import React from 'react';
import {
    TableHead, TableRow, TableCell, TableSortLabel, TableContainer,
    Paper, Table, TableBody, IconButton, Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { ChevronRight } from '@mui/icons-material';
import TableHelper, { Order } from '../util/tableFunctions';
import ModerationUser from '../interfaces/moderationUser';

interface HeadCell {
    id: keyof ModerationUser;
    label: string;
}

const headCells: HeadCell[] = [
    { id: 'userID', label: 'User ID' },
    { id: 'reportsOfUser', label: 'Reported Entries' },
    { id: 'reportsByUser', label: 'Reports' },
];

interface EnhancedTableProps {
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof ModerationUser) => void;
    order: Order;
    orderBy: string;
}

const EnhancedTableHead = (props: EnhancedTableProps) => {
    const {
        onRequestSort, order, orderBy,
    } = props;
    const createSortHandler = (property: keyof ModerationUser) => (event: React.MouseEvent<unknown>) => {
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
    user: ModerationUser;
}

const Row = (props: RowProps) => {
    const { user } = props;

    return (
        <TableRow
            key={user.userID}
            hover
            sx={{
                transition: 'all 0.4s',
            }}
        >
            <TableCell>{user.userID}</TableCell>
            <TableCell>{user.reportsOfUser}</TableCell>
            <TableCell>{user.reportsByUser}</TableCell>
            <TableCell>
                <Link to={`/userdetails/${user.userID}`}>
                    <IconButton>
                        <ChevronRight />
                    </IconButton>
                </Link>
            </TableCell>
        </TableRow>
    );
};

interface ModerationUserTableProps {
    users: Array<ModerationUser>;
}

const ModerationUsersTable = (props: ModerationUserTableProps) => {
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof ModerationUser>('userID');
    const { users } = props;

    const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof ModerationUser) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    let tableContent = null;
    tableContent = TableHelper.stableSort(users, TableHelper.getSorting(order, orderBy))
        .map((row: ModerationUser) => (
            <Row user={row} />
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

export default ModerationUsersTable;
