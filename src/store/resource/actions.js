import Utils from '../../utils/Utils';

export const OPEN_RESOURCE_FORM = 'OPEN_RESOURCE_FORM';
export const CLOSE_RESOURCE_FORM = 'CLOSE_RESOURCE_FORM';
export const GET_ALL_RESOURCES = 'GET_ALL_RESOURCES';

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
