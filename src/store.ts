import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { createStore, applyMiddleware, compose } from 'redux';
import createOidcMiddleware from 'redux-oidc';
import createRootReducer from './reducer';
import userManager from './util/userManager';

// create the middleware with the userManager
const oidcMiddleware = createOidcMiddleware(userManager);

export const history = createBrowserHistory();

export default function configureStore(preloadedState: any) {
  const store = createStore(
    createRootReducer(history), // root reducer with router state
    preloadedState,
    compose(
      applyMiddleware(
        routerMiddleware(history), // for dispatching history actions
        oidcMiddleware,
      ),
    ),
  );

  return store;
}
