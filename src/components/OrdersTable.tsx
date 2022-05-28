import React from 'react';
import {
    TableHead, TableRow, TableCell, TableSortLabel, TableContainer,
    Paper, Table, TableBody, IconButton, Typography,
} from '@mui/material';
import { useStore } from 'react-redux';
import { push } from 'connected-react-router';
import { ChevronRight, Delete } from '@mui/icons-material';
import OrderListItem from '../interfaces/orderListItem';
import TableHelper, { Order } from '../util/tableFunctions';

interface HeadCell {
    id: keyof OrderListItem;
    label: string;
}

const headCells: HeadCell[] = [
    { id: 'orderId', label: 'Order ID' },
    { id: 'bookshop', label: 'Bookshop' },
    { id: 'orderDate', label: 'Order Date' },
    { id: 'numberOfItems', label: 'Number of Items' },
    { id: 'total', label: 'Total' },
];

interface EnhancedTableProps {
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof OrderListItem) => void;
    order: Order;
    orderBy: string;
}

const EnhancedTableHead = (props: EnhancedTableProps): JSX.Element => {
    const { onRequestSort, orderBy, order } = props;

    const createSortHandler = (
        property: keyof OrderListItem,
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
    order: OrderListItem;
    deleteOrder: (orderId: number) => void;
}

const NavigationCell = (props: NavCellProps): JSX.Element => {
    const { deleteOrder, order } = props;
    const store = useStore();

    return (
        <TableCell>
            <IconButton onClick={() => {
                deleteOrder(order.orderId);
            }}
            >
                <Delete sx={{ color: 'red' }} />
            </IconButton>
            <IconButton onClick={() => {
                store.dispatch(push(`order/${order.orderId}`));
            }}
            >
                <ChevronRight />
            </IconButton>
        </TableCell>
    );
};

interface RowProps {
    deleteOrder: (orderId: number) => void;
    order: OrderListItem;
}

const Row = (props: RowProps): JSX.Element => {
    const { order, deleteOrder } = props;

    return (
        <TableRow
            key={order.orderId}
            hover
            sx={{
                transition: 'all 0.4s',
            }}
        >
            <TableCell>{order.orderId}</TableCell>
            <TableCell>{order.bookshop}</TableCell>
            <TableCell>{order.orderDate}</TableCell>
            <TableCell>{order.numberOfItems}</TableCell>
            <TableCell>
                <Typography>
                    {`$${order.total}`}
                </Typography>
            </TableCell>
            <NavigationCell
                order={order}
                deleteOrder={deleteOrder}
            />
        </TableRow>
    );
};

interface OrdersTableProps {
    orders: Array<OrderListItem>;
    deleteOrder: (orderId: number) => void;
}

const OrdersTable = (props: OrdersTableProps): JSX.Element => {
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof OrderListItem>('orderId');
    const { orders, deleteOrder } = props;

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof OrderListItem,
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const tableContent = TableHelper
        .stableSort(orders, TableHelper.getSorting(order, orderBy))
        .map((row: OrderListItem) => (
            <Row order={row} deleteOrder={deleteOrder} />
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
