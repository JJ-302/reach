import React, { useReducer, useEffect } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { INTERNAL_SERVER_ERROR } from '../store/confirm/types';
import * as accountActions from '../store/account/actions';
import * as projectActions from '../store/project/actions';
import * as confirmActions from '../store/confirm/actions';
import * as loadingActions from '../store/loading/actions';
import ErrorMessage from './Error';
import Utils from '../utils/Utils';
import '../css/Session.scss';

const mapStateToProps = (state) => {
  const { accountForm } = state;
  return {
    errors: accountForm.errors,
  };
};

const mapDispatchToProps = (dispatch) => {
  const { closeAccountForm, updateAccount } = accountActions;
  const { getAllProjects } = projectActions;
  const { openConfirm } = confirmActions;
  const { loadStart, loadEnd } = loadingActions;
  return {
    closeAccountForm: () => dispatch(closeAccountForm()),
    updateAccount: (params) => dispatch(updateAccount(params)),
    getAllProjects: () => dispatch(getAllProjects()),
    openConfirm: (payload) => dispatch(openConfirm(payload)),
    loadStart: () => dispatch(loadStart()),
    loadEnd: () => dispatch(loadEnd()),
  };
};

const GET_CURRENT_ACCOUNT = 'GET_CURRENT_ACCOUNT';
const ON_CHANGE_FILE = 'ON_CHANGE_FILE';
const ON_CHANGE_NAME = 'ON_CHANGE_NAME';
const ON_CHANGE_EMAIL = 'ON_CHANGE_EMAIL';

const initialAccountLocalState = {
  uri: '', avatar: null, name: '', email: '',
};

const editAccountReducer = (state, action) => {
  switch (action.type) {
    case GET_CURRENT_ACCOUNT:
      return {
        ...state,
        uri: action.payload.uri,
        name: action.payload.name,
        email: action.payload.email,
      };
    case ON_CHANGE_FILE:
      return {
        ...state,
        avatar: action.payload.avatar,
        uri: action.payload.uri,
      };
    case ON_CHANGE_NAME:
      return {
        ...state,
        name: action.value,
      };
    case ON_CHANGE_EMAIL:
      return {
        ...state,
        email: action.value,
      };
    default:
      return state;
  }
};

const EditAccuount = (props) => {
  const {
    openConfirm,
    closeAccountForm,
    errors,
    getAllProjects,
    updateAccount,
    loadStart,
    loadEnd,
  } = props;

  const [state, dispatch] = useReducer(editAccountReducer, initialAccountLocalState);
  const {
    uri, name, email, avatar,
  } = state;

  useEffect(() => {
    getCurrentAccount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getCurrentAccount = async () => {
    const url = Utils.buildRequestUrl('/users/edit');
    const token = localStorage.getItem('token');
    const response = await axios.get(url, {
      headers: { 'X-Reach-token': token },
    }).catch((error) => error.response);

    if (response.status !== 200) {
      openConfirm(INTERNAL_SERVER_ERROR);
      return;
    }
    const { user } = response.data;
    const payload = { uri: user.avatar, name: user.name, email: user.email };
    dispatch({ type: GET_CURRENT_ACCOUNT, payload });
  };

  const handleUpdate = async () => {
    loadStart();
    const params = new FormData();
    params.append('user[name]', name);
    params.append('user[email]', email);
    if (avatar) {
      params.append('user[avatar]', avatar);
    }

    await updateAccount(params);
    getAllProjects();
    loadEnd();
  };

  const onChangeFile = (event) => {
    const avatarFile = event.target.files[0];
    const avatarURI = URL.createObjectURL(avatarFile);
    dispatch({ type: ON_CHANGE_FILE, payload: { avatar: avatarFile, uri: avatarURI } });
  };

  const onChangeName = (event) => {
    const { value } = event.target;
    dispatch({ type: ON_CHANGE_NAME, value });
  };

  const onChangeEmail = (event) => {
    const { value } = event.target;
    dispatch({ type: ON_CHANGE_EMAIL, value });
  };

  const onClickOverlay = (event) => event.stopPropagation();

  return (
    <div className="background--edit" onClick={closeAccountForm}>
      <div className="session--edit" onClick={onClickOverlay}>
        <div className="session__title">Edit account</div>
        {errors.length !== 0 && <ErrorMessage action="Registration" errors={errors} />}
        <label htmlFor="avatarForm" className="session__avatar">
          <input id="avatarForm" type="file" className="session__fileField" onChange={onChangeFile} />
          {uri === ''
            ? <FontAwesomeIcon icon={['fas', 'user']} className="session__fileIcon" />
            : <img src={uri} alt="avatar" className="session__preview" />}
        </label>
        <div className="session__fileLabel">Upload your avatar</div>
        <input
          type="text"
          className="session__name"
          placeholder="Name"
          value={name}
          onChange={onChangeName}
        />
        <input
          type="text"
          className="session__email"
          placeholder="Email"
          value={email}
          onChange={onChangeEmail}
        />
        <button type="button" onClick={handleUpdate} className="session__submit">
          Update
        </button>
      </div>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(EditAccuount);
