import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import Task from './Task'
import TaskForm from './TaskForm'
import ProjectForm from './ProjectForm'
import '../css/Project.scss'

class Project extends Component {
  constructor(props) {
    super(props)
    const { project } = this.props
    this.state = {
      name: project.name,
      isVisible: false,
      projectFormVisible: false,
    }
  }

  openModal = (event) => {
    this.id = event.currentTarget.dataset.id || null
    this.action = event.currentTarget.dataset.action
    this.setState({ isVisible: true })
  }

  closeModal = () => this.setState({ isVisible: false })

  openProjectForm = () => this.setState({ projectFormVisible: true })

  closeProjectForm = () => this.setState({ projectFormVisible: false })

  updateProject = (name) => this.setState({ name })

  render() {
    const {
      project,
      index,
      refreshTask,
      destroyMode,
    } = this.props

    const { tasks, id } = project
    const { isVisible, projectFormVisible, name } = this.state
    return (
      <div key={name} className="project">
        <div className="projectHeader">
          <div className="projectHeader__name">{name}</div>
          <FontAwesomeIcon
            icon={['fas', 'edit']}
            className="projectHeader__edit"
            onClick={this.openProjectForm}
          />
          <FontAwesomeIcon
            icon={['fas', 'plus']}
            data-action="new"
            className="projectHeader__addTask"
            onClick={this.openModal}
          />
        </div>
        {tasks && (
          <Task
            destroyMode={destroyMode}
            index={index}
            refresh={refreshTask}
            tasks={tasks}
            onClick={this.openModal}
          />
        )}
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
        {projectFormVisible && (
          <ProjectForm
            id={id}
            refresh={this.updateProject}
            action="edit"
            closeModal={this.closeProjectForm}
          />
        )}
      </div>
    )
  }
}

const Projects = (props) => {
  const { projects, refreshTask, mode } = props
  return projects.map((project, index) => (
    <Project
      refreshTask={refreshTask}
      project={project}
      key={project.name}
      index={index}
      destroyMode={mode}
    />
  ))
}

export default Projects
