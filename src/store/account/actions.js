import Utils from '../../utils/Utils';

export const OPEN_ACCOUNT_FORM = 'OPEN_ACCOUNT_FORM';
export const CLOSE_ACCOUNT_FORM = 'CLOSE_ACCOUNT_FORM';
export const GET_ALL_ACCOUNT = 'GET_ALL_ACCOUNT';
export const UPDATE_ACCOUNT = 'UPDATE_ACCOUNT';

export const openAccountForm = () => ({
  type: OPEN_ACCOUNT_FORM,
});

export const closeAccountForm = () => ({
  type: CLOSE_ACCOUNT_FORM,
});

export const getAllAccount = () => async (dispatch) => {
  const url = Utils.buildRequestUrl('/users');
  const token = localStorage.getItem('token');
  const response = await fetch(url, {
    method: 'GET',
    headers: { 'X-Reach-token': token },
  });

  const json = await response.json();
  if (json.is_authenticated) {
    dispatch({ type: GET_ALL_ACCOUNT, users: json.users });
  }
};

export const updateAccount = (params) => async (dispatch) => {
  const url = Utils.buildRequestUrl('/users/update');
  const token = localStorage.getItem('token');
  const response = await fetch(url, {
    method: 'PATCH',
    headers: { 'X-Reach-token': token },
    body: params,
  });

  const json = await response.json();
  if (json.is_updated) {
    dispatch({ type: UPDATE_ACCOUNT, user: json.user });
  }
};
