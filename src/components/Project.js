import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Task from './Task';
import TaskForm from './TaskForm';
import ProjectForm from './ProjectForm';
import LinkForm from './LinkForm';
import '../css/Project.scss';

class Project extends Component {
  constructor(props) {
    super(props);
    const { project } = this.props;
    this.state = {
      name: project.name,
      isVisible: false,
      projectFormVisible: false,
      linkFormVisible: false,
    };
  }

  openModal = (event) => {
    this.id = event.currentTarget.dataset.id || null;
    this.action = event.currentTarget.dataset.action;
    this.setState({ isVisible: true });
  }

  closeModal = () => this.setState({ isVisible: false })

  openProjectForm = () => this.setState({ projectFormVisible: true })

  closeProjectForm = () => this.setState({ projectFormVisible: false })

  openLinkForm = () => this.setState({ linkFormVisible: true })

  closeLinkForm = () => this.setState({ linkFormVisible: false })

  updateProject = (name) => this.setState({ name })

  render() {
    const {
      project,
      index,
      refreshTask,
      destroyMode,
      refreshProject,
    } = this.props;

    const { tasks, id } = project;
    const {
      isVisible,
      projectFormVisible,
      linkFormVisible,
      name,
    } = this.state;

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
          <FontAwesomeIcon
            icon={['fas', 'link']}
            className="projectHeader__link"
            onClick={this.openLinkForm}
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
        {isVisible && (
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
            refreshProject={refreshProject}
            refresh={this.updateProject}
            action="edit"
            closeModal={this.closeProjectForm}
          />
        )}
        {linkFormVisible && <LinkForm id={id} closeModal={this.closeLinkForm} />}
      </div>
    );
  }
}

const Projects = (props) => {
  const {
    projects,
    refreshTask,
    mode,
    refreshProject,
  } = props;

  return projects.map((project, index) => (
    <Project
      refreshTask={refreshTask}
      refreshProject={refreshProject}
      project={project}
      key={project.name}
      index={index}
      destroyMode={mode}
    />
  ));
};

export default Projects;
