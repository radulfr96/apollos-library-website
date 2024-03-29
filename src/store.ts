import { routerMiddleware } from 'connected-react-router';
import { createStore, applyMiddleware, compose } from 'redux';
import { loadUser } from 'redux-oidc';
import createRootReducer from './reducer';
import userManager from './util/userManager';

export default function configureStore(preloadedState: any, history: any) {
    const store = createStore(
        createRootReducer(history), // root reducer with router state
        preloadedState,
        compose(
            applyMiddleware(
                routerMiddleware(history), // for dispatching history actions
            ),
        ),
    );

    loadUser(store, userManager);
    return store;
}
