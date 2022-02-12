import React from 'react';
import {
    TableHead, TableRow, TableCell, TableSortLabel, TableContainer,
    Paper, Table, TableBody, IconButton, Typography,
} from '@mui/material';
import { useStore } from 'react-redux';
import { push } from 'connected-react-router';
import { ChevronRight, Delete } from '@mui/icons-material';
import { AuthorListItem } from '../interfaces/authorListItem';
import TableHelper, { Order } from '../util/TableFunctions';

interface HeadCell {
    id: keyof AuthorListItem;
    label: string;
}

const headCells: HeadCell[] = [
    { id: 'authorId', label: 'Author ID' },
    { id: 'name', label: 'Name' },
    { id: 'country', label: 'Country' },
];

interface EnhancedTableProps {
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof AuthorListItem) => void;
    order: Order;
    orderBy: string;
}

const EnhancedTableHead = (props: EnhancedTableProps): JSX.Element => {
    const { onRequestSort, orderBy, order } = props;

    const createSortHandler = (
        property: keyof AuthorListItem,
    ) => (event: React.MouseEvent<unknown>) => {
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
                                <Typography
                                    sx={{
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

interface NavCellProps {
    author: AuthorListItem;
    deleteAuthor: (authorId: number) => void;
}

const NavigationCell = (props: NavCellProps): JSX.Element => {
    const { deleteAuthor, author } = props;
    const store = useStore();

    return (
        <TableCell>
            <IconButton onClick={() => {
                deleteAuthor(author.authorId);
            }}
            >
                <Delete sx={{ color: 'red' }} />
            </IconButton>
            <IconButton onClick={() => {
                store.dispatch(push(`author/${author.authorId}`));
            }}
            >
                <ChevronRight />
            </IconButton>
        </TableCell>
    );
};

interface RowProps {
    deleteAuthor: (authorId: number) => void;
    author: AuthorListItem;
}

const Row = (props: RowProps): JSX.Element => {
    const { author, deleteAuthor } = props;

    return (
        <TableRow
            key={author.authorId}
            hover
            sx={{
                transition: 'all 0.4s',
            }}
        >
            <TableCell>{author.authorId}</TableCell>
            <TableCell>{author.name}</TableCell>
            <TableCell>{author.country}</TableCell>
            <NavigationCell
                author={author}
                deleteAuthor={deleteAuthor}
            />
        </TableRow>
    );
};

interface AuthorsTableProps {
    authors: Array<AuthorListItem>;
    deleteAuthor: (authorId: number) => void;
}

const AuthorsTable = (props: AuthorsTableProps): JSX.Element => {
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof AuthorListItem>('authorId');
    const { authors, deleteAuthor } = props;

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof AuthorListItem,
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const tableContent = TableHelper
        .stableSort(authors, TableHelper.getSorting(order, orderBy))
        .map((row: AuthorListItem) => (
            <Row author={row} deleteAuthor={deleteAuthor} />
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

export default AuthorsTable;
