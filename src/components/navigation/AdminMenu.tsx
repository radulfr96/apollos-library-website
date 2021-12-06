/* eslint-disable linebreak-style */
import {
    Box,
    IconButton, Link, Menu, MenuItem,
} from '@mui/material';
import { Settings } from '@mui/icons-material';
import React from 'react';

export default function AdminMenu(): JSX.Element {
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
                <Settings color="secondary" />
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
                    sx={{
                        color: '#000000',
                        textDecoration: 'none',
                    }}
                    href="/user"
                >
                    <MenuItem onClick={handleClose}>
                        Users
                    </MenuItem>
                </Link>
                <Link
                    sx={{
                        color: '#000000',
                        textDecoration: 'none',
                    }}
                    href="/genres"
                >
                    <MenuItem onClick={handleClose}>
                        Genres
                    </MenuItem>
                </Link>
            </Menu>
        </Box>
    );
}
