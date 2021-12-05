/* eslint-disable linebreak-style */
import {
    IconButton, makeStyles, Menu, MenuItem,
} from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import React from 'react';
import { Link } from 'react-router-dom';

const useStyles = makeStyles(() => ({
    navLink: {
        color: '#000000',
        textDecoration: 'none',
    },
}));

export default function AdminMenu(): JSX.Element {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const classes = useStyles();

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
            >
                <SettingsIcon color="secondary" />
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
                <Link className={classes.navLink} to="/user">
                    <MenuItem onClick={handleClose}>
                        Users
                    </MenuItem>
                </Link>
                <Link className={classes.navLink} to="/genres">
                    <MenuItem onClick={handleClose}>
                        Genres
                    </MenuItem>
                </Link>
            </Menu>
        </div>
    );
}
