import React, { useContext } from 'react';
import {
    AppBar, Toolbar, Typography, IconButton, Box,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { Book, Business, Person } from '@mui/icons-material';
import AccountMenu from './AccountMenu';
import AdminMenu from './AdminMenu';
import { AppContext } from '../../Context';

const NavMenu = () => {
    const context = useContext(AppContext);

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
                        aria-label="Publishers"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                    >
                        <Link
                            style={{
                                color: '#000000',
                                textDecoration: 'none',
                            }}
                            to="/publishers"
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
                <AccountMenu />
            </Toolbar>
        </AppBar>
    );
};

export default NavMenu;
