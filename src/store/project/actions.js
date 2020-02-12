import axios from 'axios';
import Utils from '../../utils/Utils';

export const OPEN_PROJECT_FORM = 'OPEN_PROJECT_FORM';
export const CLOSE_PROJECT_FORM = 'CLOSE_PROJECT_FORM';
export const GET_ALL_PROJECTS = 'GET_ALL_PROJESTS';
export const CREATE_PROJECT = 'CREATE_PROJECT';
export const DELETE_PROJECT = 'DELETE_PROJECT';
export const UPDATE_PROJECT = 'UPDATE_PROJECT';
export const SEARCH_PROJECT = 'SEARCH_PROJECT';
export const CREATE_TASK = 'CREATE_TASK';
export const DELETE_TASK = 'DELETE_TASK';
export const UPDATE_TASK = 'UPDATE_TASK';
export const INVALID_PROJECT_PARAMS = 'INVALID_PROJECT_PARAMS';
export const INVALID_TASK_PARAMS = 'INVALID_TASK_PARAMS';

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
  const response = await axios.get(url, {
    headers: { 'X-Reach-token': token },
  }).catch((error) => error.response);

  if (response.status !== 200) {
    console.log(response);
    return;
  }
  const { projects } = response.data;
  dispatch(({ type: GET_ALL_PROJECTS, projects }));
};

export const createProject = (params) => async (dispatch) => {
  const url = Utils.buildRequestUrl('/projects');
  const token = localStorage.getItem('token');
  const response = await axios.post(url, params, {
    headers: { 'X-Reach-token': token, 'Content-Type': 'application/json' },
  }).catch((error) => error.response);

  if (response.status !== 200) {
    console.log(response);
    return;
  }
  const { is_created, errors, project } = response.data;
  if (is_created) {
    dispatch({ type: CREATE_PROJECT, project });
  } else {
    dispatch({ type: INVALID_PROJECT_PARAMS, errors });
  }
};

export const deleteProject = (id) => async (dispatch) => {
  const url = Utils.buildRequestUrl(`/projects/${id}`);
  const token = localStorage.getItem('token');
  const response = await axios.delete(url, {
    headers: { 'X-Reach-token': token },
  }).catch((error) => error.response);

  if (response.status !== 200) {
    console.log(response);
    return;
  }
  const { is_delete } = response.data;
  if (is_delete) {
    dispatch({ type: DELETE_PROJECT, id });
  }
};

export const updateProject = (id, params) => async (dispatch) => {
  const url = Utils.buildRequestUrl(`/projects/${id}`);
  const token = localStorage.getItem('token');
  const response = await axios.patch(url, params, {
    headers: { 'X-Reach-token': token, 'Content-Type': 'application/json' },
  }).catch((error) => error.response);

  if (response.status !== 200) {
    console.log(response);
    return;
  }
  const { is_updated, errors, project } = response.data;
  if (is_updated) {
    dispatch({ type: UPDATE_PROJECT, project });
  } else {
    dispatch({ type: INVALID_PROJECT_PARAMS, errors });
  }
};

export const searchProjects = (params) => async (dispatch) => {
  const url = Utils.buildRequestUrl('/tasks/search');
  const response = await axios.post(url, params, {
    headers: { 'Content-Type': 'application/json' },
  }).catch((error) => error.response);

  if (response.status !== 200) {
    console.log(response);
    return;
  }
  const { projects } = response.data;
  dispatch({ type: SEARCH_PROJECT, projects });
};

export const createTask = (params) => async (dispatch) => {
  const url = Utils.buildRequestUrl('/tasks');
  const token = localStorage.getItem('token');
  const response = await axios.post(url, params, {
    headers: { 'X-Reach-token': token, 'Content-Type': 'application/json' },
  }).catch((error) => error.response);

  if (response.status !== 200) {
    console.log(response);
    return;
  }
  const { is_created, errors, task } = response.data;
  if (is_created) {
    dispatch({ type: CREATE_TASK, task });
  } else {
    dispatch({ type: INVALID_TASK_PARAMS, errors });
  }
};

export const deleteTask = (id) => async (dispatch) => {
  const url = Utils.buildRequestUrl(`/tasks/${id}`);
  const token = localStorage.getItem('token');
  const response = await axios.delete(url, {
    headers: { 'X-Reach-token': token },
  }).catch((error) => error.response);

  if (response.status !== 200) {
    console.log(response);
    return;
  }
  const { is_delete, task } = response.data;
  if (is_delete) {
    dispatch({ type: DELETE_TASK, task });
  }
};

export const updateTask = (id, params) => async (dispatch) => {
  const url = Utils.buildRequestUrl(`/tasks/${id}`);
  const token = localStorage.getItem('token');
  const response = await axios.patch(url, params, {
    headers: { 'X-Reach-token': token, 'Content-Type': 'application/json' },
  }).catch((error) => error.response);

  if (response.status !== 200) {
    console.log(response);
    return;
  }
  const { is_updated, errors, task } = response.data;
  if (is_updated) {
    dispatch({ type: UPDATE_TASK, task });
  } else {
    dispatch({ type: INVALID_TASK_PARAMS, errors });
  }
};
