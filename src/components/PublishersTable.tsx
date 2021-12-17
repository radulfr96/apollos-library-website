import React from 'react';
import {
    TableHead, TableRow, TableCell, TableSortLabel, TableContainer,
    Paper, Table, TableBody, IconButton, Typography,
} from '@mui/material';
import { ChevronRight, Delete } from '@mui/icons-material';
import { RouteComponentProps, withRouter } from 'react-router';
import { PublisherTableItem } from '../interfaces/publisherTableItem';
import TableHelper, { Order } from '../util/TableFunctions.ts';

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

const NavCell = (props: RowProps & RouteComponentProps) => (
    <TableCell>
        <IconButton onClick={() => {
            props.deletePublisher(props.publisher.publisherId);
        }}
        >
            <Delete sx={{
                color: 'red',
            }}
            />
        </IconButton>
        <IconButton onClick={() => {
            props.history.push(`publisher/${props.publisher.publisherId}`);
        }}
        >
            <ChevronRight />
        </IconButton>
    </TableCell>
);

export const NavigationCell = withRouter(NavCell);

export var Row = (props: RowProps) => (
    <TableRow
        key={props.publisher.publisherId}
        hover
        sx={{
            transition: 'all 0.4s',
        }}
    >
        <TableCell>{props.publisher.publisherId}</TableCell>
        <TableCell>{props.publisher.name}</TableCell>
        <TableCell>{props.publisher.country}</TableCell>
        <NavigationCell publisher={props.publisher} deletePublisher={props.deletePublisher} />
    </TableRow>
);

interface PublishersTableProps {
    publishers: Array<PublisherTableItem>;
    deletePublisher: (publisherId: number) => void;
}

const PublishersTable = (props: PublishersTableProps) => {
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof PublisherTableItem>('publisherId');
    const tableHelper = new TableHelper();

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof PublisherTableItem,
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    let tableContent = null;
    tableContent = tableHelper.stableSort(props.publishers, tableHelper.getSorting(order, orderBy))
        .map((row: PublisherTableItem) => (
            <Row publisher={row} deletePublisher={props.deletePublisher} />
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
