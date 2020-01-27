import * as React from 'react';
import { AppBar, Toolbar, Typography, makeStyles } from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import { NavLink } from 'react-router-dom';
import { useContext } from 'react';
import { AppContext } from '../Context';
import SettingsIcon from '@material-ui/icons/Settings';
import { userInfo } from 'os';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
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
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6">
                    <NavLink to="/" className={classes.title}>
                        My Library
                        </NavLink>
                </Typography>
                <NavLink style={{ display: isAdmin ? '' : 'none' }} className={classes.menuButton} to="/user">
                    <SettingsIcon />
                </NavLink>
                <NavLink style={{ display: userInfo == null ? '' : 'none' }} className={classes.menuButton} to="/login">
                    <PersonIcon />
                </NavLink>
            </Toolbar>
        </AppBar>
    );
};
