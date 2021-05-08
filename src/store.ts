import {
 createStore, applyMiddleware, compose,
} from 'redux';
import { createBrowserHistory } from 'history'
import {
    routerMiddleware,
} from 'react-router-redux';
import { loadUser } from 'redux-oidc';
import reducer from './reducer/index';
import userManager from './util/userManager';

// create the middleware with the userManager
// const oidcMiddleware = createOidcMiddleware(userManager);

const loggerMiddleware = () => (next: Function) => (action: Function) => {
  next(action);
};

const initialState = {};

const createStoreWithMiddleware = compose(
  applyMiddleware(loggerMiddleware, routerMiddleware(createBrowserHistory())),
)(createStore);

const store = createStoreWithMiddleware(reducer, initialState);
loadUser(store, userManager);

export default store;
