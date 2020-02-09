import {
  OPEN_PROJECT_FORM,
  CLOSE_PROJECT_FORM,
  GET_ALL_PROJECTS,
  CREATE_PROJECT,
  DELETE_PROJECT,
} from './actions';

const initialProjectFormState = { visible: false, id: null };
const initialProjectState = { projects: [] };

export const projectFormReducer = (state = initialProjectFormState, action) => {
  switch (action.type) {
    case OPEN_PROJECT_FORM:
      return { visible: true, id: action.id };
    case CLOSE_PROJECT_FORM:
      return { visible: false, id: null };
    default:
      return state;
  }
};

export const projectReducer = (state = initialProjectState, action) => {
  switch (action.type) {
    case GET_ALL_PROJECTS:
      return { projects: action.projects };
    case CREATE_PROJECT:
      return {
        ...state,
        projects: [...state.projects, action.project],
      };
    case DELETE_PROJECT:
      return {
        ...state,
        projects: state.projects.filter((project) => String(project.id) !== action.id),
      };
    default:
      return state;
  }
};
