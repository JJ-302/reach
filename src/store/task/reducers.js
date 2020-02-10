import {
  OPEN_TASK_FORM,
  CLOSE_TASK_FORM,
} from './actions';

const initialTaskFormState = { visible: false, id: null };

export const taskFormReducer = (state = initialTaskFormState, action) => {
  switch (action.type) {
    case OPEN_TASK_FORM:
      return { visible: true, id: action.id };
    case CLOSE_TASK_FORM:
      return { visible: false, id: null };
    default:
      return state;
  }
};

export const taskReducer = () => {};
