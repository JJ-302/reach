import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';

import * as projectActions from '../store/project/actions';
import * as taskActions from '../store/task/actions';
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
  const { openProjectForm, getAllProjects } = projectActions;
  const { openTaskForm } = taskActions;
  const { openAttachmentForm } = attachmentAction;
  return {
    openProjectForm: (id) => dispatch(openProjectForm(id)),
    getAllProjects: () => dispatch(getAllProjects()),
    openTaskForm: ({ projectID }) => dispatch(openTaskForm({ projectID })),
    openAttachmentForm: (projectID) => dispatch(openAttachmentForm(projectID)),
  };
};

const Projects = (props) => {
  const {
    projects,
    getAllProjects,
    projectFormVisible,
    taskFormVisible,
    attachmentFormVisible,
    openProjectForm,
    openTaskForm,
    openAttachmentForm,
  } = props;

  useEffect(() => {
    getAllProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onClickEditProject = (event) => {
    const { id } = event.currentTarget.dataset;
    openProjectForm(id);
  };

  const onClickAddTask = (event) => {
    const { id } = event.currentTarget.dataset;
    openTaskForm({ projectID: id });
  };

  const onClickAttachmentIcon = (event) => {
    const { id } = event.currentTarget.dataset;
    openAttachmentForm(id);
  };

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
              onClick={onClickEditProject}
            />
            <FontAwesomeIcon
              icon={['fas', 'plus']}
              className="projectHeader__addTask"
              data-id={project.id}
              onClick={onClickAddTask}
            />
            <FontAwesomeIcon
              icon={['fas', 'link']}
              className="projectHeader__link"
              data-id={project.id}
              onClick={onClickAttachmentIcon}
            />
          </div>
          {project.tasks && <Task index={index} tasks={project.tasks} />}
        </div>
      ))}
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Projects);
