import { OPEN_TASK_FORM, CLOSE_TASK_FORM } from './actions';

const initialTaskFormState = { visible: false, projectID: null, taskID: null };

const taskFormReducer = (state = initialTaskFormState, action) => {
  switch (action.type) {
    case OPEN_TASK_FORM:
      return { visible: true, projectID: action.payload.projectID, taskID: action.payload.taskID };
    case CLOSE_TASK_FORM:
      return { visible: false, projectID: null, taskID: null };
    default:
      return state;
  }
};

export default taskFormReducer;
