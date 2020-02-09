import Utils from '../../utils/Utils';

export const OPEN_PROJECT_FORM = 'OPEN_PROJECT_FORM';
export const CLOSE_PROJECT_FORM = 'CLOSE_PROJECT_FORM';
export const GET_ALL_PROJECTS = 'GET_ALL_PROJESTS';
export const CREATE_PROJECT = 'CREATE_PROJECT';
export const DELETE_PROJECT = 'DELETE_PROJECT';

export const openProjectForm = (id = null) => ({
  type: OPEN_PROJECT_FORM,
  id,
});

export const closeProjectForm = () => ({
  type: CLOSE_PROJECT_FORM,
});

export const getAllProjects = () => async (dispatch) => {
  const url = Utils.buildRequestUrl('/projects');
  const token = localStorage.getItem('token');
  const response = await fetch(url, {
    method: 'GET',
    headers: { 'X-Reach-token': token },
  });

  const json = await response.json();
  if (json.is_authenticated) {
    dispatch(({ type: GET_ALL_PROJECTS, projects: json.projects }));
  }
};

export const createProject = (params) => async (dispatch) => {
  const url = Utils.buildRequestUrl('/projects');
  const token = localStorage.getItem('token');
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'X-Reach-token': token, 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  const json = await response.json();
  if (json.is_created) {
    dispatch({ type: CREATE_PROJECT, project: json.project });
  }
};

export const deleteProject = (id) => async (dispatch) => {
  const url = Utils.buildRequestUrl(`/projects/${id}`);
  const token = localStorage.getItem('token');
  const response = await fetch(url, {
    method: 'DELETE',
    headers: { 'X-Reach-token': token },
  });

  const json = await response.json();
  if (json.is_delete) {
    dispatch({ type: DELETE_PROJECT, id });
  }
};
