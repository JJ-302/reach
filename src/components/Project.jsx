import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';

import * as projectActions from '../store/project/actions';
import * as taskActions from '../store/task/actions';
import Task from './Task';
import TaskForm from './TaskForm';
import ProjectForm from './ProjectForm';
import LinkForm from './LinkForm';
import '../css/Project.scss';

const mapStateToProps = (state) => {
  const { projectForm, project, taskForm } = state;
  return {
    projectFormVisible: projectForm.visible,
    projectID: projectForm.id,
    projects: project.projects,
    taskFormVisible: taskForm.visible,
    taskID: taskForm.id,
  };
};

const mapDispatchToProps = (dispatch) => {
  const { openProjectForm, closeProjectForm, getAllProjects } = projectActions;
  const { openTaskForm } = taskActions;
  return {
    openProjectForm: (id) => dispatch(openProjectForm(id)),
    closeProjectForm: () => dispatch(closeProjectForm()),
    getAllProjects: () => dispatch(getAllProjects()),
    openTaskForm: ({ projectID }) => dispatch(openTaskForm({ projectID })),
  };
};

class Projects extends Component {
  constructor(props) {
    super(props);
    this.state = {
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

  onClickAddTask = (event) => {
    const { openTaskForm } = this.props;
    const { id } = event.currentTarget.dataset;
    openTaskForm({ projectID: id });
  }

  openLinkForm = () => this.setState({ linkFormVisible: true })

  closeLinkForm = () => this.setState({ linkFormVisible: false })

  render() {
    const { projects, projectFormVisible, taskFormVisible } = this.props;
    const { linkFormVisible } = this.state;

    return (
      <>
        {projectFormVisible && <ProjectForm />}
        {taskFormVisible && <TaskForm />}
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
                className="projectHeader__addTask"
                data-id={project.id}
                onClick={this.onClickAddTask}
              />
              <FontAwesomeIcon
                icon={['fas', 'link']}
                className="projectHeader__link"
                onClick={this.openLinkForm}
              />
            </div>
            {project.tasks && <Task index={index} tasks={project.tasks} />}
            {linkFormVisible && <LinkForm id={project.id} closeModal={this.closeLinkForm} />}
          </div>
        ))}
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Projects);
