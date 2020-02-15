/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react';
import { Route, Router, Switch } from 'react-router';
import { MuiThemeProvider } from '@material-ui/core';
import { SnackbarProvider } from 'notistack';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/User/Login';
import Users from './pages/User/Users';
import Register from './pages/User/Register';
import MyAccount from './pages/User/MyAccount/MyAccount';
import MyDetails from './pages/User/MyAccount/MyDetails';
import theme from './config/theme';
import { AppContextProvider } from './Context';

export default () => (
  <AppContextProvider>
    <MuiThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={1}>
        <Layout />
      </SnackbarProvider>
    </MuiThemeProvider>
  </AppContextProvider>
);
