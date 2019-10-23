import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import '../css/Session.scss'

export default class SignIn extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
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

  render() {
    const { email, password } = this.state
    return (
      <div className="background">
        <div className="session">
          <div className="session__title">Sign in to Reach</div>
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
          <Link to="/home" className="session__submit">Sign In</Link>
          <Link to="/signup" className="session__switch">Create account</Link>
        </div>
      </div>
    )
  }
}
