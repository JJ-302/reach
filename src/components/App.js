import React, { Component } from 'react'
import {
  BrowserRouter,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom'

import Main from './Main'
import SignIn from './SignIn'
import SignUp from './SignUp'

class Home extends Component {
  constructor(props) {
    super(props)
    const token = localStorage.getItem('token')
    const isAuthenticated = token !== null
    this.state = {
      isAuthenticated,
    }
  }

  render() {
    const { isAuthenticated } = this.state
    return isAuthenticated ? <Main /> : <Redirect to="/signin" />
  }
}

const App = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/signin"><SignIn /></Route>
      <Route path="/signup"><SignUp /></Route>
      <Route exact path="/"><Home /></Route>
      <Route exact><SignIn /></Route>
    </Switch>
  </BrowserRouter>
)

export default App
