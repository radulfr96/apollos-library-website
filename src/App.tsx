/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { Provider } from 'react-redux';
import { OidcProvider } from 'redux-oidc';
import { MuiThemeProvider } from '@material-ui/core';
import { SnackbarProvider } from 'notistack';
import Layout from './components/Layout';
import theme from './config/theme';
import store from './store';
import userManager from './util/userManager';
import MyLibraryRouter from './components/Router';

export default (): React.ReactElement => (
  <Provider store={store}>
    <OidcProvider store={store} userManager={userManager}>
      <MuiThemeProvider theme={theme}>
        <SnackbarProvider maxSnack={10}>
          <Layout>
            <MyLibraryRouter />
          </Layout>
        </SnackbarProvider>
      </MuiThemeProvider>
    </OidcProvider>
  </Provider>

);
