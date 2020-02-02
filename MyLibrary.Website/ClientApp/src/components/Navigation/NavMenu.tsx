import * as React from 'react';
import {
  AppBar, Toolbar, Typography, makeStyles, Theme,
} from '@material-ui/core';
import { NavLink } from 'react-router-dom';
import AccountMenu from './AccountMenu';
import { AppContextProvider } from '../../Context';

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
}));

export default function NavMenu() {
  const classes = useStyles();

  return (
    <AppContextProvider>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            <NavLink to="/" className={classes.homeLink}>
              My Library
            </NavLink>
          </Typography>
          <AccountMenu />
        </Toolbar>
      </AppBar>
    </AppContextProvider>
  );
}
