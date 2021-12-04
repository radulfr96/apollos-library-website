import React from 'react';
import {
    TableHead, TableRow, TableCell, TableSortLabel,
    makeStyles, createStyles, Theme, TableContainer,
    Paper, Table, TableBody, IconButton,
} from '@material-ui/core';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import DeleteIcon from '@material-ui/icons/Delete';
import { useNavigate } from 'react-router-dom';
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
    classes: any;
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof AuthorListItem) => void;
    order: Order;
    orderBy: string;
}

function EnhancedTableHead(props: EnhancedTableProps): JSX.Element {
    const createSortHandler = (
        property: keyof AuthorListItem,
    ) => (event: React.MouseEvent<unknown>) => {
        props.onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        sortDirection={props.orderBy === headCell.id ? props.order : false}
                    >
                        <TableSortLabel
                            active={props.orderBy === headCell.id}
                            direction={props.orderBy === headCell.id ? props.order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {props.orderBy === headCell.id ? (
                                <span className={props.classes.visuallyHidden}>
                                    {props.order === 'desc' ? 'sorted descending' : 'sorted ascending'}
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

interface NavCellProps {
    classes: any;
    author: AuthorListItem;
    deleteAuthor: (authorId: number) => void;
}

function NavigationCell(props: NavCellProps): JSX.Element {
    const history = useNavigate();

    return (
        <TableCell>
                <IconButton onClick={() => {
                    props.deleteAuthor(props.author.authorId);
                }}
                >
                    <DeleteIcon className={props.classes.deleteIcon} />
                </IconButton>
                <IconButton onClick={() => {
                    history(`author/${props.author.authorId}`);
                }}
                >
                    <ChevronRightIcon />
                </IconButton>
        </TableCell>
    );
}

interface RowProps {
    classes: any;
    deleteAuthor: (authorId: number) => void;
    author: AuthorListItem;
}

function Row(props: RowProps): JSX.Element {
    return (
        <TableRow key={props.author.authorId} hover className={props.classes.row}>
            <TableCell>{props.author.authorId}</TableCell>
            <TableCell>{props.author.name}</TableCell>
            <TableCell>{props.author.country}</TableCell>
            <NavigationCell
                classes={props.classes}
                author={props.author}
                deleteAuthor={props.deleteAuthor}
            />
        </TableRow>
    );
}

interface AuthorsTableProps {
    authors: Array<AuthorListItem>;
    deleteAuthor: (authorId: number) => void;
}

export default function AuthorsTable(props: AuthorsTableProps): JSX.Element {
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

    const tableContent = tableHelper
        .stableSort(props.authors, tableHelper.getSorting(order, orderBy))
        .map((row: AuthorListItem) => (
            <Row classes={classes} author={row} deleteAuthor={props.deleteAuthor} />
        ));

    return (
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
    );
}
