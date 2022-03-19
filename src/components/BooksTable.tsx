import React from 'react';
import {
    Table, TableRow, TableCell, TableContainer,
    Paper, IconButton, TableHead, Typography, TableSortLabel, TableBody,
} from '@mui/material';
import { useStore } from 'react-redux';
import { push } from 'connected-react-router';
import { ChevronRight, Delete } from '@mui/icons-material';
import BookListItem from '../interfaces/bookListItem';
import TableHelper, { Order } from '../util/TableFunctions';

interface HeadCell {
    id: keyof BookListItem;
    label: string;
}

const headCells: HeadCell[] = [
    { id: 'bookId', label: 'Book ID' },
    { id: 'ISBN', label: 'ISBN' },
    { id: 'eISBN', label: 'eISBN' },
    { id: 'title', label: 'Title' },
    { id: 'formatType', label: 'Format Type' },
    { id: 'fictionType', label: 'Fiction Type' },
];

interface EnhancedTableProps {
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof BookListItem) => void;
    order: Order;
    orderBy: string;
}

interface RowProps {
    book: BookListItem;
    deleteBook: (bookID: number) => void;
}

const NavCell = (props: RowProps) => {
    const store = useStore();
    const { deleteBook, book } = props;

    return (
        <TableCell>
            <IconButton onClick={() => {
                deleteBook(book.bookId);
            }}
            >
                <Delete sx={{ color: 'red' }} />
            </IconButton>
            <IconButton onClick={() => {
                store.dispatch(push(`book/${book.bookId}`));
            }}
            >
                <ChevronRight />
            </IconButton>
        </TableCell>
    );
};

export const Row = (props: RowProps) => {
    const { book, deleteBook } = props;

    return (
        <TableRow
            key={book.bookId}
            hover
            sx={{
                transition: 'all 0.4s',
            }}
        >
            <TableCell>{book.bookId}</TableCell>
            <TableCell>{book.ISBN}</TableCell>
            <TableCell>{book.eISBN}</TableCell>
            <TableCell>{book.title}</TableCell>
            <TableCell>{book.fictionType}</TableCell>
            <TableCell>{book.formatType}</TableCell>
            <NavCell book={book} deleteBook={deleteBook} />
        </TableRow>
    );
};

const EnhancedTableHead = (props: EnhancedTableProps) => {
    const { onRequestSort, orderBy, order } = props;

    const createSortHandler = (
        property: keyof BookListItem,
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

interface BooksTableProps {
    books: Array<BookListItem>;
    deleteBook: (authorId: number) => void;
}

const BooksTable = (props: BooksTableProps) => {
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof BookListItem>('bookId');
    const { books, deleteBook } = props;

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof BookListItem,
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const tableContent = TableHelper
        .stableSort(books, TableHelper.getSorting(order, orderBy))
        .map((row: BookListItem) => (
            <Row book={row} deleteBook={deleteBook} />
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

export default BooksTable;
