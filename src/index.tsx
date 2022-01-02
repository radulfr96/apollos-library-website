import { ConnectedRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router';
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
import Authors from './pages/authors/authors';
import AuthorPage from './pages/authors/author';
import theme from './config/theme';
import userManager from './util/userManager';
import AppContextProvider from './Context';
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
                                        <Route exact path="/" component={Home} />
                                        <Route path="/callback" component={CallbackPage} />
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
