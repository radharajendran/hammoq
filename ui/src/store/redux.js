import { createStore } from 'redux';
import { userReducer } from './reducer'

const enableReduxDevTools = window.__REDUX_DEVTOOLS_EXTENSION__?.();

export const createReduxStore = () => {
  return createStore(userReducer, enableReduxDevTools);
}