import React, { useContext } from 'react';
import {
  AppBar, Toolbar, Typography, makeStyles, Theme, IconButton,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import BusinessIcon from '@material-ui/icons/Business';
import PersonIcon from '@material-ui/icons/Person';
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
          <Link to="/" className={classes.homeLink}>
            My Library
          </Link>
        </Typography>
        <div style={{ display: context.isStandardUser() ? 'block' : 'none' }}>
          <IconButton
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
          >
            <Link className={classes.navLink} to="/authors">
              <PersonIcon color="secondary" />
            </Link>
          </IconButton>
          <IconButton
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
          >
            <Link className={classes.navLink} to="/publishers">
              <BusinessIcon color="secondary" />
            </Link>
          </IconButton>
        </div>
        <div style={{ display: context.isAdmin() ? 'block' : 'none' }}>
          <AdminMenu />
        </div>
        <AccountMenu />
      </Toolbar>
    </AppBar>
  );
}
