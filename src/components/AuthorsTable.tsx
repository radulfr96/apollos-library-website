import React from 'react';
import {
    TableHead, TableRow, TableCell, TableSortLabel,
    makeStyles, createStyles, Theme, TableContainer,
    Paper, Table, TableBody, IconButton,
} from '@material-ui/core';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import DeleteIcon from '@material-ui/icons/Delete';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { AuthorListItem } from '../interfaces/authorListItem';
import TableHelper, { Order } from '../util/TableFunctions';

interface HeadCell {
    id: keyof AuthorListItem;
    label: string;
}

const headCells: HeadCell[] = [
    { id: 'authorId', label: 'Author ID' },
    { id: 'name', label: 'Name' },
    { id: 'country', label: 'Country' },
];

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        width: '100%',
    },
    paper: {
        width: '100%',
        marginBottom: theme.spacing(2),
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
    row: {
        transition: 'all 0.4s',
    },
    deleteIcon: {
        color: 'red',
    },
}));

interface EnhancedTableProps {
    classes: ReturnType<typeof useStyles>;
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof AuthorListItem) => void;
    order: Order;
    orderBy: string;
}

function EnhancedTableHead(props: EnhancedTableProps) {
    const {
        classes, onRequestSort, order, orderBy,
    } = props;
    const createSortHandler = (
        property: keyof AuthorListItem,
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
                                <span className={classes.visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </span>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
                <TableCell />
            </TableRow>
        </TableHead>
    );
}

interface RowProps {
    publisher: AuthorListItem;
    deletePublisher: Function;
}

const NavCell: React.FC<{
    publisher: AuthorListItem;
    deletePublisher: Function;
} & RouteComponentProps> = (props) => {
    const classes = useStyles();
    return (
        <>
            <TableCell>
                <IconButton onClick={() => {
                    props.deletePublisher(props.publisher.authorId);
                }}
                >
                    <DeleteIcon className={classes.deleteIcon} />
                </IconButton>
                <IconButton onClick={() => {
                    props.history.push(`author/${props.publisher.authorId}`);
                }}
                >
                    <ChevronRightIcon />
                </IconButton>
            </TableCell>
        </>
    );
};

export const NavigationCell = withRouter(NavCell);

export const Row: React.FC<RowProps> = (props) => {
    const classes = useStyles();

    return (
        <TableRow key={props.publisher.authorId} hover className={classes.row}>
            <TableCell>{props.publisher.authorId}</TableCell>
            <TableCell>{props.publisher.name}</TableCell>
            <TableCell>{props.publisher.country}</TableCell>
            <NavigationCell publisher={props.publisher} deletePublisher={props.deletePublisher} />
        </TableRow>
    );
};

const AuthorsTable: React.FC<{
    authors: Array<AuthorListItem>;
    deleteAuthor: Function;
}> = ({ authors: publishers, deleteAuthor: deletePublisher }) => {
    const classes = useStyles();
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

    let tableContent = null;
    tableContent = tableHelper.stableSort(publishers, tableHelper.getSorting(order, orderBy))
        .map((row: AuthorListItem) => (
            <Row publisher={row} deletePublisher={deletePublisher} />
        ));

    return (
        <>
            <TableContainer component={Paper}>
                <Table
                    aria-labelledby="tableTitle"
                    aria-label="enhanced table"
                    size="small"
                >
                    <EnhancedTableHead
                        classes={classes}
                        order={order}
                        orderBy={orderBy}
                        onRequestSort={handleRequestSort}
                    />
                    <TableBody>
                        {tableContent}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};

export default AuthorsTable;
