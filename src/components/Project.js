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

  openModal = (event) => {
    this.id = event.currentTarget.dataset.id || null
    this.action = event.currentTarget.dataset.action
    this.setState({ isVisible: true })
  }

  closeModal = () => {
    this.setState({ isVisible: false })
  }

  render() {
    const { project, index, refreshTask } = this.props
    const { tasks, name, id } = project
    const { isVisible } = this.state
    return (
      <div key={name} className="project">
        <div className="projectHeader">
          <div className="projectHeader__name">{name}</div>
          <FontAwesomeIcon
            icon={['fas', 'plus']}
            data-action="new"
            className="projectHeader__addTask"
            onClick={this.openModal}
          />
        </div>
        {tasks && <Task tasks={tasks} onClick={this.openModal} />}
        {isVisible
          && (
            <TaskForm
              id={id}
              action={this.action}
              taskID={this.id}
              refresh={refreshTask}
              index={index}
              closeModal={this.closeModal}
            />
          )}
      </div>
    )
  }
}

const Projects = (props) => {
  const { projects, refreshTask } = props
  return projects.map((project, index) => (
    <Project refreshTask={refreshTask} project={project} key={project.name} index={index} />
  ))
}

export default Projects
