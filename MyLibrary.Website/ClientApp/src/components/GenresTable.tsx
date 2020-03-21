import React from 'react';
import {
    TableHead, TableRow, TableCell, TableSortLabel,
    makeStyles, createStyles, Theme, TableContainer,
    Paper, Table, TableBody, IconButton,
} from '@material-ui/core';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import DeleteIcon from '@material-ui/icons/Delete';
import { NavLink } from 'react-router-dom';
import { Genre } from '../interfaces/genre';
import TableHelper, { Order } from '../util/TableFunctions';

interface HeadCell {
    id: keyof Genre;
    label: string;
}

const headCells: HeadCell[] = [
    { id: 'genreId', label: 'Genre ID' },
    { id: 'name', label: 'Name' },
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
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Genre) => void;
    order: Order;
    orderBy: string;
}

function EnhancedTableHead(props: EnhancedTableProps) {
    const {
        classes, onRequestSort, order, orderBy,
    } = props;
    const createSortHandler = (property: keyof Genre) => (event: React.MouseEvent<unknown>) => {
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
    genre: Genre;
    deleteGenre: Function;
}

export const Row: React.FC<RowProps> = (props) => {
    const classes = useStyles();

    return (
        <TableRow key={props.genre.genreId} hover className={classes.row}>
            <TableCell>{props.genre.name}</TableCell>
            <TableCell>
                <IconButton onClick={() => {
                    props.deleteGenre(props.genre.genreId);
                }}
                >
                    <DeleteIcon className={classes.deleteIcon} />
                </IconButton>
                <IconButton>
                    <NavLink to={`/userdetails/${props.genre.name}`}>
                        <ChevronRightIcon />
                    </NavLink>
                </IconButton>
            </TableCell>
        </TableRow>
    );
};

const GenresTable: React.FC<{
    genres: Array<Genre>;
    deleteGenre: Function;
}> = ({ genres, deleteGenre }) => {
    const classes = useStyles();
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof Genre>('genreId');
    const tableHelper = new TableHelper();

    const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof Genre) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    let tableContent = null;
    tableContent = tableHelper.stableSort(genres, tableHelper.getSorting(order, orderBy))
        .map((row: Genre) => (
            <Row genre={row} deleteGenre={deleteGenre} />
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

export default GenresTable;
