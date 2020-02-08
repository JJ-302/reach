import { createStore, combineReducers } from 'redux';
import resourceFormReducer from './resource/reducers';

const rootReducer = combineReducers({
  resourceForm: resourceFormReducer,
});

/* eslint-disable no-underscore-dangle */
const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);
/* eslint-enable */

export default store;
