import React from 'react';
import {
    TableHead, TableRow, TableCell, TableSortLabel, TableContainer,
    Table, TableBody, IconButton, Typography,
} from '@mui/material';
import { useStore } from 'react-redux';
import { push } from 'connected-react-router';
import { ChevronRight } from '@mui/icons-material';
import TableHelper, { Order } from '../util/tableFunctions';
import EntryReportListItem from '../interfaces/entryReportListItem';

interface HeadCell {
    id: keyof EntryReportListItem;
    label: string;
}

const headCells: HeadCell[] = [
    { id: 'reportId', label: 'Report ID' },
    { id: 'entryId', label: 'Entry ID' },
    { id: 'entryTypeId', label: 'Entry Type' },
    { id: 'entryStatus', label: 'Entry Status' },
    { id: 'reportedBy', label: 'Reported By' },
    { id: 'reportedDate', label: 'Reported Date' },
    { id: 'createdBy', label: 'Created By' },
    { id: 'createdDate', label: 'Created Date' },
];

interface EnhancedTableProps {
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof EntryReportListItem) => void;
    order: Order;
    orderBy: string;
}

const EnhancedTableHead = (props: EnhancedTableProps): JSX.Element => {
    const { onRequestSort, orderBy, order } = props;

    const createSortHandler = (
        property: keyof EntryReportListItem,
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
    report: EntryReportListItem;
}

const NavigationCell = (props: NavCellProps): JSX.Element => {
    const { report } = props;
    const store = useStore();

    return (
        <TableCell>
            <IconButton onClick={() => {
                store.dispatch(push(`series/${report.reportId}`));
            }}
            >
                <ChevronRight />
            </IconButton>
        </TableCell>
    );
};

interface RowProps {
    report: EntryReportListItem;
}

const Row = (props: RowProps): JSX.Element => {
    const { report } = props;

    return (
        <TableRow
            key={report.reportId}
            hover
            sx={{
                transition: 'all 0.4s',
            }}
        >
            <TableCell>{report.reportId}</TableCell>
            <TableCell>{report.entryId}</TableCell>
            <TableCell>{report.entryType}</TableCell>
            <TableCell>{report.entryStatus}</TableCell>
            <TableCell>{report.reportedBy}</TableCell>
            <TableCell>{report.reportedDate}</TableCell>
            <TableCell>{report.createdBy}</TableCell>
            <TableCell>{report.createdDate}</TableCell>
            <NavigationCell
                report={report}
            />
        </TableRow>
    );
};

interface ReportsTableProps {
    reports: Array<EntryReportListItem>;
}

const ReportsTable = (props: ReportsTableProps): JSX.Element => {
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof EntryReportListItem>('reportId');
    const { reports } = props;

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof EntryReportListItem,
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    let tableContent = null;
    tableContent = TableHelper.stableSort(reports, TableHelper.getSorting(order, orderBy))
        .map((row: EntryReportListItem) => (
            <Row report={row} />
        ));

    return (
        <TableContainer>
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

export default ReportsTable;
