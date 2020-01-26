import * as React from 'react';
import { AppBar, Toolbar, Typography, makeStyles } from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import { NavLink } from 'react-router-dom';
import { useContext } from 'react';
import { AppContext } from '../Context';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
        color: theme.palette.secondary.main,
    },
    title: {
        flexGrow: 1,
        color: theme.palette.secondary.main,
        textDecoration: 'none',
    },
}));

export default function NavMenu() {
    const classes = useStyles();
    const context = useContext(AppContext);
    const isAdmin = context.isAdmin();

    return (
        <header>
            <AppBar position="static">
                <Toolbar>
                    <NavLink to="/" className={classes.title}>
                        <Typography variant="h6">
                            My Library
                        </Typography>
                    </NavLink>
                    <NavLink style={ {display: isAdmin ? '' : 'none' }} className={classes.menuButton} to="/user">
                        <PersonIcon />
                    </NavLink>
                </Toolbar>
            </AppBar>
        </header>
    );
};
