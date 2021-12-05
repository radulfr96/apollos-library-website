import React, { useContext } from 'react';
import {
  AppBar, Toolbar, Typography, makeStyles, Theme, IconButton, Box,
} from '@mui/material';
import { Business, Person } from '@mui/icons-material';
import AccountMenu from './AccountMenu';
import AdminMenu from './AdminMenu';
import { AppContext } from '../../Context';

const useStyles = makeStyles((theme: Theme) => ({
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
  navLink: {
    color: '#000000',
    textDecoration: 'none',
  },
}));

export default function NavMenu(): JSX.Element {
  const classes = useStyles();
  const context = useContext(AppContext);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          <a href="/" className={classes.homeLink}>
            My Library
          </a>
        </Typography>
        <Box style={{ display: context.isStandardUser() ? 'block' : 'none' }}>
          <IconButton
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
          >
            <a className={classes.navLink} href="/authors">
              <Person color="secondary" />
            </a>
          </IconButton>
          <IconButton
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
          >
            <a className={classes.navLink} href="/publishers">
              <Business color="secondary" />
            </a>
          </IconButton>
        </Box>
        <Box style={{ display: context.isAdmin() ? 'block' : 'none' }}>
          <AdminMenu />
        </Box>
        <AccountMenu />
      </Toolbar>
    </AppBar>
  );
}
