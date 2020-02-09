import * as React from 'react';
import { Route } from 'react-router';
import { MuiThemeProvider } from '@material-ui/core';
import { SnackbarProvider } from 'notistack';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/User/Login';
import Users from './pages/User/Users';
import Register from './pages/User/Register';
import MyAccount from './pages/User/MyAccount';
import theme from './config/theme';
import { AppContextProvider } from './Context';

export default () => (
  <AppContextProvider>
    <MuiThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={1}>
        <Layout>
          <Route exact path="/" component={Home} />
          <Route path="/user" component={Users} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/account" component={MyAccount} />
        </Layout>
      </SnackbarProvider>
    </MuiThemeProvider>
  </AppContextProvider>
);
