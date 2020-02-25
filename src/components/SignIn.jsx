import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';

import { INTERNAL_SERVER_ERROR } from '../store/confirm/types';
import * as confirmActions from '../store/confirm/actions';
import * as verificationFormActions from '../store/verification/actions';
import * as loadingActions from '../store/loading/actions';
import VerificationForm from './VerificationForm';
import ErrorMessage from './Error';
import Utils from '../utils/Utils';

import '../css/Session.scss';

const mapStateToProps = (state) => {
  const { verificationForm } = state;
  return {
    verificationFormVisible: verificationForm.visible,
  };
};

const mapDispatchToProps = (dispatch) => {
  const { openConfirm } = confirmActions;
  const { openVerificationForm } = verificationFormActions;
  const { loadStart, loadEnd } = loadingActions;
  return {
    openConfirm: (payload) => dispatch(openConfirm(payload)),
    openVerificationForm: () => dispatch(openVerificationForm()),
    loadStart: () => dispatch(loadStart()),
    loadEnd: () => dispatch(loadEnd()),
  };
};

const SignIn = (props) => {
  const {
    loadStart,
    loadEnd,
    openConfirm,
    verificationFormVisible,
    openVerificationForm,
  } = props;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignIn, signIn] = useState(false);
  const [errors, addErrors] = useState([]);

  const handleSignIn = async () => {
    loadStart();
    const url = Utils.buildRequestUrl('/sessions');
    const params = { email, password };
    const response = await axios.post(url, params, {
      headers: { 'Content-Type': 'application/json' },
    }).catch((error) => error.response);

    if (response.status !== 200) {
      openConfirm(INTERNAL_SERVER_ERROR);
      loadEnd();
      return;
    }

    const { result, token } = response.data;
    if (result) {
      localStorage.setItem('token', token);
      signIn(true);
    } else {
      addErrors(response.data.errors);
    }
    loadEnd();
  };

  const onChangeEmail = (event) => {
    const { value } = event.target;
    setEmail(value);
  };

  const onChangePassword = (event) => {
    const { value } = event.target;
    setPassword(value);
  };

  return (
    isSignIn ? <Redirect to="/reach" /> : (
      <div className="background">
        <div className="session">
          <div className="session__title">Sign in to Reach</div>
          {errors.length !== 0 && <ErrorMessage action="Authentication" errors={errors} />}
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
          <button type="button" onClick={handleSignIn} className="session__submit">
            Sign In
          </button>
          <Link to="/reach/signup" className="session__switch">Create account</Link>
          <div className="session__openVerification" onClick={openVerificationForm}>Account verification</div>
        </div>
        {verificationFormVisible && <VerificationForm />}
      </div>
    )
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
