import { OPEN_TASK_FORM, CLOSE_TASK_FORM, TOGGLE_DELETE_BUTTON } from './actions';
import { INVALID_TASK_PARAMS } from '../project/actions';

const initialTaskFormState = {
  visible: false, projectID: null, taskID: null, errors: [],
};

const initialTaskState = { deleteButtonVisible: false };

export const taskFormReducer = (state = initialTaskFormState, action) => {
  switch (action.type) {
    case OPEN_TASK_FORM:
      return {
        visible: true,
        projectID: action.payload.projectID,
        taskID: action.payload.taskID,
        errors: [],
      };
    case CLOSE_TASK_FORM:
      return {
        visible: false,
        projectID: null,
        taskID: null,
        errors: [],
      };
    case INVALID_TASK_PARAMS:
      return {
        ...state,
        errors: action.errors,
      };
    default:
      return state;
  }
};

export const taskReducer = (state = initialTaskState, action) => {
  switch (action.type) {
    case TOGGLE_DELETE_BUTTON:
      return {
        deleteButtonVisible: !state.deleteButtonVisible,
      };
    default:
      return state;
  }
};
