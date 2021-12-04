/* eslint-disable max-len */
import React from 'react';
import { Route } from 'react-router';
import { ConnectedRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import Home from '../pages/Home';
import CallbackPage from '../pages/CallbackPage';
import Users from '../pages/user/Users';
import Login from '../pages/user/Login';
import Register from '../pages/user/Register';
import MyAccount from '../pages/user/myAccount/MyAccount';
import UserPage from '../pages/user/User';
import Genres from '../pages/genre/Genres';
import GenrePage from '../pages/genre/Genre';
import Publishers from '../pages/publishers/publishers';
import PublisherPage from '../pages/publishers/publisher';
import Authors from '../pages/authors/authors';
import AuthorPage from '../pages/authors/author';

export default function MyLibraryRouter(): JSX.Element {
  const history = createBrowserHistory();

  return (
    <ConnectedRouter history={history}>
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
    </ConnectedRouter>
  );
}
