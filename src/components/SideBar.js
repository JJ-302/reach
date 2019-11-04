import React, { PureComponent } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import ProjectForm from './ProjectForm'
import ResourceForm from './ResourceForm'
import '../css/SideBar.scss'

export default class SideBar extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      projectFormVisible: false,
      resourceFormVisible: false,
    }
  }

  openProjectForm = () => {
    this.setState({ projectFormVisible: true })
  }

  closeProjectForm = () => {
    this.setState({ projectFormVisible: false })
  }

  openResourceForm = () => {
    this.setState({ resourceFormVisible: true })
  }

  closeResourceForm = () => {
    this.setState({ resourceFormVisible: false })
  }

  render() {
    const { projectFormVisible, resourceFormVisible } = this.state
    const { refreshProject } = this.props
    return (
      <div className="sidebar">
        <FontAwesomeIcon
          icon={['fas', 'plus']}
          className="sidebar__icon"
          onClick={this.openProjectForm}
        />
        <FontAwesomeIcon
          icon={['fas', 'tags']}
          className="sidebar__icon"
          onClick={this.openResourceForm}
        />
        {projectFormVisible
          && <ProjectForm action="Create" refresh={refreshProject} closeModal={this.closeProjectForm} />}
        {resourceFormVisible && <ResourceForm action="Create" closeModal={this.closeResourceForm} />}
      </div>
    )
  }
}
