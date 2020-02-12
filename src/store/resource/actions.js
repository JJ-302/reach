import Utils from '../../utils/Utils';

export const OPEN_RESOURCE_FORM = 'OPEN_RESOURCE_FORM';
export const CLOSE_RESOURCE_FORM = 'CLOSE_RESOURCE_FORM';
export const GET_ALL_RESOURCES = 'GET_ALL_RESOURCES';
export const CREATE_RESOURCE = 'CREATE_RESOURCE';
export const DELETE_RESOURCE = 'DELETE_RESOURCE';
export const UPDATE_RESOURCE = 'UPDATE_RESOURCE';

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
  const response = await fetch(url, {
    method: 'GET',
    headers: { 'X-Reach-token': token },
  });
  const { resources } = await response.json();
  dispatch({ type: GET_ALL_RESOURCES, resources });
};

export const createResource = (params) => async (dispatch) => {
  const url = Utils.buildRequestUrl('/resources');
  const token = localStorage.getItem('token');
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'X-Reach-token': token, 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  const json = await response.json();
  if (json.is_created) {
    dispatch({ type: CREATE_RESOURCE, resource: json.resource });
  }
};

export const deleteResource = (id) => async (dispatch) => {
  const url = Utils.buildRequestUrl(`/resources/${id}`);
  const token = localStorage.getItem('token');
  const response = await fetch(url, {
    method: 'DELETE',
    headers: { 'X-Reach-token': token },
  });

  const { is_delete } = await response.json();
  if (is_delete) {
    dispatch({ type: DELETE_RESOURCE, id });
  }
};

export const updateResource = (id, params) => async (dispatch) => {
  const url = Utils.buildRequestUrl(`/resources/${id}`);
  const token = localStorage.getItem('token');
  const response = await fetch(url, {
    method: 'PATCH',
    headers: { 'X-Reach-token': token, 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  const json = await response.json();
  if (json.is_updated) {
    dispatch({ type: UPDATE_RESOURCE, resource: json.resource });
  }
};
