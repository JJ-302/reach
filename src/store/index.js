import thunk from 'redux-thunk';
import {
  createStore,
  combineReducers,
  applyMiddleware,
  compose,
} from 'redux';

import { resourceFormReducer, resourceReducer } from './resource/reducers';
import { projectFormReducer, projectReducer } from './project/reducers';
import { accountFormReducer, accountReducer } from './account/reducers';
import { taskFormReducer, taskReducer } from './task/reducers';
import scheduleReducer from './schedule/reducers';

const rootReducer = combineReducers({
  resourceForm: resourceFormReducer,
  resource: resourceReducer,
  projectForm: projectFormReducer,
  project: projectReducer,
  accountForm: accountFormReducer,
  account: accountReducer,
  taskForm: taskFormReducer,
  task: taskReducer,
  schedule: scheduleReducer,
});

/* eslint-disable no-underscore-dangle */
const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(thunk),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  ),
);
/* eslint-enable */

export default store;
