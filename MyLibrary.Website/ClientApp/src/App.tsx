import * as React from 'react';
import { Route } from 'react-router';
import { MuiThemeProvider } from '@material-ui/core';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/User/Login';
import Users from './pages/User/Users';
import theme from './config/theme';
import { AppContextProvider } from './Context';

export default () => (
  <AppContextProvider>
    <MuiThemeProvider theme={theme}>
      <Layout>
        <Route exact path="/" component={Home} />
        <Route path="/user" component={Users} />
        <Route path="/login" component={Login} />
      </Layout>
    </MuiThemeProvider>
  </AppContextProvider>
);
