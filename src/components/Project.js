import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import Task from './Task'
import TaskForm from './TaskForm'
import '../css/Project.scss'

class Project extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tasks: props.project.tasks,
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
    const { tasks, isVisible } = this.state
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
        <Task tasks={tasks} />
        {isVisible
          && <TaskForm tasks={tasks} onRefresh={this.refreshTasks} closeModal={this.closeModal} />}
      </div>
    )
  }
}

const Projects = (props) => {
  const projects = props.projects.map((project) => (
    <Project project={project} key={project.name} />
  ))
  return projects
}

export default Projects
