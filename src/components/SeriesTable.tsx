import React from 'react';
import {
    TableHead, TableRow, TableCell, TableSortLabel, TableContainer,
    Paper, Table, TableBody, IconButton, Typography,
} from '@mui/material';
import { useStore } from 'react-redux';
import { push } from 'connected-react-router';
import { ChevronRight, Delete } from '@mui/icons-material';
import { SeriesListItem } from '../interfaces/seriesListItem';
import TableHelper, { Order } from '../util/TableFunctions';

interface HeadCell {
    id: keyof SeriesListItem;
    label: string;
}

const headCells: HeadCell[] = [
    { id: 'seriesId', label: 'Series ID' },
    { id: 'name', label: 'Name' },
];

interface EnhancedTableProps {
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof SeriesListItem) => void;
    order: Order;
    orderBy: string;
}

const EnhancedTableHead = (props: EnhancedTableProps): JSX.Element => {
    const { onRequestSort, orderBy, order } = props;

    const createSortHandler = (
        property: keyof SeriesListItem,
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
    series: SeriesListItem;
    deleteSeries: (seriesId: number) => void;
}

const NavigationCell = (props: NavCellProps): JSX.Element => {
    const { deleteSeries, series } = props;
    const store = useStore();

    return (
        <TableCell>
            <IconButton onClick={() => {
                deleteSeries(series.seriesId);
            }}
            >
                <Delete sx={{ color: 'red' }} />
            </IconButton>
            <IconButton onClick={() => {
                store.dispatch(push(`series/${series.seriesId}`));
            }}
            >
                <ChevronRight />
            </IconButton>
        </TableCell>
    );
};

interface RowProps {
    deleteSeries: (seriesId: number) => void;
    series: SeriesListItem;
}

const Row = (props: RowProps): JSX.Element => {
    const { series, deleteSeries } = props;

    return (
        <TableRow
            key={series.seriesId}
            hover
            sx={{
                transition: 'all 0.4s',
            }}
        >
            <TableCell>{series.seriesId}</TableCell>
            <TableCell>{series.name}</TableCell>
            <NavigationCell
                series={series}
                deleteSeries={deleteSeries}
            />
        </TableRow>
    );
};

interface AuthorsTableProps {
    series: Array<SeriesListItem>;
    deleteSeries: (seriesId: number) => void;
}

const AuthorsTable = (props: AuthorsTableProps): JSX.Element => {
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof SeriesListItem>('seriesId');
    const { series, deleteSeries } = props;

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof SeriesListItem,
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const tableContent = TableHelper
        .stableSort(series, TableHelper.getSorting(order, orderBy))
        .map((row: SeriesListItem) => (
            <Row series={row} deleteSeries={deleteSeries} />
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
