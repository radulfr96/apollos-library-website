import React from 'react';
import {
    TableHead, TableRow, TableCell, TableSortLabel, TableContainer,
    Paper, Table, TableBody, IconButton, Typography,
} from '@mui/material';
import { ChevronRight, Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { AuthorListItem } from '../interfaces/authorListItem';
import TableHelper, { Order } from '../util/TableFunctions.ts';

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
    const createSortHandler = (
        property: keyof AuthorListItem,
    ) => (event: React.MouseEvent<unknown>) => {
        props.onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        sortDirection={props.orderBy === headCell.id ? props.order : false}
                    >
                        <TableSortLabel
                            active={props.orderBy === headCell.id}
                            direction={props.orderBy === headCell.id ? props.order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {props.orderBy === headCell.id ? (
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
                                    {props.order === 'desc' ? 'sorted descending' : 'sorted ascending'}
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
    const history = useNavigate();

    return (
        <TableCell>
            <IconButton onClick={() => {
                props.deleteAuthor(props.author.authorId);
            }}
            >
                <Delete sx={{ color: 'red' }} />
            </IconButton>
            <IconButton onClick={() => {
                history(`author/${props.author.authorId}`);
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

const Row = (props: RowProps): JSX.Element => (
    <TableRow
        key={props.author.authorId}
        hover
        sx={{
            transition: 'all 0.4s',
        }}
    >
        <TableCell>{props.author.authorId}</TableCell>
        <TableCell>{props.author.name}</TableCell>
        <TableCell>{props.author.country}</TableCell>
        <NavigationCell
            author={props.author}
            deleteAuthor={props.deleteAuthor}
        />
    </TableRow>
);

interface AuthorsTableProps {
    authors: Array<AuthorListItem>;
    deleteAuthor: (authorId: number) => void;
}

export default function AuthorsTable(props: AuthorsTableProps): JSX.Element {
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof AuthorListItem>('authorId');
    const tableHelper = new TableHelper();

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof AuthorListItem,
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const tableContent = tableHelper
        .stableSort(props.authors, tableHelper.getSorting(order, orderBy))
        .map((row: AuthorListItem) => (
            <Row author={row} deleteAuthor={props.deleteAuthor} />
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
}
