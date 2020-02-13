import axios from 'axios';
import Utils from '../../utils/Utils';
import { OPEN_CONFIRM } from '../confirm/actions';
import { INTERNAL_SERVER_ERROR } from '../confirm/types';

export const OPEN_ATTACHMENT_FORM = 'OPEN_ATTACHMENT_FORM';
export const CLOSE_ATTACHMENT_FORM = 'CLOSE_ATTACHMENT_FORM';
export const GET_ALL_ATTACHMENT = 'GET_ALL_ATTACHMENT';
export const CREATE_ATTACHMENT = 'CREATE_ATTACHMENT';
export const DELETE_ATTACHMENT = 'DELETE_ATTACHMENT';
export const INVALID_ATTACHMENT_PARAMS = 'INVALID_ATTACHMENT_PARAMS';

export const openAttachmentForm = (projectID) => ({
  type: OPEN_ATTACHMENT_FORM,
  projectID,
});

export const closeAttachmentForm = () => ({
  type: CLOSE_ATTACHMENT_FORM,
});

export const getAllAttachment = (projectID) => async (dispatch) => {
  const url = Utils.buildRequestUrl(`/projects/${projectID}/attachments`);
  const token = localStorage.getItem('token');
  const response = await axios.get(url, {
    headers: { 'X-Reach-token': token },
  }).catch((error) => error.response);

  if (response.status !== 200) {
    dispatch({ type: OPEN_CONFIRM, payload: INTERNAL_SERVER_ERROR });
    return;
  }
  const { attachments } = response.data;
  dispatch({ type: GET_ALL_ATTACHMENT, attachments });
};

export const createAttachment = (params, projectID) => async (dispatch) => {
  const url = Utils.buildRequestUrl(`/projects/${projectID}/attachments`);
  const token = localStorage.getItem('token');
  const response = await axios.post(url, params, {
    headers: { 'X-Reach-token': token, 'Content-Type': 'application/json' },
  }).catch((error) => error.response);

  if (response.status !== 200) {
    dispatch({ type: OPEN_CONFIRM, payload: INTERNAL_SERVER_ERROR });
    return;
  }
  const { is_created, errors, attachment } = response.data;
  if (is_created) {
    dispatch({ type: CREATE_ATTACHMENT, attachment });
  } else {
    dispatch({ type: INVALID_ATTACHMENT_PARAMS, errors });
  }
};

export const deleteAttachment = (id) => async (dispatch) => {
  const url = Utils.buildRequestUrl(`/attachments/${id}`);
  const token = localStorage.getItem('token');
  const response = await axios.delete(url, {
    headers: { 'X-Reach-token': token },
  }).catch((error) => error.response);

  if (response.status !== 200) {
    dispatch({ type: OPEN_CONFIRM, payload: INTERNAL_SERVER_ERROR });
    return;
  }
  const { is_delete } = response.data;
  if (is_delete) {
    dispatch({ type: DELETE_ATTACHMENT, id });
  }
};
