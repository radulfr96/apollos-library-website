import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import { createBrowserHistory } from 'history';
import createOidcMiddleware from 'redux-oidc';
import reducer from './reducer';
import userManager from './util/userManager';

// create the middleware with the userManager
const oidcMiddleware = createOidcMiddleware(userManager);

const initialState = {};

const createStoreWithMiddleware = compose(
  applyMiddleware(oidcMiddleware, routerMiddleware(createBrowserHistory())),
)(createStore);

const store = createStoreWithMiddleware(reducer, initialState);

export default store;
