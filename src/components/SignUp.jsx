import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { INTERNAL_SERVER_ERROR } from '../store/confirm/types';
import * as confirmActions from '../store/confirm/actions';
import ErrorMessage from './Error';
import Utils from '../utils/Utils';
import '../css/Session.scss';

const mapDispatchToProps = (dispatch) => {
  const { openConfirm } = confirmActions;
  return {
    openConfirm: (payload) => dispatch(openConfirm(payload)),
  };
};

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uri: '',
      avatar: null,
      name: '',
      email: '',
      password: '',
      passwordConfirmation: '',
      errors: [],
      isSignIn: false,
    };
  }

  handleSignUp = async () => {
    const {
      avatar,
      name,
      email,
      password,
      passwordConfirmation,
    } = this.state;

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
      const { openConfirm } = this.props;
      openConfirm(INTERNAL_SERVER_ERROR);
      return;
    }

    const { is_created, errors, token } = response.data;
    if (is_created) {
      localStorage.setItem('token', token);
      this.setState({ isSignIn: true });
    } else {
      this.setState({ errors });
    }
  }

  onChangeFile = (event) => {
    const avatar = event.target.files[0];
    const uri = URL.createObjectURL(avatar);
    this.setState({ uri, avatar });
  }

  onChangeName = (event) => {
    const name = event.target.value;
    this.setState({ name });
  }

  onChangeEmail = (event) => {
    const email = event.target.value;
    this.setState({ email });
  }

  onChangePassword = (event) => {
    const password = event.target.value;
    this.setState({ password });
  }

  onChangePasswordConfirmation = (event) => {
    const passwordConfirmation = event.target.value;
    this.setState({ passwordConfirmation });
  }

  render() {
    const {
      uri,
      name,
      email,
      password,
      passwordConfirmation,
      errors,
      isSignIn,
    } = this.state;

    return (
      isSignIn ? <Redirect to="/reach" /> : (
        <div className="background">
          <div className="session">
            <div className="session__title">Create account</div>
            {errors.length !== 0 && <ErrorMessage action="Registration" errors={errors} />}
            <label htmlFor="avatarForm" className="session__avatar">
              <input
                id="avatarForm"
                type="file"
                className="session__fileField"
                onChange={this.onChangeFile}
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
              onChange={this.onChangeName}
            />
            <input
              type="text"
              className="session__email"
              placeholder="Email"
              value={email}
              onChange={this.onChangeEmail}
            />
            <input
              type="password"
              className="session__password"
              placeholder="Password"
              value={password}
              onChange={this.onChangePassword}
            />
            <input
              type="password"
              className="session__password"
              placeholder="Password confirmation"
              value={passwordConfirmation}
              onChange={this.onChangePasswordConfirmation}
            />
            <button type="button" onClick={this.handleSignUp} className="session__submit">
              Sign Up
            </button>
            <Link to="/reach/signin" className="session__switch">Move to Sign In</Link>
          </div>
        </div>
      )
    );
  }
}

export default connect(null, mapDispatchToProps)(SignUp);
