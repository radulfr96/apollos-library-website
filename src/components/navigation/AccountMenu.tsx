/* eslint-disable linebreak-style */
import {
    IconButton, Menu, MenuItem, Box, Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { Person } from '@mui/icons-material';
import React, { useContext, useState } from 'react';
import { AppContext } from '../../Context';
import userManager from '../../util/userManager';

const AccountMenu = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const context = useContext(AppContext);

    const logOut = () => {
        userManager.signoutRedirect();
    };

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogin = (event: any) => {
        event.preventDefault();
        userManager.signinRedirect();
    };

    return (
        <Box>
            <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
            >
                <Person sx={{
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
                    to="/account"
                >
                    <MenuItem style={{ display: context.userInfo?.email !== undefined ? 'block' : 'none' }} onClick={handleClose}>
                        My Account
                    </MenuItem>
                </Link>
                <MenuItem
                    style={{ display: context.userInfo?.email !== undefined ? 'block' : 'none' }}
                    onClick={() => {
                        logOut();
                        context.clearUserInfo();
                        handleClose();
                    }}
                >
                    <Link
                        style={{
                            color: '#000000',
                            textDecoration: 'none',
                        }}
                        to="/"
                    >
                        Log out
                    </Link>
                </MenuItem>
                <MenuItem style={{ display: context.userInfo?.email === undefined ? 'block' : 'none' }} onClick={handleLogin}>
                    <Typography>Log in</Typography>
                </MenuItem>
                <MenuItem style={{ display: context.userInfo?.email === undefined ? 'block' : 'none' }} onClick={handleClose}>
                    <Link
                        style={{
                            color: '#000000',
                            textDecoration: 'none',
                        }}
                        to="/register"
                    >
                        Sign Up
                    </Link>
                </MenuItem>
            </Menu>
        </Box>
    );
};

export default AccountMenu;
