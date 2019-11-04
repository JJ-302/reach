import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import Task from './Task'
import TaskForm from './TaskForm'
import '../css/Project.scss'

class Project extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isVisible: false,
    }
  }

  openModal = () => {
    this.setState({ isVisible: true })
  }

  closeModal = () => {
    this.setState({ isVisible: false })
  }

  refreshTasks = (tasks) => {
    this.setState({ tasks })
  }

  render() {
    const { project } = this.props
    const { tasks } = project
    const { isVisible } = this.state
    return (
      <div key={project.name} className="project">
        <div className="projectHeader">
          <div className="projectHeader__name">{project.name}</div>
          <FontAwesomeIcon
            icon={['fas', 'plus']}
            className="projectHeader__addTask"
            onClick={this.openModal}
          />
        </div>
        {tasks && <Task tasks={tasks} />}
        {isVisible
          && <TaskForm tasks={tasks} closeModal={this.closeModal} />}
      </div>
    )
  }
}

const Projects = (props) => {
  const { projects } = props
  return projects.map((project) => (
    <Project project={project} key={project.name} />
  ))
}

export default Projects
