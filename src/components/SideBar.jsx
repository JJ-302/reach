import React, { PureComponent } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import * as actions from '../store/resource/actions';
import ProjectForm from './ProjectForm';
import EditAccount from './EditAccount';
import '../css/SideBar.scss';

const mapDispatchToProps = (dispatch) => {
  const { openResourceForm } = actions;
  return {
    openResourceForm: () => dispatch(openResourceForm()),
  };
};

class SideBar extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      projectFormVisible: false,
      accountMenuVisible: false,
      editAccuountVisible: false,
      isSignOut: false,
    };
  }

  openProjectForm = () => this.setState({ projectFormVisible: true })

  closeProjectForm = () => this.setState({ projectFormVisible: false })

  openEditAccount = () => this.setState({ editAccuountVisible: true })

  closeEditAccount = () => this.setState({ editAccuountVisible: false })

  toggleAccountMenu = () => {
    const { accountMenuVisible } = this.state;
    this.setState({ accountMenuVisible: !accountMenuVisible });
  }

  changeMode = () => {
    const { changeMode } = this.props;
    changeMode();
  }

  signOut = () => {
    localStorage.removeItem('token');
    this.setState({ isSignOut: true });
  }

  render() {
    const {
      refreshProject,
      getProjectIndex,
      openResourceForm,
    } = this.props;

    const {
      projectFormVisible,
      accountMenuVisible,
      editAccuountVisible,
      isSignOut,
    } = this.state;

    return (
      isSignOut ? <Redirect to="/reach/signin" /> : (
        <div className="sidebar">
          <div className="sidebar__iconWrapper--plus" onClick={this.openProjectForm}>
            <FontAwesomeIcon icon={['fas', 'plus']} className="sidebar__icon" />
          </div>
          <div className="sidebar__iconWrapper--minus" onClick={this.changeMode}>
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
                <div className="accountMenu__edit" onClick={this.openEditAccount}>アカウント編集</div>
                <div className="accountMenu__signout" onClick={this.signOut}>サインアウト</div>
              </div>
            </div>
          )}
          {projectFormVisible
            && <ProjectForm action="new" refresh={refreshProject} closeModal={this.closeProjectForm} />}
          {editAccuountVisible
            && <EditAccount refresh={getProjectIndex} closeEditAccount={this.closeEditAccount} />}
        </div>
      )
    );
  }
}

export default connect(null, mapDispatchToProps)(SideBar);