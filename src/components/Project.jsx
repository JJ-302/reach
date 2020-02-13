import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';

import * as projectActions from '../store/project/actions';
import * as taskActions from '../store/task/actions';
import * as confirmActions from '../store/confirm/actions';
import * as attachmentAction from '../store/attachment/actions';
import Task from './Task';
import TaskForm from './TaskForm';
import ProjectForm from './ProjectForm';
import AttachmentForm from './AttachmentForm';
import '../css/Project.scss';

const mapStateToProps = (state) => {
  const {
    projectForm, project, taskForm, attachmentForm,
  } = state;

  return {
    projectFormVisible: projectForm.visible,
    projectID: projectForm.id,
    projects: project.projects,
    taskFormVisible: taskForm.visible,
    taskID: taskForm.id,
    attachmentFormVisible: attachmentForm.visible,
  };
};

const mapDispatchToProps = (dispatch) => {
  const { openProjectForm, closeProjectForm, getAllProjects } = projectActions;
  const { openTaskForm } = taskActions;
  const { closeConfirm } = confirmActions;
  const { openAttachmentForm } = attachmentAction;
  return {
    openProjectForm: (id) => dispatch(openProjectForm(id)),
    closeProjectForm: () => dispatch(closeProjectForm()),
    getAllProjects: () => dispatch(getAllProjects()),
    openTaskForm: ({ projectID }) => dispatch(openTaskForm({ projectID })),
    closeConfirm: () => dispatch(closeConfirm()),
    openAttachmentForm: (projectID) => dispatch(openAttachmentForm(projectID)),
  };
};

class Projects extends Component {
  componentDidMount() {
    const { getAllProjects } = this.props;
    getAllProjects();
  }

  componentDidUpdate(previousProps) {
    const { projects, closeProjectForm, closeConfirm } = this.props;
    if (previousProps.projects.length !== projects.length) {
      closeProjectForm();
      closeConfirm();
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

  onClickAttachmentIcon = (event) => {
    const { openAttachmentForm } = this.props;
    const { id } = event.currentTarget.dataset;
    openAttachmentForm(id);
  }

  render() {
    const {
      projects, projectFormVisible, taskFormVisible, attachmentFormVisible,
    } = this.props;

    return (
      <>
        {projectFormVisible && <ProjectForm />}
        {taskFormVisible && <TaskForm />}
        {attachmentFormVisible && <AttachmentForm />}
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
                data-id={project.id}
                onClick={this.onClickAttachmentIcon}
              />
            </div>
            {project.tasks && <Task index={index} tasks={project.tasks} />}
          </div>
        ))}
      </>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Projects);
