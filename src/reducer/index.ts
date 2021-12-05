import { connectRouter } from 'connected-react-router';
import { combineReducers } from 'redux';
import { reducer as oidcReducer } from 'redux-oidc';
import subscriptionsReducer from './subscriptions';

const createRootReducer = (history: any) => combineReducers({
  router: connectRouter(history),
  oidc: oidcReducer,
  subscriptions: subscriptionsReducer,
});
export default createRootReducer;
