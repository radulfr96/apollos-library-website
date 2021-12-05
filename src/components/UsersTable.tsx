import React from 'react';
import {
    TableHead, TableRow, TableCell, TableSortLabel,
    makeStyles, createStyles, Theme, TableContainer,
    Paper, Table, TableBody, IconButton,
} from '@mui/material';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import DeleteIcon from '@material-ui/icons/Delete';
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
    deleteIcon: {
        color: 'red',
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
                                <Typography className={classes.visuallyHidden}>
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
}

interface RowProps {
    user: User;
    deleteUser: (userId: string) => void;
}

function Row(props: RowProps) {
    const classes = useStyles();

    return (
        <TableRow key={props.user.userID} hover className={classes.row}>
            <TableCell>{props.user.userID}</TableCell>
            <TableCell>{props.user.username}</TableCell>
            <TableCell>{props.user.isActive}</TableCell>
            <TableCell>
                <IconButton onClick={() => {
                    props.deleteUser(props.user.userID);
                }}
                >
                    <DeleteIcon className={classes.deleteIcon} />
                </IconButton>
                <IconButton>
                    <a href={`/userdetails/${props.user.userID}`}>
                        <ChevronRightIcon />
                    </a>
                </IconButton>
            </TableCell>
        </TableRow>
    );
}

interface UserTableProps {
    users: Array<User>;
    deleteUser: (userId: string) => void;
}

function UsersTable(props: UserTableProps) {
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
    tableContent = tableHelper.stableSort(props.users, tableHelper.getSorting(order, orderBy))
        .map((row: User) => (
            <Row user={row} deleteUser={props.deleteUser} />
        ));

    return (
        <TableContainer component={Paper}>
                <Table
                    aria-labelledby="tableTitle"
                    aria-label="enhanced table"
                    size="small"
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
    );
}

export default UsersTable;
