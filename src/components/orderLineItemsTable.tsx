import React from 'react';
import {
    TableHead, TableRow, TableCell, TableSortLabel, TableContainer,
    Paper, Table, TableBody, IconButton, Typography,
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import TableHelper, { Order } from '../util/tableFunctions';
import { OrderItemListItem } from '../interfaces/order';

interface HeadCell {
    id: keyof OrderItemListItem;
    label: string;
}

const headCells: HeadCell[] = [
    { id: 'isbn', label: 'ISBN' },
    { id: 'eisbn', label: 'eISBN' },
    { id: 'title', label: 'Title' },
    { id: 'quantity', label: 'Quantity' },
    { id: 'unitPrice', label: 'Unit Price' },
    { id: 'total', label: 'Total' },
];

interface EnhancedTableProps {
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof OrderItemListItem) => void;
    order: Order;
    orderBy: string;
}

const EnhancedTableHead = (props: EnhancedTableProps): JSX.Element => {
    const { onRequestSort, orderBy, order } = props;

    const createSortHandler = (
        property: keyof OrderItemListItem,
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
    orderItem: OrderItemListItem;
    deleteOrderItem: (bookId: number) => void;
}

const NavigationCell = (props: NavCellProps): JSX.Element => {
    const { deleteOrderItem, orderItem } = props;
    return (
        <TableCell>
            <IconButton onClick={() => {
                deleteOrderItem(orderItem.bookId);
            }}
            >
                <Delete sx={{ color: 'red' }} />
            </IconButton>
        </TableCell>
    );
};

interface RowProps {
    deleteOrderItem: (bookId: number) => void;
    orderItem: OrderItemListItem;
}

const Row = (props: RowProps): JSX.Element => {
    const { orderItem, deleteOrderItem } = props;

    return (
        <TableRow
            key={orderItem.bookId}
            hover
            sx={{
                transition: 'all 0.4s',
            }}
        >
            <TableCell>{orderItem.isbn}</TableCell>
            <TableCell>{orderItem.eisbn}</TableCell>
            <TableCell>{orderItem.title}</TableCell>
            <TableCell>{orderItem.quantity}</TableCell>
            <TableCell>{orderItem.unitPrice}</TableCell>
            <TableCell>{orderItem.unitPrice * orderItem.quantity}</TableCell>
            <NavigationCell
                orderItem={orderItem}
                deleteOrderItem={deleteOrderItem}
            />
        </TableRow>
    );
};

interface OrdersTableProps {
    orderItems: Array<OrderItemListItem>;
    deleteOrderItem: (bookId: number) => void;
}

const OrdersTable = (props: OrdersTableProps): JSX.Element => {
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof OrderItemListItem>('bookId');
    const { orderItems, deleteOrderItem } = props;

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof OrderItemListItem,
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const tableContent = TableHelper
        .stableSort(orderItems, TableHelper.getSorting(order, orderBy))
        .map((row: OrderItemListItem) => (
            <Row orderItem={row} deleteOrderItem={deleteOrderItem} />
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

export default OrdersTable;
