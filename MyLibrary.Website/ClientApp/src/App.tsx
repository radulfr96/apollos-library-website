import * as React from 'react';
import { Route } from 'react-router';
import Layout from './components/Layout';
import Home from './components/Home';
import Login from './pages/User/Login';
import Users from './pages/User/Users';
import theme from './config/theme'
import { MuiThemeProvider } from '@material-ui/core';

export default () => (
    <MuiThemeProvider theme={theme}>
        <Layout>
            <Route exact path='/' component={Home} />
            <Route path='/user' component={Users} />
            <Route path='/login' component={Login} />
        </Layout>
    </MuiThemeProvider>
);
