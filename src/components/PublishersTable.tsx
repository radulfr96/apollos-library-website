import React from 'react';
import {
    TableHead, TableRow, TableCell, TableSortLabel, TableContainer,
    Paper, Table, TableBody, IconButton, Typography,
} from '@mui/material';
import { push } from 'connected-react-router';
import { ChevronRight, Delete } from '@mui/icons-material';
import { PublisherTableItem } from '../interfaces/publisherTableItem';
import TableHelper, { Order } from '../util/TableFunctions';

interface HeadCell {
    id: keyof PublisherTableItem;
    label: string;
}

const headCells: HeadCell[] = [
    { id: 'publisherId', label: 'Publisher ID' },
    { id: 'name', label: 'Name' },
    { id: 'country', label: 'Country' },
];

interface EnhancedTableProps {
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof PublisherTableItem) => void;
    order: Order;
    orderBy: string;
}

const EnhancedTableHead = (props: EnhancedTableProps) => {
    const {
        onRequestSort, order, orderBy,
    } = props;
    const createSortHandler = (
        property: keyof PublisherTableItem,
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
    publisher: PublisherTableItem;
    deletePublisher: (publisherId: number) => void;
}

const NavCell = (props: RowProps) => {
    const { deletePublisher, publisher } = props;

    return (
        <TableCell>
            <IconButton onClick={() => {
                deletePublisher(publisher.publisherId);
            }}
            >
                <Delete sx={{
                    color: 'red',
                }}
                />
            </IconButton>
            <IconButton onClick={() => {
                push(`publisher/${publisher.publisherId}`);
            }}
            >
                <ChevronRight />
            </IconButton>
        </TableCell>
    );
};

export const Row = (props: RowProps) => {
    const { publisher, deletePublisher } = props;
    return (
        <TableRow
            key={publisher.publisherId}
            hover
            sx={{
                transition: 'all 0.4s',
            }}
        >
            <TableCell>{publisher.publisherId}</TableCell>
            <TableCell>{publisher.name}</TableCell>
            <TableCell>{publisher.country}</TableCell>
            <NavCell publisher={publisher} deletePublisher={deletePublisher} />
        </TableRow>
    );
};

interface PublishersTableProps {
    publishers: Array<PublisherTableItem>;
    deletePublisher: (publisherId: number) => void;
}

const PublishersTable = (props: PublishersTableProps) => {
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof PublisherTableItem>('publisherId');
    const { publishers, deletePublisher } = props;

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof PublisherTableItem,
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    let tableContent = null;
    tableContent = TableHelper.stableSort(publishers, TableHelper.getSorting(order, orderBy))
        .map((row: PublisherTableItem) => (
            <Row publisher={row} deletePublisher={deletePublisher} />
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

export default PublishersTable;
