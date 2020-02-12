import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  BrowserRouter,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';

import Main from './Main';
import SignIn from './SignIn';
import SignUp from './SignUp';
import Confirm from './Confirm';

const mapStateToProps = (state) => {
  const { confirm } = state;
  return {
    confirmVisible: confirm.visible,
  };
};

class Home extends Component {
  constructor(props) {
    super(props);
    const token = localStorage.getItem('token');
    const isAuthenticated = token !== null;
    this.state = {
      isAuthenticated,
    };
  }

  render() {
    const { isAuthenticated } = this.state;
    return isAuthenticated ? <Main /> : <Redirect to="/reach/signin" />;
  }
}

const App = (props) => {
  const { confirmVisible } = props;
  return (
    <>
      <BrowserRouter>
        <Switch>
          <Route path="/reach/signin"><SignIn /></Route>
          <Route path="/reach/signup"><SignUp /></Route>
          <Route exact path="/reach"><Home /></Route>
          <Route exact><SignIn /></Route>
        </Switch>
      </BrowserRouter>
      {confirmVisible && <Confirm />}
    </>
  );
};

export default connect(mapStateToProps)(App);
