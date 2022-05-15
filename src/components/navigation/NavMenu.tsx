import React, { useContext, useEffect, useState } from 'react';
import {
    AppBar, Toolbar, Typography, IconButton, Box, MenuItem, Menu,
} from '@mui/material';
import { Link } from 'react-router-dom';
import {
    Book, Business, Person, CollectionsBookmark, TableRowsOutlined, Receipt,
} from '@mui/icons-material';
import AdminMenu from './AdminMenu';
import { AppContext } from '../../Context';
import userManager from '../../util/userManager';

const NavMenu = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const context = useContext(AppContext);
    const open = Boolean(anchorEl);

    const [isLoading, setIsLoading] = useState<boolean>(true);

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

    useEffect(() => {
        if (context.getToken() === undefined) {
            return;
        }
        setIsLoading(false);
    }, [context]);

    if (isLoading) {
        return (
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        <Link to="/" style={{ textDecoration: 'none', color: '#FFFFFFFF' }}>
                            Apollo&apos;s Library
                        </Link>
                    </Typography>
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
                        <MenuItem onClick={handleLogin}>
                            <Typography>Log in</Typography>
                        </MenuItem>
                        <MenuItem onClick={handleClose}>
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
                </Toolbar>
            </AppBar>
        );
    }
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    <Link to="/" style={{ textDecoration: 'none', color: '#FFFFFFFF' }}>
                        Apollo&apos;s Library
                    </Link>
                </Typography>
                <Box style={{ display: context.isPaidUser() ? 'block' : 'none' }}>
                    <IconButton
                        aria-label="Orders"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                    >
                        <Link
                            style={{
                                color: '#000000',
                                textDecoration: 'none',
                            }}
                            to="/orders"
                        >
                            <Receipt sx={{
                                color: '#FFFFFF',
                            }}
                            />
                        </Link>
                    </IconButton>
                    <IconButton
                        aria-label="Library"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                    >
                        <Link
                            style={{
                                color: '#000000',
                                textDecoration: 'none',
                            }}
                            to="/library"
                        >
                            <TableRowsOutlined sx={{
                                color: '#FFFFFF',
                            }}
                            />
                        </Link>
                    </IconButton>
                    <IconButton
                        aria-label="Books"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                    >
                        <Link
                            style={{
                                color: '#000000',
                                textDecoration: 'none',
                            }}
                            to="/books"
                        >
                            <Book sx={{
                                color: '#FFFFFF',
                            }}
                            />
                        </Link>
                    </IconButton>
                    <IconButton
                        aria-label="Series"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                    >
                        <Link
                            style={{
                                color: '#000000',
                                textDecoration: 'none',
                            }}
                            to="/serieslist"
                        >
                            <CollectionsBookmark sx={{
                                color: '#FFFFFF',
                            }}
                            />
                        </Link>
                    </IconButton>
                    <IconButton
                        aria-label="Authors"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                    >
                        <Link
                            style={{
                                color: '#000000',
                                textDecoration: 'none',
                            }}
                            to="/authors"
                        >
                            <Person sx={{
                                color: '#FFFFFF',
                            }}
                            />
                        </Link>
                    </IconButton>
                    <IconButton
                        aria-label="Businesses"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                    >
                        <Link
                            style={{
                                color: '#000000',
                                textDecoration: 'none',
                            }}
                            to="/businesses"
                        >
                            <Business sx={{
                                color: '#FFFFFF',
                            }}
                            />
                        </Link>
                    </IconButton>
                </Box>
                <Box style={{ display: context.isAdmin() ? 'block' : 'none' }}>
                    <AdminMenu />
                </Box>
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
            </Toolbar>
        </AppBar>
    );
};

export default NavMenu;
