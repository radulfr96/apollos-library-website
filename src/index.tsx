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
import SubscriberRoute from './components/navigation/subscriberRoute';
import AdminRoute from './components/navigation/adminRoute';
import Moderation from './pages/moderation/moderation';
import Report from './pages/moderation/report/report';
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
                                                <AdminRoute>
                                                    <Users />
                                                </AdminRoute>
                                            </Protected>
                                        </Route>
                                        <Route path="/account">
                                            <Protected>
                                                <MyAccount />
                                            </Protected>
                                        </Route>
                                        <Route path="/userdetails/:id">
                                            <Protected>
                                                <AdminRoute>
                                                    <UserPage />
                                                </AdminRoute>
                                            </Protected>
                                        </Route>
                                        <Route path="/genres">
                                            <Protected>
                                                <AdminRoute>
                                                    <Genres />
                                                </AdminRoute>
                                            </Protected>
                                        </Route>
                                        <Route path="/genre/:id">
                                            <Protected>
                                                <AdminRoute>
                                                    <GenrePage />
                                                </AdminRoute>
                                            </Protected>
                                        </Route>
                                        <Route path="/addgenre">
                                            <Protected>
                                                <AdminRoute>
                                                    <GenrePage />
                                                </AdminRoute>
                                            </Protected>
                                        </Route>
                                        <Route path="/businesses">
                                            <Protected>
                                                <SubscriberRoute>
                                                    <BusinessesPage />
                                                </SubscriberRoute>
                                            </Protected>
                                        </Route>
                                        <Route path="/business/:id">
                                            <Protected>
                                                <SubscriberRoute>
                                                    <BusinessPage />
                                                </SubscriberRoute>
                                            </Protected>
                                        </Route>
                                        <Route path="/addbusiness">
                                            <Protected>
                                                <SubscriberRoute>
                                                    <BusinessPage />
                                                </SubscriberRoute>
                                            </Protected>
                                        </Route>
                                        <Route path="/authors">
                                            <Protected>
                                                <SubscriberRoute>
                                                    <AuthorsPage />
                                                </SubscriberRoute>
                                            </Protected>
                                        </Route>
                                        <Route path="/author/:id">
                                            <Protected>
                                                <SubscriberRoute>
                                                    <AuthorPage />
                                                </SubscriberRoute>
                                            </Protected>
                                        </Route>
                                        <Route path="/addauthor">
                                            <SubscriberRoute>
                                                <AuthorPage />
                                            </SubscriberRoute>
                                        </Route>
                                        <Route path="/books">
                                            <Protected>
                                                <SubscriberRoute>
                                                    <BooksPage />
                                                </SubscriberRoute>
                                            </Protected>
                                        </Route>
                                        <Route path="/addbook">
                                            <Protected>
                                                <SubscriberRoute>
                                                    <BookPage />
                                                </SubscriberRoute>
                                            </Protected>
                                        </Route>
                                        <Route path="/book/:id">
                                            <Protected>
                                                <SubscriberRoute>
                                                    <BookPage />
                                                </SubscriberRoute>
                                            </Protected>
                                        </Route>
                                        <Route path="/serieslist">
                                            <Protected>
                                                <SubscriberRoute>
                                                    <SeriesListPage />
                                                </SubscriberRoute>
                                            </Protected>
                                        </Route>
                                        <Route path="/addseries">
                                            <Protected>
                                                <SubscriberRoute>
                                                    <SeriesPage />
                                                </SubscriberRoute>
                                            </Protected>
                                        </Route>
                                        <Route path="/series/:id">
                                            <Protected>
                                                <SubscriberRoute>
                                                    <SeriesPage />
                                                </SubscriberRoute>
                                            </Protected>
                                        </Route>
                                        <Route path="/library">
                                            <Protected>
                                                <SubscriberRoute>
                                                    <LibraryPage />
                                                </SubscriberRoute>
                                            </Protected>
                                        </Route>
                                        <Route path="/addentry">
                                            <Protected>
                                                <SubscriberRoute>
                                                    <LibraryEntryPage />
                                                </SubscriberRoute>
                                            </Protected>
                                        </Route>
                                        <Route path="/entry/:id">
                                            <Protected>
                                                <SubscriberRoute>
                                                    <LibraryEntryPage />
                                                </SubscriberRoute>
                                            </Protected>
                                        </Route>
                                        <Route path="/orders">
                                            <Protected>
                                                <SubscriberRoute>
                                                    <Orders />
                                                </SubscriberRoute>
                                            </Protected>
                                        </Route>
                                        <Route path="/addorder">
                                            <Protected>
                                                <SubscriberRoute>
                                                    <OrderPage />
                                                </SubscriberRoute>
                                            </Protected>
                                        </Route>
                                        <Route path="/order/:id">
                                            <Protected>
                                                <SubscriberRoute>
                                                    <OrderPage />
                                                </SubscriberRoute>
                                            </Protected>
                                        </Route>
                                        <Route path="/subscriptions">
                                            <Protected>
                                                <SubscriberRoute>
                                                    <StripeSubscriptionPage />
                                                </SubscriberRoute>
                                            </Protected>
                                        </Route>
                                        <Route path="/moderation">
                                            <AdminRoute>
                                                <Moderation />
                                            </AdminRoute>
                                        </Route>
                                        <Route path="/report/:id">
                                            <AdminRoute>
                                                <Report />
                                            </AdminRoute>
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
