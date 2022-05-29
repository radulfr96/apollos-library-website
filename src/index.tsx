import { ConnectedRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import { OidcProvider } from 'redux-oidc';
import Layout from './components/layout';
import CallbackPage from './pages/callbackPage';
import GenrePage from './pages/genre/genre';
import Genres from './pages/genre/genres';
import Home from './pages/home';
import BusinessPage from './pages/business/business';
import BusinessesPage from './pages/business/businesses';
import MyAccount from './pages/user/myAccount/myAccount';
import UserPage from './pages/user/user';
import Users from './pages/user/users';
import configureStore from './store';
import AuthorPage from './pages/authors/author';
import theme from './config/theme';
import userManager from './util/userManager';
import AppContextProvider from './context';
import AuthorsPage from './pages/authors/authors';
import BooksPage from './pages/books/books';
import BookPage from './pages/books/book';
import SeriesPage from './pages/series/series';
import SeriesListPage from './pages/series/seriesListPage';
import LibraryPage from './pages/library/library';
import LibraryEntryPage from './pages/library/libraryEntry';
import Orders from './pages/order/orders';
import OrderPage from './pages/order/order';
import StripeSubscriptionPage from './pages/subscription/stripeSubscriptionPage';
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
                                        <Route path="/businesses">
                                            <BusinessesPage />
                                        </Route>
                                        <Route path="/business/:id">
                                            <BusinessPage />
                                        </Route>
                                        <Route path="/addbusiness">
                                            <BusinessPage />
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
                                        <Route path="/addbook">
                                            <BookPage />
                                        </Route>
                                        <Route path="/book/:id">
                                            <BookPage />
                                        </Route>
                                        <Route path="/serieslist">
                                            <SeriesListPage />
                                        </Route>
                                        <Route path="/addseries">
                                            <SeriesPage />
                                        </Route>
                                        <Route path="/series/:id">
                                            <SeriesPage />
                                        </Route>
                                        <Route path="/library">
                                            <LibraryPage />
                                        </Route>
                                        <Route path="/addentry">
                                            <LibraryEntryPage />
                                        </Route>
                                        <Route path="/entry/:id">
                                            <LibraryEntryPage />
                                        </Route>
                                        <Route path="/orders">
                                            <Orders />
                                        </Route>
                                        <Route path="/addorder">
                                            <OrderPage />
                                        </Route>
                                        <Route path="/order/:id">
                                            <OrderPage />
                                        </Route>
                                        <Route path="/subscriptions">
                                            <StripeSubscriptionPage />
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
