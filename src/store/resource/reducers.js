import {
  OPEN_RESOURCE_FORM,
  CLOSE_RESOURCE_FORM,
  GET_ALL_RESOURCES,
} from './actions';

const initialResouceFormState = { visible: false, id: null };
const initialResouceState = { resources: [] };

export const resourceFormReducer = (state = initialResouceFormState, action) => {
  switch (action.type) {
    case OPEN_RESOURCE_FORM:
      return { visible: true, id: action.id };
    case CLOSE_RESOURCE_FORM:
      return { visible: false, id: null };
    default:
      return state;
  }
};

export const resourceReducer = (state = initialResouceState, action) => {
  switch (action.type) {
    case GET_ALL_RESOURCES:
      return { resources: action.resources };
    default:
      return state;
  }
};
