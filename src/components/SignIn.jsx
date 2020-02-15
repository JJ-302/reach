import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';

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

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      isSignIn: false,
      errors: [],
    };
  }

  handleSignIn = async () => {
    const { email, password } = this.state;
    const url = Utils.buildRequestUrl('/sessions');
    const params = { email, password };
    const response = await axios.post(url, params, {
      headers: { 'Content-Type': 'application/json' },
    }).catch((error) => error.response);

    if (response.status !== 200) {
      const { openConfirm } = this.props;
      openConfirm(INTERNAL_SERVER_ERROR);
      return;
    }

    const { result, token, errors } = response.data;
    if (result) {
      localStorage.setItem('token', token);
      this.setState({ isSignIn: true });
    } else {
      this.setState({ errors });
    }
  }

  emailOnChange = (event) => {
    const email = event.target.value;
    this.setState({ email });
  }

  passwordOnChange = (event) => {
    const password = event.target.value;
    this.setState({ password });
  }

  render() {
    const {
      email, password, isSignIn, errors,
    } = this.state;

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
              onChange={this.emailOnChange}
            />
            <input
              type="password"
              className="session__password"
              placeholder="Password"
              value={password}
              onChange={this.passwordOnChange}
            />
            <button type="button" onClick={this.handleSignIn} className="session__submit">
              Sign In
            </button>
            <Link to="/reach/signup" className="session__switch">Create account</Link>
          </div>
        </div>
      )
    );
  }
}

export default connect(null, mapDispatchToProps)(SignIn);
