import axios from 'axios';
import Utils from '../../utils/Utils';
import { OPEN_CONFIRM } from '../confirm/actions';
import { INTERNAL_SERVER_ERROR } from '../confirm/types';

export const OPEN_ACCOUNT_FORM = 'OPEN_ACCOUNT_FORM';
export const CLOSE_ACCOUNT_FORM = 'CLOSE_ACCOUNT_FORM';
export const GET_ALL_ACCOUNT = 'GET_ALL_ACCOUNT';
export const UPDATE_ACCOUNT = 'UPDATE_ACCOUNT';
export const INVALID_ACCOUNT_PARAMS = 'INVALID_ACCOUNT_PARAMS';

export const openAccountForm = () => ({
  type: OPEN_ACCOUNT_FORM,
});

export const closeAccountForm = () => ({
  type: CLOSE_ACCOUNT_FORM,
});

export const getAllAccount = () => async (dispatch) => {
  const url = Utils.buildRequestUrl('/users');
  const token = localStorage.getItem('token');
  const response = await axios.get(url, {
    headers: { 'X-Reach-token': token },
  }).catch((error) => error.response);

  if (response.status !== 200) {
    dispatch({ type: OPEN_CONFIRM, payload: INTERNAL_SERVER_ERROR });
    return;
  }
  const { users } = response.data;
  dispatch({ type: GET_ALL_ACCOUNT, users });
};

export const updateAccount = (params) => async (dispatch) => {
  const url = Utils.buildRequestUrl('/users/update');
  const token = localStorage.getItem('token');
  const response = await axios.patch(url, params, {
    headers: { 'X-Reach-token': token },
  }).catch((error) => error.response);

  if (response.status !== 200) {
    dispatch({ type: OPEN_CONFIRM, payload: INTERNAL_SERVER_ERROR });
    return;
  }

  const { is_updated, user, errors } = response.data;
  if (is_updated) {
    dispatch({ type: UPDATE_ACCOUNT, user });
  } else {
    dispatch({ type: INVALID_ACCOUNT_PARAMS, errors });
  }
};
