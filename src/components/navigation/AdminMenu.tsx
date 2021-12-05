/* eslint-disable linebreak-style */
import {
    IconButton, makeStyles, Menu, MenuItem,
} from '@mui/material';
import SettingsIcon from '@material-ui/icons/Settings';
import React from 'react';

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
        <Box>
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
                <a className={classes.navLink} href="/user">
                    <MenuItem onClick={handleClose}>
                        Users
                    </MenuItem>
                </a>
                <a className={classes.navLink} href="/genres">
                    <MenuItem onClick={handleClose}>
                        Genres
                    </MenuItem>
                </a>
            </Menu>
        </Box>
    );
}
