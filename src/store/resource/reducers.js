import { OPEN_RESOURCE_FORM, CLOSE_RESOURCE_FORM } from './actions';

const initialResouceFormState = { visible: false, id: null };

const resourceFormReducer = (state = initialResouceFormState, action) => {
  switch (action.type) {
    case OPEN_RESOURCE_FORM:
      return { visible: true, id: action.id };
    case CLOSE_RESOURCE_FORM:
      return { visible: false, id: null };
    default:
      return state;
  }
};

export default resourceFormReducer;
