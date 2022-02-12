/* eslint-disable linebreak-style */
import {
    Box,
    IconButton, Menu, MenuItem,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { Settings } from '@mui/icons-material';
import React from 'react';

const AdminMenu = () => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

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
                <Settings sx={{
                    color: '#FFFFFF',
                }}
                />
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
                <Link
                    style={{
                        color: '#000000',
                        textDecoration: 'none',
                    }}
                    to="/user"
                >
                    <MenuItem onClick={handleClose}>
                        Users
                    </MenuItem>
                </Link>
                <Link
                    style={{
                        color: '#000000',
                        textDecoration: 'none',
                    }}
                    to="/genres"
                >
                    <MenuItem onClick={handleClose}>
                        Genres
                    </MenuItem>
                </Link>
            </Menu>
        </Box>
    );
};

export default AdminMenu;
