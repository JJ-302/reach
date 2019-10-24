import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import SideBar from './SideBar'
import Main from './Main'
import SignIn from './SignIn'
import SignUp from './SignUp'
import '../css/App.scss'

const Home = () => (
  <div className="App">
    <SideBar />
    <Main />
  </div>
)

const App = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/"><SignIn /></Route>
      <Route path="/signup"><SignUp /></Route>
      <Route path="/home"><Home /></Route>
      <Route exact><SignIn /></Route>
    </Switch>
  </BrowserRouter>
)

export default App
