import React from 'react';
import {
    Table, TableRow, TableCell, TableContainer,
    Paper, IconButton, TableHead, Typography, TableSortLabel, TableBody,
} from '@mui/material';
import { useStore } from 'react-redux';
import { push } from 'connected-react-router';
import { ChevronRight, Delete } from '@mui/icons-material';
import TableHelper, { Order } from '../util/TableFunctions';
import LibraryEntryListItem from '../interfaces/libraryEntryListItem';

interface HeadCell {
    id: keyof LibraryEntryListItem;
    label: string;
}

const headCells: HeadCell[] = [
    { id: 'entryId', label: 'Entry ID' },
    { id: 'title', label: 'Title' },
    { id: 'author', label: 'Author' },
    { id: 'quantity', label: 'Quantity' },
];

interface EnhancedTableProps {
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof LibraryEntryListItem) => void;
    order: Order;
    orderBy: string;
}

interface RowProps {
    entry: LibraryEntryListItem;
    deleteEntry: (entryId: number) => void;
}

const NavCell = (props: RowProps) => {
    const store = useStore();
    const { deleteEntry, entry } = props;

    return (
        <TableCell>
            <IconButton onClick={() => {
                deleteEntry(entry.entryId);
            }}
            >
                <Delete sx={{ color: 'red' }} />
            </IconButton>
            <IconButton onClick={() => {
                store.dispatch(push(`entry/${entry.entryId}`));
            }}
            >
                <ChevronRight />
            </IconButton>
        </TableCell>
    );
};

export const Row = (props: RowProps) => {
    const { entry, deleteEntry } = props;

    return (
        <TableRow
            key={entry.entryId}
            hover
            sx={{
                transition: 'all 0.4s',
            }}
        >
            <TableCell>{entry.entryId}</TableCell>
            <TableCell>{entry.title}</TableCell>
            <TableCell>{entry.author}</TableCell>
            <TableCell>{entry.quantity}</TableCell>
            <NavCell entry={entry} deleteEntry={deleteEntry} />
        </TableRow>
    );
};

const EnhancedTableHead = (props: EnhancedTableProps) => {
    const { onRequestSort, orderBy, order } = props;

    const createSortHandler = (
        property: keyof LibraryEntryListItem,
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

interface LibraryTableProps {
    entries: Array<LibraryEntryListItem>;
    deleteEntry: (entryId: number) => void;
}

const LibraryTable = (props: LibraryTableProps) => {
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof LibraryEntryListItem>('entryId');
    const { entries, deleteEntry } = props;

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof LibraryEntryListItem,
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const tableContent = TableHelper
        .stableSort(entries, TableHelper.getSorting(order, orderBy))
        .map((row: LibraryEntryListItem) => (
            <Row entry={row} deleteEntry={deleteEntry} />
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

export default LibraryTable;
