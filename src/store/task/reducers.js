import { OPEN_TASK_FORM, CLOSE_TASK_FORM, TOGGLE_DELETE_BUTTON } from './actions';

const initialTaskFormState = { visible: false, projectID: null, taskID: null };
const initialTaskState = { deleteButtonVisible: false };

export const taskFormReducer = (state = initialTaskFormState, action) => {
  switch (action.type) {
    case OPEN_TASK_FORM:
      return { visible: true, projectID: action.payload.projectID, taskID: action.payload.taskID };
    case CLOSE_TASK_FORM:
      return { visible: false, projectID: null, taskID: null };
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
