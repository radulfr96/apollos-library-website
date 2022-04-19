import React from 'react';
import {
    TableHead, TableRow, TableCell, TableSortLabel, TableContainer,
    Paper, Table, TableBody, IconButton, Typography,
} from '@mui/material';
import { push } from 'connected-react-router';
import { useStore } from 'react-redux';
import { ChevronRight, Delete } from '@mui/icons-material';
import BusinessTableItem from '../interfaces/businessTableItem';
import TableHelper, { Order } from '../util/TableFunctions';

interface HeadCell {
    id: keyof BusinessTableItem;
    label: string;
}

const headCells: HeadCell[] = [
    { id: 'businessId', label: 'Business ID' },
    { id: 'name', label: 'Name' },
    { id: 'type', label: 'Type' },
    { id: 'country', label: 'Country' },
];

interface EnhancedTableProps {
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof BusinessTableItem) => void;
    order: Order;
    orderBy: string;
}

const EnhancedTableHead = (props: EnhancedTableProps) => {
    const {
        onRequestSort, order, orderBy,
    } = props;
    const createSortHandler = (
        property: keyof BusinessTableItem,
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
    business: BusinessTableItem;
    deleteBusiness: (businessId: number) => void;
}

const NavCell = (props: RowProps) => {
    const store = useStore();
    const { deleteBusiness, business } = props;

    return (
        <TableCell>
            <IconButton onClick={() => {
                deleteBusiness(business.businessId);
            }}
            >
                <Delete sx={{
                    color: 'red',
                }}
                />
            </IconButton>
            <IconButton onClick={() => {
                store.dispatch(push(`business/${business.businessId}`));
            }}
            >
                <ChevronRight />
            </IconButton>
        </TableCell>
    );
};

export const Row = (props: RowProps) => {
    const { business, deleteBusiness } = props;
    return (
        <TableRow
            key={business.businessId}
            hover
            sx={{
                transition: 'all 0.4s',
            }}
        >
            <TableCell>{business.businessId}</TableCell>
            <TableCell>{business.name}</TableCell>
            <TableCell>{business.type}</TableCell>
            <TableCell>{business.country}</TableCell>
            <NavCell business={business} deleteBusiness={deleteBusiness} />
        </TableRow>
    );
};

interface BusinesssTableProps {
    businesses: Array<BusinessTableItem>;
    deleteBusiness: (businessId: number) => void;
}

const BusinesssTable = (props: BusinesssTableProps) => {
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof BusinessTableItem>('businessId');
    const { businesses, deleteBusiness } = props;

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof BusinessTableItem,
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    let tableContent = null;
    tableContent = TableHelper.stableSort(businesses, TableHelper.getSorting(order, orderBy))
        .map((row: BusinessTableItem) => (
            <Row business={row} deleteBusiness={deleteBusiness} />
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

export default BusinesssTable;
