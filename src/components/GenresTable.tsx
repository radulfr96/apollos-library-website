import React from 'react';
import {
    TableHead, TableRow, TableCell, TableSortLabel, TableContainer,
    Paper, Table, TableBody, IconButton, Typography,
} from '@mui/material';
import { ChevronRight, Delete } from '@mui/icons-material';
import { push } from 'react-router-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { Genre } from '../interfaces/genre';
import TableHelper, { Order } from '../util/TableFunctions';

interface HeadCell {
    id: keyof Genre;
    label: string;
}

const headCells: HeadCell[] = [
    { id: 'genreId', label: 'Genre ID' },
    { id: 'name', label: 'Name' },
];

interface EnhancedTableProps {
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Genre) => void;
    order: Order;
    orderBy: string;
}

const EnhancedTableHead = (props: EnhancedTableProps) => {
    const {
        onRequestSort, order, orderBy,
    } = props;
    const createSortHandler = (property: keyof Genre) => (event: React.MouseEvent<unknown>) => {
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
    genre: Genre;
    deleteGenre: (genreId: number) => void;
}

const NavCell = (props: RowProps & RouteComponentProps) => {
    const { deleteGenre, genre } = props;

    return (
        <TableCell>
            <IconButton onClick={() => {
                deleteGenre(genre.genreId);
            }}
            >
                <Delete sx={{ color: 'red' }} />
            </IconButton>
            <IconButton onClick={() => {
                push(`genre/${genre.genreId}`);
            }}
            >
                <ChevronRight />
            </IconButton>
        </TableCell>
    );
};

export const NavigationCell = withRouter(NavCell);

export const Row = (props: RowProps) => {
    const { genre, deleteGenre } = props;

    return (
        <TableRow
            key={genre.genreId}
            hover
            sx={{
                transition: 'all 0.4s',
            }}
        >
            <TableCell>{genre.genreId}</TableCell>
            <TableCell>{genre.name}</TableCell>
            <NavigationCell genre={genre} deleteGenre={deleteGenre} />
        </TableRow>
    );
};

interface GenreTableProps {
    genres: Array<Genre>;
    deleteGenre: (genreId: number) => void;
}

const GenresTable = (props: GenreTableProps) => {
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof Genre>('genreId');
    const { genres, deleteGenre } = props;

    const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof Genre) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    let tableContent = null;
    tableContent = TableHelper.stableSort(genres, TableHelper.getSorting(order, orderBy))
        .map((row: Genre) => (
            <Row genre={row} deleteGenre={deleteGenre} />
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

export default GenresTable;
