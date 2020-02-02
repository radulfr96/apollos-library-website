import * as React from 'react';
import { AppBar, Toolbar, Typography, makeStyles, IconButton, Menu, MenuItem } from '@material-ui/core';
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
    },
    homeLink: {
        color: theme.palette.secondary.main,
        textDecoration: 'none',
    },
}));

export default function NavMenu() {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const classes = useStyles();
    const context = useContext(AppContext);
    const isAdmin = context.isAdmin();
    const open = Boolean(anchorEl);

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" className={classes.title} >
                    <NavLink to="/" className={classes.homeLink}>
                        My Library
                    </NavLink>
                </Typography>
                <div>
                    <IconButton
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleMenu}
                    >
                        <PersonIcon color="secondary" />
                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        open={open}
                        onClose={handleClose}
                    >
                        <MenuItem style={{ display: context.userInfo !== null ? '' : 'none'  }} onClick={handleClose}>Log out</MenuItem>
                        <MenuItem style={{ display: context.userInfo !== null ? '' : 'none'  }} onClick={handleClose}>My account</MenuItem>
                        <MenuItem style={{ display: context.userInfo === null ? '' : 'none'  }} onClick={handleClose}>Log in</MenuItem>
                        <MenuItem style={{ display: context.userInfo === null ? '' : 'none'  }} onClick={handleClose}>Sign Up</MenuItem>
                    </Menu>
                </div>
            </Toolbar>
        </AppBar>
    );
};
