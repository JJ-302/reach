import {
  OPEN_RESOURCE_FORM,
  CLOSE_RESOURCE_FORM,
  GET_ALL_RESOURCES,
  CREATE_RESOURCE,
  DELETE_RESOURCE,
  UPDATE_RESOURCE,
  INVALID_RESOURCE_PARAMS,
} from './actions';

const initialResouceFormState = { visible: false, id: null, errors: [] };
const initialResouceState = { resources: [] };

export const resourceFormReducer = (state = initialResouceFormState, action) => {
  switch (action.type) {
    case OPEN_RESOURCE_FORM:
      return { visible: true, id: action.id, errors: [] };
    case CLOSE_RESOURCE_FORM:
      return { visible: false, id: null, errors: [] };
    case INVALID_RESOURCE_PARAMS:
      return {
        ...state,
        errors: action.errors,
      };
    default:
      return state;
  }
};

export const resourceReducer = (state = initialResouceState, action) => {
  switch (action.type) {
    case GET_ALL_RESOURCES:
      return { resources: action.resources };
    case CREATE_RESOURCE:
      return {
        ...state,
        resources: [...state.resources, action.resource],
      };
    case DELETE_RESOURCE:
      return {
        ...state,
        resources: state.resources.filter((resource) => String(resource.id) !== action.id),
      };
    case UPDATE_RESOURCE:
      return {
        ...state,
        resources: state.resources.map((resource) => (
          resource.id === action.resource.id ? action.resource : resource
        )),
      };
    default:
      return state;
  }
};
