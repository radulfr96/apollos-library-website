import React, { useContext, useEffect, useState } from 'react';
import {
    AppBar, Toolbar, Typography, IconButton, MenuItem, Menu, Grid,
} from '@mui/material';
import { Link } from 'react-router-dom';
import {
    Book, Business, Person, CollectionsBookmark, TableRowsOutlined, Receipt, Settings,
} from '@mui/icons-material';
import { AppContext } from '../../userContext';
import userManager from '../../util/userManager';

const NavMenu = () => {
    const [accountAnchorEl, setAccountAnchorEl] = useState<null | HTMLElement>(null);
    const [adminAnchorEl, setAdminAnchorEl] = useState<null | HTMLElement>(null);
    const context = useContext(AppContext);
    const accountOpen = Boolean(accountAnchorEl);
    const adminOpen = Boolean(adminAnchorEl);

    const [isLoading, setIsLoading] = useState<boolean>(true);

    const logOut = () => {
        userManager.signoutRedirect();
    };

    const handleMenu = (event: React.MouseEvent<HTMLElement>, setAnchorEl: Function) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (setAnchorEl: Function) => {
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
                    <Grid container spacing={2}>
                        <Grid item xs={2}>
                            <Typography variant="h5">
                                <Link to="/" style={{ textDecoration: 'none', color: '#FFFFFFFF' }}>
                                    Apollo&apos;s Library
                                </Link>
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="h6">
                                <Link
                                    style={{
                                        color: '#FFFFFF',
                                        textDecoration: 'none',
                                    }}
                                    to="/subscriptions"
                                >
                                    Subscriptions
                                </Link>
                            </Typography>
                        </Grid>
                        <Grid item xs={4} sx={{ textAlign: 'right' }}>
                            <IconButton
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={(e) => handleMenu(e, setAccountAnchorEl)}
                            >
                                <Person sx={{
                                    color: '#FFFFFF',
                                }}
                                />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={accountAnchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                open={accountOpen}
                                onClose={() => handleClose(setAccountAnchorEl)}
                            >
                                <MenuItem onClick={handleLogin}>
                                    <Typography>Log in</Typography>
                                </MenuItem>
                            </Menu>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
        );
    }
    return (
        <AppBar position="static">
            <Toolbar>
                <Grid container>
                    <Grid item xs={2}>
                        <Link to="/" style={{ textDecoration: 'none', color: '#FFFFFFFF' }}>
                            <Typography variant="h5" sx={{ flexGrow: 1 }}>
                                Apollo&apos;s Library
                            </Typography>
                        </Link>
                    </Grid>
                    {
                        !context.isPaidUser() && (
                            <Grid item xs={2}>
                                <Typography variant="h6">
                                    <Link
                                        style={{
                                            color: '#FFFFFF',
                                            textDecoration: 'none',
                                        }}
                                        to="/subscriptions"
                                    >
                                        Subscriptions
                                    </Link>
                                </Typography>
                            </Grid>
                        )
                    }

                    <Grid item xs={context.isPaidUser() ? 10 : 8} sx={{ textAlign: 'right' }}>
                        {
                            context.isPaidUser() && (
                                <>
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
                                </>
                            )
                        }
                        {
                            context.isAdmin() && (
                                <>
                                    <IconButton
                                        aria-label="account of current user"
                                        aria-controls="menu-appbar"
                                        aria-haspopup="true"
                                        onClick={(e) => handleMenu(e, setAdminAnchorEl)}
                                    >
                                        <Settings sx={{
                                            color: '#FFFFFF',
                                        }}
                                        />
                                    </IconButton>
                                    <Menu
                                        id="menu-appbar"
                                        anchorEl={adminAnchorEl}
                                        anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        keepMounted
                                        open={adminOpen}
                                        onClose={() => handleClose(setAdminAnchorEl)}
                                    >
                                        <Link
                                            style={{
                                                color: '#000000',
                                                textDecoration: 'none',
                                            }}
                                            to="/user"
                                        >
                                            <MenuItem onClick={() => handleClose(setAdminAnchorEl)}>
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
                                            <MenuItem onClick={() => handleClose(setAdminAnchorEl)}>
                                                Genres
                                            </MenuItem>
                                        </Link>
                                        <Link
                                            style={{
                                                color: '#000000',
                                                textDecoration: 'none',
                                            }}
                                            to="/moderation"
                                        >
                                            <MenuItem onClick={() => handleClose(setAdminAnchorEl)}>
                                                Moderation
                                            </MenuItem>
                                        </Link>
                                    </Menu>
                                </>
                            )
                        }
                        <>
                            <IconButton
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={(e) => handleMenu(e, setAccountAnchorEl)}
                            >
                                <Person sx={{
                                    color: '#FFFFFF',
                                }}
                                />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={accountAnchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                open={accountOpen}
                                onClose={() => handleClose(setAccountAnchorEl)}
                            >
                                <Link
                                    style={{
                                        color: '#000000',
                                        textDecoration: 'none',
                                    }}
                                    to="/account"
                                >
                                    <MenuItem onClick={() => handleClose(setAccountAnchorEl)}>
                                        My Account
                                    </MenuItem>
                                </Link>
                                <MenuItem
                                    onClick={() => {
                                        logOut();
                                        context.clearUserInfo();
                                        handleClose(setAccountAnchorEl);
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
                            </Menu>
                        </>
                    </Grid>
                </Grid>
            </Toolbar>
        </AppBar>
    );
};

export default NavMenu;
