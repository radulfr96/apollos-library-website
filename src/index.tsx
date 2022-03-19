import { ConnectedRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import { OidcProvider } from 'redux-oidc';
import Layout from './components/Layout';
import CallbackPage from './pages/CallbackPage';
import GenrePage from './pages/genre/Genre';
import Genres from './pages/genre/Genres';
import Home from './pages/Home';
import PublisherPage from './pages/publishers/publisher';
import Publishers from './pages/publishers/publishers';
import Login from './pages/user/Login';
import MyAccount from './pages/user/myAccount/MyAccount';
import Register from './pages/user/Register';
import UserPage from './pages/user/User';
import Users from './pages/user/Users';
import configureStore from './store';
import AuthorPage from './pages/authors/author';
import theme from './config/theme';
import userManager from './util/userManager';
import AppContextProvider from './Context';
import AuthorsPage from './pages/authors/authors';
import BooksPage from './pages/books/books';
// Create browser history to use in the Redux store

// Get the application-wide store instance, prepopulating
// with state from the server where available.

const history = createBrowserHistory();
const store = configureStore({}, history);

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <ConnectedRouter history={history}>
                <OidcProvider store={store} userManager={userManager}>
                    <AppContextProvider>
                        <ThemeProvider theme={theme}>
                            <SnackbarProvider maxSnack={10}>
                                <Layout>
                                    <Switch>
                                        <Route exact path="/">
                                            <Home />
                                        </Route>
                                        <Route path="/callback">
                                            <CallbackPage />
                                        </Route>
                                        <Route path="/user">
                                            <Users />
                                        </Route>
                                        <Route path="/login">
                                            <Login />
                                        </Route>
                                        <Route path="/register">
                                            <Register />
                                        </Route>
                                        <Route path="/account">
                                            <MyAccount />
                                        </Route>
                                        <Route path="/userdetails/:id">
                                            <UserPage />
                                        </Route>
                                        <Route path="/genres">
                                            <Genres />
                                        </Route>
                                        <Route path="/genre/:id">
                                            <GenrePage />
                                        </Route>
                                        <Route path="/addgenre">
                                            <GenrePage />
                                        </Route>
                                        <Route path="/publishers">
                                            <Publishers />
                                        </Route>
                                        <Route path="/publisher/:id">
                                            <PublisherPage />
                                        </Route>
                                        <Route path="/addpublisher">
                                            <PublisherPage />
                                        </Route>
                                        <Route path="/authors">
                                            <AuthorsPage />
                                        </Route>
                                        <Route path="/author/:id">
                                            <AuthorPage />
                                        </Route>
                                        <Route path="/addauthor">
                                            <AuthorPage />
                                        </Route>
                                        <Route path="/books">
                                            <BooksPage />
                                        </Route>
                                    </Switch>
                                </Layout>
                            </SnackbarProvider>
                        </ThemeProvider>
                    </AppContextProvider>
                </OidcProvider>
            </ConnectedRouter>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root'),
);
