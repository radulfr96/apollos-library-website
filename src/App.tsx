/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { Route } from 'react-router';
import { MuiThemeProvider } from '@material-ui/core';
import { SnackbarProvider } from 'notistack';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/user/Login';
import Users from './pages/user/Users';
import Register from './pages/user/Register';
import MyAccount from './pages/user/myAccount/MyAccount';
import UserPage from './pages/user/User';
import theme from './config/theme';
import { AppContextProvider } from './Context';
import Genres from './pages/genre/Genres';
import GenrePage from './pages/genre/Genre';
import Publishers from './pages/publishers/publishers';
import PublisherPage from './pages/publishers/publisher';
import Authors from './pages/authors/authors';
import AuthorPage from './pages/authors/author';

export default (): JSX.Element => (
  <AppContextProvider>
    <MuiThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={10}>
      <Layout>
          <Route exact path="/" component={Home} />
          <Route path="/user" component={Users} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/account" component={MyAccount} />
          <Route path="/userdetails/:id" component={UserPage} />
          <Route path="/genres" component={Genres} />
          <Route path="/genre/:id" component={GenrePage} />
          <Route path="/addgenre" component={GenrePage} />
          <Route path="/publishers" component={Publishers} />
          <Route path="/publisher/:id" component={PublisherPage} />
          <Route path="/addpublisher" component={PublisherPage} />
          <Route path="/authors" component={Authors} />
          <Route path="/author/:id" component={AuthorPage} />
          <Route path="/addauthor" component={AuthorPage} />
      </Layout>
      </SnackbarProvider>
    </MuiThemeProvider>
  </AppContextProvider>
);
