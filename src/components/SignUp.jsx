import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { INTERNAL_SERVER_ERROR } from '../store/confirm/types';
import * as confirmActions from '../store/confirm/actions';
import * as loadingActions from '../store/loading/actions';
import ErrorMessage from './Error';
import Utils from '../utils/Utils';
import '../css/Session.scss';

const mapDispatchToProps = (dispatch) => {
  const { openConfirm } = confirmActions;
  const { loadStart, loadEnd } = loadingActions;
  return {
    openConfirm: (payload) => dispatch(openConfirm(payload)),
    loadStart: () => dispatch(loadStart()),
    loadEnd: () => dispatch(loadEnd()),
  };
};

const SignUp = (props) => {
  const {
    loadStart,
    loadEnd,
    openConfirm,
  } = props;

  const [uri, setURI] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [errors, addErrors] = useState([]);
  const [isSignUp, signUp] = useState(false);

  const handleSignUp = async () => {
    loadStart();
    const params = new FormData();
    params.append('user[name]', name);
    params.append('user[email]', email);
    params.append('user[password]', password);
    params.append('user[password_confirmation]', passwordConfirmation);
    if (avatar) {
      params.append('user[avatar]', avatar);
    }

    const url = Utils.buildRequestUrl('/users');
    const response = await axios.post(url, params).catch((error) => error.response);
    if (response.status !== 200) {
      openConfirm(INTERNAL_SERVER_ERROR);
      loadEnd();
      return;
    }

    const { is_created } = response.data;
    if (is_created) {
      signUp(true);
    } else {
      addErrors(response.data.errors);
    }
    loadEnd();
  };

  const onChangeFile = (event) => {
    const avatarFile = event.target.files[0];
    const avatarURI = URL.createObjectURL(avatarFile);
    setURI(avatarURI);
    setAvatar(avatarFile);
  };

  const onChangeName = (event) => {
    const { value } = event.target;
    setName(value);
  };

  const onChangeEmail = (event) => {
    const { value } = event.target;
    setEmail(value);
  };

  const onChangePassword = (event) => {
    const { value } = event.target;
    setPassword(value);
  };

  const onChangePasswordConfirmation = (event) => {
    const { value } = event.target;
    setPasswordConfirmation(value);
  };

  return (
    isSignUp ? <Redirect to="/reach/signin" /> : (
      <div className="background">
        <div className="session">
          <div className="session__title">Create account</div>
          {errors.length !== 0 && <ErrorMessage action="Registration" errors={errors} />}
          <label htmlFor="avatarForm" className="session__avatar">
            <input
              id="avatarForm"
              type="file"
              className="session__fileField"
              onChange={onChangeFile}
            />
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
          <input
            type="password"
            className="session__password"
            placeholder="Password"
            value={password}
            onChange={onChangePassword}
          />
          <input
            type="password"
            className="session__password"
            placeholder="Password confirmation"
            value={passwordConfirmation}
            onChange={onChangePasswordConfirmation}
          />
          <button type="button" onClick={handleSignUp} className="session__submit">
            Sign Up
          </button>
          <Link to="/reach/signin" className="session__switch">Move to Sign In</Link>
        </div>
      </div>
    )
  );
};

export default connect(null, mapDispatchToProps)(SignUp);
