import React, { PureComponent } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import * as resourceActions from '../store/resource/actions';
import * as projectActions from '../store/project/actions';
import * as accountActions from '../store/account/actions';
import * as taskActions from '../store/task/actions';
import EditAccount from './EditAccount';
import '../css/SideBar.scss';

const mapStateToProps = (state) => {
  const { accountForm } = state;
  return {
    accountFormVisible: accountForm.visible,
  };
};

const mapDispatchToProps = (dispatch) => {
  const { openResourceForm } = resourceActions;
  const { openProjectForm } = projectActions;
  const { openAccountForm } = accountActions;
  const { toggleDeleteButton } = taskActions;
  return {
    openResourceForm: () => dispatch(openResourceForm()),
    openProjectForm: () => dispatch(openProjectForm()),
    openAccountForm: () => dispatch(openAccountForm()),
    toggleDeleteButton: () => dispatch(toggleDeleteButton()),
  };
};

class SideBar extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      accountMenuVisible: false,
      isSignOut: false,
    };
  }

  toggleAccountMenu = () => {
    const { accountMenuVisible } = this.state;
    this.setState({ accountMenuVisible: !accountMenuVisible });
  }

  signOut = () => {
    localStorage.removeItem('token');
    this.setState({ isSignOut: true });
  }

  render() {
    const { accountMenuVisible, isSignOut } = this.state;
    const {
      openResourceForm, openProjectForm, openAccountForm, accountFormVisible, toggleDeleteButton,
    } = this.props;

    return (
      isSignOut ? <Redirect to="/reach/signin" /> : (
        <div className="sidebar">
          <div className="sidebar__iconWrapper--plus" onClick={openProjectForm}>
            <FontAwesomeIcon icon={['fas', 'plus']} className="sidebar__icon" />
          </div>
          <div className="sidebar__iconWrapper--minus" onClick={toggleDeleteButton}>
            <FontAwesomeIcon icon={['fas', 'minus']} className="sidebar__icon" />
          </div>
          <div className="sidebar__iconWrapper--resource" onClick={openResourceForm}>
            <FontAwesomeIcon icon={['fas', 'tags']} className="sidebar__icon" />
          </div>
          <div className="sidebar__iconWrapper--account" onClick={this.toggleAccountMenu}>
            <FontAwesomeIcon icon={['fas', 'user']} className="sidebar__icon" />
          </div>
          {accountMenuVisible && (
            <div className="overlay" onClick={this.toggleAccountMenu}>
              <div className="accountMenu">
                <div className="accountMenu__edit" onClick={openAccountForm}>アカウント編集</div>
                <div className="accountMenu__signout" onClick={this.signOut}>サインアウト</div>
              </div>
            </div>
          )}
          {accountFormVisible && <EditAccount />}
        </div>
      )
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SideBar);
