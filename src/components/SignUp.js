import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import ErrorMessage from './Error';
import Confirm from './Confirm';
import Utils from '../utils/Utils';
import { reload, serverError } from '../utils/Text';
import '../css/Session.scss';

export default class SignUp extends Component {
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
      confirmVisible: false,
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
    const response = await fetch(url, {
      method: 'POST',
      body: params,
    });

    const { is_created, errors, token } = await response.json();
    if (is_created) {
      localStorage.setItem('token', token);
      this.setState({ isSignIn: true });
    } else if (errors !== undefined) {
      this.setState({ errors });
    } else {
      this.openConfirm();
    }
  }

  openConfirm = () => this.setState({ confirmVisible: true })

  closeConfirm = () => this.setState({ confirmVisible: false })

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
      confirmVisible,
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
          {confirmVisible && (
            <Confirm
              type="error"
              closeConfirm={this.closeConfirm}
              title={serverError}
              description={reload}
              confirm={this.closeConfirm}
            />
          )}
        </div>
      )
    );
  }
}
