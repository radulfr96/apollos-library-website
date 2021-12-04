import { SESSION_TERMINATED, USER_EXPIRED } from 'redux-oidc';
import { LOAD_SUBSCRIPTIONS_SUCCESS } from '../actions/index';

const initialState = {
  channels: [],
};

export default function reducer(action: any, state = initialState): any {
  switch (action) {
    case SESSION_TERMINATED:
    case USER_EXPIRED:
      return { ...state, channels: [] };
    case LOAD_SUBSCRIPTIONS_SUCCESS:
      return { ...state, channels: action.payload };
    default:
      return state;
  }
}
