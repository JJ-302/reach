import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';

import * as actions from '../store/project/actions';
import Task from './Task';
import TaskForm from './TaskForm';
import ProjectForm from './ProjectForm';
import LinkForm from './LinkForm';
import '../css/Project.scss';

const mapStateToProps = (state) => {
  const { projectForm, project } = state;
  return {
    projectFormVisible: projectForm.visible,
    targetID: projectForm.id,
    projects: project.projects,
  };
};

const mapDispatchToProps = (dispatch) => {
  const { openProjectForm, closeProjectForm, getAllProjects } = actions;
  return {
    openProjectForm: (id) => dispatch(openProjectForm(id)),
    closeProjectForm: () => dispatch(closeProjectForm()),
    getAllProjects: () => dispatch(getAllProjects()),
  };
};

class Projects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      linkFormVisible: false,
    };
  }

  componentDidMount() {
    const { getAllProjects } = this.props;
    getAllProjects();
  }

  componentDidUpdate(previousProps) {
    const { projects, closeProjectForm } = this.props;
    if (previousProps.projects.length !== projects.length) {
      closeProjectForm();
    }
  }

  onClickEditProject = (event) => {
    const { openProjectForm } = this.props;
    const { id } = event.currentTarget.dataset;
    openProjectForm(id);
  };

  openModal = (event) => {
    this.id = event.currentTarget.dataset.id || null;
    this.action = event.currentTarget.dataset.action;
    this.setState({ isVisible: true });
  }

  closeModal = () => this.setState({ isVisible: false })

  openLinkForm = () => this.setState({ linkFormVisible: true })

  closeLinkForm = () => this.setState({ linkFormVisible: false })

  // updateProject = (name) => this.setState({ name })

  render() {
    const {
      refreshTask,
      refreshProject,
      projects,
      mode,
      projectFormVisible,
      targetID,
    } = this.props;

    const { isVisible, linkFormVisible } = this.state;

    return (
      <>
        {projectFormVisible && (
          <ProjectForm
            id={targetID}
            refreshProject={refreshProject}
            refresh={this.updateProject}
          />
        )}
        {projects.map((project, index) => (
          <div key={project.id} className="project">
            <div className="projectHeader">
              <div className="projectHeader__name">{project.name}</div>
              <FontAwesomeIcon
                icon={['fas', 'edit']}
                className="projectHeader__edit"
                data-id={project.id}
                onClick={this.onClickEditProject}
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
            {project.tasks && (
              <Task
                destroyMode={mode}
                index={index}
                refresh={refreshTask}
                tasks={project.tasks}
                onClick={this.openModal}
              />
            )}
            {isVisible && (
              <TaskForm
                id={project.id}
                action={this.action}
                taskID={this.id}
                refresh={refreshTask}
                index={index}
                closeModal={this.closeModal}
              />
            )}
            {linkFormVisible && <LinkForm id={project.id} closeModal={this.closeLinkForm} />}
          </div>
        ))}
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Projects);
