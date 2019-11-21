import React, { PureComponent } from 'react'
import { Redirect } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import ProjectForm from './ProjectForm'
import ResourceForm from './ResourceForm'
import EditAccount from './EditAccount'
import '../css/SideBar.scss'

export default class SideBar extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      projectFormVisible: false,
      resourceFormVisible: false,
      accountMenuVisible: false,
      editAccuountVisible: false,
      isSignOut: false,
    }
  }

  openProjectForm = () => this.setState({ projectFormVisible: true })

  closeProjectForm = () => this.setState({ projectFormVisible: false })

  openResourceForm = () => this.setState({ resourceFormVisible: true })

  closeResourceForm = () => this.setState({ resourceFormVisible: false })

  openEditAccount = () => this.setState({ editAccuountVisible: true })

  closeEditAccount = () => this.setState({ editAccuountVisible: false })

  toggleAccountMenu = () => {
    const { accountMenuVisible } = this.state
    this.setState({ accountMenuVisible: !accountMenuVisible })
  }

  changeMode = () => {
    const { changeMode } = this.props
    changeMode()
  }

  signOut = () => {
    localStorage.removeItem('token')
    this.setState({ isSignOut: true })
  }

  render() {
    const { refreshProject, getProjectIndex } = this.props
    const {
      projectFormVisible,
      resourceFormVisible,
      accountMenuVisible,
      editAccuountVisible,
      isSignOut,
    } = this.state

    return (
      isSignOut ? <Redirect to="/reach/signin" /> : (
        <div className="sidebar">
          <div className="sidebar__iconWrapper--plus" onClick={this.openProjectForm}>
            <FontAwesomeIcon icon={['fas', 'plus']} className="sidebar__icon" />
          </div>
          <div className="sidebar__iconWrapper--minus" onClick={this.changeMode}>
            <FontAwesomeIcon icon={['fas', 'minus']} className="sidebar__icon" />
          </div>
          <div className="sidebar__iconWrapper--resource" onClick={this.openResourceForm}>
            <FontAwesomeIcon icon={['fas', 'tags']} className="sidebar__icon" />
          </div>
          <div className="sidebar__iconWrapper--account" onClick={this.toggleAccountMenu}>
            <FontAwesomeIcon icon={['fas', 'user']} className="sidebar__icon" />
          </div>
          {accountMenuVisible && (
            <div className="overlay" onClick={this.toggleAccountMenu}>
              <div className="accountMenu">
                <div className="accountMenu__edit" onClick={this.openEditAccount}>Edit account</div>
                <div className="accountMenu__signout" onClick={this.signOut}>Sign out</div>
              </div>
            </div>
          )}
          {projectFormVisible
            && <ProjectForm action="new" refresh={refreshProject} closeModal={this.closeProjectForm} />}
          {resourceFormVisible && <ResourceForm action="Create" closeModal={this.closeResourceForm} />}
          {editAccuountVisible
            && <EditAccount refresh={getProjectIndex} closeEditAccount={this.closeEditAccount} />}
        </div>
      )
    )
  }
}
