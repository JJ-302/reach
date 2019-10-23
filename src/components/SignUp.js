import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import '../css/Session.scss'

export default class SignUp extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      passwordConfirmation: '',
    }
  }

  emailOnChange = (event) => {
    const email = event.target.value
    this.setState({ email })
  }

  passwordOnChange = (event) => {
    const password = event.target.value
    this.setState({ password })
  }

  passwordConfirmationOnChange = (event) => {
    const passwordConfirmation = event.target.value
    this.setState({ passwordConfirmation })
  }

  render() {
    const { email, password, passwordConfirmation } = this.state
    return (
      <div className="background">
        <div className="session">
          <div className="session__title">Create account</div>
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
          <input
            type="password"
            className="session__password"
            placeholder="Password confirmation"
            value={passwordConfirmation}
            onChange={this.passwordConfirmationOnChange}
          />
          <Link to="/home" className="session__submit">Sign Up</Link>
          <Link to="/" className="session__switch">Move to Sign In</Link>
        </div>
      </div>
    )
  }
}
