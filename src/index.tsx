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
import AppContextProvider from './userContext';
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
import Protected from './components/navigation/protected';
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
                                            <Protected>
                                                <Users />
                                            </Protected>
                                        </Route>
                                        <Route path="/account">
                                            <Protected>
                                                <MyAccount />
                                            </Protected>
                                        </Route>
                                        <Route path="/userdetails/:id">
                                            <Protected>
                                                <UserPage />
                                            </Protected>
                                        </Route>
                                        <Route path="/genres">
                                            <Protected>
                                                <Genres />
                                            </Protected>
                                        </Route>
                                        <Route path="/genre/:id">
                                            <Protected>
                                                <GenrePage />
                                            </Protected>
                                        </Route>
                                        <Route path="/addgenre">
                                            <Protected>
                                                <GenrePage />
                                            </Protected>
                                        </Route>
                                        <Route path="/businesses">
                                            <Protected>
                                                <BusinessesPage />
                                            </Protected>
                                        </Route>
                                        <Route path="/business/:id">
                                            <Protected>
                                                <BusinessPage />
                                            </Protected>
                                        </Route>
                                        <Route path="/addbusiness">
                                            <Protected>
                                                <BusinessPage />
                                            </Protected>
                                        </Route>
                                        <Route path="/authors">
                                            <Protected>
                                                <AuthorsPage />
                                            </Protected>
                                        </Route>
                                        <Route path="/author/:id">
                                            <Protected>
                                                <AuthorPage />
                                            </Protected>
                                        </Route>
                                        <Route path="/addauthor">
                                            <AuthorPage />
                                        </Route>
                                        <Route path="/books">
                                            <Protected>
                                                <BooksPage />
                                            </Protected>
                                        </Route>
                                        <Route path="/addbook">
                                            <Protected>
                                                <BookPage />
                                            </Protected>
                                        </Route>
                                        <Route path="/book/:id">
                                            <Protected>
                                                <BookPage />
                                            </Protected>
                                        </Route>
                                        <Route path="/serieslist">
                                            <Protected>
                                                <SeriesListPage />
                                            </Protected>
                                        </Route>
                                        <Route path="/addseries">
                                            <Protected>
                                                <SeriesPage />
                                            </Protected>
                                        </Route>
                                        <Route path="/series/:id">
                                            <Protected>
                                                <SeriesPage />
                                            </Protected>
                                        </Route>
                                        <Route path="/library">
                                            <Protected>
                                                <LibraryPage />
                                            </Protected>
                                        </Route>
                                        <Route path="/addentry">
                                            <Protected>
                                                <LibraryEntryPage />
                                            </Protected>
                                        </Route>
                                        <Route path="/entry/:id">
                                            <Protected>
                                                <LibraryEntryPage />
                                            </Protected>
                                        </Route>
                                        <Route path="/orders">
                                            <Protected>
                                                <Orders />
                                            </Protected>
                                        </Route>
                                        <Route path="/addorder">
                                            <Protected>
                                                <OrderPage />
                                            </Protected>
                                        </Route>
                                        <Route path="/order/:id">
                                            <Protected>
                                                <OrderPage />
                                            </Protected>
                                        </Route>
                                        <Route path="/subscriptions">
                                            <Protected>
                                                <StripeSubscriptionPage />
                                            </Protected>
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
