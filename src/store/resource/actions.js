import axios from 'axios';
import Utils from '../../utils/Utils';
import { OPEN_CONFIRM } from '../confirm/actions';
import { INTERNAL_SERVER_ERROR } from '../confirm/types';
import { failToDestroy } from '../../utils/Text';

export const OPEN_RESOURCE_FORM = 'OPEN_RESOURCE_FORM';
export const CLOSE_RESOURCE_FORM = 'CLOSE_RESOURCE_FORM';
export const GET_ALL_RESOURCES = 'GET_ALL_RESOURCES';
export const CREATE_RESOURCE = 'CREATE_RESOURCE';
export const DELETE_RESOURCE = 'DELETE_RESOURCE';
export const UPDATE_RESOURCE = 'UPDATE_RESOURCE';
export const INVALID_RESOURCE_PARAMS = 'INVALID_RESOURCE_PARAMS';

export const openResourceForm = (id = null) => ({
  type: OPEN_RESOURCE_FORM,
  id,
});

export const closeResourceForm = () => ({
  type: CLOSE_RESOURCE_FORM,
});

export const getAllResources = () => async (dispatch) => {
  const url = Utils.buildRequestUrl('/resources');
  const token = localStorage.getItem('token');
  const response = await axios.get(url, {
    headers: { 'X-Reach-token': token },
  }).catch((error) => error.response);

  if (response.status !== 200) {
    dispatch({ type: OPEN_CONFIRM, payload: INTERNAL_SERVER_ERROR });
    return;
  }
  const { resources } = response.data;
  dispatch({ type: GET_ALL_RESOURCES, resources });
};

export const createResource = (params) => async (dispatch) => {
  const url = Utils.buildRequestUrl('/resources');
  const token = localStorage.getItem('token');
  const response = await axios.post(url, params, {
    headers: { 'X-Reach-token': token, 'Content-Type': 'application/json' },
  }).catch((error) => error.response);

  if (response.status !== 200) {
    dispatch({ type: OPEN_CONFIRM, payload: INTERNAL_SERVER_ERROR });
    return;
  }
  const { is_created, resource, errors } = response.data;
  if (is_created) {
    dispatch({ type: CREATE_RESOURCE, resource });
  } else {
    dispatch({ type: INVALID_RESOURCE_PARAMS, errors });
  }
};

export const deleteResource = (id) => async (dispatch) => {
  const url = Utils.buildRequestUrl(`/resources/${id}`);
  const token = localStorage.getItem('token');
  const response = await axios.delete(url, {
    headers: { 'X-Reach-token': token },
  }).catch((error) => error.response);

  if (response.status !== 200) {
    dispatch({ type: OPEN_CONFIRM, payload: INTERNAL_SERVER_ERROR });
    return;
  }
  const { is_delete, errors } = response.data;
  if (is_delete) {
    dispatch({ type: DELETE_RESOURCE, id });
  } else {
    const payload = { type: 'error', title: failToDestroy, description: errors[0].error };
    dispatch({ type: OPEN_CONFIRM, payload });
  }
};

export const updateResource = (id, params) => async (dispatch) => {
  const url = Utils.buildRequestUrl(`/resources/${id}`);
  const token = localStorage.getItem('token');
  const response = await axios.patch(url, params, {
    headers: { 'X-Reach-token': token, 'Content-Type': 'application/json' },
  }).catch((error) => error.response);

  if (response.status !== 200) {
    dispatch({ type: OPEN_CONFIRM, payload: INTERNAL_SERVER_ERROR });
    return;
  }
  const { is_updated, errors, resource } = response.data;
  if (is_updated) {
    dispatch({ type: UPDATE_RESOURCE, resource });
  } else {
    dispatch({ type: INVALID_RESOURCE_PARAMS, errors });
  }
};
